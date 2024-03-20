import ColorThief from "colorthief"

export default function calculateBackgroundColor(imageUrl: string) {
    const image = new Image();
    image.crossOrigin = "Anonymous";

    image.onload = function() {
        const colorThief = new ColorThief();
        const dominantColor = colorThief.getColor(image);

        // Convert the dominant color to HSL
        const hslColor = rgbToHsl(dominantColor[0], dominantColor[1], dominantColor[2]);

        // Check if the image appears to have vibrant colors
        const isVibrant = hslColor[1] > 20; // Adjust as needed (0-100)

        // Modify the saturation and lightness based on whether it's grayscale or not
        if (!isVibrant) {
            // If it doesn't have vibrant colors, set a toned-down tint of the dominant color
            const targetSaturation = 10; // Adjust as needed (0-100)
            const targetLightness = 40; // Adjust as needed (0-100)
            hslColor[1] = targetSaturation;
            hslColor[2] = targetLightness;
        } else {
            // If it has vibrant colors, modify the saturation and lightness more aggressively
            const targetSaturation = 75; // Adjust as needed (0-100)
            const targetLightness = 65; // Adjust as needed (0-100)
            hslColor[1] = targetSaturation;
            hslColor[2] = targetLightness;
        }

        // Convert the adjusted HSL color back to RGB
        const adjustedColor = hslToRgb(hslColor[0], hslColor[1], hslColor[2]);

        // Convert the adjusted RGB values to a CSS color string
        const backgroundColor = `rgb(${Math.round(adjustedColor[0])}, ${Math.round(adjustedColor[1])}, ${Math.round(adjustedColor[2])})`;

    
        return backgroundColor
    };

    image.src = imageUrl + "?sdawd=awdawd";
}

// Function to convert RGB to HSL
function rgbToHsl(r: number, g: number, b: number) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
}

// Function to convert HSL to RGB
function hslToRgb(h: number, s: number, l: number) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
}