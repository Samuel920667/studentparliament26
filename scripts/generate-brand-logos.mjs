import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

// Sharp is installed with Next.js. Keep the original PNGs as the source assets.
const logos = {};
let totalBytes = 0;
for (const [name, filename] of [["veritas", "veritas-logo.png"], ["sdp", "sdp-logo.png"]]) {
  const original = await readFile(new URL(`../public/${filename}`, import.meta.url));
  const image = await sharp(original)
    .resize(192, 192, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 90, effort: 6 })
    .toBuffer();
  logos[name] = `data:image/webp;base64,${image.toString("base64")}`;
  totalBytes += image.length;
}
await writeFile(new URL("../src/data/brand-logos.json", import.meta.url), JSON.stringify(logos, null, 2) + "\n");
console.log(`Generated inline brand logos (${totalBytes.toLocaleString()} bytes before base64 encoding).`);
