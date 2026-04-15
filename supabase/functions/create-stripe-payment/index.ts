import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import Stripe from 'npm:stripe@14.18.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { booking_id } = await req.json()

    if (!booking_id) {
      throw new Error("Missing booking_id");
    }

    // 1. Inicjalizacja klienta Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 2. Pobranie danych rezerwacji w celu wyliczenia kwoty po stronie SERWERA
    // Gwarantuje to, że frontend nie może zmodyfikować kwoty do zapłaty
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, rooms(base_price)')
      .eq('id', booking_id)
      .single();

    if (bookingError || !booking) {
      throw new Error("Booking not found");
    }

    // 3. Weryfikacja i pobranie kwoty (backend logic)
    // Nasza logika biznesowa: zadatek to 30% całości.
    // Kwota zapisana w bazie w `deposit_amount` jest bezpiecznym źródłem prawdy.
    const depositAmount = booking.deposit_amount;
    const amountInGrosze = Math.round(depositAmount * 100);

    console.log(`Tworzenie Stripe PaymentIntent dla rezerwacji ${booking_id} na kwotę ${depositAmount} PLN`);

    // 4. Utworzenie PaymentIntent w Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInGrosze,
      currency: 'pln',
      metadata: {
        booking_id: booking_id
      },
    });

    // 5. Aktualizacja rekordu w bazie - przypisanie ID transakcji
    await supabase.from('payments').update({ 
      transaction_id: paymentIntent.id 
    }).eq('booking_id', booking_id);

    return new Response(
      JSON.stringify({ 
        clientSecret: paymentIntent.client_secret,
        amount: depositAmount
      }),
      { headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    console.error("Stripe payment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 400,
    })
  }
})