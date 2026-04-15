import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, Wifi, Tv, Coffee, Wind, Check, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import { DayPicker, DateRange } from 'react-day-picker';
import { pl } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import { format, eachDayOfInterval, addDays, startOfDay, isSameDay } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { useToastStore } from '../../store/useToastStore';
import { Snowfall } from '../../components/ui/Snowfall';

interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
  base_price: number;
  amenities: string[];
  images: string[];
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const query = useQuery();
  const { addToast } = useToastStore();
  
  const adults = query.get('adults') || '2';
  const teens = query.get('teens') || '0';
  const children = query.get('children') || '0';

  const [selectedDates, setSelectedDates] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [room, setRoom] = useState<Room | null>(null);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [checkInDates, setCheckInDates] = useState<Date[]>([]);
  const [checkOutDates, setCheckOutDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchRoomDetails() {
      if (!id) return;
      
      try {
        const { data: roomData, error: roomError } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', id)
          .single();
        
        if (roomError) throw roomError;
        
        if (roomData) {
          setRoom(roomData);
        }

        const smoobuRes = await fetch('/api/smoobu-availability');
        const smoobuData = await smoobuRes.json();
          
        if (!smoobuData.success) throw new Error(smoobuData.error);

        if (smoobuData.bookings) {
          const datesToBlockFull: Date[] = [];
          const checkIns: Date[] = [];
          const checkOuts: Date[] = [];
          
          const smoobuId = roomData.smoobu_id;
          
          if (smoobuId) {
            const roomBookings = smoobuData.bookings.filter((b: any) => b.apartment_id === smoobuId);
            
            roomBookings.forEach((booking: any) => {
              const start = new Date(booking.check_in);
              const end = new Date(booking.check_out);
              
              checkIns.push(start);
              checkOuts.push(end);

              if (end.getTime() - start.getTime() > 24 * 60 * 60 * 1000) {
                const interval = eachDayOfInterval({ start: addDays(start, 1), end: addDays(end, -1) });
                datesToBlockFull.push(...interval);
              }
            });
          }
          
          setBookedDates(datesToBlockFull);
          setCheckInDates(checkIns);
          setCheckOutDates(checkOuts);
        }
        
      } catch (error) {
        console.error('Error fetching room details or bookings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRoomDetails();
  }, [id]);

  const isDateBlocked = (date: Date) => {
    return bookedDates.some(blockedDate => isSameDay(blockedDate, date));
  };

  const handleSelectDates = (range: DateRange | undefined) => {
    if (!range) {
      setSelectedDates({ from: undefined, to: undefined });
      return;
    }
    
    if (range.from && range.to) {
      const start = startOfDay(range.from);
      const end = startOfDay(range.to);
      
      const interval = eachDayOfInterval({ start, end });
      const hasBlockedDates = interval.some(date => isDateBlocked(date));
      
      const hasConflictInside = interval.some(date => {
        if (!isSameDay(date, start) && !isSameDay(date, end)) {
           return checkInDates.some(c => isSameDay(c, date)) || checkOutDates.some(c => isSameDay(c, date));
        }
        return false;
      });
      
      const startIsCheckIn = checkInDates.some(c => isSameDay(c, start));
      const endIsCheckOut = checkOutDates.some(c => isSameDay(c, end));

      if (hasBlockedDates || hasConflictInside || startIsCheckIn || endIsCheckOut) {
        addToast('Wybrany termin nakłada się na już zarezerwowane daty.', 'error');
        setSelectedDates({ from: range.from, to: undefined });
        return;
      }
    }
    
    setSelectedDates({ from: range.from, to: range.to });
  };

  const getAmenityIcon = (amenity: string) => {
    switch(amenity) {
      case 'wifi': return <><Wifi className="h-6 w-6 text-ice mb-3 drop-shadow-md" /> Szybkie Wi-Fi</>;
      case 'tv': return <><Tv className="h-6 w-6 text-ice mb-3 drop-shadow-md" /> Smart TV 55"</>;
      case 'coffee': return <><Coffee className="h-6 w-6 text-ice mb-3 drop-shadow-md" /> Ekspres do kawy</>;
      case 'sauna': return <><Wind className="h-6 w-6 text-ice mb-3 drop-shadow-md" /> Prywatna sauna</>;
      case 'balcony': return <><Wind className="h-6 w-6 text-ice mb-3 drop-shadow-md" /> Balkon z widokiem</>;
      default: return null;
    }
  };

  const handleBooking = () => {
    if (selectedDates.from && selectedDates.to) {
      const fromStr = format(selectedDates.from, 'yyyy-MM-dd');
      const toStr = format(selectedDates.to, 'yyyy-MM-dd');
      navigate(`/booking?room=${id}&from=${fromStr}&to=${toStr}&adults=${adults}&teens=${teens}&children=${children}`);
    } else {
      addToast('Proszę wybrać daty pobytu przed dokonaniem rezerwacji.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="bg-navy min-h-screen pb-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ice"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="bg-navy min-h-screen pb-24 text-silver-light flex flex-col justify-center items-center">
        <h2 className="text-2xl font-heading text-white mb-4">Nie znaleziono pokoju</h2>
        <Link to="/rooms" className="text-ice hover:underline">Wróć do listy pokoi</Link>
      </div>
    );
  }

  const features = [
    "Prywatna łazienka z prysznicem",
    "Zestaw kosmetyków naturalnych",
    "Suszarka do włosów",
    "Ręczniki",
    "Klimatyzacja/Ogrzewanie",
    "Mini lodówka"
  ];

  return (
    <div className="bg-navy min-h-screen pb-24 text-silver-light relative selection:bg-ice/30 selection:text-white font-sans">
      <div className="absolute inset-0 bg-gradient-radial from-ice/5 via-transparent to-transparent blur-3xl mix-blend-screen pointer-events-none z-0"></div>
      <Snowfall />

      {/* Top Bar */}
      <div className="bg-navy-dark/90 backdrop-blur-xl border-b border-white/5 sticky top-20 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/rooms" className="flex items-center gap-3 text-silver hover:text-white font-medium transition-colors uppercase tracking-widest text-sm">
            <ArrowLeft className="h-4 w-4" /> Wróć do listy
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <div className="text-xl font-bold text-white tracking-wider drop-shadow-sm">{room.base_price} <span className="text-ice">zł</span> <span className="text-xs font-normal text-silver uppercase tracking-widest">/ noc</span></div>
            </div>
            <button 
              onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-ice hover:bg-white text-navy px-8 py-2.5 rounded-full font-bold transition-all uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(223,243,255,0.3)]"
            >
              Rezerwuj
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10 animate-fade-in-up">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="glass-card p-8 md:p-12 relative overflow-hidden border border-white/10 bg-white/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-8">
                <h1 className="text-4xl font-heading font-bold text-white tracking-wide drop-shadow-[0_0_15px_rgba(223,243,255,0.2)]">{room.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-silver">
                  <span className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 uppercase tracking-widest text-xs rounded-full backdrop-blur-md text-white">
                    <Users className="h-4 w-4 text-ice" /> Max {room.capacity} os.
                  </span>
                </div>
              </div>

              <p className="text-silver-dark leading-relaxed mb-12 font-light text-lg">
                {room.description}
              </p>

              <h3 className="text-2xl font-heading font-semibold text-white mb-6 flex items-center gap-3">
                Główne udogodnienia
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-ice to-transparent rounded-full mb-8 opacity-50"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {room.amenities.map(a => (
                  <div key={a} className="flex flex-col items-center justify-center text-center p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-ice/50 hover:bg-white/10 transition-all duration-300">
                    {getAmenityIcon(a)}
                  </div>
                ))}
              </div>

              <h3 className="text-2xl font-heading font-semibold text-white mb-6 flex items-center gap-3">
                Wyposażenie pokoju
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-ice to-transparent rounded-full mb-8 opacity-50"></div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-4 text-silver font-light">
                    <div className="p-1 rounded-full bg-ice/10 border border-ice/20 shadow-[0_0_10px_rgba(223,243,255,0.2)]">
                      <Check className="h-4 w-4 text-ice shrink-0" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1" id="booking-section">
            <div className="glass-card p-8 sticky top-32 border border-white/10 bg-navy-light/40 backdrop-blur-xl">
              <div className="flex justify-between items-end mb-8 pb-8 border-b border-white/10">
                <span className="text-sm uppercase tracking-widest text-silver">Cena za noc</span>
                <div className="text-3xl font-bold text-white tracking-wider drop-shadow-sm">{room.base_price} <span className="text-ice">zł</span></div>
              </div>

              <h3 className="font-heading text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-ice" /> Wybierz termin
              </h3>

              <div className="flex justify-center mb-8 calendar-wrapper bg-navy border border-white/20 rounded-2xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <style>{`
                  .rdp-root { 
                    --rdp-accent-color: #dff3ff; 
                    --rdp-accent-background-color: #dff3ff; 
                    margin: 0; 
                  }
                  .rdp-day { color: #e2e8f0; font-size: 1.1rem; padding: 0 !important; margin: 0 !important; border: 1px solid transparent; }
                  .rdp-disabled { color: #475569; opacity: 1; background-color: transparent; }
                  .rdp-caption_label { color: #ffffff; font-family: 'Playfair Display', serif; font-size: 1.2rem; text-transform: uppercase; letter-spacing: 0.1em; }
                  .rdp-weekday { color: #94a3b8; font-weight: normal; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.85rem; padding-bottom: 0.5rem; }
                  
                  .rdp-button_reset {
                    width: 100% !important;
                    height: 48px !important;
                    max-width: none !important;
                    margin: 0 !important;
                    border-radius: 0 !important;
                    transition: all 0.2s ease !important;
                  }

                  .rdp-day_selected:not([disabled]),
                  .rdp-day_selected:focus-visible:not([disabled]),
                  .rdp-day_selected:hover:not([disabled]) {
                    background-color: #dff3ff !important;
                    color: #000000 !important;
                    font-weight: bold;
                    border-radius: 0 !important;
                    box-shadow: 0 0 15px rgba(223, 243, 255, 0.4);
                  }

                  .rdp-day_range_start {
                    border-top-left-radius: 9999px !important;
                    border-bottom-left-radius: 9999px !important;
                  }
                  .rdp-day_range_end {
                    border-top-right-radius: 9999px !important;
                    border-bottom-right-radius: 9999px !important;
                  }
                  .rdp-day_range_start.rdp-day_range_end {
                    border-radius: 9999px !important;
                  }

                  .rdp-day_hovered:not([disabled]),
                  .rdp-day_range_middle {
                    background-color: #dff3ff !important;
                    color: #000000 !important;
                    border-radius: 0 !important;
                  }

                  .rdp-day_button:hover:not([disabled]):not(.rdp-day_selected):not(.rdp-day_range_middle) {
                    background-color: rgba(255, 255, 255, 0.1) !important;
                    color: #ffffff !important;
                    border-radius: 9999px !important;
                  }

                  .rdp-day_booked {
                    background-color: rgba(255, 107, 107, 0.1) !important;
                    color: #ff6b6b !important;
                    text-decoration: line-through;
                  }
                  .rdp-day_checkIn {
                    background: linear-gradient(to right, transparent 50%, rgba(255, 107, 107, 0.1) 50%) !important;
                  }
                  .rdp-day_checkOut {
                    background: linear-gradient(to right, rgba(255, 107, 107, 0.1) 50%, transparent 50%) !important;
                  }
                  .rdp-day_checkIn.rdp-day_checkOut {
                    background: rgba(255, 107, 107, 0.1) !important;
                    color: #ff6b6b !important;
                    text-decoration: line-through;
                  }
                `}</style>
                <DayPicker
                  mode="range"
                  selected={selectedDates}
                  onSelect={handleSelectDates}
                  locale={pl}
                  disabled={[
                    { before: new Date() },
                    ...bookedDates
                  ]}
                  modifiers={{
                    booked: bookedDates,
                    checkIn: checkInDates,
                    checkOut: checkOutDates
                  }}
                  numberOfMonths={1}
                />
              </div>

              {selectedDates.from && selectedDates.to && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 backdrop-blur-md">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-silver uppercase tracking-widest text-xs">Od:</span>
                    <span className="font-medium text-white">{format(selectedDates.from, 'dd.MM.yyyy')}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-silver uppercase tracking-widest text-xs">Do:</span>
                    <span className="font-medium text-white">{format(selectedDates.to, 'dd.MM.yyyy')}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-6">
                    <span className="text-silver uppercase tracking-widest text-xs">Długość pobytu:</span>
                    <span className="font-medium text-white">
                      {Math.ceil((selectedDates.to.getTime() - selectedDates.from.getTime()) / (1000 * 60 * 60 * 24))} nocy
                    </span>
                  </div>
                  <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                    <span className="font-heading text-lg text-silver tracking-wider">Suma:</span>
                    <span className="text-2xl font-bold text-white drop-shadow-md">
                      {room.base_price * Math.ceil((selectedDates.to.getTime() - selectedDates.from.getTime()) / (1000 * 60 * 60 * 24))} <span className="text-ice">zł</span>
                    </span>
                  </div>
                </div>
              )}

              <button 
                onClick={handleBooking}
                disabled={!selectedDates.from || !selectedDates.to}
                className="w-full bg-ice hover:bg-white disabled:bg-navy-dark disabled:text-silver-dark disabled:border-white/5 disabled:cursor-not-allowed text-navy rounded-xl py-4 font-bold transition-all duration-300 uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(223,243,255,0.3)] disabled:shadow-none hover:shadow-[0_0_25px_rgba(223,243,255,0.6)]"
              >
                Przejdź do rezerwacji
              </button>
              
              <p className="text-xs text-center text-silver-dark mt-6 uppercase tracking-widest">
                Nic nie zapłacisz na tym etapie.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
