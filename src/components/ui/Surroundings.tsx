import { MapPin, Mountain, Compass, Navigation } from 'lucide-react';
import { DecorativeLine } from './DecorativeLine';
import { SectionDivider } from './SectionDivider';
import { FolkPattern } from './FolkPattern';

export function Surroundings() {
  const attractions = [
    {
      name: "Rówień Krupowa",
      distance: "200 m",
      time: "3 min spacerem",
      description: "Ogromna zielona przestrzeń w samym centrum Zakopanego, idealna na poranne spacery i wieczorny relaks. Znakomity punkt widokowy na Giewont.",
      icon: <Compass className="h-8 w-8 text-gold" />
    },
    {
      name: "Krupówki",
      distance: "600 m",
      time: "8 min spacerem",
      description: "Najsłynniejszy deptak w Polsce. Znajdziesz tu najlepsze regionalne restauracje, kawiarnie i luksusowe butiki.",
      icon: <MapPin className="h-8 w-8 text-gold" />
    },
    {
      name: "Kuźnice (Szlaki)",
      distance: "3.5 km",
      time: "10 min busem",
      description: "Główny punkt wypadowy w wyższe partie Tatr, m.in. stacja kolejki na Kasprowy Wierch i wejście na Halę Gąsienicową.",
      icon: <Mountain className="h-8 w-8 text-gold" />
    },
    {
      name: "Dworzec PKP/PKS",
      distance: "400 m",
      time: "5 min spacerem",
      description: "Znakomita komunikacja z resztą kraju oraz lokalnymi busami dojeżdżającymi do najpopularniejszych dolin.",
      icon: <Navigation className="h-8 w-8 text-gold" />
    }
  ];

  return (
    <section id="surroundings" className="py-32 bg-gray-darker relative overflow-hidden">
      <SectionDivider position="top" fillClass="fill-white" type="wave" className="-mt-px" />
      <FolkPattern className="text-gold w-[600px] h-[600px] -right-32 top-10 opacity-5" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Text Content */}
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-heading font-bold text-gray-800 mb-6 tracking-wider">Okolica Willi</h2>
            <DecorativeLine className="mb-8 justify-start w-1/2" />
            <p className="text-gray-600 font-light text-lg mb-10 leading-relaxed">
              Willa 14 Zakopane to idealna baza wypadowa. Zaledwie kilka minut spacerem dzieli Cię od najważniejszych atrakcji Zakopanego. Bliskość Krupówek, Aqua Parku i szlaków turystycznych sprawia, że każdy dzień możesz spędzić inaczej.
            </p>

            <div className="space-y-8">
              {attractions.map((item, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center bg-white group-hover:bg-gold/10 transition-colors duration-500">
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-4 mb-2">
                      <h3 className="text-xl font-heading font-semibold text-gray-800 tracking-wide">{item.name}</h3>
                      <span className="text-gold text-sm font-medium tracking-widest">{item.distance}</span>
                    </div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">{item.time}</p>
                    <p className="text-gray-600 font-light leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map/Image */}
          <div className="lg:w-1/2 w-full">
            <div className="glass-panel p-2 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-gold/20 to-transparent blur-2xl -z-10 opacity-50"></div>
              <div className="h-[600px] w-full overflow-hidden relative bg-white">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2598.6654271881665!2d19.9575999!3d49.298711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4715f2a1b18d8e5b%3A0xc3905c10edb89311!2sWilla%20Rysy!5e0!3m2!1spl!2spl!4v1700000000000!5m2!1spl!2spl" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa dojazdu Willa 14 Zakopane"
                ></iframe>
                <div className="absolute bottom-6 left-6 right-6 bg-white/80 backdrop-blur-md border border-gray-200 p-6 text-center pointer-events-none">
                  <h4 className="text-gold font-heading text-xl mb-2">ul. Salwatoriańska 14</h4>
                  <p className="text-gray-600 text-sm tracking-widest uppercase">34-500 Zakopane</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
