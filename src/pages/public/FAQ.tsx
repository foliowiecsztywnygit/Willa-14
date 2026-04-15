import { DecorativeLine } from '../../components/ui/DecorativeLine';
import { SectionDivider } from '../../components/ui/SectionDivider';
import { FolkPattern } from '../../components/ui/FolkPattern';

export function FAQ() {
  const faqs = [
    {
      q: "O której godzinie jest zameldowanie i wymeldowanie?",
      a: "Doba hotelowa w Willi 14 Zakopane zaczyna się o 15:00 w dniu przyjazdu, a kończy o 11:00 w dniu wyjazdu."
    },
    {
      q: "Czy na terenie obiektu jest darmowy parking?",
      a: "Tak, dla wszystkich naszych gości oferujemy bezpłatny prywatny parking na terenie posesji. Nie wymaga on wcześniejszej rezerwacji."
    },
    {
      q: "Czy akceptujecie zwierzęta domowe?",
      a: "Z uwagi na dbałość o komfort wszystkich naszych gości, zwłaszcza alergików, nie przyjmujemy zwierząt."
    },
    {
      q: "Czy w pobliżu znajdują się restauracje lub sklepy?",
      a: "Tak, jesteśmy położeni bardzo blisko centrum Zakopanego. Spacer na Krupówki, gdzie znajdziesz liczne restauracje, karczmy regionalne i sklepy, zajmuje około 5-10 minut."
    },
    {
      q: "Czy pokoje są sprzątane w trakcie pobytu?",
      a: "Codzienne sprzątanie pokoi może zostać zrealizowane na życzenie. Domyślnie dbamy o prywatność naszych gości i wchodzimy do pokoju tylko wtedy, gdy nas o to poproszą."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative pt-32 pb-24 bg-green-dark flex items-center justify-center overflow-hidden">
        <FolkPattern className="text-white w-96 h-96 -right-32 top-0 opacity-10" />
        <FolkPattern className="text-gold w-64 h-64 -left-16 bottom-0 opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 tracking-wide drop-shadow-lg">
            Najczęściej zadawane pytania
          </h1>
          <DecorativeLine className="border-gold mx-auto" />
        </div>
        <SectionDivider position="bottom" fillClass="fill-white" type="wave" className="-mb-px" />
      </section>

      {/* Content Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-gray-700 leading-relaxed font-light text-lg">
          <div className="space-y-8">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-panel p-8 rounded-md border border-gray-200">
                <h2 className="text-xl font-heading font-bold text-gold tracking-wide mb-4">{faq.q}</h2>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center border-t border-gray-200 pt-16">
            <h3 className="text-2xl font-heading font-semibold text-gray-900 tracking-wide mb-4">
              Masz inne pytania?
            </h3>
            <p className="text-gray-600 mb-8">
              Zadzwoń do nas lub napisz e-mail, a chętnie rozwiejemy Twoje wątpliwości.
            </p>
            <a 
              href="/#contact"
              className="inline-block bg-gold text-white font-medium uppercase tracking-widest text-sm px-8 py-4 hover:bg-gold-dark transition-colors"
            >
              Skontaktuj się z nami
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
