import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import { siteConfig } from '../../config/content';

export function Footer() {
  return (
    <footer id="contact" className="bg-navy-dark text-silver pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-ice/20 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center text-white hover:text-ice transition-colors font-heading font-bold text-2xl">
              <span className="tracking-wider drop-shadow-md">Willa 14 Zakopane</span>
            </Link>
            <p className="text-sm text-silver-dark leading-relaxed font-light">
              Miejsce, do którego chce się wracać. Odkryj gościnność i domową atmosferę w doskonałej lokalizacji.
            </p>
            <div className="flex gap-4 pt-2">
              <a href={siteConfig.social.facebook} className="p-2 glass-panel rounded-full text-silver hover:text-ice transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={siteConfig.social.instagram} className="p-2 glass-panel rounded-full text-silver hover:text-ice transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 font-heading text-xl tracking-wider uppercase">Na skróty</h3>
            <ul className="space-y-3">
              <li><Link to="/#about" className="hover:text-ice transition-colors text-sm uppercase tracking-widest font-light">O nas</Link></li>
              <li><Link to="/rooms" className="hover:text-ice transition-colors text-sm uppercase tracking-widest font-light">Pokoje</Link></li>
              <li><Link to="/#contact" className="hover:text-ice transition-colors text-sm uppercase tracking-widest font-light">Kontakt</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-6 font-heading text-xl tracking-wider uppercase">Kontakt</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 text-sm font-light">
                <MapPin className="h-5 w-5 text-ice shrink-0 mt-0.5" />
                <span className="whitespace-pre-line text-silver">{siteConfig.contact.address.replace(', ', '\n')}</span>
              </li>
              <li className="flex items-center gap-4 text-sm font-light">
                <Phone className="h-5 w-5 text-ice shrink-0" />
                <a href={`tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`} className="hover:text-ice transition-colors text-silver">{siteConfig.contact.phone}</a>
              </li>
              <li className="flex items-center gap-4 text-sm font-light">
                <Mail className="h-5 w-5 text-ice shrink-0" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-ice transition-colors text-silver">{siteConfig.contact.email}</a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-6 font-heading text-xl tracking-wider uppercase">Informacje</h3>
            <ul className="space-y-3">
              <li><Link to="/regulamin" className="hover:text-ice transition-colors text-sm uppercase tracking-widest font-light">Regulamin obiektu</Link></li>
              <li><Link to="/polityka-prywatnosci" className="hover:text-ice transition-colors text-sm uppercase tracking-widest font-light">Polityka prywatności</Link></li>
              <li><Link to="/faq" className="hover:text-ice transition-colors text-sm uppercase tracking-widest font-light">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-silver-dark font-light">
          <p>&copy; {new Date().getFullYear()} Willa 14 Zakopane. Wszelkie prawa zastrzeżone.</p>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Link to="/regulamin" className="hover:text-ice transition-colors">Regulamin</Link>
            <span>|</span>
            <Link to="/polityka-prywatnosci" className="hover:text-ice transition-colors">Prywatność</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
