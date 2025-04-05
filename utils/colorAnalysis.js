const { Vibrant } = require("node-vibrant/node");

async function extractColors(imageUrl, colorCount = 5) {
  try {
    // Create a new palette instance
    const palette = await Vibrant.from(imageUrl).getPalette();

    // Get the total population to calculate percentages
    const totalPopulation = Object.values(palette).reduce((sum, swatch) => sum + swatch._population, 0);

    // Create array of color objects with rgb values, hex values, and percentages
    const colorArray = Object.entries(palette).map(([_, swatch]) => {
      return {
        rgb: swatch._rgb,
        hex: swatch.hex,
        percentage: parseFloat(
          ((swatch._population / totalPopulation) * 100).toFixed(2)
        ),
      };
    });

    // Sort by percentage in descending order
    return colorArray.sort((a, b) => b.percentage - a.percentage);
  } catch (error) {
    console.error("Error extracting colors:", error);
    return []; // Return empty array on error
  }
}

module.exports = { extractColors };
