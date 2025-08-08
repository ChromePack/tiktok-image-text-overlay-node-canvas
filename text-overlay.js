const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs");
const path = require("path");

/**
 * Simple text line splitting based on newline characters only
 * @param {string} text - Input text to split
 * @returns {string[]} Array of lines split by \n
 */
function splitTextByNewlines(text) {
  // Convert escaped newlines to actual newlines
  const processedText = text.replace(/\\n/g, "\n");
  return processedText.split("\n").filter((line) => line.trim().length > 0);
}

// TikTok UI safe zones (from preview tool)
// Note: Only enforced in auto-wrap mode per product requirements
const TIKTOK_SAFE_ZONES = {
  right: { x: 870, width: 154 },
  bottom: { y: 1200, height: 336 },
};

/**
 * TikTok Text Overlay Implementation
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
class TikTokTextOverlay {
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

      // Text styling (Proxima Nova - modern sans-serif font)
      fontSize: 65, // Scaled to 1.35x (48 * 1.35 = 64.8, rounded to 65)
      fontFamily: "Proxima Nova", // Using Proxima Nova as default - modern sans-serif
      fontWeight: "600", // Using Semibold 600 weight
      textColor: "#131313", // Very dark gray, almost black

      // Bubble styling (CapCut-style white bubbles)
      bubbleColor: "#FFFFFF",
      bubbleOpacity: 1, // Removed transparency - completely opaque
      bubblePadding: 20, // Increased by 20% from 16 to 20
      horizontalPadding: 26, // 30% more than bubblePadding (20 * 1.3 = 26)
      bubbleRadius: 25, // Increased by 40% from 12 to 17

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
   * Calculate text dimensions and line breaks
   * - Uses explicit newlines if provided by user
   * - Falls back to auto word-wrapping (safe-zone aware) when no newlines present
   *
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} text - Text to measure
   * @param {number} maxWidth - Maximum width before wrapping (not used in simple mode)
   * @returns {Object} Text metrics including lines, lineHeight, and totalHeight
   */
  calculateTextMetrics(ctx, text, maxWidth) {
    // Determine mode: explicit line breaks vs. auto-wrap
    const hasExplicitBreaks = /\n|\\n/.test(text);
    const lines = hasExplicitBreaks
      ? splitTextByNewlines(text)
      : this.autoWrapLines(ctx, text);

    return {
      lines: lines,
      lineHeight: this.config.fontSize * this.config.lineHeight,
      totalHeight: lines.length * this.config.fontSize * this.config.lineHeight,
    };
  }

  /**
   * Decide if we should auto-wrap (no explicit newlines)
   * @param {string} text
   * @returns {boolean}
   */
  shouldAutoWrap(text) {
    return !/\n|\\n/.test(text);
  }

  /**
   * Compute the maximum bubble width allowed when centered, obeying right/left constraints.
   * Right safe zone starts at x=870, left boundary is x=0. With centered alignment, we cap
   * the bubble so its right edge never exceeds 870, and left edge never goes < 0.
   * @returns {number}
   */
  getMaxBubbleWidthForAutoMode() {
    const canvasWidth = this.config.width; // 1024
    const centerX = canvasWidth / 2; // 512
    const rightBoundary = TIKTOK_SAFE_ZONES.right.x; // 870
    const leftBoundary = 0;

    const maxHalfWidthRight = rightBoundary - centerX; // 358
    const maxHalfWidthLeft = centerX - leftBoundary; // 512
    const maxHalfWidth = Math.min(maxHalfWidthRight, maxHalfWidthLeft);
    return maxHalfWidth * 2; // 716
  }

  /**
   * Auto-wrap text into lines without breaking words.
   * - Only used when no explicit newlines are provided
   * - Enforces safe horizontal zone by limiting bubble width
   * - Greedy word wrapping using canvas measurement
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {string} rawText
   * @returns {string[]}
   */
  autoWrapLines(ctx, rawText) {
    // Normalize whitespace and treat multiple spaces as single separators
    const normalized = rawText
      .replace(/\\n/g, "\n")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (normalized.length === 0) return [];

    const maxBubbleWidth = this.getMaxBubbleWidthForAutoMode();
    const maxTextWidth = Math.max(
      0,
      maxBubbleWidth - 2 * this.config.horizontalPadding
    );

    const words = normalized.split(" ");
    const lines = [];
    let currentLine = "";

    for (const word of words) {
      const candidate = currentLine ? `${currentLine} ${word}` : word;
      const candidateWidth = ctx.measureText(candidate).width;

      if (candidateWidth <= maxTextWidth) {
        currentLine = candidate;
        continue;
      }

      // Candidate would exceed available width
      if (currentLine) {
        // Push current line and start a new one with the word
        lines.push(currentLine);
        currentLine = word;
      } else {
        // Single word longer than allowed width: place it on its own line (allowed to overflow)
        lines.push(word);
        currentLine = "";
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
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
    ctx.shadowColor = "transparent"; // Removed shadow
    ctx.shadowBlur = 0; // Removed shadow blur
    ctx.shadowOffsetX = 0; // Removed shadow offset
    ctx.shadowOffsetY = 0; // Removed shadow offset

    // Fill bubble background with opacity
    ctx.globalAlpha = 1; // Removed transparency - completely opaque
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
    const overlapBetweenBubbles = 10; // 10px overlap between bubbles
    const totalBubbleHeight =
      lineCount * bubbleHeight - (lineCount - 1) * overlapBetweenBubbles; // Subtract overlaps

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

      const isAutoWrap = this.shouldAutoWrap(text);

      // Calculate positioning for first line
      const lineHeight = this.config.fontSize * this.config.lineHeight;
      const bubbleHeight = lineHeight + this.config.bubblePadding * 2;
      const gapBetweenBubbles = -10; // Negative value creates overlap instead of gap

      // TODO: Support top/center positions for auto-wrap mode if needed
      let startY =
        this.calculateVerticalPosition(
          this.config.height,
          textMetrics.totalHeight,
          textMetrics.lines.length
        ) - 50; // Move text 50px up

      // In auto-wrap mode, clamp so the block bottom does not pass into bottom safe zone
      if (isAutoWrap && textMetrics.lines.length > 0) {
        const overlapBetweenBubbles = 10;
        const totalBubbleHeight =
          textMetrics.lines.length * bubbleHeight -
          (textMetrics.lines.length - 1) * overlapBetweenBubbles;
        const blockBottom = startY + totalBubbleHeight;
        const maxBottom = TIKTOK_SAFE_ZONES.bottom.y; // 1200
        if (blockBottom > maxBottom) {
          startY -= blockBottom - maxBottom;
        }
      }

      // Draw individual bubbles for each line
      textMetrics.lines.forEach((line, index) => {
        // Calculate bubble dimensions for this specific line
        const lineWidth = ctx.measureText(line).width;
        const isFirstLine = index === 0;
        const extraPadding = isFirstLine ? 0 : 0; // Add 10px extra padding only to first line
        const bubbleWidth =
          lineWidth + (this.config.horizontalPadding + extraPadding) * 2; // Use horizontal padding for width
        const bubbleHeight =
          lineHeight + (this.config.bubblePadding + extraPadding) * 2; // Add extra padding to height for first line

        // Calculate bubble position
        const bubbleX = (this.config.width - bubbleWidth) / 2;
        const bubbleY = startY + index * (bubbleHeight + gapBetweenBubbles);

        // Draw individual bubble background
        this.drawBubble(
          ctx,
          bubbleX,
          bubbleY,
          bubbleWidth,
          bubbleHeight,
          this.config.bubbleRadius
        );

        // Draw text for this line
        ctx.fillStyle = this.config.textColor;
        const textY =
          bubbleY + (this.config.bubblePadding + extraPadding) + lineHeight / 2;
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
   * Add text overlay to image and return as base64
   *
   * @param {string} imagePath - Input image path
   * @param {string} text - Text to overlay
   * @returns {Promise<string>} Base64 encoded image
   */
  async addTextOverlayBase64(imagePath, text) {
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

      const isAutoWrap = this.shouldAutoWrap(text);

      // Calculate positioning for first line
      const lineHeight = this.config.fontSize * this.config.lineHeight;
      const bubbleHeight = lineHeight + this.config.bubblePadding * 2;
      const gapBetweenBubbles = -10; // Negative value creates overlap instead of gap

      // TODO: Support top/center positions for auto-wrap mode if needed
      let startY =
        this.calculateVerticalPosition(
          this.config.height,
          textMetrics.totalHeight,
          textMetrics.lines.length
        ) - 50; // Move text 50px up

      // In auto-wrap mode, clamp so the block bottom does not pass into bottom safe zone
      if (isAutoWrap && textMetrics.lines.length > 0) {
        const overlapBetweenBubbles = 10;
        const totalBubbleHeight =
          textMetrics.lines.length * bubbleHeight -
          (textMetrics.lines.length - 1) * overlapBetweenBubbles;
        const blockBottom = startY + totalBubbleHeight;
        const maxBottom = TIKTOK_SAFE_ZONES.bottom.y; // 1200
        if (blockBottom > maxBottom) {
          startY -= blockBottom - maxBottom;
        }
      }

      // Draw individual bubbles for each line
      textMetrics.lines.forEach((line, index) => {
        // Calculate bubble dimensions for this specific line
        const lineWidth = ctx.measureText(line).width;
        const isFirstLine = index === 0;
        const extraPadding = isFirstLine ? 0 : 0; // Add 10px extra padding only to first line
        const bubbleWidth =
          lineWidth + (this.config.horizontalPadding + extraPadding) * 2; // Use horizontal padding for width
        const bubbleHeight =
          lineHeight + (this.config.bubblePadding + extraPadding) * 2; // Add extra padding to height for first line

        // Calculate bubble position
        const bubbleX = (this.config.width - bubbleWidth) / 2;
        const bubbleY = startY + index * (bubbleHeight + gapBetweenBubbles);

        // Draw individual bubble background
        this.drawBubble(
          ctx,
          bubbleX,
          bubbleY,
          bubbleWidth,
          bubbleHeight,
          this.config.bubbleRadius
        );

        // Draw text for this line
        ctx.fillStyle = this.config.textColor;
        const textY =
          bubbleY + (this.config.bubblePadding + extraPadding) + lineHeight / 2;
        ctx.fillText(line, this.config.width / 2, textY);
      });

      // Convert to base64
      const buffer = canvas.toBuffer("image/png");
      const base64Image = buffer.toString("base64");

      console.log(`✅ Text overlay processed successfully (base64)`);
      return base64Image;
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
   * Set font family for text overlay
   *
   * @param {string} fontFamily - Font family name
   */
  setFontFamily(fontFamily) {
    this.config.fontFamily = fontFamily;
  }

  /**
   * Set font size for text overlay
   *
   * @param {number} size - Font size in pixels
   */
  setFontSize(size) {
    this.config.fontSize = size;
  }

  /**
   * Set font weight for text overlay
   *
   * @param {string} weight - Font weight (normal, bold, etc.)
   */
  setFontWeight(weight) {
    this.config.fontWeight = weight;
  }

  /**
   * Set line height for text overlay
   *
   * @param {number} lineHeight - Line height multiplier (e.g., 1.2 for 120% of font size)
   */
  setLineHeight(lineHeight) {
    this.config.lineHeight = lineHeight;
  }

  /**
   * Preview text layout based on newline characters
   *
   * @param {string} text - Text to preview
   * @param {Object} options - Options (not used in simple mode)
   * @returns {string[]} Array of lines split by newlines
   */
  previewBalancedText(text, options = {}) {
    return splitTextByNewlines(text);
  }
}

// Export for use in other modules
module.exports = {
  TikTokTextOverlay,
  splitTextByNewlines,
};
