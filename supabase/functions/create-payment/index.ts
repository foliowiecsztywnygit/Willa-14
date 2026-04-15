import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import * as crypto from "https://deno.land/std@0.177.0/crypto/mod.ts";
import { encodeHex } from "https://deno.land/std@0.177.0/encoding/hex.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generowanie podpisu Przelewy24
async function generateSign(data: any, crcKey: string): Promise<string> {
  const jsonString = JSON.stringify(data);
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(jsonString);
  const hashBuffer = await crypto.subtle.digest("SHA-384", dataBytes);
  return encodeHex(hashBuffer);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { booking_id, amount, method, email } = await req.json()
    console.log(`Processing payment for booking: ${booking_id}, amount: ${amount}, method: ${method}`);

    // Inicjalizacja klienta Supabase, aby zaktualizować status płatności
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parametry testowe Przelewy24 (Można zastąpić prawdziwymi w zmiennych środowiskowych)
    const p24MerchantId = Deno.env.get('P24_MERCHANT_ID') || '144364'; 
    const p24PosId = Deno.env.get('P24_POS_ID') || '144364';
    const p24Crc = Deno.env.get('P24_CRC') || 'test_crc_key_here';
    const isSandbox = true; // Flaga sandbox
    const p24BaseUrl = isSandbox ? 'https://sandbox.przelewy24.pl' : 'https://secure.przelewy24.pl';

    // Przygotowanie danych do Przelewy24
    // P24 wymaga kwoty w groszach (int)
    const amountInGrosze = Math.round(amount * 100);
    const sessionId = `req_${Date.now()}_${booking_id}`;

    // W Przelewy24, 'method' określa konkretny bank/kanał. 
    // Jeśli nie przekażemy 'method', P24 pokaże swój panel wyboru.
    // Dla BLIK metoda to często 154, dla kart: 0, itd. 
    // Na potrzeby sandboxa i uproszczenia przepuszczamy wszystko przez ogólny panel P24, 
    // ewentualnie możemy tu zmapować: method === 'blik' ? 154 : null;

    const p24Data = {
      merchantId: parseInt(p24MerchantId),
      posId: parseInt(p24PosId),
      sessionId: sessionId,
      amount: amountInGrosze,
      currency: "PLN",
      description: `Zadatek za rezerwację Willa Rysy: ${booking_id}`,
      email: email,
      country: "PL",
      language: "pl",
      urlReturn: `http://localhost:5174/confirmation?id=${booking_id}`, // Adres powrotu po udanej płatności
      urlStatus: `${supabaseUrl}/functions/v1/p24-webhook`, // Nasz webhook do potwierdzeń
      timeLimit: 15,
      // channel: method === 'blik' ? 64 : method === 'card' ? 1 : 2 // Mapowanie kanałów P24 (opcjonalnie)
    };

    // Obliczanie podpisu SHA-384
    const signData = {
      sessionId: p24Data.sessionId,
      merchantId: p24Data.merchantId,
      amount: p24Data.amount,
      currency: p24Data.currency,
      crc: p24Crc
    };
    
    const sign = await generateSign(signData, p24Crc);
    const requestData = { ...p24Data, sign };

    // Symulacja w środowisku deweloperskim, jeśli nie mamy prawdziwych kluczy P24
    if (p24Crc === 'test_crc_key_here') {
      console.log("DEV MODE: Mocking P24 response");
      
      // Zaktualizuj bazę (mock)
      await supabase.from('payments').update({ 
        transaction_id: sessionId,
        status: 'completed' // W mocku od razu dajemy completed, normalnie czeka na webhook
      }).eq('booking_id', booking_id);

      await supabase.from('bookings').update({
        status: 'confirmed'
      }).eq('id', booking_id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          paymentUrl: `http://localhost:5174/confirmation?id=${booking_id}&mock=true`,
          message: "Payment mocked successfully"
        }),
        { headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Właściwe wywołanie API Przelewy24 (Rejestracja transakcji)
    const p24Auth = btoa(`${p24MerchantId}:klucz_api_tutaj`); // Wymaga API KEY, nie tylko CRC
    
    // UWAGA: Kod poniżej jest przygotowany strukturalnie pod żywe API. 
    // Z racji braku faktycznego klucza API, ta gałąź kodu wykona się tylko jeśli wprowadzisz prawdziwe dane.
    /*
    const response = await fetch(`${p24BaseUrl}/api/v1/transaction/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${p24Auth}`
      },
      body: JSON.stringify(requestData)
    });

    const result = await response.json();

    if (!response.ok || result.error) {
      console.error("P24 Registration Error:", result);
      throw new Error(result.error || "P24 Registration Failed");
    }

    // Zaktualizuj sessionId w naszej bazie, by móc powiązać z webhookiem
    await supabase.from('payments').update({ transaction_id: sessionId }).eq('booking_id', booking_id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        paymentUrl: `${p24BaseUrl}/trnRequest/${result.data.token}`,
      }),
      { headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
    */

    // Zabezpieczenie przed błędem, jeśli klucze nie są pełne, ale test_crc_key_here został zmieniony
    throw new Error("P24 API integration requires API_KEY configuration. Running in mock mode is recommended for now.");

  } catch (error) {
    console.error("Payment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 400,
    })
  }
})