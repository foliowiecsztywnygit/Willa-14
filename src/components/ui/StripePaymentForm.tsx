import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Shield } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';

interface BookingData {
  roomId: string;
  fromDate: string;
  toDate: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestsCount: number;
  notes: string;
  totalAmount: number;
  depositAmount: number;
}

export function StripePaymentForm({ 
  amount, 
  paymentIntentId,
  bookingData
}: { 
  amount: number,
  paymentIntentId: string,
  bookingData: BookingData
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { addToast } = useToastStore();

  const logToTerminal = (msg: string, data?: any) => {
    fetch('/api/frontend-log', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ msg, data }) 
    }).catch(() => {});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    logToTerminal("--------------------------------------------------");
    logToTerminal(`Krok 0: Kliknięto przycisk. stripe=${!!stripe}, elements=${!!elements}`);

    if (!stripe || !elements) return;

    // Ręczna walidacja pól formularza rezerwacji
    const [firstName, ...lastNameParts] = bookingData.guestName.split(' ');
    const lastName = lastNameParts.join(' ');
    
    logToTerminal("Walidacja klienta", { name: bookingData.guestName, email: bookingData.guestEmail, phone: bookingData.guestPhone });

    if (!firstName?.trim() || !lastName?.trim()) {
      addToast('Proszę podać pełne imię i nazwisko.', 'error');
      logToTerminal("Walidacja odrzucona: brak imienia/nazwiska");
      return;
    }
    
    if (!bookingData.guestEmail?.trim() || !bookingData.guestEmail.includes('@')) {
      addToast('Proszę podać poprawny adres e-mail.', 'error');
      logToTerminal("Walidacja odrzucona: błędny e-mail");
      return;
    }
    
    if (!bookingData.guestPhone?.trim() || bookingData.guestPhone.length < 5) {
      addToast('Proszę podać poprawny numer telefonu.', 'error');
      logToTerminal("Walidacja odrzucona: błędny telefon");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    logToTerminal("Krok 1: Rozpoczęto proces płatności (walidacja manualna OK)");

    // 1. Walidacja formularza Stripe (czy dane karty/BLIK są ok)
    logToTerminal("Krok 2: Walidacja formularza elements.submit()...");
    const { error: submitError } = await elements.submit();
    if (submitError) {
      logToTerminal("Błąd walidacji Stripe:", submitError.message);
      setErrorMessage(submitError.message || "Wystąpił błąd formularza.");
      setIsProcessing(false);
      return;
    }
    logToTerminal("Krok 2: Walidacja Stripe OK.");

    try {
      // 2. Zapisz rezerwację na backendzie (bezpieczne użycie service_role_key)
      logToTerminal("Krok 3: Wysyłanie żądania do /api/create-booking...");
      const res = await fetch('/api/create-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId, bookingData })
      });
      
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Błąd serwera przy tworzeniu rezerwacji");
      }
      logToTerminal(`Krok 3: Rezerwacja zapisana w bazie. Otrzymane ID: ${data.bookingId}`);

      // 3. Autoryzacja i potwierdzenie płatności w API Stripe
      const confirmParams = {
        return_url: `${window.location.origin}/confirmation?id=${data.bookingId}&pi=${paymentIntentId}&email=${encodeURIComponent(bookingData.guestEmail)}`,
      };

      logToTerminal("Krok 4: Wywoływanie stripe.confirmPayment... Przekierowanie powinno nastąpić za chwilę.", {
        return_url: confirmParams.return_url
      });

      // Usunięto 'if_required' z opcji redirect - Stripe musi natywnie zarządzać
      // przepływem asynchronicznych płatności jak BLIK (requires_action).
      const confirmResult = await stripe.confirmPayment({
        elements,
        confirmParams
      });

      logToTerminal("Krok 4: Zakończono confirmPayment bez natywnego przekierowania. Wynik:", confirmResult);

      if (confirmResult.error) {
        logToTerminal("Błąd stripe.confirmPayment:", confirmResult.error.message);
        if (confirmResult.error.type === 'card_error' || confirmResult.error.type === 'validation_error') {
          setErrorMessage(confirmResult.error.message || "Błąd walidacji karty.");
        } else {
          setErrorMessage("Wystąpił nieoczekiwany błąd podczas płatności.");
        }
        setIsProcessing(false);
      }

    } catch (err: any) {
      logToTerminal("Wyjątek w procesie płatności (catch block):", err.message);
      console.error("Błąd procesu płatności:", err);
      setErrorMessage("Wystąpił problem podczas zapisywania rezerwacji.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement options={{ layout: 'tabs' }} />
      {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
      <button 
        disabled={!stripe || isProcessing}
        className="w-full bg-gold hover:bg-gold-light text-white py-4 font-semibold transition-all duration-300 uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(212,175,55,0.2)] flex items-center justify-center gap-3 mt-8"
      >
        <Shield className="h-5 w-5" />
        {isProcessing ? 'Przetwarzanie...' : `Opłać zadatek i rezerwuj (${amount} zł)`}
      </button>
    </form>
  );
}