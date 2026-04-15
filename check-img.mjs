import fs from 'fs';
const buf = fs.readFileSync('public/wzor.png');
console.log('wzor.png signature:', buf.slice(0, 8).toString('hex'));

const buf2 = fs.readFileSync('public/tatra_panorama.png');
console.log('tatra_panorama.png signature:', buf2.slice(0, 8).toString('hex'));
