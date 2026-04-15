import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import Stripe from 'npm:stripe@14.18.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  try {
    const body = await req.text();
    let event;

    // Weryfikacja podpisu webhooka Stripe dla bezpieczeństwa
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } else {
      // Fallback wyłącznie dla testów lokalnych jeśli secret webhooka nie został jeszcze ustawiony
      event = JSON.parse(body);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Przetwarzanie zdarzenia Stripe: ${event.type}`);

    // Obsługa poprawnej płatności
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const booking_id = paymentIntent.metadata.booking_id;

      if (booking_id) {
        // Aktualizacja płatności jako opłacona
        const { error: paymentError } = await supabase
          .from('payments')
          .update({ 
            status: 'completed',
            paid_at: new Date().toISOString()
          })
          .eq('booking_id', booking_id);
        
        if (paymentError) throw paymentError;

        // Aktualizacja statusu rezerwacji jako potwierdzona
        const { error: bookingError } = await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', booking_id);
          
        if (bookingError) throw bookingError;

        console.log(`Płatność zatwierdzona. Rezerwacja ${booking_id} potwierdzona.`);
      }
    } 
    // Obsługa błędu płatności
    else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      const booking_id = paymentIntent.metadata.booking_id;
      const errorMsg = paymentIntent.last_payment_error?.message || 'Błąd płatności Stripe';

      console.error(`Płatność nie powiodła się dla rezerwacji ${booking_id}: ${errorMsg}`);

      if (booking_id) {
        await supabase
          .from('payments')
          .update({ status: 'failed' })
          .eq('booking_id', booking_id);
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error(`Błąd webhooka Stripe: ${err.message}`);
    return new Response(`Błąd Webhooka: ${err.message}`, { status: 400 });
  }
});