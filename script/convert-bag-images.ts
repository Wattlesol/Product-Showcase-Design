import { execSync } from 'child_process';
import { readdirSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

const sourceDir = 'bags shoot';
const destDir = 'attached_assets/products';

if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
}

const bags = [
    { name: 'Heritage Art Carryall', sku: 'HAC-01' },
    { name: 'Blush Croc Paneled Tote', sku: 'BPT-02' },
    { name: 'Honey Amber', sku: 'HAT-03' },
    { name: 'Indigo Daily Tote', sku: 'IDT-04' },
    { name: 'Midnight Navy', sku: 'MNT-05' },
    { name: 'Sandstone Crossbody', sku: 'SSC-06' },
    { name: 'Saffron Scarf Tote', sku: 'SST-07' },
    { name: 'Contrast Mocha Tote', sku: 'CMT-08' },
];

bags.forEach(bag => {
    const bagPath = path.join(sourceDir, bag.name);
    if (!existsSync(bagPath)) {
        console.warn(`Directory not found: ${bagPath}`);
        return;
    }

    const files = readdirSync(bagPath);
    
    // Find best 3 images (1, 2, 3)
    const targets = ['1', '2', '3'];
    targets.forEach((t, index) => {
        const file = files.find(f => f.startsWith(t + '.') && !f.includes('(1)'));
        if (file) {
            const input = path.join(bagPath, file);
            const suffix = index === 0 ? 'C' : index === 1 ? 'L' : 'R'; // Center, Left, Right
            const output = path.join(destDir, `${bag.sku}_${suffix}.webp`);
            
            console.log(`Converting ${input} to ${output}...`);
            try {
                // Using cwebp for conversion with resizing to max 1200px width
                execSync(`cwebp -q 80 -resize 1200 0 "${input}" -o "${output}"`);
            } catch (err) {
                console.error(`Failed to convert ${input}:`, err);
            }
        } else if (index > 0) {
            // Fallback to center image if L/R missing
            const centerOutput = path.join(destDir, `${bag.sku}_C.webp`);
            if (existsSync(centerOutput)) {
                const suffix = index === 1 ? 'L' : 'R';
                const output = path.join(destDir, `${bag.sku}_${suffix}.webp`);
                console.log(`Copying center image for ${suffix}: ${output}`);
                execSync(`cp "${centerOutput}" "${output}"`);
            }
        }
    });
});

console.log('Conversion completed.');
