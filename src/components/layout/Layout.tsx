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
      
      {/* Mobile Sticky CTA - Widoczne tylko na stronie głównej */}
      {isHome && (
        <>
          <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] z-50">
            <Link 
              to="/rooms" 
              className="block w-full bg-gold hover:bg-gold-light text-white text-center py-4 font-semibold transition-colors uppercase tracking-widest text-sm"
            >
              Sprawdź dostępność
            </Link>
          </div>
          {/* Spacer for mobile sticky CTA */}
          <div className="h-24 md:hidden" />
        </>
      )}
    </div>
  );
}
