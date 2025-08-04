const express = require("express");
const multer = require("multer");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
const fs = require("fs");
const { TikTokTextOverlay } = require("./text-overlay");

/**
 * Express.js Backend API for TikTok Text Overlay
 *
 * Clean Code Principles Applied:
 * - Single Responsibility: Each route handler has one clear purpose
 * - Descriptive Names: Self-documenting function and variable names
 * - Small Functions: Methods are focused and concise
 * - Consistent Formatting: Clear structure and indentation
 * - Error Handling: Comprehensive error management
 */

class TikTokTextOverlayAPI {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.overlayProcessor = new TikTokTextOverlay();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Initialize Express middleware for security and performance
   */
  initializeMiddleware() {
    // Security middleware
    this.app.use(
      helmet({
        contentSecurityPolicy: false, // Disable for image processing
      })
    );

    // CORS configuration
    this.app.use(
      cors({
        origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
      })
    );

    // Compression for better performance
    this.app.use(compression());

    // Body parsing
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Static file serving for outputs and public files
    this.app.use("/outputs", express.static(path.join(__dirname, "outputs")));
    this.app.use("/", express.static(path.join(__dirname, "public")));
  }

  /**
   * Configure multer for temporary file upload handling
   */
  configureMulter() {
    // Ensure output directory exists for any temporary files
    const outputDir = path.join(__dirname, "outputs");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Configure memory storage for temporary processing
    const storage = multer.memoryStorage();

    // File filter for image validation
    const fileFilter = (req, file, cb) => {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];

      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new Error(
            "Invalid file type. Only JPEG, PNG, and WebP images are allowed."
          ),
          false
        );
      }
    };

    return multer({
      storage: storage,
      fileFilter: fileFilter,
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    });
  }

  /**
   * Initialize API routes
   */
  initializeRoutes() {
    const upload = this.configureMulter();

    // Health check endpoint
    this.app.get("/health", (req, res) => {
      res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        service: "TikTok Text Overlay API",
        version: "1.0.0",
      });
    });

    // Main text overlay endpoint
    this.app.post(
      "/api/text-overlay",
      upload.single("avatar"),
      async (req, res) => {
        try {
          await this.handleTextOverlay(req, res);
        } catch (error) {
          this.handleError(error, res);
        }
      }
    );

    // Configuration endpoint
    this.app.post("/api/configure", (req, res) => {
      try {
        this.handleConfiguration(req, res);
      } catch (error) {
        this.handleError(error, res);
      }
    });

    // Preview text layout endpoint
    this.app.post("/api/preview-text", (req, res) => {
      try {
        this.handleTextPreview(req, res);
      } catch (error) {
        this.handleError(error, res);
      }
    });
  }

  /**
   * Handle text overlay processing
   */
  async handleTextOverlay(req, res) {
    // Validate requesti
    if (!req.file) {
      return res.status(400).json({
        error: "No image file provided",
        message: 'Please upload an avatar image using the "avatar" field',
      });
    }

    if (!req.body.text || req.body.text.trim().length === 0) {
      return res.status(400).json({
        error: "No text provided",
        message: 'Please provide text content in the "text" field',
      });
    }

    const text = req.body.text.trim();
    const position = req.body.position || "bottom";
    const fontSize = req.body.fontSize ? parseInt(req.body.fontSize) : null;
    const lineHeight = req.body.lineHeight
      ? parseFloat(req.body.lineHeight)
      : null;
    let tempFilePath = null;

    try {
      // Create temporary file for processing
      const tempDir = path.join(__dirname, "temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(req.file.originalname);
      tempFilePath = path.join(tempDir, `temp-${uniqueSuffix}${ext}`);

      // Write buffer to temporary file
      fs.writeFileSync(tempFilePath, req.file.buffer);

      // Configure overlay settings
      this.overlayProcessor.setPosition(position);
      if (fontSize) {
        this.overlayProcessor.setFontSize(fontSize);
      }
      if (lineHeight) {
        this.overlayProcessor.setLineHeight(lineHeight);
      }

      // Process the image and get base64
      const base64Image = await this.overlayProcessor.addTextOverlayBase64(
        tempFilePath,
        text
      );

      res.json({
        success: true,
        message: "Text overlay processed successfully",
        data: {
          imageBase64: base64Image,
          originalImage: req.file.originalname,
          text: text,
          position: position,
          fontSize: fontSize || this.overlayProcessor.config.fontSize,
          lineHeight: lineHeight || this.overlayProcessor.config.lineHeight,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      throw error;
    } finally {
      // Clean up temporary file
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        try {
          fs.unlinkSync(tempFilePath);
        } catch (cleanupError) {
          console.warn(
            "Failed to clean up temporary file:",
            cleanupError.message
          );
        }
      }
    }
  }

  /**
   * Handle configuration updates
   */
  handleConfiguration(req, res) {
    const {
      fontSize,
      position,
      fontFamily,
      fontWeight,
      lineHeight,
      textColor,
      bubbleColor,
    } = req.body;

    try {
      if (fontSize) this.overlayProcessor.setFontSize(fontSize);
      if (position) this.overlayProcessor.setPosition(position);
      if (fontFamily) this.overlayProcessor.setFontFamily(fontFamily);
      if (fontWeight) this.overlayProcessor.setFontWeight(fontWeight);
      if (lineHeight) this.overlayProcessor.setLineHeight(lineHeight);

      // Update other configuration options
      const configUpdates = {};
      if (textColor) configUpdates.textColor = textColor;
      if (bubbleColor) configUpdates.bubbleColor = bubbleColor;

      if (Object.keys(configUpdates).length > 0) {
        this.overlayProcessor.updateConfig(configUpdates);
      }

      res.json({
        success: true,
        message: "Configuration updated successfully",
        data: {
          currentConfig: this.overlayProcessor.config,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Handle text preview functionality
   */
  handleTextPreview(req, res) {
    const { text, options } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        error: "No text provided",
        message: "Please provide text content for preview",
      });
    }

    try {
      const previewLines = this.overlayProcessor.previewBalancedText(
        text,
        options
      );

      res.json({
        success: true,
        message: "Text preview generated successfully",
        data: {
          originalText: text,
          lines: previewLines,
          lineCount: previewLines.length,
          preview: previewLines.map((line, index) => ({
            lineNumber: index + 1,
            text: line,
            wordCount: line.split(" ").length,
            characterCount: line.length,
          })),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Initialize error handling middleware
   */
  initializeErrorHandling() {
    // Multer error handling
    this.app.use((error, req, res, next) => {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            error: "File too large",
            message: "File size must be less than 10MB",
          });
        }
        return res.status(400).json({
          error: "File upload error",
          message: error.message,
        });
      }
      next(error);
    });

    // General error handling
    this.app.use((error, req, res, next) => {
      console.error("API Error:", error);

      res.status(500).json({
        error: "Internal server error",
        message:
          process.env.NODE_ENV === "production"
            ? "An unexpected error occurred"
            : error.message,
        timestamp: new Date().toISOString(),
      });
    });

    // 404 handler
    this.app.use("*", (req, res) => {
      res.status(404).json({
        error: "Endpoint not found",
        message: `Route ${req.originalUrl} does not exist`,
        availableEndpoints: [
          "GET /health",
          "POST /api/text-overlay",
          "POST /api/configure",
          "POST /api/preview-text",
        ],
      });
    });
  }

  /**
   * Start the Express server
   */
  start() {
    this.app.listen(this.port, () => {
      console.log(
        `🚀 TikTok Text Overlay API server running on port ${this.port}`
      );
      console.log(`📝 Health check: http://localhost:${this.port}/health`);
      console.log(
        `🖼️  Text overlay endpoint: http://localhost:${this.port}/api/text-overlay`
      );
      console.log(
        `⚙️  Configuration endpoint: http://localhost:${this.port}/api/configure`
      );
      console.log(
        `👀 Preview endpoint: http://localhost:${this.port}/api/preview-text`
      );
    });
  }
}

// Create and start the server
const server = new TikTokTextOverlayAPI();
server.start();

module.exports = TikTokTextOverlayAPI;
