import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  BedDouble, Wifi, Users, ShieldCheck, ParkingCircle,
  Coffee, MapPin, ArrowRight, Star
} from 'lucide-react';
import { BookingWidget } from '../../components/ui/BookingWidget';
import { Snowfall } from '../../components/ui/Snowfall';

// Subcomponents

const SectionHeading = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="text-center mb-16 animate-fade-in-up">
    <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 tracking-wide">{title}</h2>
    {subtitle && <p className="text-silver-dark max-w-2xl mx-auto text-lg">{subtitle}</p>}
    <div className="mt-6 w-24 h-1 bg-gradient-to-r from-transparent via-ice to-transparent mx-auto rounded-full shadow-[0_0_10px_rgba(223,243,255,0.8)]"></div>
  </div>
);

export function Home() {
  const [mousePos, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    setMousePosition({ x, y });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80;
      const offsetPosition = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const benefits = [
    { icon: <BedDouble className="h-8 w-8" />, title: "Czyste i komfortowe pokoje" },
    { icon: <ShieldCheck className="h-8 w-8" />, title: "Całodobowa dostępność" },
    { icon: <MapPin className="h-8 w-8" />, title: "Świetna lokalizacja w Zakopanem" },
    { icon: <Wifi className="h-8 w-8" />, title: "Atrakcyjne ceny i darmowe Wi-Fi" },
    { icon: <Coffee className="h-8 w-8" />, title: "Przyjazna, domowa atmosfera" },
    { icon: <ParkingCircle className="h-8 w-8" />, title: "Wygodny, bezpłatny parking" },
  ];

  const rooms = [
    {
      id: "11111111-1111-1111-1111-111111111111",
      name: "Pokój Standard z Widokiem",
      tags: ["widok na tatry", "dla par"],
      image: "/src/assets/gallery/321097405.jpg",
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      name: "Rodzinne Studio z Balkonem",
      tags: ["przestronne", "dla rodzin"],
      image: "/src/assets/gallery/321097410.jpg",
    },
    {
      id: "33333333-3333-3333-3333-333333333333",
      name: "Apartament Salwatoriański Premium",
      tags: ["aneks kuchenny", "nowoczesny"],
      image: "/src/assets/gallery/449668426.jpg",
    }
  ];

  const reviews = [
    {
      text: "Czysto, komfortowo i bezproblemowo – idealny pobyt w Zakopanem",
      author: "Anna M.",
      avatar: "https://ui-avatars.com/api/?name=Anna+M&background=0D8ABC&color=fff"
    },
    {
      text: "Świetna atmosfera i lokalizacja – czuliśmy się jak w domu",
      author: "Tomasz K.",
      avatar: "https://ui-avatars.com/api/?name=Tomasz+K&background=0D8ABC&color=fff"
    },
    {
      text: "Warto było przyjechać z daleka – miejsce, do którego chce się wracać",
      author: "Marta R.",
      avatar: "https://ui-avatars.com/api/?name=Marta+R&background=0D8ABC&color=fff"
    },
    {
      text: "Przemiła obsługa i super ceny. Najlepszy wybór na relaks w górach!",
      author: "Piotr W.",
      avatar: "https://ui-avatars.com/api/?name=Piotr+W&background=0D8ABC&color=fff"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-navy text-silver-light font-sans selection:bg-ice/30 selection:text-white">
      
      {/* HERO SECTION */}
      <section 
        ref={heroRef}
        className="relative h-[80vh] md:h-screen min-h-[500px] md:min-h-[700px] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0 overflow-hidden bg-navy">
          <img 
            src="/hero.png" 
            alt="Willa 14 w zimowej scenerii" 
            className="absolute top-0 left-0 w-full h-full object-cover opacity-90"
          />
          {/* Subtle building glow & haze */}
          <div className="absolute inset-0 bg-gradient-radial from-ice/10 via-transparent to-transparent blur-3xl opacity-50 mix-blend-screen"></div>
          {/* Gradient Overlay: Dark Navy -> Cool Blue */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/50 to-navy"></div>
          {/* Fog effect at the bottom */}
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-navy via-navy/60 to-transparent z-10"></div>
        </div>

        {/* Snowfall Effect (only on larger screens or reduced on mobile if needed, but let's keep it simple) */}
        {!isMobile && <Snowfall />}

        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto pt-10 md:pt-20 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 tracking-wide drop-shadow-[0_0_20px_rgba(223,243,255,0.4)] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Willa 14 Zakopane – Twój dom w górach</h1>
          <p className="text-lg md:text-2xl text-ice-light mb-10 max-w-3xl mx-auto font-light tracking-wide drop-shadow-md animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Poczuj prawdziwą gościnność. Czyste pokoje, świetna lokalizacja i niezapomniany wypoczynek.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <button 
              onClick={() => scrollTo('booking-section')}
              className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-full bg-white/10 border border-white/20 hover:border-ice backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(223,243,255,0.4)]"
            >
              <span className="relative text-white font-medium tracking-wider uppercase text-sm z-10">Zarezerwuj pobyt</span>
              <div className="absolute inset-0 bg-gradient-to-r from-ice/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button 
              onClick={() => scrollTo('rooms-section')}
              className="group inline-flex items-center justify-center px-8 py-4 rounded-full bg-transparent text-silver-light hover:text-white font-medium tracking-wider uppercase text-sm transition-all duration-300"
            >
              Zobacz pokoje <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* BOOKING WIDGET */}
      <section id="booking-section" className="py-8 md:py-16 bg-navy relative z-30 -mt-10 md:-mt-20">
        <div className="container mx-auto px-4 relative">
          <BookingWidget />
        </div>
      </section>

      {/* O OBIEKCIE (Benefits grid) */}
      <section id="about" className="py-24 bg-navy relative overflow-hidden">
        {/* Decorative subtle snow in bg */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-ice/5 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading title="Poczuj się jak u siebie" subtitle="Stworzyliśmy to miejsce z myślą o Twoim komforcie. Zapewniamy wszystko, by Twój pobyt w Zakopanem był wyjątkowy." />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="glass-card flex flex-col items-center text-center group animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-ice mb-4 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_8px_rgba(223,243,255,0.5)]">
                  {b.icon}
                </div>
                <h3 className="text-silver-light font-medium text-lg leading-snug group-hover:text-white transition-colors">{b.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POKOJE */}
      <section id="rooms-section" className="py-24 bg-navy relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <SectionHeading title="Twoja przestrzeń do relaksu" subtitle="Wybierz pokój idealnie dopasowany do Twoich potrzeb." />
            <Link to="/rooms" className="hidden md:flex items-center gap-2 text-ice font-medium hover:text-white transition-colors uppercase tracking-widest text-sm pb-2">
              Zobacz wszystkie pokoje <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <Link to={`/room/${room.id}`} key={room.id} className="group relative rounded-2xl overflow-hidden aspect-[4/5] block bg-navy-dark border border-white/5 hover:border-ice/30 transition-all duration-500">
                <img 
                  src={room.image} 
                  alt={room.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>

                <div className="absolute bottom-0 left-0 p-8 w-full flex flex-col justify-end">
                  <h3 className="text-2xl font-heading font-bold text-white mb-3 drop-shadow-md group-hover:text-ice transition-colors">{room.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.tags.map(tag => (
                      <span key={tag} className="text-xs uppercase tracking-wider bg-white/10 backdrop-blur-sm text-ice-light px-2 py-1 rounded-sm border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center text-ice text-sm uppercase tracking-widest font-semibold mt-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    Szczegóły <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link to="/rooms" className="inline-flex items-center gap-2 text-ice font-medium hover:text-white transition-colors uppercase tracking-widest text-sm">
              Zobacz wszystkie <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* OPINIE GOŚCI */}
      <section className="py-24 bg-navy-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-ice/5 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-ice/5 blur-[120px] rounded-full"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading title="Opinie Naszych Gości" />
          
          {/* Simple auto-scroll CSS marquee or just a grid. Let's make it a CSS marquee */}
          <div className="relative w-full overflow-hidden flex pb-10">
            <div className="flex gap-6 animate-scroll-left w-max">
              {[...reviews, ...reviews].map((review, i) => (
                <div key={i} className="glass-card w-80 flex-shrink-0 flex flex-col justify-between">
                  <div className="flex text-ice mb-4 drop-shadow-[0_0_5px_rgba(223,243,255,0.6)]">
                    {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="text-silver-light italic mb-6 font-light leading-relaxed flex-grow">"{review.text}"</p>
                  <div className="flex items-center gap-4 mt-auto">
                    <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full border border-white/20" />
                    <span className="font-medium text-white">{review.author}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Fade edges */}
            <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-navy-dark to-transparent pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-navy-dark to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* LOKALIZACJA */}
      <section className="py-24 bg-navy relative border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/3">
              <SectionHeading title="Wszędzie blisko" subtitle="Zatrzymaj się w sercu Zakopanego, zachowując spokój i ciszę." />
              <div className="space-y-6 mt-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 glass-panel rounded-full text-ice">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-lg mb-1">Idealna baza wypadowa</h4>
                    <p className="text-silver-dark font-light">Krótki spacer dzieli Cię od Krupówek i najpiękniejszych górskich szlaków.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 glass-panel rounded-full text-ice">
                    <BedDouble className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-lg mb-1">Odpoczynek po pełnym dniu</h4>
                    <p className="text-silver-dark font-light">Domowa atmosfera, w której szybko zregenerujesz siły po górskich wędrówkach.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-2/3 w-full h-[400px] rounded-2xl overflow-hidden glass-panel p-2">
              {/* Dark mode map placeholder or iframe */}
              <div className="w-full h-full rounded-xl overflow-hidden relative bg-navy-dark flex items-center justify-center border border-white/10">
                <div className="absolute inset-0 opacity-40 bg-[url('https://maps.wikimedia.org/osm-intl/14/9083/5610.png')] bg-cover bg-center grayscale invert"></div>
                <div className="absolute inset-0 bg-navy/60 mix-blend-multiply"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <MapPin className="h-12 w-12 text-ice animate-bounce drop-shadow-[0_0_15px_rgba(223,243,255,0.8)]" />
                  <span className="mt-2 font-heading font-bold text-xl text-white bg-navy/80 px-4 py-1 rounded-full border border-white/10 backdrop-blur-md">Willa 14 Zakopane</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA (NA DOLE) */}
      <section className="relative py-32 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero.png" 
            alt="Zimowa noc" 
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy-dark/90"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mb-8 drop-shadow-lg">
            Gotowy na niezapomniany pobyt w górach?
          </h2>
          <button 
            onClick={() => scrollTo('booking-section')}
            className="group relative inline-flex items-center justify-center px-10 py-5 overflow-hidden rounded-full bg-ice text-navy font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(223,243,255,0.5)] hover:shadow-[0_0_40px_rgba(223,243,255,0.8)] transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">Sprawdź dostępność <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></span>
          </button>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 pointer-events-none">
        <button 
          onClick={() => scrollTo('booking-section')}
          className="w-full pointer-events-auto bg-ice/90 backdrop-blur-xl text-navy font-bold py-4 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/50 uppercase tracking-widest text-sm flex justify-center items-center gap-2 active:scale-95 transition-transform"
        >
          Sprawdź dostępność <ArrowRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}

export default Home;
