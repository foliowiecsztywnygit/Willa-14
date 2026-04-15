import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Wifi, Tv, Coffee, Wind, ArrowRight, Calendar as CalendarIcon, Minus, Plus } from 'lucide-react';
import { DayPicker, DateRange } from 'react-day-picker';
import { pl } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
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

export function Rooms() {
  const query = useQuery();
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtry
  const [adults, setAdults] = useState(parseInt(query.get('guests') || '2'));
  const [teens, setTeens] = useState(parseInt(query.get('teens') || '0'));
  const [children, setChildren] = useState(parseInt(query.get('children') || '0'));
  
  const queryFrom = query.get('from');
  const queryTo = query.get('to');
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: queryFrom ? new Date(queryFrom) : undefined,
    to: queryTo ? new Date(queryTo) : undefined
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const [roomsResponse, smoobuResponse] = await Promise.all([
          supabase.from('rooms').select('*'),
          fetch('/api/smoobu-availability').then(res => res.json())
        ]);
        
        if (roomsResponse.error) throw roomsResponse.error;
        if (!smoobuResponse.success) throw new Error(smoobuResponse.error);
        
        if (roomsResponse.data) setRooms(roomsResponse.data);
        if (smoobuResponse.bookings) setBookings(smoobuResponse.bookings);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSelectDates = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const isRoomAvailable = (roomId: string, range: DateRange | undefined) => {
    if (!range?.from || !range?.to) return true;
    
    const room = rooms.find(r => r.id === roomId);
    if (!room) return false;
    
    const smoobuId = (room as any).smoobu_id;
    if (!smoobuId) return true;

    const roomBookings = bookings.filter(b => b.apartment_id === smoobuId);
    
    for (const b of roomBookings) {
      const bStart = new Date(b.check_in);
      const bEnd = new Date(b.check_out);
      
      if (range.from < bEnd && range.to > bStart) {
        return false;
      }
    }
    
    return true;
  };

  const totalGuests = adults + teens + children;
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'capacity-desc'>('price-asc');

  const filteredRooms = rooms.filter(room => {
    const hasCapacity = room.capacity >= totalGuests;
    const isAvailable = isRoomAvailable(room.id, dateRange);
    return hasCapacity && isAvailable;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.base_price - b.base_price;
    if (sortBy === 'price-desc') return b.base_price - a.base_price;
    if (sortBy === 'capacity-desc') return b.capacity - a.capacity;
    return 0;
  });

  const getAmenityIcon = (amenity: string) => {
    switch(amenity) {
      case 'wifi': return <span title="Wi-Fi"><Wifi className="h-4 w-4" /></span>;
      case 'tv': return <span title="Smart TV"><Tv className="h-4 w-4" /></span>;
      case 'coffee': return <span title="Ekspres do kawy"><Coffee className="h-4 w-4" /></span>;
      case 'sauna': return <span title="Sauna"><Wind className="h-4 w-4" /></span>;
      default: return null;
    }
  };

  return (
    <div className="bg-navy min-h-screen pb-24 relative selection:bg-ice/30 selection:text-white font-sans text-silver-light">
      
      {/* Header */}
      <div className="bg-navy-dark pt-32 pb-16 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ice/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-radial from-ice/5 via-transparent to-transparent blur-3xl mix-blend-screen pointer-events-none"></div>
        <Snowfall />

        <div className="container mx-auto px-4 text-center max-w-3xl flex flex-col items-center relative z-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 tracking-wide drop-shadow-[0_0_15px_rgba(223,243,255,0.3)]">Nasze Pokoje</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-ice to-transparent mx-auto rounded-full mb-6 shadow-[0_0_10px_rgba(223,243,255,0.8)]"></div>
          <p className="text-silver-dark text-lg font-light tracking-wide">
            Wybierz przestrzeń idealnie dopasowaną do Twoich potrzeb. Każdy z naszych pokoi został zaprojektowany z myślą o Twoim komforcie i relaksie blisko natury.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl mt-12 relative z-20">
        {/* Filters */}
        <div className="glass-panel rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 mb-12 relative z-[60] sticky top-24 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            
            {/* Date Picker Filter */}
            <div className="relative" ref={calendarRef}>
              <label className="block text-xs font-semibold text-ice uppercase tracking-widest mb-3 drop-shadow-sm">Wybierz termin</label>
              <div 
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className="flex items-center gap-3 border border-white/20 rounded-xl px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <CalendarIcon className="h-5 w-5 text-ice shrink-0 group-hover:text-white transition-colors" />
                <span className="text-white text-sm font-medium uppercase tracking-wider truncate">
                  {dateRange?.from ? (
                    dateRange.to ? (
                      `${format(dateRange.from, 'dd.MM')} - ${format(dateRange.to, 'dd.MM')}`
                    ) : (
                      format(dateRange.from, 'dd.MM')
                    )
                  ) : (
                    "Wybierz daty"
                  )}
                </span>
              </div>
              
              {isCalendarOpen && (
                <div className="absolute top-full left-0 mt-2 z-[100] bg-navy border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.8)] p-4 rounded-2xl min-w-[320px]">
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
                  `}</style>
                  <DayPicker
                    mode="range"
                    selected={dateRange}
                    onSelect={handleSelectDates}
                    locale={pl}
                    disabled={{ before: new Date() }}
                    numberOfMonths={1}
                  />
                  <div className="flex justify-end mt-4 pt-4 border-t border-white/10">
                    <button 
                      onClick={() => setIsCalendarOpen(false)}
                      className="text-xs text-white uppercase tracking-widest hover:text-navy font-semibold px-6 py-2 rounded-full border border-white hover:bg-white transition-all duration-300"
                    >
                      Zamknij
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Adults Filter */}
            <div className="flex flex-col gap-3">
              <label className="block text-xs font-semibold text-ice uppercase tracking-widest drop-shadow-sm">Dorośli</label>
              <div className="flex items-center justify-between border border-white/20 rounded-xl px-4 py-3 bg-white/5 backdrop-blur-md">
                <button 
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="text-silver hover:text-white hover:scale-110 transition-all"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="text-white font-medium w-8 text-center">{adults}</span>
                <button 
                  onClick={() => setAdults(Math.min(10, adults + 1))}
                  className="text-silver hover:text-white hover:scale-110 transition-all"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Teens Filter */}
            <div className="flex flex-col gap-3">
              <label className="block text-xs font-semibold text-ice uppercase tracking-widest drop-shadow-sm">Wiek 3-17</label>
              <div className="flex items-center justify-between border border-white/20 rounded-xl px-4 py-3 bg-white/5 backdrop-blur-md">
                <button 
                  onClick={() => setTeens(Math.max(0, teens - 1))}
                  className="text-silver hover:text-white hover:scale-110 transition-all"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="text-white font-medium w-8 text-center">{teens}</span>
                <button 
                  onClick={() => setTeens(Math.min(10, teens + 1))}
                  className="text-silver hover:text-white hover:scale-110 transition-all"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Children Filter */}
            <div className="flex flex-col gap-3">
              <label className="block text-xs font-semibold text-ice uppercase tracking-widest drop-shadow-sm">Wiek 0-2</label>
              <div className="flex items-center justify-between border border-white/20 rounded-xl px-4 py-3 bg-white/5 backdrop-blur-md">
                <button 
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  className="text-silver hover:text-white hover:scale-110 transition-all"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="text-white font-medium w-8 text-center">{children}</span>
                <button 
                  onClick={() => setChildren(Math.min(10, children + 1))}
                  className="text-silver hover:text-white hover:scale-110 transition-all"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Room List */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ice"></div>
          </div>
        ) : (
          <div className="space-y-6 max-w-6xl mx-auto">
            
            {/* Opcje sortowania nad listą pokoi */}
            <div className="flex flex-col sm:flex-row justify-between items-center glass-card border border-white/10 p-4 rounded-2xl mb-6 relative z-[50]">
              <h2 className="text-white font-medium mb-4 sm:mb-0">
                Znaleziono {filteredRooms.length} {filteredRooms.length === 1 ? 'pokój' : filteredRooms.length > 1 && filteredRooms.length < 5 ? 'pokoje' : 'pokoi'}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-silver uppercase tracking-widest">Sortuj:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-navy-dark border border-white/20 text-white text-sm font-medium py-2 px-4 rounded-lg focus:ring-1 focus:ring-ice focus:border-ice outline-none appearance-none cursor-pointer"
                >
                  <option value="price-asc">Cena (od najniższej)</option>
                  <option value="price-desc">Cena (od najwyższej)</option>
                  <option value="capacity-desc">Ilość osób (od największej)</option>
                </select>
              </div>
            </div>

            {filteredRooms.map((room, i) => (
              <div key={room.id} className="glass-card flex flex-col md:flex-row gap-6 items-center rounded-2xl overflow-hidden relative z-10 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                
                {/* Content */}
                <div className="flex-1 w-full">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-3">
                    <Link to={`/room/${room.id}`}>
                      <h2 className="text-2xl md:text-3xl font-bold text-white font-heading tracking-wide hover:text-ice transition-colors cursor-pointer drop-shadow-sm">
                        {room.name}
                      </h2>
                    </Link>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-ice bg-white/5 px-3 py-1.5 rounded-full border border-white/10 whitespace-nowrap shadow-inner">
                      <Users className="h-4 w-4" /> Max {room.capacity} {room.capacity === 1 ? 'osoba' : room.capacity >= 5 ? 'osób' : 'osoby'}
                    </div>
                  </div>
                  
                  <p className="text-silver-dark text-sm md:text-base font-light mb-4 line-clamp-2 leading-relaxed">
                    {room.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    {room.amenities.map(a => (
                      <div key={a} className="flex items-center gap-1.5 text-[10px] md:text-xs font-medium text-white bg-white/10 px-2.5 py-1 border border-white/20 rounded-full uppercase tracking-wider">
                        {getAmenityIcon(a)} {a}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price and Action */}
                <div className="w-full md:w-64 shrink-0 flex flex-col items-end bg-navy-dark/50 p-6 border border-white/5 rounded-xl backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ice/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
                  
                  <span className="block text-[10px] md:text-xs text-silver uppercase tracking-widest mb-1 drop-shadow-sm">Cena za noc</span>
                  <div className="text-3xl md:text-4xl font-bold text-white leading-none mb-2 drop-shadow-md">
                    {room.base_price} <span className="text-sm md:text-base text-ice font-normal">zł</span>
                  </div>
                  {dateRange?.from && dateRange?.to && (
                    <span className="block text-[10px] text-ice font-medium mb-4 drop-shadow-[0_0_8px_rgba(223,243,255,0.5)]">
                      Dostępne w wybranym terminie
                    </span>
                  )}
                  
                  <div className="w-full mt-4">
                    <Link 
                      to={
                        dateRange?.from && dateRange?.to 
                          ? `/booking?room=${room.id}&from=${format(dateRange.from, 'yyyy-MM-dd')}&to=${format(dateRange.to, 'yyyy-MM-dd')}&adults=${adults}&teens=${teens}&children=${children}`
                          : `/room/${room.id}?book=true&adults=${adults}&teens=${teens}&children=${children}`
                      }
                      className="w-full bg-ice hover:bg-white text-navy flex items-center justify-center gap-2 py-3 md:py-3.5 font-bold transition-all duration-300 uppercase tracking-widest text-xs md:text-sm rounded-xl shadow-[0_0_15px_rgba(223,243,255,0.3)] hover:shadow-[0_0_25px_rgba(223,243,255,0.6)]"
                    >
                      {dateRange?.from && dateRange?.to ? "Rezerwuj" : "Wybierz"} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          
          {filteredRooms.length === 0 && (
            <div className="text-center py-24 glass-card border border-white/10 rounded-2xl bg-navy-light/40 backdrop-blur-xl">
              <h3 className="text-2xl md:text-3xl font-heading text-white mb-4 tracking-wider">Brak pokoi spełniających kryteria</h3>
              <p className="text-silver font-light mb-8 text-lg">Zmień filtry, aby zobaczyć dostępne pokoje.</p>
              <button 
                onClick={() => {
                  setAdults(1);
                  setTeens(0);
                  setChildren(0);
                  setDateRange({from: undefined, to: undefined});
                }}
                className="text-ice font-medium hover:text-white uppercase tracking-widest text-sm border-b border-ice hover:border-white pb-1 transition-all"
              >
                Resetuj filtry
              </button>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
