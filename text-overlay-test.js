const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs");
const path = require("path");

/**
 * Balances text lines for optimal visual appearance
 * Aims for 3-4 words per line with similar character counts
 * @param {string} text - Input text to balance
 * @param {Object} options - Configuration options
 * @returns {string[]} Array of balanced lines
 */
function balanceTextLines(text, options = {}) {
  const {
    targetWordsPerLine = 3.5, // Ideal words per line (between 3-4)
    maxWordsPerLine = 5, // Maximum words allowed per line
    minWordsPerLine = 2, // Minimum words allowed per line
    maxCharVariance = 0.3, // Max character variance between lines (30%)
    preferShorterLines = true, // Prefer shorter, punchier lines
  } = options;

  // Clean and split text into words
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  if (words.length <= maxWordsPerLine) {
    return [words.join(" ")];
  }

  // Generate all possible line arrangements
  const arrangements = generateArrangements(
    words,
    minWordsPerLine,
    maxWordsPerLine
  );

  // Score each arrangement and pick the best one
  const bestArrangement = arrangements.reduce((best, current) => {
    const currentScore = scoreArrangement(
      current,
      targetWordsPerLine,
      maxCharVariance
    );
    const bestScore = scoreArrangement(
      best,
      targetWordsPerLine,
      maxCharVariance
    );
    return currentScore > bestScore ? current : best;
  });

  return bestArrangement;
}

/**
 * Generates possible line arrangements using dynamic programming
 */
function generateArrangements(words, minWords, maxWords) {
  const arrangements = [];

  function backtrack(startIndex, currentArrangement) {
    if (startIndex >= words.length) {
      arrangements.push([...currentArrangement]);
      return;
    }

    // Try different line lengths
    for (let wordsInLine = minWords; wordsInLine <= maxWords; wordsInLine++) {
      if (startIndex + wordsInLine <= words.length) {
        const line = words
          .slice(startIndex, startIndex + wordsInLine)
          .join(" ");
        currentArrangement.push(line);
        backtrack(startIndex + wordsInLine, currentArrangement);
        currentArrangement.pop();
      }
    }
  }

  backtrack(0, []);
  return arrangements;
}

/**
 * Scores an arrangement based on balance criteria
 */
function scoreArrangement(lines, targetWords, maxCharVariance) {
  if (lines.length === 0) return 0;

  let score = 0;
  const lineLengths = lines.map((line) => line.length);
  const wordCounts = lines.map((line) => line.split(" ").length);

  // Calculate character variance
  const avgLength =
    lineLengths.reduce((sum, len) => sum + len, 0) / lines.length;
  const charVariance = Math.max(...lineLengths) - Math.min(...lineLengths);
  const normalizedVariance = charVariance / avgLength;

  // Score based on character balance (higher score = better balance)
  score += Math.max(0, 100 - normalizedVariance * 200);

  // Score based on word count proximity to target
  const avgWords =
    wordCounts.reduce((sum, count) => sum + count, 0) / lines.length;
  const wordDeviation = Math.abs(avgWords - targetWords);
  score += Math.max(0, 50 - wordDeviation * 20);

  // Bonus for consistent word counts
  const wordVariance = Math.max(...wordCounts) - Math.min(...wordCounts);
  score += Math.max(0, 30 - wordVariance * 10);

  // Slight penalty for too many lines (prefer concise)
  score -= Math.max(0, (lines.length - 3) * 5);

  // Bonus for lines that are 3-4 words
  const idealWordBonus = wordCounts.reduce((bonus, count) => {
    if (count >= 3 && count <= 4) return bonus + 10;
    return bonus;
  }, 0);
  score += idealWordBonus;

  return score;
}

/**
 * Enhanced version with canvas text measurement support
 * @param {string} text - Input text
 * @param {CanvasRenderingContext2D} ctx - Canvas context for text measurement
 * @param {number} maxWidth - Maximum width constraint
 * @param {Object} options - Additional options
 */
function balanceTextLinesCanvas(
  text,
  ctx = null,
  maxWidth = null,
  options = {}
) {
  const baseLines = balanceTextLines(text, options);

  // If no canvas context provided, return basic balanced lines
  if (!ctx || !maxWidth) {
    return baseLines;
  }

  // Validate lines fit within width constraint
  const validLines = [];

  for (const line of baseLines) {
    const lineWidth = ctx.measureText(line).width;

    if (lineWidth <= maxWidth) {
      validLines.push(line);
    } else {
      // Split line that's too wide
      const words = line.split(" ");
      let currentLine = "";

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = ctx.measureText(testLine).width;

        if (testWidth <= maxWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) validLines.push(currentLine);
          currentLine = word;
        }
      }

      if (currentLine) validLines.push(currentLine);
    }
  }

  return validLines;
}

/**
 * Utility function to preview the balanced text
 */
function previewBalancedText(text, options = {}) {
  const lines = balanceTextLines(text, options);
  console.log("Balanced Text Preview:");
  console.log("═".repeat(50));
  lines.forEach((line, index) => {
    const words = line.split(" ").length;
    const chars = line.length;
    console.log(`${index + 1}: "${line}" (${words} words, ${chars} chars)`);
  });
  console.log("═".repeat(50));
  return lines;
}

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
    this.loadCustomFonts();
  }

  /**
   * Load custom fonts including Playfair Display
   */
  loadCustomFonts() {
    try {
      // Register Playfair Display (elegant serif font)
      const playfairDir = path.join(__dirname, "Playfair_Display");
      registerFont(
        path.join(playfairDir, "PlayfairDisplay-VariableFont_wght.ttf"),
        {
          family: "Playfair Display",
        }
      );

      // Register Playfair Display Regular (400 weight)
      registerFont(
        path.join(playfairDir, "static", "PlayfairDisplay-Regular.ttf"),
        {
          family: "Playfair Display",
          weight: "normal",
        }
      );

      // Register Playfair Display Italic
      registerFont(
        path.join(playfairDir, "PlayfairDisplay-Italic-VariableFont_wght.ttf"),
        {
          family: "Playfair Display",
          style: "italic",
        }
      );

      console.log("✅ Playfair Display font loaded successfully");
    } catch (error) {
      console.warn(
        "⚠️ Warning: Could not load Playfair Display font, falling back to system fonts:",
        error.message
      );
    }
  }

  /**
   * Initialize default configuration for TikTok-style text overlays
   */
  initializeConfiguration() {
    this.config = {
      // Canvas dimensions (9:16 aspect ratio for TikTok)
      width: 1024,
      height: 1536,

      // Text styling (Playfair Display - elegant serif font)
      fontSize: 65, // Scaled to 1.35x (48 * 1.35 = 64.8, rounded to 65)
      fontFamily: "Playfair Display", // Using Playfair Display as default - elegant serif
      fontWeight: "normal", // Using Regular 400 weight
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
   * Calculate text dimensions and line breaks using balanced text layout
   *
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} text - Text to measure
   * @param {number} maxWidth - Maximum width before wrapping
   * @returns {Object} Text metrics including lines, lineHeight, and totalHeight
   */
  calculateTextMetrics(ctx, text, maxWidth) {
    // Use balanced text layout for optimal visual appearance
    const balancedLines = balanceTextLinesCanvas(text, ctx, maxWidth, {
      targetWordsPerLine: 3.5, // Ideal words per line (between 3-4)
      maxWordsPerLine: 5, // Maximum words allowed per line
      minWordsPerLine: 2, // Minimum words allowed per line
      maxCharVariance: 0.3, // Max character variance between lines (30%)
      preferShorterLines: true, // Prefer shorter, punchier lines
    });

    return {
      lines: balancedLines,
      lineHeight: this.config.fontSize * this.config.lineHeight,
      totalHeight:
        balancedLines.length * this.config.fontSize * this.config.lineHeight,
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

      // Calculate positioning for first line
      const lineHeight = this.config.fontSize * this.config.lineHeight;
      const bubbleHeight = lineHeight + this.config.bubblePadding * 2;
      const gapBetweenBubbles = -10; // Negative value creates overlap instead of gap

      const startY =
        this.calculateVerticalPosition(
          this.config.height,
          textMetrics.totalHeight,
          textMetrics.lines.length
        ) - 50; // Move text 50px up

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
          bubbleY +
          (this.config.bubblePadding + extraPadding) +
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
   * Preview balanced text layout before generating overlay
   *
   * @param {string} text - Text to preview
   * @param {Object} options - Balancing options
   * @returns {string[]} Array of balanced lines
   */
  previewBalancedText(text, options = {}) {
    const defaultOptions = {
      targetWordsPerLine: 3.5,
      maxWordsPerLine: 5,
      minWordsPerLine: 2,
      maxCharVariance: 0.3,
      preferShorterLines: true,
    };

    const finalOptions = { ...defaultOptions, ...options };
    return previewBalancedText(text, finalOptions);
  }
}

/**
 * Test function to demonstrate the TikTok text overlay functionality
 * Focused on bottom position only (most common for TikTok)
 */
async function runTest() {
  console.log(
    "🚀 Starting TikTok Text Overlay Test with Playfair Display Font"
  );
  console.log("=".repeat(50));

  const overlay = new TikTokTextOverlayTest();

  // Test configuration
  const testImage = "file.png";
  const testText =
    "Skincare products I'd NEVER recommend my clients from a esthetician of 7+ years";

  try {
    // Preview the balanced text layout
    console.log("\n📝 Previewing balanced text layout:");
    overlay.previewBalancedText(testText);

    // Set position to bottom (most common for TikTok)
    console.log(
      "\n📋 Testing with Playfair Display Regular font and balanced text..."
    );
    overlay.setPosition("bottom");
    overlay.setFontFamily("Playfair Display");
    overlay.setFontWeight("normal");

    // Generate the text overlay with balanced text layout
    await overlay.addTextOverlay(testImage, testText, "output.png");

    console.log("\n🎉 Test completed successfully!");
    console.log("📁 Check the generated output file:");
    console.log(
      "   - output.png (Playfair Display Regular font with balanced text)"
    );
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

// Export for use in other modules
module.exports = {
  TikTokTextOverlayTest,
  balanceTextLines,
  balanceTextLinesCanvas,
  previewBalancedText,
};

// Run test if this file is executed directly
if (require.main === module) {
  runTest();
}

// Example usage for testing balanced text functionality
if (require.main === module) {
  console.log("\n" + "=".repeat(60));
  console.log("🧪 Testing Balanced Text Layout with Sample Texts");
  console.log("=".repeat(60));

  const sampleTexts = [
    "Skincare products I'd NEVER recommend my clients from a esthetician of 7+ years",
    "Brutally rating viral skincare as a esthetician that has tried it ALL",
    "Skin products I'd NEVER touch again as a esthetician of 6+ years",
  ];

  sampleTexts.forEach((text, index) => {
    console.log(`\n📝 Sample ${index + 1}:`);
    previewBalancedText(text);
  });
}
