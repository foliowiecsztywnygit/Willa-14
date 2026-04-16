import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const images = import.meta.glob('../../assets/gallery/*.{jpg,jpeg,png,webp}', { eager: true });
const imageUrls = Object.values(images).map((module: any) => module.default);

export function PhotoGallery() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % imageUrls.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + imageUrls.length) % imageUrls.length);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {imageUrls.map((url, index) => (
          <div 
            key={index} 
            className="group relative rounded-xl overflow-hidden aspect-square bg-navy-dark cursor-pointer border border-white/5 hover:border-ice/30 transition-all duration-500"
            onClick={() => openLightbox(index)}
          >
            <img 
              src={url} 
              alt={`Galeria zdjęć - zdjęcie ${index + 1}`} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-navy-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <ZoomIn className="text-white w-10 h-10 drop-shadow-md scale-50 group-hover:scale-100 transition-transform duration-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-dark/95 backdrop-blur-xl"
          onClick={closeLightbox}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
            onClick={closeLightbox}
          >
            <X className="w-8 h-8" />
          </button>

          <button 
            className="absolute left-4 md:left-10 text-white/70 hover:text-white transition-colors p-4 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm"
            onClick={prevImage}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <img 
            src={imageUrls[selectedImageIndex]} 
            alt="Powiększone zdjęcie" 
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-fade-in-up"
          />

          <button 
            className="absolute right-4 md:right-10 text-white/70 hover:text-white transition-colors p-4 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm"
            onClick={nextImage}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          
          <div className="absolute bottom-6 left-0 right-0 text-center text-silver-light font-medium tracking-widest text-sm">
            {selectedImageIndex + 1} / {imageUrls.length}
          </div>
        </div>
      )}
    </>
  );
}