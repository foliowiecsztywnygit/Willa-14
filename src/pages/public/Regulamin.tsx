import { DecorativeLine } from '../../components/ui/DecorativeLine';
import { SectionDivider } from '../../components/ui/SectionDivider';
import { FolkPattern } from '../../components/ui/FolkPattern';

export function Regulamin() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative pt-32 pb-24 bg-green-dark flex items-center justify-center overflow-hidden">
        <FolkPattern className="text-white w-96 h-96 -right-32 top-0 opacity-10" />
        <FolkPattern className="text-gold w-64 h-64 -left-16 bottom-0 opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 tracking-wide drop-shadow-lg">
            Regulamin Obiektu
          </h1>
          <DecorativeLine className="border-gold mx-auto" />
        </div>
        <SectionDivider position="bottom" fillClass="fill-white" type="wave" className="-mb-px" />
      </section>

      {/* Content Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-gray-700 leading-relaxed space-y-8 font-light text-lg">
          <h2 className="text-2xl font-heading font-semibold text-gray-900 tracking-wide">1. Postanowienia ogólne</h2>
          <p>
            Niniejszy regulamin określa zasady świadczenia usług, odpowiedzialności oraz przebywania na terenie Willi 14 Zakopane. 
            Potwierdzenie rezerwacji jest równoznaczne z zapoznaniem się oraz akceptacją postanowień niniejszego regulaminu.
          </p>
          
          <h2 className="text-2xl font-heading font-semibold text-gray-900 tracking-wide mt-8">2. Doba hotelowa</h2>
          <p>
            Doba hotelowa rozpoczyna się o godzinie 15:00 w dniu przyjazdu, a kończy o godzinie 11:00 w dniu wyjazdu. 
            Życzenie przedłużenia pobytu poza okres wskazany w dniu przybycia, Gość powinien zgłosić obsłudze obiektu 
            do godziny 9:00 dnia, w którym upływa termin najmu pokoju.
          </p>
          
          <h2 className="text-2xl font-heading font-semibold text-gray-900 tracking-wide mt-8">3. Cisza nocna</h2>
          <p>
            W obiekcie obowiązuje cisza nocna w godzinach od 22:00 do 7:00 rano. 
            W godzinach ciszy nocnej Goście i osoby korzystające z usług obiektu mają obowiązek takiego zachowania, 
            by w żaden sposób nie zakłócało ono spokoju pobytu innych osób.
          </p>

          <h2 className="text-2xl font-heading font-semibold text-gray-900 tracking-wide mt-8">4. Płatności i anulacje</h2>
          <p>
            Rezerwacja jest gwarantowana po wpłacie zadatku. W przypadku anulacji rezerwacji zadatek nie podlega zwrotowi, 
            zgodnie z obowiązującymi przepisami prawa, chyba że obiekt i gość uzgodnią inaczej.
          </p>
        </div>
      </section>
    </div>
  );
}
