// Plik konfiguracyjny dla zdjęć
// Możesz wrzucać nowe zdjęcia do 'src/assets/gallery' a one pojawią się tu automatycznie.

const galleryModules = import.meta.glob<{ default: string }>('../assets/gallery/*.{png,jpg,jpeg,webp}', { eager: true });

export const galleryImages = Object.values(galleryModules).map(module => module.default);

export const sectionImages = {
  hero: '/hero.png', // Plik w folderze public
};
