import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Text, Group, Image as KonvaImage } from 'react-konva';
import './App.css';

// TikTok canvas dimensions (same as API)
const CANVAS_CONFIG = {
  width: 1024,
  height: 1536,
  // Scale factor for preview display
  previewScale: 0.35
};

// Default configuration matching the API
const DEFAULT_CONFIG = {
  fontSize: 65,
  fontFamily: 'Proxima Nova, Arial, sans-serif',
  fontWeight: '600',
  textColor: '#131313',
  bubbleColor: '#FFFFFF',
  bubbleOpacity: 1,
  bubblePadding: 20,
  horizontalPadding: 26,
  bubbleRadius: 25,
  maxWidth: 900,
  lineHeight: 1.2,
  position: 'center'
};

// TikTok UI safe zones (approximate positions based on TikTok app layout)
const TIKTOK_UI_ZONES = {
  // Top UI elements (profile, follow button, etc.)
  topSafeZone: {
    y: 0,
    height: 120 // First 120px from top
  },
  // Bottom UI elements (like, comment, share buttons, description)
  bottomSafeZone: {
    y: 1200, // Last 336px from bottom
    height: 336
  },
  // Right side UI (like, comment, share, profile buttons)
  rightSafeZone: {
    x: 870, // Last 154px from right
    width: 154
  }
};

function App() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [text, setText] = useState('Your TikTok text here\\nSecond line of text\\nThird line example');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [konvaImage, setKonvaImage] = useState(null);
  const [showSafeZones, setShowSafeZones] = useState(true);
  const fileInputRef = useRef();
  const textMeasureCanvasRef = useRef(null);

  // Function to split text by newlines (same as API)
  const splitTextByNewlines = (inputText) => {
    // Handle both \n and \\n patterns
    const processedText = inputText.replace(/\\n/g, '\n');
    return processedText.split('\n').filter(line => line.trim().length > 0);
  };

  // Calculate text metrics (same logic as API)
  const calculateTextMetrics = (lines) => {
    return {
      lines: lines,
      lineHeight: config.fontSize * config.lineHeight,
      totalHeight: lines.length * config.fontSize * config.lineHeight
    };
  };

  // Calculate vertical position (same logic as API)
  const calculateVerticalPosition = (canvasHeight, totalTextHeight, lineCount) => {
    const lineHeight = config.fontSize * config.lineHeight;
    const bubbleHeight = lineHeight + config.bubblePadding * 2;
    const overlapBetweenBubbles = 10;
    const totalBubbleHeight = lineCount * bubbleHeight - (lineCount - 1) * overlapBetweenBubbles;

    switch (config.position) {
      case 'top':
        return canvasHeight * 0.15;
      case 'bottom':
        return canvasHeight * 0.85 - totalBubbleHeight;
      case 'center':
      default:
        return (canvasHeight - totalBubbleHeight) / 2;
    }
  };

  // Initialize text measurement canvas
  useEffect(() => {
    if (!textMeasureCanvasRef.current) {
      textMeasureCanvasRef.current = document.createElement('canvas');
      // Force a re-render once canvas is ready
      setConfig(prev => ({ ...prev }));
    }
  }, []);

  // Measure text width using canvas (same as API)
  const measureTextWidth = (text, fontSize, fontFamily, fontWeight) => {
    if (!textMeasureCanvasRef.current) return text.length * (fontSize * 0.6);
    
    const ctx = textMeasureCanvasRef.current.getContext('2d');
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    return ctx.measureText(text).width;
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        setKonvaImage(img);
        setBackgroundImage(e.target.result);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Render text bubbles (same logic as API)
  const renderTextBubbles = () => {
    const lines = splitTextByNewlines(text);
    if (lines.length === 0) return null;

    const textMetrics = calculateTextMetrics(lines);
    const lineHeight = config.fontSize * config.lineHeight;
    const bubbleHeight = lineHeight + config.bubblePadding * 2;
    const gapBetweenBubbles = -10;
    
    const startY = calculateVerticalPosition(
      CANVAS_CONFIG.height,
      textMetrics.totalHeight,
      textMetrics.lines.length
    ) - 50;

    return lines.map((line, index) => {
      // Calculate bubble dimensions for this specific line using accurate text measurement
      const lineWidth = measureTextWidth(line, config.fontSize, config.fontFamily, config.fontWeight);
      const isFirstLine = index === 0;
      const extraPadding = isFirstLine ? 0 : 0;
      const bubbleWidth = lineWidth + (config.horizontalPadding + extraPadding) * 2;
      const actualBubbleHeight = lineHeight + (config.bubblePadding + extraPadding) * 2;

      // Calculate bubble position
      const bubbleX = (CANVAS_CONFIG.width - bubbleWidth) / 2;
      const bubbleY = startY + index * (bubbleHeight + gapBetweenBubbles);

      return (
        <Group key={index}>
          {/* Bubble background */}
          <Rect
            x={bubbleX}
            y={bubbleY}
            width={bubbleWidth}
            height={actualBubbleHeight}
            fill={config.bubbleColor}
            opacity={config.bubbleOpacity}
            cornerRadius={config.bubbleRadius}
          />
          {/* Text */}
          <Text
            x={CANVAS_CONFIG.width / 2}
            y={bubbleY + (config.bubblePadding + extraPadding) + lineHeight / 2}
            text={line}
            fontSize={config.fontSize}
            fontFamily={config.fontFamily}
            fontStyle={config.fontWeight}
            fill={config.textColor}
            align="center"
            verticalAlign="middle"
            offsetX={lineWidth / 2}
            offsetY={lineHeight / 4}
          />
        </Group>
      );
    });
  };

  // Render TikTok UI safe zones
  const renderSafeZones = () => {
    if (!showSafeZones) return null;

    return (
      <Group>
        {/* Top safe zone */}
        <Rect
          x={0}
          y={TIKTOK_UI_ZONES.topSafeZone.y}
          width={CANVAS_CONFIG.width}
          height={TIKTOK_UI_ZONES.topSafeZone.height}
          fill="rgba(255, 0, 0, 0.2)"
          stroke="red"
          strokeWidth={2}
          dash={[10, 5]}
        />
        
        {/* Bottom safe zone */}
        <Rect
          x={0}
          y={TIKTOK_UI_ZONES.bottomSafeZone.y}
          width={CANVAS_CONFIG.width}
          height={TIKTOK_UI_ZONES.bottomSafeZone.height}
          fill="rgba(255, 0, 0, 0.2)"
          stroke="red"
          strokeWidth={2}
          dash={[10, 5]}
        />
        
        {/* Right safe zone */}
        <Rect
          x={TIKTOK_UI_ZONES.rightSafeZone.x}
          y={0}
          width={TIKTOK_UI_ZONES.rightSafeZone.width}
          height={CANVAS_CONFIG.height}
          fill="rgba(255, 0, 0, 0.2)"
          stroke="red"
          strokeWidth={2}
          dash={[10, 5]}
        />
        
        {/* Safe zone labels */}
        <Text
          x={50}
          y={60}
          text="TOP UI ZONE"
          fontSize={16}
          fontFamily="Arial"
          fill="red"
          fontStyle="bold"
        />
        
        <Text
          x={50}
          y={1250}
          text="BOTTOM UI ZONE\n(Like, Comment, Share)"
          fontSize={16}
          fontFamily="Arial"
          fill="red"
          fontStyle="bold"
        />
        
        <Text
          x={880}
          y={400}
          text="RIGHT UI"
          fontSize={14}
          fontFamily="Arial"
          fill="red"
          fontStyle="bold"
          rotation={90}
        />
      </Group>
    );
  };

  return (
    <div className="App">
      <div className="app-header">
        <h1>🎬 TikTok Text Overlay Preview Tool</h1>
        <p>Preview your text overlays with TikTok UI safe zones in real-time</p>
      </div>

      <div className="app-container">
        {/* Controls Panel */}
        <div className="controls-panel">
          <div className="control-section">
            <h3>📝 Text Content</h3>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text here. Use \n for new lines..."
              rows={4}
              className="text-input"
            />
          </div>

          <div className="control-section">
            <h3>🖼️ Background Image</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input"
            />
            {!backgroundImage && (
              <p className="upload-hint">Upload an image to see the overlay preview</p>
            )}
          </div>

          <div className="control-section">
            <h3>⚙️ Text Settings</h3>
            
            <div className="control-group">
              <label>Font Size: {config.fontSize}px</label>
              <input
                type="range"
                min="30"
                max="120"
                value={config.fontSize}
                onChange={(e) => setConfig({...config, fontSize: parseInt(e.target.value)})}
                className="range-input"
              />
            </div>

            <div className="control-group">
              <label>Line Height: {config.lineHeight}</label>
              <input
                type="range"
                min="0.8"
                max="2.0"
                step="0.1"
                value={config.lineHeight}
                onChange={(e) => setConfig({...config, lineHeight: parseFloat(e.target.value)})}
                className="range-input"
              />
            </div>

            <div className="control-group">
              <label>Position:</label>
              <select
                value={config.position}
                onChange={(e) => setConfig({...config, position: e.target.value})}
                className="select-input"
              >
                <option value="top">Top</option>
                <option value="center">Center</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>

            <div className="control-group">
              <label>Bubble Radius: {config.bubbleRadius}px</label>
              <input
                type="range"
                min="5"
                max="50"
                value={config.bubbleRadius}
                onChange={(e) => setConfig({...config, bubbleRadius: parseInt(e.target.value)})}
                className="range-input"
              />
            </div>
          </div>

          <div className="control-section">
            <h3>🔍 Preview Options</h3>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showSafeZones}
                onChange={(e) => setShowSafeZones(e.target.checked)}
              />
              Show TikTok UI Safe Zones
            </label>
          </div>
        </div>

        {/* Preview Canvas */}
        <div className="preview-panel">
          <div className="canvas-container">
            <Stage 
              width={CANVAS_CONFIG.width * CANVAS_CONFIG.previewScale} 
              height={CANVAS_CONFIG.height * CANVAS_CONFIG.previewScale}
              scaleX={CANVAS_CONFIG.previewScale}
              scaleY={CANVAS_CONFIG.previewScale}
            >
              <Layer>
                {/* Background Image */}
                {konvaImage && (
                  <KonvaImage
                    image={konvaImage}
                    x={0}
                    y={0}
                    width={CANVAS_CONFIG.width}
                    height={CANVAS_CONFIG.height}
                  />
                )}
                
                {/* Default background if no image */}
                {!konvaImage && (
                  <Rect
                    x={0}
                    y={0}
                    width={CANVAS_CONFIG.width}
                    height={CANVAS_CONFIG.height}
                    fill="#667eea"
                  />
                )}

                {/* Text Bubbles */}
                {renderTextBubbles()}

                {/* TikTok UI Safe Zones */}
                {renderSafeZones()}
              </Layer>
            </Stage>
          </div>

          <div className="preview-info">
            <h4>📱 TikTok Preview Simulation</h4>
            <p><span className="safe-zone-indicator"></span> Red zones show where TikTok UI elements appear</p>
            <p>Ensure your text doesn't overlap with these areas for optimal visibility</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
