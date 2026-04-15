import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { DecorativeLine } from '../../components/ui/DecorativeLine';
import { supabase } from '../../lib/supabase';
import { StripePaymentForm } from '../../components/ui/StripePaymentForm';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Snowfall } from '../../components/ui/Snowfall';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_51TIRXxArtHG9wOklMyQ0bvUou3hee4Cg5e3uRbmvabRZ2oqXVD0ENALqOcc0CHJL7WmFZaYIf2uPp3Iwh3Utga5O004DTvQX1J');

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function Booking() {
  const navigate = useNavigate();
  const query = useQuery();
  const roomId = query.get('room');
  const fromDate = query.get('from');
  const toDate = query.get('to');
  const queryAdults = query.get('adults') || '2';
  const queryTeens = query.get('teens') || '0';
  const queryChildren = query.get('children') || '0';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    adults: queryAdults,
    teens: queryTeens,
    children: queryChildren,
    notes: '',
    acceptTerms: false
  });

  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<{clientSecret: string, paymentIntentId: string, depositAmount: number, totalPrice: number} | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function initCheckout() {
      if (!roomId || !fromDate || !toDate) {
        setLoading(false);
        return;
      }
      
      try {
        const { data: roomData, error } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', roomId)
          .single();
          
        if (error) throw error;
        setRoom(roomData);

        const res = await fetch('/api/init-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ room_id: roomId, from: fromDate, to: toDate })
        });
        
        const pData = await res.json();
        if (!res.ok) throw new Error(pData.error);
        
        setPaymentData(pData);

      } catch (error) {
        console.error("Error init checkout:", error);
      } finally {
        setLoading(false);
      }
    }
    
    initCheckout();
  }, [roomId, fromDate, toDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (loading) {
    return (
      <div className="bg-navy min-h-screen pb-24 text-silver flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ice"></div>
      </div>
    );
  }

  if (!room || !fromDate || !toDate || !paymentData) {
    return (
      <div className="bg-navy min-h-screen pb-24 text-silver flex flex-col justify-center items-center">
        <h2 className="text-2xl font-heading text-white mb-4">Wystąpił problem z wczytaniem płatności</h2>
        <p className="mb-6 font-light">Wróć do strony pokoju i wybierz poprawny termin.</p>
        <button onClick={() => navigate('/rooms')} className="bg-ice text-navy px-6 py-3 font-bold rounded-full uppercase tracking-widest text-sm hover:bg-white transition-colors">Wróć do pokoi</button>
      </div>
    );
  }

  const start = new Date(fromDate);
  const end = new Date(toDate);
  const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  const bookingDataForStripe = {
    roomId: room.id,
    fromDate: fromDate,
    toDate: toDate,
    guestName: `${formData.firstName} ${formData.lastName}`,
    guestEmail: formData.email,
    guestPhone: formData.phone,
    guestsCount: parseInt(formData.adults) + parseInt(formData.teens) + parseInt(formData.children),
    notes: `Dorośli: ${formData.adults}, Nastolatkowie: ${formData.teens}, Dzieci: ${formData.children}. ${formData.notes}`,
    totalAmount: paymentData.totalPrice,
    depositAmount: paymentData.depositAmount
  };

  return (
    <div className="bg-navy min-h-screen pb-24 text-silver-light relative selection:bg-ice/30 selection:text-white font-sans">
      <div className="absolute inset-0 bg-gradient-radial from-ice/5 via-transparent to-transparent blur-3xl mix-blend-screen pointer-events-none z-0"></div>
      <Snowfall />

      <div className="bg-navy-dark/90 backdrop-blur-xl border-b border-white/5 sticky top-20 z-40">
        <div className="container mx-auto px-4 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-silver hover:text-white font-medium transition-colors uppercase tracking-widest text-sm">
            <ArrowLeft className="h-4 w-4" /> Wróć do wyboru terminu
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10 animate-fade-in-up">
        <div className="flex flex-col mb-10">
          <h1 className="text-4xl font-heading font-bold text-white tracking-wider mb-4 drop-shadow-[0_0_15px_rgba(223,243,255,0.2)]">Dokończ rezerwację</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-ice to-transparent rounded-full mb-8 opacity-50"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Form & Payment (Wrapped in Stripe Elements) */}
          <div className="lg:col-span-2 space-y-12">
            
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret: paymentData.clientSecret, 
                locale: 'pl',
                appearance: { 
                  theme: 'night', 
                  variables: { 
                    colorPrimary: '#dff3ff',
                    colorBackground: 'rgba(255, 255, 255, 0.05)',
                    colorText: '#f8f9fa',
                    colorDanger: '#ff6b6b',
                    fontFamily: 'Inter, sans-serif',
                    spacingUnit: '4px',
                    borderRadius: '12px'
                  },
                  rules: {
                    tabIconSelectedColor: '#0f172a',
                    tabIconColor: '#94a3b8',
                    tabIconHoverColor: '#dff3ff'
                  }
                } 
              }}
            >
              <div className="space-y-12">
                {/* Guest Details */}
                <div className="glass-card p-8 md:p-10 relative border border-white/10 bg-white/5 backdrop-blur-xl">
                  <h2 className="text-2xl font-heading font-bold text-white mb-8 tracking-wider border-b border-white/10 pb-4">Dane gościa</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-medium text-ice uppercase tracking-widest mb-3">Imię *</label>
                      <input 
                        type="text" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-navy-dark/50 border border-white/20 rounded-xl text-white focus:ring-1 focus:ring-ice focus:border-ice outline-none transition-colors backdrop-blur-md placeholder-silver-dark/50"
                        placeholder="Jan"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ice uppercase tracking-widest mb-3">Nazwisko *</label>
                      <input 
                        type="text" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-navy-dark/50 border border-white/20 rounded-xl text-white focus:ring-1 focus:ring-ice focus:border-ice outline-none transition-colors backdrop-blur-md placeholder-silver-dark/50"
                        placeholder="Kowalski"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ice uppercase tracking-widest mb-3">Adres e-mail *</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-navy-dark/50 border border-white/20 rounded-xl text-white focus:ring-1 focus:ring-ice focus:border-ice outline-none transition-colors backdrop-blur-md placeholder-silver-dark/50"
                        placeholder="jan.kowalski@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ice uppercase tracking-widest mb-3">Numer telefonu *</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-navy-dark/50 border border-white/20 rounded-xl text-white focus:ring-1 focus:ring-ice focus:border-ice outline-none transition-colors backdrop-blur-md placeholder-silver-dark/50"
                        placeholder="+48 123 456 789"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ice uppercase tracking-widest mb-3">Dorośli *</label>
                      <select 
                        name="adults"
                        value={formData.adults}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-navy-dark/50 border border-white/20 rounded-xl text-white focus:ring-1 focus:ring-ice focus:border-ice outline-none transition-colors appearance-none backdrop-blur-md cursor-pointer"
                      >
                        {[1,2,3,4,5,6].map(num => (
                          <option key={num} value={num} className="bg-navy-dark text-white">{num}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ice uppercase tracking-widest mb-3">Nastolatkowie (3-17)</label>
                      <select 
                        name="teens"
                        value={formData.teens}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-navy-dark/50 border border-white/20 rounded-xl text-white focus:ring-1 focus:ring-ice focus:border-ice outline-none transition-colors appearance-none backdrop-blur-md cursor-pointer"
                      >
                        {[0,1,2,3,4,5].map(num => (
                          <option key={num} value={num} className="bg-navy-dark text-white">{num}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-ice uppercase tracking-widest mb-3">Dzieci (0-2)</label>
                      <select 
                        name="children"
                        value={formData.children}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 bg-navy-dark/50 border border-white/20 rounded-xl text-white focus:ring-1 focus:ring-ice focus:border-ice outline-none transition-colors appearance-none backdrop-blur-md cursor-pointer"
                      >
                        {[0,1,2,3,4,5].map(num => (
                          <option key={num} value={num} className="bg-navy-dark text-white">{num}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-ice uppercase tracking-widest mb-3">Życzenia specjalne (opcjonalnie)</label>
                      <textarea 
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-4 bg-navy-dark/50 border border-white/20 rounded-xl text-white focus:ring-1 focus:ring-ice focus:border-ice outline-none transition-colors resize-none backdrop-blur-md placeholder-silver-dark/50"
                        placeholder="Napisz, jeśli masz specjalne wymagania..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Policies */}
                <div className="glass-card p-8 md:p-10 relative border border-white/10 bg-white/5 backdrop-blur-xl">
                  <h2 className="text-2xl font-heading font-bold text-white mb-6 tracking-wider border-b border-white/10 pb-4">Zasady i regulamin</h2>
                  
                  <div className="bg-navy-dark/50 border border-white/10 rounded-xl p-6 mb-8 text-sm text-silver space-y-4 font-light leading-relaxed">
                    <p><strong className="text-white font-medium">Zadatek:</strong> Aby potwierdzić rezerwację, wymagana jest wpłata zadatku w wysokości 30% wartości rezerwacji. Pozostała kwota płatna na miejscu w dniu przyjazdu.</p>
                    <p><strong className="text-white font-medium">Anulacja:</strong> W przypadku anulacji na mniej niż 14 dni przed przyjazdem, zadatek nie podlega zwrotowi.</p>
                    <p><strong className="text-white font-medium">Zameldowanie:</strong> 15:00 - 22:00 | <strong className="text-white font-medium">Wymeldowanie:</strong> do 11:00</p>
                  </div>

                  <label className="flex items-start gap-4 cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="w-5 h-5 mt-1 rounded border-white/30 bg-navy-dark text-ice focus:ring-ice focus:ring-offset-navy" 
                    />
                    <span className="text-sm text-silver font-light">
                      Akceptuję <Link to="/regulamin" className="text-ice hover:underline">regulamin obiektu</Link> oraz <Link to="/polityka-prywatnosci" className="text-ice hover:underline">politykę prywatności</Link>. Rozumiem, że dokonuję rezerwacji z obowiązkiem zapłaty. *
                    </span>
                  </label>
                </div>

                {/* Payment Form inside Elements */}
                {formData.acceptTerms ? (
                  <div className="glass-card p-8 md:p-10 relative border border-white/10 bg-white/5 backdrop-blur-xl">
                    <h2 className="text-2xl font-heading font-bold text-white mb-6 tracking-wider border-b border-white/10 pb-4">Płatność</h2>
                    <StripePaymentForm 
                      amount={paymentData.depositAmount}
                      paymentIntentId={paymentData.paymentIntentId}
                      bookingData={bookingDataForStripe}
                    />
                  </div>
                ) : (
                  <div className="glass-card p-8 md:p-10 relative border border-white/10 bg-white/5 backdrop-blur-xl text-center">
                    <p className="text-silver font-light">Zaakceptuj regulamin, aby przejść do bezpiecznej płatności.</p>
                  </div>
                )}

              </div>
            </Elements>

          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-8 sticky top-32 border border-white/10 bg-navy-light/40 backdrop-blur-xl">
              <h2 className="text-xl font-heading font-bold text-white mb-6 pb-4 border-b border-white/10 tracking-wider">Podsumowanie</h2>
              
              <div className="mb-8">
                <h3 className="font-bold text-white mb-2 tracking-wide text-lg drop-shadow-sm">{room.name}</h3>
                <p className="text-sm text-silver uppercase tracking-widest">
                  Dorośli: {formData.adults}, Nast.: {formData.teens}, Dzieci: {formData.children}
                </p>
              </div>

              <div className="flex justify-between items-center mb-8 bg-navy-dark/50 rounded-xl border border-white/10 p-4">
                <div>
                  <div className="text-xs text-ice uppercase tracking-widest mb-1">Od</div>
                  <div className="font-medium text-white">{start.toLocaleDateString('pl-PL')}</div>
                </div>
                <ArrowLeft className="h-4 w-4 text-silver rotate-180" />
                <div className="text-right">
                  <div className="text-xs text-ice uppercase tracking-widest mb-1">Do</div>
                  <div className="font-medium text-white">{end.toLocaleDateString('pl-PL')}</div>
                </div>
              </div>

              <div className="space-y-4 mb-8 pb-8 border-b border-white/10 text-sm">
                <div className="flex justify-between">
                  <span className="text-silver">Cena za noc</span>
                  <span className="text-white font-medium">{room.base_price} zł</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-silver">Długość pobytu</span>
                  <span className="text-white font-medium">{nights} noce</span>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-silver uppercase tracking-widest text-sm">Całkowity koszt</span>
                  <span className="text-2xl font-bold text-white drop-shadow-md">{paymentData.totalPrice} <span className="text-ice text-lg font-normal">zł</span></span>
                </div>
                
                <div className="bg-ice/10 border border-ice/20 rounded-xl p-6 shadow-[0_0_15px_rgba(223,243,255,0.1)]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-ice uppercase tracking-widest text-xs">Do zapłaty teraz (30%)</span>
                    <span className="text-2xl font-bold text-ice drop-shadow-sm">{paymentData.depositAmount} zł</span>
                  </div>
                  <p className="text-xs text-silver-dark mt-4 leading-relaxed font-light">Pozostałe {paymentData.totalPrice - paymentData.depositAmount} zł płatne na miejscu.</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-silver uppercase tracking-widest">
                <Shield className="h-4 w-4 text-ice" />
                <span>Bezpieczna płatność Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
