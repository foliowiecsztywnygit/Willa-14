import { useState, useRef, useEffect } from 'react';
import { Calendar, Users, Search, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DayPicker, DateRange } from 'react-day-picker';
import { pl } from 'date-fns/locale';
import { format } from 'date-fns';
import 'react-day-picker/dist/style.css';

export function BookingWidget() {
  const navigate = useNavigate();
  const [adults, setAdults] = useState(2);
  const [teens, setTeens] = useState(0);
  const [children, setChildren] = useState(0);
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    let url = `/rooms?guests=${adults}&teens=${teens}&children=${children}`;
    if (dateRange?.from && dateRange?.to) {
      url += `&from=${format(dateRange.from, 'yyyy-MM-dd')}&to=${format(dateRange.to, 'yyyy-MM-dd')}`;
    }
    navigate(url);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 max-w-5xl w-full mx-auto relative z-10 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] bg-navy-light/40 backdrop-blur-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
        
        {/* Date Picker */}
        <div className="flex flex-col gap-3 relative lg:col-span-2" ref={calendarRef}>
          <label className="text-xs font-semibold text-ice uppercase tracking-widest drop-shadow-sm">Wybierz termin</label>
          <div 
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="flex items-center gap-3 border border-white/20 rounded-xl px-4 py-3 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer backdrop-blur-md group"
          >
            <Calendar className="h-5 w-5 text-ice shrink-0 group-hover:text-white transition-colors" />
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
                onSelect={setDateRange}
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
          <label className="block text-xs font-semibold text-ice uppercase tracking-widest truncate drop-shadow-sm" title="Dorośli">Dorośli</label>
          <div className="flex items-center justify-between border border-white/20 rounded-xl px-3 py-3 bg-white/5 backdrop-blur-md">
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
          <label className="block text-xs font-semibold text-ice uppercase tracking-widest truncate drop-shadow-sm" title="Nastolatkowie (3-17)">Wiek 3-17</label>
          <div className="flex items-center justify-between border border-white/20 rounded-xl px-3 py-3 bg-white/5 backdrop-blur-md">
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
          <label className="block text-xs font-semibold text-ice uppercase tracking-widest truncate drop-shadow-sm" title="Dzieci (0-2)">Wiek 0-2</label>
          <div className="flex items-center justify-between border border-white/20 rounded-xl px-3 py-3 bg-white/5 backdrop-blur-md">
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

      {/* Search Button (Full width on bottom) */}
      <div className="mt-8">
        <button 
          onClick={handleSearch}
          className="bg-ice hover:bg-white text-navy px-4 py-4 rounded-xl flex items-center justify-center gap-3 font-bold transition-all duration-300 w-full uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(223,243,255,0.3)] hover:shadow-[0_0_25px_rgba(223,243,255,0.6)]"
        >
          <Search className="h-5 w-5" />
          <span>Szukaj dostępnych pokoi</span>
        </button>
      </div>
    </div>
  );
}
