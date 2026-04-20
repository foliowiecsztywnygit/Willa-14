import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useEffect } from 'react';

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Adjust for sticky header
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else if (location.pathname !== '/') {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className={cn("flex-grow", !isHome && "pt-20")}>
        <Outlet />
      </main>
      <Footer />
      
      {/* Mobile Sticky CTA - Zapytaj o rezerwację */}
      {isHome && (
        <>
          <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 pointer-events-none">
            <a 
              href="#contact" 
              className="w-full pointer-events-auto bg-ice/90 backdrop-blur-xl text-navy font-bold py-4 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/50 uppercase tracking-widest text-sm flex justify-center items-center gap-2 active:scale-95 transition-transform"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('contact');
                if (element) {
                  const headerOffset = 80;
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
              }}
            >
              Zapytaj o rezerwację
            </a>
          </div>
          {/* Spacer for mobile sticky CTA */}
          <div className="h-24 md:hidden" />
        </>
      )}
    </div>
  );
}
