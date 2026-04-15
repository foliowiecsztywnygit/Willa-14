import { useState, useMemo } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { DecorativeLine } from './DecorativeLine';
import { galleryImages as configGalleryImages } from '../../config/images';

import { SectionDivider } from './SectionDivider';
import { FolkPattern } from './FolkPattern';

const categories = ['wszystkie', 'pokoje', 'na zewnatrz', 'detale', 'okolica'];

export function Gallery() {
  const [filter, setFilter] = useState('wszystkie');
  const [index, setIndex] = useState(-1);
  const [visibleCount, setVisibleCount] = useState(12);

  // Use real images from the config
  const galleryImages = useMemo(() => {
    return configGalleryImages.map((src, i) => {
      // Simple random category assignment for bulk loaded images 
      // (in a real app you might parse folders or file names)
      const randomCat = categories[1 + (i % 4)]; 
      return {
        id: i + 1,
        category: randomCat,
        src: src,
        thumbnail: src,
        alt: `Zdjęcie galerii ${i + 1}`
      };
    });
  }, []);

  const filteredImages = filter === 'wszystkie' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === filter);

  const displayedImages = filteredImages.slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  const slides = filteredImages.map(img => ({ src: img.src, alt: img.alt }));

  return (
    <section id="gallery" className="py-32 bg-white relative overflow-hidden">
      <SectionDivider position="top" fillClass="fill-gray-darker" type="zigzag" className="-mt-px" />
      <FolkPattern className="text-gold w-[400px] h-[400px] -left-20 top-40 opacity-5" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="text-4xl font-heading font-bold text-gray-800 mb-6 tracking-wider">Galeria</h2>
          <DecorativeLine className="mb-8" />
          <p className="text-gray-600 max-w-2xl mx-auto font-light text-lg">Zobacz nasze wnętrza i okolicę na własne oczy. Odkryj przestrzeń stworzoną do wypoczynku.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setFilter(cat);
                setVisibleCount(12);
              }}
              aria-label={`Filtruj galerię: ${cat}`}
              aria-pressed={filter === cat}
              className={`px-8 py-3 text-sm uppercase tracking-widest font-medium transition-all duration-300 ${
                filter === cat 
                  ? 'bg-gold text-white shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
                  : 'bg-transparent text-gray-700 hover:text-gold border border-gray-200 hover:border-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid or Empty State */}
        {displayedImages.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
            {displayedImages.map((image, i) => (
              <div 
                key={image.id} 
                className="break-inside-avoid relative group overflow-hidden glass-panel cursor-pointer min-h-[300px]"
                onClick={() => setIndex(i)}
                role="button"
                tabIndex={0}
                aria-label={`Powiększ zdjęcie: ${image.alt}`}
                onKeyDown={(e) => e.key === 'Enter' && setIndex(i)}
              >
                <img
                  src={image.thumbnail}
                  srcSet={`${image.thumbnail} 600w, ${image.src} 1200w`}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full min-h-[300px] object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span className="text-gold font-heading tracking-widest text-lg border border-gold px-8 py-3 backdrop-blur-sm">Powiększ</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 border border-gray-200 rounded-sm">
            <p className="text-gray-500 font-medium tracking-widest uppercase">Brak zdjęć w galerii</p>
            <p className="text-gray-400 text-sm mt-2">Zdjęcia pojawią się wkrótce.</p>
          </div>
        )}

        {/* Load More */}
        {visibleCount < filteredImages.length && (
          <div className="mt-16 text-center">
            <button 
              onClick={loadMore}
              className="px-12 py-4 bg-transparent border border-gold text-gold hover:bg-gold hover:text-white uppercase tracking-widest text-sm font-semibold transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              Załaduj więcej zdjęć ({filteredImages.length - visibleCount})
            </button>
          </div>
        )}
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          doubleClickMaxStops: 2,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
          scrollToZoom: true,
        }}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, 0.95)" } }}
      />
    </section>
  );
}
