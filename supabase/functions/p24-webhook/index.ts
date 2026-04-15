import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import * as crypto from "https://deno.land/std@0.177.0/crypto/mod.ts";
import { encodeHex } from "https://deno.land/std@0.177.0/encoding/hex.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    const payload = await req.json();
    console.log("Received P24 Webhook Payload:", payload);

    const p24MerchantId = Deno.env.get('P24_MERCHANT_ID') || '144364'; 
    const p24PosId = Deno.env.get('P24_POS_ID') || '144364';
    const p24Crc = Deno.env.get('P24_CRC') || 'test_crc_key_here';
    const isSandbox = true;
    const p24BaseUrl = isSandbox ? 'https://sandbox.przelewy24.pl' : 'https://secure.przelewy24.pl';

    // 1. Weryfikacja podpisu przychodzącego
    const signData = {
      merchantId: payload.merchantId,
      posId: payload.posId,
      sessionId: payload.sessionId,
      amount: payload.amount,
      originAmount: payload.originAmount,
      currency: payload.currency,
      orderId: payload.orderId,
      methodId: payload.methodId,
      statement: payload.statement,
      crc: p24Crc
    };

    const calculatedSign = await generateSign(signData, p24Crc);

    if (calculatedSign !== payload.sign) {
      console.error("Invalid signature in webhook");
      return new Response("Invalid signature", { status: 400 });
    }

    // 2. Weryfikacja transakcji w P24 (wymagane przez API P24)
    // UWAGA: Zakomentowane dopóki nie ma faktycznego API_KEY
    /*
    const p24Auth = btoa(`${p24MerchantId}:klucz_api_tutaj`);
    const verifyData = {
      merchantId: payload.merchantId,
      posId: payload.posId,
      sessionId: payload.sessionId,
      amount: payload.amount,
      currency: payload.currency,
      orderId: payload.orderId,
      sign: await generateSign({
        sessionId: payload.sessionId,
        orderId: payload.orderId,
        amount: payload.amount,
        currency: payload.currency,
        crc: p24Crc
      }, p24Crc)
    };

    const verifyResponse = await fetch(`${p24BaseUrl}/api/v1/transaction/verify`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${p24Auth}`
      },
      body: JSON.stringify(verifyData)
    });

    if (!verifyResponse.ok) {
      console.error("Transaction verification failed");
      return new Response("Verification failed", { status: 400 });
    }
    */

    // 3. Aktualizacja bazy danych Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Wyciągnij booking_id z sessionId
    const bookingIdMatch = payload.sessionId.match(/req_\d+_(.+)/);
    if (!bookingIdMatch) {
      throw new Error("Invalid sessionId format");
    }
    const bookingId = bookingIdMatch[1];

    // Aktualizuj płatność
    const { error: paymentError } = await supabase
      .from('payments')
      .update({ 
        status: 'completed',
        transaction_id: payload.orderId.toString(),
        paid_at: new Date().toISOString()
      })
      .eq('booking_id', bookingId);

    if (paymentError) throw paymentError;

    // Aktualizuj rezerwację
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', bookingId);

    if (bookingError) throw bookingError;

    console.log(`Payment confirmed for booking: ${bookingId}`);

    return new Response("OK", { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});