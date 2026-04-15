import fs from 'fs';
import { PNG } from 'pngjs';

fs.createReadStream('public/wzor.png')
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let idx = (this.width * y + x) << 2;
        
        // Check if pixel is white (or very close to white)
        if (this.data[idx] > 240 && this.data[idx+1] > 240 && this.data[idx+2] > 240) {
          this.data[idx+3] = 0; // Set alpha to 0 (transparent)
        }
      }
    }
    
    this.pack().pipe(fs.createWriteStream('public/wzor.png'))
      .on('finish', () => console.log('Successfully removed white background from wzor.png'));
  })
  .on('error', (err) => console.error('Error processing image:', err));
