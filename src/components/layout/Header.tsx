import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { siteConfig } from '../../config/content';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'O nas', href: '/#about' },
    { name: 'Pokoje', href: '/rooms' },
    { name: 'Kontakt', href: '/#contact' },
  ];

  const isActive = (path: string) => location.pathname === path;
  
  const isTransparent = isHome && !isScrolled;

  return (
    <header 
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isTransparent 
          ? "bg-transparent py-4" 
          : "bg-navy/80 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)] py-2"
      )}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className={cn(
          "flex items-center transition-all duration-300",
          isTransparent 
            ? "drop-shadow-md hover:opacity-80" 
            : "hover:opacity-80"
        )}>
          <img src="/logo.png" alt="Willa 14 Zakopane" className="h-12 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-all uppercase tracking-widest pb-1 border-b",
                  isTransparent
                    ? (active ? "text-white border-white" : "text-silver-light border-transparent hover:text-white hover:border-white/50")
                    : (active ? "text-ice border-ice" : "text-silver border-transparent hover:text-ice")
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button (Desktop) */}
        <div className="hidden md:block">
          <Link
            to="/rooms"
            className={cn(
              "px-8 py-3 rounded-full font-medium transition-all duration-300 uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(223,243,255,0.2)] hover:shadow-[0_0_25px_rgba(223,243,255,0.6)]",
              isTransparent 
                ? "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:border-ice" 
                : "bg-ice text-navy hover:bg-white"
            )}
          >
            Rezerwuj
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={cn(
            "md:hidden p-2 transition-colors",
            isTransparent ? "text-white" : "text-white"
          )}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-navy/95 backdrop-blur-2xl border-t border-white/10 py-6 px-4 shadow-2xl absolute w-full left-0 top-full h-screen">
          <div className="flex flex-col space-y-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-lg font-medium py-2 uppercase tracking-widest text-center transition-colors",
                  isActive(item.href) ? "text-ice" : "text-silver hover:text-white"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/rooms"
              className="bg-ice text-navy hover:bg-white text-center rounded-full px-6 py-4 mt-6 font-medium uppercase tracking-widest transition-colors shadow-[0_0_20px_rgba(223,243,255,0.4)]"
              onClick={() => setIsMenuOpen(false)}
            >
              Rezerwuj online
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
