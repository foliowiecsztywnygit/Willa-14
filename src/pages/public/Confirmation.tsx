import { useEffect, useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { DecorativeLine } from '../../components/ui/DecorativeLine';
import { Snowfall } from '../../components/ui/Snowfall';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function Confirmation() {
  const query = useQuery();
  const bookingId = query.get('id');
  const paymentIntentId = query.get('payment_intent') || query.get('pi');
  const paymentIntentClientSecret = query.get('payment_intent_client_secret');
  const redirectStatus = query.get('redirect_status');
  const guestEmail = query.get('email');

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string>('Verifying...');
  const [emailUrl, setEmailUrl] = useState<string | null>(null);
  const verifyCallMade = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function finalizePaymentAndFetch() {
      if (!bookingId) {
        setLoading(false);
        return;
      }

      if (verifyCallMade.current) {
        console.log("[Confirmation] Pomiń podwójne wywołanie useEffect (React Strict Mode).");
        return;
      }
      verifyCallMade.current = true;

      try {
        console.log("Parametry URL Stripe:", { paymentIntentId, paymentIntentClientSecret, redirectStatus });

        if (paymentIntentId) {
          console.log("[Confirmation] Rozpoczynam weryfikację płatności dla:", { paymentIntentId, bookingId, guestEmail });
          const res = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentIntentId, bookingId, guestEmail })
          });
          
          console.log("[Confirmation] Otrzymano odpowiedź z /api/verify-payment, status:", res.status);
          const data = await res.json();
          console.log("[Confirmation] Odpowiedź z /api/verify-payment (data):", data);

          if (data.success) {
            setPaymentStatus(data.status || 'Succeeded');
            if (data.emailUrl) {
              setEmailUrl(data.emailUrl);
            }
            console.log("Status z backendu po verify-payment:", data.status);
            if (data.emailUrl) console.log("Email wysłany pomyślnie. Link:", data.emailUrl);
          } else {
            console.warn("[Confirmation] Płatność nie powiodła się lub status inny niż succeeded/processing:", data);
            setPaymentStatus(data.status || 'Failed');
          }
        }

        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            rooms ( name )
          `)
          .eq('id', bookingId)
          .single();
        
        if (error) throw error;
        setBooking(data);

      } catch (error) {
        console.error("Error fetching booking or verifying payment:", error);
      } finally {
        setLoading(false);
      }
    }

    finalizePaymentAndFetch();
  }, [bookingId, paymentIntentId, guestEmail]);

  if (loading) {
    return (
      <div className="bg-navy min-h-screen pb-24 text-silver flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ice"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="bg-navy min-h-screen pb-24 text-silver flex flex-col justify-center items-center">
        <h2 className="text-2xl font-heading text-white mb-4">Nie znaleziono rezerwacji</h2>
        <Link to="/" className="text-ice hover:underline">Wróć na stronę główną</Link>
      </div>
    );
  }

  return (
    <div className="bg-navy min-h-screen py-24 text-silver-light relative selection:bg-ice/30 selection:text-white font-sans">
      <div className="absolute inset-0 bg-gradient-radial from-ice/5 via-transparent to-transparent blur-3xl mix-blend-screen pointer-events-none z-0"></div>
      <Snowfall />

      <div className="container mx-auto px-4 max-w-3xl relative z-10 animate-fade-in-up">
        <div className="glass-card p-8 md:p-12 text-center flex flex-col items-center border border-white/10 bg-navy-light/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="w-20 h-20 bg-ice/10 rounded-full flex items-center justify-center mb-8 border border-ice/30 shadow-[0_0_20px_rgba(223,243,255,0.2)]">
            <CheckCircle className="h-10 w-10 text-ice" />
          </div>
          
          <h1 className="text-4xl font-heading font-bold text-white tracking-wider mb-4 drop-shadow-md">Dziękujemy za rezerwację!</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-ice to-transparent rounded-full mb-8 shadow-[0_0_10px_rgba(223,243,255,0.8)]"></div>
          
          <p className="text-lg md:text-xl text-silver-light font-light mb-12 leading-relaxed">
            {paymentStatus === 'processing' 
              ? `Twoja płatność (zadatek: ${booking.deposit_amount} zł) jest w trakcie przetwarzania przez bank.`
              : `Twoja płatność (zadatek: ${booking.deposit_amount} zł) została pomyślnie przetworzona.`
            }
            <br/>Wysłaliśmy potwierdzenie na adres: <span className="text-white font-medium drop-shadow-sm">{booking.guest_email}</span>
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-full text-left mb-12 backdrop-blur-md">
            <h3 className="text-xl font-heading text-white mb-6 tracking-wider border-b border-white/10 pb-4">Szczegóły rezerwacji</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <span className="block text-silver-dark uppercase tracking-widest text-xs mb-1">Numer rezerwacji</span>
                <span className="text-white font-mono">{booking.id.split('-')[0].toUpperCase()}</span>
              </div>
              <div>
                <span className="block text-silver-dark uppercase tracking-widest text-xs mb-1">Gość</span>
                <span className="text-white">{booking.guest_name}</span>
              </div>
              <div>
                <span className="block text-silver-dark uppercase tracking-widest text-xs mb-1">Pokój</span>
                <span className="text-white">{booking.rooms?.name}</span>
              </div>
              <div>
                <span className="block text-silver-dark uppercase tracking-widest text-xs mb-1">Liczba gości</span>
                <span className="text-white">{booking.guests_count}</span>
              </div>
              <div>
                <span className="block text-silver-dark uppercase tracking-widest text-xs mb-1">Data przyjazdu</span>
                <span className="text-white">{new Date(booking.check_in).toLocaleDateString('pl-PL')} <span className="text-silver">(od 15:00)</span></span>
              </div>
              <div>
                <span className="block text-silver-dark uppercase tracking-widest text-xs mb-1">Data wyjazdu</span>
                <span className="text-white">{new Date(booking.check_out).toLocaleDateString('pl-PL')} <span className="text-silver">(do 11:00)</span></span>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
              <span className="text-silver uppercase tracking-widest text-sm">Do dopłaty na miejscu</span>
              <span className="text-2xl font-bold text-white drop-shadow-sm">{booking.total_amount - booking.deposit_amount} <span className="text-ice">zł</span></span>
            </div>
          </div>

          {emailUrl && (
            <div className="bg-ice/5 border border-ice/20 p-6 w-full text-left mb-12 rounded-2xl shadow-[0_0_15px_rgba(223,243,255,0.1)]">
              <h3 className="text-lg font-heading text-ice mb-2">Informacja testowa (Mock E-mail)</h3>
              <p className="text-sm text-silver font-light mb-4">
                E-mail z potwierdzeniem rezerwacji został wysłany przez środowisko testowe. Możesz podejrzeć jego treść tutaj:
              </p>
              <a href={emailUrl} target="_blank" rel="noreferrer" className="text-ice hover:text-white transition-colors hover:underline font-medium break-all">
                {emailUrl}
              </a>
            </div>
          )}

          <Link 
            to="/"
            className="bg-transparent border border-ice text-ice hover:bg-ice hover:text-navy px-8 py-4 rounded-xl font-bold transition-all duration-300 uppercase tracking-widest text-sm flex items-center gap-3 shadow-[0_0_15px_rgba(223,243,255,0.1)] hover:shadow-[0_0_25px_rgba(223,243,255,0.4)]"
          >
            Wróć na stronę główną <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
