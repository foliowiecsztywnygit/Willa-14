import { DecorativeLine } from '../../components/ui/DecorativeLine';
import { SectionDivider } from '../../components/ui/SectionDivider';
import { FolkPattern } from '../../components/ui/FolkPattern';

export function PolitykaPrywatnosci() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative pt-32 pb-24 bg-green-dark flex items-center justify-center overflow-hidden">
        <FolkPattern className="text-white w-96 h-96 -right-32 top-0 opacity-10" />
        <FolkPattern className="text-gold w-64 h-64 -left-16 bottom-0 opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 tracking-wide drop-shadow-lg">
            Polityka Prywatności
          </h1>
          <DecorativeLine className="border-gold mx-auto" />
        </div>
        <SectionDivider position="bottom" fillClass="fill-white" type="wave" className="-mb-px" />
      </section>

      {/* Content Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-gray-700 leading-relaxed space-y-8 font-light text-lg">
          <p>
            Ochrona Twojej prywatności jest dla nas priorytetem. Zależy nam na tym, abyś czuł się bezpiecznie
            korzystając z serwisu internetowego Willa 14 Zakopane. W niniejszej polityce prywatności dowiesz się, 
            w jaki sposób gromadzimy i przetwarzamy Twoje dane osobowe.
          </p>
          
          <h2 className="text-2xl font-heading font-semibold text-gray-900 tracking-wide mt-8">1. Administrator danych</h2>
          <p>
            Administratorem Twoich danych osobowych przekazywanych w ramach rezerwacji i komunikacji z obiektem jest
            Willa 14 Zakopane, zlokalizowana w Zakopanem. 
          </p>
          
          <h2 className="text-2xl font-heading font-semibold text-gray-900 tracking-wide mt-8">2. Cel i zakres zbierania danych</h2>
          <p>
            Dane osobowe (imię, nazwisko, adres e-mail, numer telefonu) przetwarzane są wyłącznie w celach:
          </p>
          <ul className="list-disc pl-8 space-y-2 mt-4">
            <li>realizacji procesu rezerwacji usług hotelowych,</li>
            <li>kontaktu w sprawach związanych z pobytem,</li>
            <li>ewentualnych procesów reklamacyjnych,</li>
            <li>wystawiania faktur i rozliczeń księgowych.</li>
          </ul>

          <h2 className="text-2xl font-heading font-semibold text-gray-900 tracking-wide mt-8">3. Pliki cookies</h2>
          <p>
            Nasz serwis może wykorzystywać pliki cookies (tzw. "ciasteczka") w celu prawidłowego działania 
            aplikacji, zachowania sesji logowania oraz zbierania anonimowych danych analitycznych i 
            statystycznych poprawiających jakość użytkowania.
          </p>

          <h2 className="text-2xl font-heading font-semibold text-gray-900 tracking-wide mt-8">4. Twoje prawa</h2>
          <p>
            Masz prawo dostępu do treści swoich danych, prawo ich sprostowania, usunięcia, ograniczenia przetwarzania,
            a także prawo do przenoszenia danych i wniesienia sprzeciwu. W celu realizacji swoich praw, skontaktuj się 
            z nami za pomocą e-maila wskazanego w dziale Kontakt.
          </p>
        </div>
      </section>
    </div>
  );
}
