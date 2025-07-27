const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");
const path = require("path");

/**
 * TikTok Text Overlay Test Implementation
 *
 * This class implements TikTok-style text overlays with white bubble backgrounds
 * following the specifications from the main project documentation.
 *
 * Clean Code Principles Applied:
 * - Single Responsibility: Each method has one clear purpose
 * - Descriptive Names: Self-documenting method and variable names
 * - Small Functions: Methods are focused and concise
 * - Consistent Formatting: Clear structure and indentation
 */
class TikTokTextOverlayTest {
  constructor() {
    this.initializeConfiguration();
  }

  /**
   * Initialize default configuration for TikTok-style text overlays
   */
  initializeConfiguration() {
    this.config = {
      // Canvas dimensions (9:16 aspect ratio for TikTok)
      width: 1024,
      height: 1536,

      // Text styling (TikTok Sans fallback)
      fontSize: 48,
      fontFamily: "Arial",
      fontWeight: "bold",
      textColor: "#000000",

      // Bubble styling (CapCut-style white bubbles)
      bubbleColor: "#FFFFFF",
      bubbleOpacity: 0.95,
      bubblePadding: 16,
      bubbleRadius: 12,

      // Middle line padding for connected appearance
      middleLinePadding: 8, // Extra padding for middle lines

      // Shadow effects for depth
      shadowColor: "rgba(0, 0, 0, 0.3)",
      shadowBlur: 4,
      shadowOffsetX: 2,
      shadowOffsetY: 2,

      // Text layout and positioning
      maxWidth: 900,
      lineHeight: 1.2,
      position: "center", // 'top', 'center', 'bottom'
    };
  }

  /**
   * Calculate text dimensions and line breaks for proper wrapping
   *
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} text - Text to measure
   * @param {number} maxWidth - Maximum width before wrapping
   * @returns {Object} Text metrics including lines, lineHeight, and totalHeight
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
   * Draw rounded rectangle bubble background with shadow effects
   *
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} width - Bubble width
   * @param {number} height - Bubble height
   * @param {number} radius - Corner radius
   */
  drawBubble(ctx, x, y, width, height, radius) {
    // Create rounded rectangle path
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

    // Apply shadow effects
    ctx.shadowColor = this.config.shadowColor;
    ctx.shadowBlur = this.config.shadowBlur;
    ctx.shadowOffsetX = this.config.shadowOffsetX;
    ctx.shadowOffsetY = this.config.shadowOffsetY;

    // Fill bubble background with opacity
    ctx.globalAlpha = this.config.bubbleOpacity;
    ctx.fillStyle = this.config.bubbleColor;
    ctx.fill();

    // Reset shadow and opacity for text rendering
    ctx.shadowColor = "transparent";
    ctx.globalAlpha = 1;
  }

  /**
   * Calculate vertical position based on configuration setting
   *
   * @param {number} canvasHeight - Canvas height
   * @param {number} totalTextHeight - Total height of all text lines
   * @param {number} lineCount - Number of text lines
   * @returns {number} Y position for first line placement
   */
  calculateVerticalPosition(canvasHeight, totalTextHeight, lineCount) {
    const lineHeight = this.config.fontSize * this.config.lineHeight;
    const bubbleHeight = lineHeight + this.config.bubblePadding * 2;
    const gapBetweenBubbles = 10; // Gap between individual bubbles

    // Calculate total height including middle line padding
    let totalBubbleHeight =
      lineCount * bubbleHeight + (lineCount - 1) * gapBetweenBubbles;

    // Add extra padding for middle lines (lines 2, 3, etc. but not first or last)
    if (lineCount > 2) {
      const middleLinesCount = lineCount - 2; // Lines 2, 3, etc.
      totalBubbleHeight += middleLinesCount * this.config.middleLinePadding * 2; // Top and bottom padding
    }

    switch (this.config.position) {
      case "top":
        return canvasHeight * 0.15; // 15% from top
      case "bottom":
        return canvasHeight * 0.85 - totalBubbleHeight; // 15% from bottom
      case "center":
      default:
        return (canvasHeight - totalBubbleHeight) / 2; // Center
    }
  }

  /**
   * Main method to add text overlay to image
   *
   * @param {string} imagePath - Input image path
   * @param {string} text - Text to overlay
   * @param {string} outputPath - Output image path
   * @returns {Promise<string>} Path to generated image
   */
  async addTextOverlay(imagePath, text, outputPath) {
    try {
      console.log(`🔄 Processing image: ${imagePath}`);
      console.log(`📝 Adding text: "${text}"`);

      // Load the background image
      const image = await loadImage(imagePath);

      // Create canvas with TikTok dimensions
      const canvas = createCanvas(this.config.width, this.config.height);
      const ctx = canvas.getContext("2d");

      // Draw background image (scaled to fit 9:16 aspect ratio)
      ctx.drawImage(image, 0, 0, this.config.width, this.config.height);

      // Configure text styling
      ctx.font = `${this.config.fontWeight} ${this.config.fontSize}px ${this.config.fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Calculate text metrics and line breaks
      const textMetrics = this.calculateTextMetrics(
        ctx,
        text,
        this.config.maxWidth
      );

      // Calculate positioning for first line
      const lineHeight = this.config.fontSize * this.config.lineHeight;
      const bubbleHeight = lineHeight + this.config.bubblePadding * 2;
      const gapBetweenBubbles = 10; // Gap between individual bubbles

      const startY = this.calculateVerticalPosition(
        this.config.height,
        textMetrics.totalHeight,
        textMetrics.lines.length
      );

      // Draw individual bubbles for each line
      textMetrics.lines.forEach((line, index) => {
        // Calculate bubble dimensions for this specific line
        const lineWidth = ctx.measureText(line).width;
        const bubbleWidth = lineWidth + this.config.bubblePadding * 2;

        // Determine if this is a middle line (not first or last)
        const isMiddleLine = index > 0 && index < textMetrics.lines.length - 1;
        const extraPadding = isMiddleLine ? this.config.middleLinePadding : 0;
        const adjustedBubbleHeight = bubbleHeight + extraPadding * 2;

        // Calculate bubble position with accumulated height
        const bubbleX = (this.config.width - bubbleWidth) / 2;
        let bubbleY = startY;

        // Add height of all previous lines
        for (let i = 0; i < index; i++) {
          const isPreviousMiddleLine =
            i > 0 && i < textMetrics.lines.length - 1;
          const previousExtraPadding = isPreviousMiddleLine
            ? this.config.middleLinePadding
            : 0;
          const previousBubbleHeight = bubbleHeight + previousExtraPadding * 2;
          bubbleY += previousBubbleHeight + gapBetweenBubbles;
        }

        // Draw individual bubble background
        this.drawBubble(
          ctx,
          bubbleX,
          bubbleY,
          bubbleWidth,
          adjustedBubbleHeight,
          this.config.bubbleRadius
        );

        // Draw text for this line (centered within the adjusted bubble)
        ctx.fillStyle = this.config.textColor;
        const textY =
          bubbleY +
          this.config.bubblePadding +
          extraPadding +
          this.config.fontSize / 2;
        ctx.fillText(line, this.config.width / 2, textY);
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
   * Update configuration with new settings
   *
   * @param {Object} newConfig - New configuration options
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Set text position (top, center, bottom)
   *
   * @param {string} position - Position setting
   */
  setPosition(position) {
    this.config.position = position;
  }

  /**
   * Set font size for text overlay
   *
   * @param {number} size - Font size in pixels
   */
  setFontSize(size) {
    this.config.fontSize = size;
  }
}

/**
 * Test function to demonstrate the TikTok text overlay functionality
 * Focused on bottom position only (most common for TikTok)
 */
async function runTest() {
  console.log("🚀 Starting TikTok Text Overlay Test (Bottom Position Only)");
  console.log("=".repeat(50));

  const overlay = new TikTokTextOverlayTest();

  // Test configuration
  const testImage = "file.png";
  const testText =
    "This is a test caption for TikTok-style text overlay that will definitely wrap to multiple lines and create a beautiful connected appearance!";

  try {
    // Set position to bottom (most common for TikTok)
    console.log("\n📋 Testing bottom position text overlay...");
    overlay.setPosition("bottom");

    // Generate the text overlay
    await overlay.addTextOverlay(testImage, testText, "output-bottom.png");

    console.log("\n🎉 Test completed successfully!");
    console.log("📁 Check the generated output file:");
    console.log("   - output-bottom.png");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

// Export for use in other modules
module.exports = TikTokTextOverlayTest;

// Run test if this file is executed directly
if (require.main === module) {
  runTest();
}
