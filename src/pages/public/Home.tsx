import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  BedDouble, Wifi, Users, ShieldCheck, ParkingCircle,
  Coffee, MapPin, ArrowRight, Star
} from 'lucide-react';
import { PhotoGallery } from '../../components/ui/PhotoGallery';
import { ContactForm } from '../../components/ui/ContactForm';
import { Snowfall } from '../../components/ui/Snowfall';

// Subcomponents

const SectionHeading = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="text-center mb-16 animate-fade-in-up">
    <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 tracking-wide">{title}</h2>
    {subtitle && <p className="text-silver-dark max-w-2xl mx-auto text-lg">{subtitle}</p>}
    <div className="mt-8 flex items-center justify-center opacity-80">
      <svg width="240" height="24" viewBox="0 0 240 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_8px_rgba(223,243,255,0.4)]">
        <path d="M20 12 C 50 12, 70 4, 100 12" stroke="url(#grad1)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 12 C 50 12, 70 20, 100 12" stroke="url(#grad1)" strokeWidth="0.5" strokeLinecap="round" opacity="0.5"/>
        <path d="M220 12 C 190 12, 170 4, 140 12" stroke="url(#grad2)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M220 12 C 190 12, 170 20, 140 12" stroke="url(#grad2)" strokeWidth="0.5" strokeLinecap="round" opacity="0.5"/>
        <circle cx="120" cy="12" r="3.5" fill="#dff3ff" opacity="0.9"/>
        <circle cx="108" cy="12" r="2" fill="#dff3ff" opacity="0.7"/>
        <circle cx="132" cy="12" r="2" fill="#dff3ff" opacity="0.7"/>
        <circle cx="98" cy="12" r="1" fill="#dff3ff" opacity="0.5"/>
        <circle cx="142" cy="12" r="1" fill="#dff3ff" opacity="0.5"/>
        <defs>
          <linearGradient id="grad1" x1="20" y1="12" x2="100" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#dff3ff" stopOpacity="0"/>
            <stop offset="1" stopColor="#dff3ff" stopOpacity="0.8"/>
          </linearGradient>
          <linearGradient id="grad2" x1="220" y1="12" x2="140" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#dff3ff" stopOpacity="0"/>
            <stop offset="1" stopColor="#dff3ff" stopOpacity="0.8"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
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

        {/* Hero Spinning Logo Pattern */}
        <img src="/wzor.png" alt="" className="absolute top-1/2 left-1/2 w-[800px] h-[800px] opacity-[0.03] animate-spin-slow-reverse pointer-events-none -translate-x-1/2 -translate-y-1/2 z-10" />

        {/* Snowfall Effect (only on larger screens or reduced on mobile if needed, but let's keep it simple) */}
        {!isMobile && <Snowfall />}

        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto pt-10 md:pt-20 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 tracking-wide drop-shadow-[0_0_20px_rgba(223,243,255,0.4)] animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Willa 14 Zakopane – Twój dom w górach</h1>
          <p className="text-lg md:text-2xl text-ice-light mb-10 max-w-3xl mx-auto font-light tracking-wide drop-shadow-md animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Poczuj prawdziwą gościnność. Czyste pokoje, świetna lokalizacja i niezapomniany wypoczynek.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <button 
              onClick={() => scrollTo('gallery')}
              className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-full bg-white/10 border border-white/20 hover:border-ice backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(223,243,255,0.4)]"
            >
              <span className="relative text-white font-medium tracking-wider uppercase text-sm z-10">Zobacz galerię</span>
              <div className="absolute inset-0 bg-gradient-to-r from-ice/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button 
              onClick={() => scrollTo('contact')}
              className="group inline-flex items-center justify-center px-8 py-4 rounded-full bg-transparent text-silver-light hover:text-white font-medium tracking-wider uppercase text-sm transition-all duration-300"
            >
              Zapytaj o nocleg <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* O OBIEKCIE (Benefits grid) */}
      <section id="about" className="py-24 bg-navy relative overflow-hidden">
        <img src="/wzor.png" alt="" className="absolute top-10 -left-20 w-96 h-96 opacity-5 animate-spin-slow pointer-events-none" />
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

      {/* GALERIA */}
      <section id="gallery" className="py-24 bg-navy relative border-t border-white/5 overflow-hidden">
        <img src="/wzor.png" alt="" className="absolute top-1/2 left-0 w-[500px] h-[500px] opacity-[0.03] animate-spin-slow pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading title="Nasza Galeria" subtitle="Zajrzyj do wnętrz Willi 14 i poczuj wyjątkowy klimat Zakopanego." />
          <PhotoGallery />
        </div>
      </section>

      {/* OPINIE GOŚCI */}
      <section className="py-24 bg-navy-dark relative overflow-hidden">
        <img src="/wzor.png" alt="" className="absolute -bottom-32 right-10 w-[500px] h-[500px] opacity-5 animate-spin-slow-reverse pointer-events-none" />
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
      <section className="py-24 bg-navy relative border-t border-white/5 overflow-hidden">
        <img src="/wzor.png" alt="" className="absolute top-1/4 -right-32 w-[600px] h-[600px] opacity-[0.04] animate-spin-slow pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/3">
              <SectionHeading title="Wszędzie blisko" subtitle="Zatrzymaj się w sercu Zakopanego, zachowując spokój i ciszę." />
              <div className="space-y-6 mt-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 glass-panel rounded-full text-ice">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-lg mb-1">Górski Odpoczynek</h4>
                    <p className="text-silver-dark font-light">Lokalizacja z dala od zgiełku i gwaru w centrum Zakopanego.</p>
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
            
            <div className="lg:w-2/3 w-full h-[400px] rounded-2xl overflow-hidden glass-panel p-2 relative group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.8643430450757!2d19.977513777069266!3d49.29479636989566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4715f2f0018b7c5b%3A0xf375133c888772c4!2sWilla%2014!5e1!3m2!1spl!2spl!4v1776883815011!5m2!1spl!2spl" 
                className="w-full h-full rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-500" 
                style={{border: 0}} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* KONTAKT (Zastępuje dawne CTA) */}
      <section id="contact" className="py-24 bg-navy-dark relative border-t border-white/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <SectionHeading title="Skontaktuj się z nami" subtitle="Masz pytania dotyczące pobytu? Jesteśmy do Twojej dyspozycji." />
          <ContactForm />
        </div>
      </section>

    </div>
  );
}

export default Home; // Exporting Home component
