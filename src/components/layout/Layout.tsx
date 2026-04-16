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
    </div>
  );
}
