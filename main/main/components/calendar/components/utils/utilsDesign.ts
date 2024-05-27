export function lightenColor(color: string, percent: number): string {
    let r: number, g: number, b: number;
    if (color.startsWith('#')) {
      const bigint = parseInt(color.substring(1), 16);
      r = (bigint >> 16) & 255;
      g = (bigint >> 8) & 255;
      b = bigint & 255;
    } else if (color.startsWith('rgb')) {
      const match = color.match(/\d+/g);
      if (match) {
        [r, g, b] = match.map(Number);
      } else {
        throw new Error('Invalid RGB color format');
      }
    } else {
      throw new Error('Unsupported color format');
    }
  
    const adjust = (colorValue: number) => Math.min(255, colorValue + Math.round(255 * percent));
  
    r = adjust(r);
    g = adjust(g);
    b = adjust(b);
  
    return `rgb(${r}, ${g}, ${b})`;
  }