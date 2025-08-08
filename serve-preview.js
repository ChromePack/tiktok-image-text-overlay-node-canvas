const express = require("express");
const path = require("path");

/**
 * Simple Express server to serve the TikTok Text Overlay Preview Tool
 * This runs independently from the main API server for easy deployment
 */

const app = express();
const PORT = process.env.PREVIEW_PORT || 3001;

// Serve static files from preview-app build directory
app.use(express.static(path.join(__dirname, "preview-app", "build")));

// Health check endpoint (must come before catch-all)
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "TikTok Text Overlay Preview Tool",
    version: "1.0.0",
  });
});

// Root route serves the preview tool
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "preview-app", "build", "index.html"));
});

// Catch all handler: send back React's index.html file for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "preview-app", "build", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`🎬 TikTok Preview Tool running on port ${PORT}`);
  console.log(`📱 Preview tool: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
