const Vibrant = require('node-vibrant/node');

async function extractColors(imageUrl, colorCount = 5) {
  try {
    // Create a new palette instance
    const palette = await Vibrant.from(imageUrl).getPalette();
    
    // Convert palette to array of hex values with percentages
    const colors = Object.values(palette)
      .filter(swatch => swatch !== null) // Filter out null swatches
      .map(swatch => ({
        hex: swatch.getHex(),
        percentage: Math.round(swatch.getPopulation() * 100) / 100
      }))
      .sort((a, b) => b.percentage - a.percentage) // Sort by percentage
      .slice(0, colorCount); // Take only the requested number of colors
      
    // Normalize percentages to add up to 100%
    const totalPercentage = colors.reduce((sum, color) => sum + color.percentage, 0);
    colors.forEach(color => {
      color.percentage = Math.round((color.percentage / totalPercentage) * 100);
    });
    
    return colors;
  } catch (error) {
    console.error('Error extracting colors:', error);
    return []; // Return empty array on error
  }
}

module.exports = { extractColors };