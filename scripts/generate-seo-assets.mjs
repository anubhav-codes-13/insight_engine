import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const INPUT_IMAGE = 'public/resolve-ai-2.0.jpg';
const OUTPUT_DIR = 'public/seo';
const FAVICON_DIR = 'public/favicons';

// Ensure directories exist
[OUTPUT_DIR, FAVICON_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const SOCIAL_SIZES = [
    { name: 'og-image', width: 1200, height: 630 },
    { name: 'social-square', width: 1080, height: 1080 },
    { name: 'social-hd', width: 1920, height: 1080 },
    { name: 'social-md', width: 800, height: 600 },
    { name: 'social-sm', width: 640, height: 640 },
    { name: 'social-xs', width: 400, height: 400 },
    { name: 'social-tiny', width: 300, height: 157 },
];

const FAVICON_SIZES = [16, 32, 48, 96, 144, 180, 192, 512];

async function generateAssets() {
    console.log('🚀 Starting SEO Asset Generation...');

    try {
        const metadata = await sharp(INPUT_IMAGE).metadata();
        console.log(`Image Metadata: ${metadata.width}x${metadata.height} ${metadata.format}`);

        // 1. Generate Social Sharing Images (JPEG & WebP)
        for (const size of SOCIAL_SIZES) {
            console.log(`Generating ${size.name} (${size.width}x${size.height})...`);

            const pipeline = sharp(INPUT_IMAGE)
                .resize(size.width, size.height, {
                    fit: 'cover',
                    position: 'center'
                });

            await pipeline.clone().jpeg({ quality: 90 }).toFile(path.join(OUTPUT_DIR, `${size.name}.jpg`));
            await pipeline.clone().webp({ quality: 90 }).toFile(path.join(OUTPUT_DIR, `${size.name}.webp`));
        }

        // 2. Generate Favicons & PWA Icons
        for (const size of FAVICON_SIZES) {
            console.log(`Generating favicon-${size}x${size}...`);
            await sharp(INPUT_IMAGE)
                .resize(size, size)
                .png()
                .toFile(path.join(FAVICON_DIR, `icon-${size}x${size}.png`));
        }

        // Special: Apple Touch Icon
        await sharp(INPUT_IMAGE)
            .resize(180, 180)
            .png()
            .toFile(path.join(FAVICON_DIR, 'apple-touch-icon.png'));

        // Special: Favicon.ico (using 32x32 as base)
        await sharp(INPUT_IMAGE)
            .resize(32, 32)
            .toFile('public/favicon.ico');

        console.log('✅ All assets generated successfully!');
    } catch (error) {
        console.error('❌ Error generating assets:', error);
    }
}

generateAssets();
