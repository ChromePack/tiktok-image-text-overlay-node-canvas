# TikTok Text Overlay Implementation with Node-Canvas

## Overview

This document provides a simple, single-file Node-Canvas implementation for creating TikTok-style text overlays with white bubble backgrounds. The implementation focuses on replicating the native TikTok text styling used in CapCut and similar editing tools.

## Research Summary

### TikTok Text Style Specifications

Based on current TikTok trends and CapCut implementations:

- **Font**: TikTok uses a custom font called TikTok Sans, which the app introduced in May 2023. Previously, TikTok used a font called Classic which was just Proxima Nova with a different name.
- **Fallback Fonts**: Helvetica, Arial, or Montserrat Semi Bold work as close alternatives
- **Background**: White rounded rectangle bubble with slight opacity
- **Text Color**: Black text on white background for maximum readability
- **Padding**: Generous padding around text (8-12px)
- **Border Radius**: Rounded corners (6-10px radius)
- **Shadow**: Subtle drop shadow for depth
- **Position**: Typically center-aligned or bottom-third positioning

### Key Visual Characteristics

- Clean, readable white bubble backgrounds
- Bold, sans-serif typography
- High contrast (black text on white background)
- Rounded corners for modern appearance
- Subtle shadows for depth and separation from background

## Implementation

### Prerequisites

```bash
npm install canvas
```

### Single File Solution: `text-overlay.js`

```javascript
const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs");
const path = require("path");

class TikTokTextOverlay {
  constructor() {
    // TikTok-style text configuration
    this.config = {
      // Canvas dimensions (9:16 aspect ratio for TikTok)
      width: 1080,
      height: 1920,

      // Text styling
      fontSize: 48,
      fontFamily: "Arial", // Fallback for TikTok Sans
      fontWeight: "bold",
      textColor: "#000000",

      // Bubble styling
      bubbleColor: "#FFFFFF",
      bubbleOpacity: 0.95,
      bubblePadding: 16,
      bubbleRadius: 12,

      // Shadow effects
      shadowColor: "rgba(0, 0, 0, 0.3)",
      shadowBlur: 4,
      shadowOffsetX: 2,
      shadowOffsetY: 2,

      // Text positioning
      maxWidth: 900, // Maximum text width before wrapping
      lineHeight: 1.2,
      position: "center", // 'top', 'center', 'bottom'
    };
  }

  /**
   * Calculate text dimensions and line breaks
   */
  calculateTextMetrics(ctx, text, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return {
      lines,
      lineHeight: this.config.fontSize * this.config.lineHeight,
      totalHeight: lines.length * this.config.fontSize * this.config.lineHeight,
    };
  }

  /**
   * Draw rounded rectangle bubble background
   */
  drawBubble(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    // Apply shadow
    ctx.shadowColor = this.config.shadowColor;
    ctx.shadowBlur = this.config.shadowBlur;
    ctx.shadowOffsetX = this.config.shadowOffsetX;
    ctx.shadowOffsetY = this.config.shadowOffsetY;

    // Fill bubble background
    ctx.globalAlpha = this.config.bubbleOpacity;
    ctx.fillStyle = this.config.bubbleColor;
    ctx.fill();

    // Reset shadow and opacity
    ctx.shadowColor = "transparent";
    ctx.globalAlpha = 1;
  }

  /**
   * Calculate vertical position based on configuration
   */
  calculateVerticalPosition(canvasHeight, textHeight) {
    switch (this.config.position) {
      case "top":
        return canvasHeight * 0.15; // 15% from top
      case "bottom":
        return canvasHeight * 0.85 - textHeight; // 15% from bottom
      case "center":
      default:
        return (canvasHeight - textHeight) / 2; // Center
    }
  }

  /**
   * Main method to add text overlay to image
   */
  async addTextOverlay(imagePath, text, outputPath) {
    try {
      // Load the background image
      const image = await loadImage(imagePath);

      // Create canvas
      const canvas = createCanvas(this.config.width, this.config.height);
      const ctx = canvas.getContext("2d");

      // Draw background image (scaled to fit)
      ctx.drawImage(image, 0, 0, this.config.width, this.config.height);

      // Set up text styling
      ctx.font = `${this.config.fontWeight} ${this.config.fontSize}px ${this.config.fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Calculate text metrics
      const textMetrics = this.calculateTextMetrics(
        ctx,
        text,
        this.config.maxWidth
      );

      // Calculate bubble dimensions
      const bubbleWidth = Math.min(
        Math.max(
          ...textMetrics.lines.map((line) => ctx.measureText(line).width)
        ) +
          this.config.bubblePadding * 2,
        this.config.maxWidth + this.config.bubblePadding * 2
      );
      const bubbleHeight =
        textMetrics.totalHeight + this.config.bubblePadding * 2;

      // Calculate positioning
      const bubbleX = (this.config.width - bubbleWidth) / 2;
      const bubbleY = this.calculateVerticalPosition(
        this.config.height,
        bubbleHeight
      );

      // Draw bubble background
      this.drawBubble(
        ctx,
        bubbleX,
        bubbleY,
        bubbleWidth,
        bubbleHeight,
        this.config.bubbleRadius
      );

      // Draw text lines
      ctx.fillStyle = this.config.textColor;
      const startY =
        bubbleY + this.config.bubblePadding + this.config.fontSize / 2;

      textMetrics.lines.forEach((line, index) => {
        const lineY = startY + index * textMetrics.lineHeight;
        ctx.fillText(line, this.config.width / 2, lineY);
      });

      // Save the result
      const buffer = canvas.toBuffer("image/png");
      fs.writeFileSync(outputPath, buffer);

      console.log(`✅ Text overlay added successfully: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error("❌ Error adding text overlay:", error);
      throw error;
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Set text position (top, center, bottom)
   */
  setPosition(position) {
    this.config.position = position;
  }

  /**
   * Set font size
   */
  setFontSize(size) {
    this.config.fontSize = size;
  }
}

// Usage example and testing
async function main() {
  const overlay = new TikTokTextOverlay();

  // Example usage with sample image and caption
  const inputImage = "sample-image.jpg"; // Your input image path
  const caption =
    "This is a sample TikTok-style caption with white bubble background";
  const outputImage = "output-with-text.png";

  try {
    // You can customize the configuration
    overlay.updateConfig({
      fontSize: 52,
      position: "bottom",
      bubbleColor: "#FFFFFF",
      textColor: "#000000",
    });

    await overlay.addTextOverlay(inputImage, caption, outputImage);
  } catch (error) {
    console.error("Failed to process image:", error);
  }
}

// Export for use in other modules
module.exports = TikTokTextOverlay;

// Run example if this file is executed directly
if (require.main === module) {
  main();
}
```

## Usage Instructions

### Basic Usage

```javascript
const TikTokTextOverlay = require("./text-overlay");

const overlay = new TikTokTextOverlay();

// Add text overlay to image
await overlay.addTextOverlay(
  "input-image.jpg",
  "Your caption text here",
  "output-image.png"
);
```

### Configuration Options

```javascript
// Customize appearance
overlay.updateConfig({
  fontSize: 48, // Text size
  position: "bottom", // 'top', 'center', 'bottom'
  bubbleColor: "#FFFFFF", // Background color
  textColor: "#000000", // Text color
  bubbleOpacity: 0.95, // Background opacity
  bubblePadding: 16, // Padding around text
  bubbleRadius: 12, // Corner radius
});
```

### Position Presets

```javascript
overlay.setPosition("top"); // Text at top
overlay.setPosition("center"); // Text in center
overlay.setPosition("bottom"); // Text at bottom (most common for TikTok)
```

## File Structure

```
project/
├── text-overlay.js          # Main implementation file
├── sample-image.jpg         # Your input image
├── output-with-text.png     # Generated output
└── package.json            # Node.js dependencies
```

## Testing Steps

1. **Install Dependencies**

```bash
npm install canvas
```

2. **Prepare Sample Image**

   - Add a 9:16 aspect ratio image named `sample-image.jpg`
   - Or modify the input path in the code

3. **Run the Script**

```bash
node text-overlay.js
```

4. **Check Output**
   - Verify `output-with-text.png` is created
   - Confirm text styling matches TikTok appearance

## Customization Tips

### Font Alternatives

If you have access to TikTok Sans or similar fonts:

```javascript
// Register custom font (if available)
registerFont("path/to/tiktok-sans.ttf", { family: "TikTok Sans" });

// Update config to use custom font
overlay.updateConfig({
  fontFamily: "TikTok Sans",
});
```

### Color Variations

```javascript
// White text on dark background
overlay.updateConfig({
  textColor: "#FFFFFF",
  bubbleColor: "#000000",
  bubbleOpacity: 0.8,
});

// Colored accents
overlay.updateConfig({
  bubbleColor: "#FF0050", // TikTok brand color
  textColor: "#FFFFFF",
});
```

### Size Adjustments

```javascript
// Larger text for impact
overlay.updateConfig({
  fontSize: 60,
  bubblePadding: 20,
  maxWidth: 800,
});
```

## Integration Notes

- **File Input**: Accepts JPG, PNG, and other common image formats
- **Output**: Always outputs PNG for transparency support
- **Performance**: Processes images quickly for automation workflows
- **Error Handling**: Includes comprehensive error catching and logging
- **Scalability**: Easy to integrate into larger automation systems

## Next Steps for n8n Integration

1. **Module Export**: This class can be imported into n8n custom functions
2. **Batch Processing**: Add array processing for multiple images
3. **Dynamic Configuration**: Connect to n8n variables for runtime customization
4. **File Management**: Integrate with Google Drive API for input/output handling
5. **Quality Assurance**: Add image validation and error recovery mechanisms

This implementation provides a solid foundation for TikTok-style text overlays that can be easily integrated into the larger automation workflow described in your project requirements.
