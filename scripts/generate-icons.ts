import sharp from "sharp";
import {readFileSync, mkdirSync} from "fs";
import {resolve, dirname} from "node:path";
import {fileURLToPath} from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const src = readFileSync(resolve(root, "public/icon.svg"));
const out = resolve(root, "public/icons");

mkdirSync(out, {recursive: true});

const sizes = [48, 72, 96, 128, 144, 152, 180, 192, 384, 512];

await Promise.all(
	sizes.map(size =>
		sharp(src)
			.resize(size, size)
			.png()
			.toFile(resolve(out, `icon-${size}x${size}.png`)),
	),
);

console.log(`Generated ${sizes.length} icons in public/icons/`);
