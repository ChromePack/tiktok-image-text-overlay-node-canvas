const express = require("express");
const path = require("path");

/**
 * Simple Express server to serve the TikTok Text Overlay Preview Tool
 * This runs independently from the main API server for easy deployment
 */

const app = express();
const PORT = process.env.PREVIEW_PORT || 3001;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Root route serves the preview tool
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "TikTok Text Overlay Preview Tool",
    version: "1.0.0",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Page not found",
    message: `Route ${req.originalUrl} does not exist`,
    availableEndpoints: [
      "GET / (Preview Tool)",
      "GET /health (Health Check)",
    ],
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🎬 TikTok Preview Tool running on port ${PORT}`);
  console.log(`📱 Preview tool: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
