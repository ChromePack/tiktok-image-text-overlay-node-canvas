# 🎬 TikTok Text Overlay Preview Tool

A simple, standalone web-based tool for previewing and adjusting TikTok text overlays to avoid UI conflicts with platform elements like buttons and icons.

![TikTok Preview Tool Demo](https://img.shields.io/badge/Status-Ready-green?style=for-the-badge)

## 🚀 Quick Start

### Option 1: Standalone Preview Tool
```bash
# Start just the preview tool
yarn preview

# Or with auto-reload for development
yarn preview:dev
```
The preview tool will be available at: **http://localhost:3001**

### Option 2: Run Both API and Preview Tool
```bash
# Start both the API server and preview tool using PM2
yarn start:all
```
- **API Server**: http://localhost:3000
- **Preview Tool**: http://localhost:3001

### Option 3: PM2 Management Commands
```bash
# Start all services
pm2 start ecosystem.config.js

# Stop all services
yarn stop:all

# Restart all services
yarn restart:all

# View logs
yarn logs
```

## 🎯 Features

### ✅ Complete TikTok Mobile Simulation
- **9:16 Aspect Ratio**: Accurate mobile TikTok proportions
- **Right-Side UI Elements**: Profile, like, comment, share, and music icons
- **Safe Text Area**: Text positioning that avoids UI conflicts
- **Realistic Styling**: TikTok-style white bubble text overlays

### ✅ Real-Time Preview Controls
- **Font Size Slider**: 12px - 48px range with live preview
- **Line Height Slider**: 1.0 - 2.0 range with precise control
- **Text Position**: Top, center, or bottom placement
- **Live Text Input**: Real-time text updates with `\n` line break support

### ✅ Image Upload Support
- **Drag & Drop**: Easy image upload interface
- **Multiple Formats**: JPEG, PNG, WebP support
- **Background Preview**: Test text overlay on actual images

### ✅ Export & Integration
- **Copy Values**: One-click copy of fontSize, lineHeight, and position
- **Production Ready**: Values work directly with the main API
- **No Dependencies**: Pure client-side processing

## 🖥️ User Interface

### Layout Structure
```
┌─────────────────────────────────────────────────┐
│              📱 TikTok Preview                 │
├─────────────────────────────────────────────────┤
│  ┌─────────────────┐     ┌─────────────────────┐│
│  │                 │     │      ⚙️ Controls    ││
│  │   📱 TikTok     │     │                     ││
│  │   Container     │     │  📁 Image Upload    ││
│  │                 │     │  📝 Text Input      ││
│  │  [Background]   │     │  🎨 Font Size       ││
│  │                 │     │  📏 Line Height     ││
│  │  "Text overlay  │     │  📍 Position        ││
│  │   appears here" │     │                     ││
│  │                 │     │  📋 Export Values   ││
│  │            [♥]  │     │  fontSize: 24px     ││
│  │            [💬] │     │  lineHeight: 1.2    ││
│  │            [↗]  │     │  position: center   ││
│  │            [👤] │     │                     ││
│  └─────────────────┘     └─────────────────────┘│
└─────────────────────────────────────────────────┘
```

## 📝 Usage Guide

### Step 1: Enter Your Text
```
I've been a sleep doctor for a decade.\nThese are the best dr*g-free things you\ncan use to fall asleep faster
```
- Use `\n` to manually control line breaks
- Text appears in real-time as you type

### Step 2: Adjust Font Size
- Drag the **Font Size** slider (12px - 48px)
- Watch text update instantly in the preview
- Find the size that fits without overlapping UI elements

### Step 3: Fine-tune Line Height
- Adjust **Line Height** slider (1.0 - 2.0)
- Control spacing between text lines
- Optimize for readability and space efficiency

### Step 4: Choose Position
- **Top**: Text positioned near the top (15% from top)
- **Center**: Text centered vertically
- **Bottom**: Text positioned near bottom (15% from bottom)

### Step 5: Upload Background Image (Optional)
- Click the upload area or drag & drop an image
- Preview how text looks on your actual content
- Supports JPEG, PNG, and WebP formats

### Step 6: Copy Production Values
- Click **📋 Copy Values** button
- Use the exported values in your production workflow:
```
fontSize: 24px
lineHeight: 1.2  
position: center
```

## 🔧 Technical Specifications

### Browser Compatibility
- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- 📱 Mobile browsers supported

### Performance
- **Client-side Only**: No server processing required
- **Instant Updates**: Real-time preview with no lag
- **Lightweight**: Single HTML file with embedded assets
- **Offline Capable**: Works without internet connection

### Text Processing Logic
The preview tool uses the same text splitting logic as the main API:
```javascript
// Convert escaped newlines to actual newlines
const processedText = text.replace(/\\n/g, '\n');
return processedText.split('\n').filter(line => line.trim().length > 0);
```

### Positioning Algorithm
Matches the backend positioning system:
- **Top**: 15% from top of container
- **Center**: Vertically centered with bubble height consideration
- **Bottom**: 15% from bottom, accounting for total text height

## 🎨 Styling Details

### TikTok UI Elements
- **Right Icons**: Profile, heart, comment, share, music
- **Positioning**: Fixed to right side, bottom area
- **Safe Zone**: Text area excludes 80px from right edge
- **Authentic Look**: Glassmorphism effects and TikTok-style icons

### Text Overlay Styling
- **Font Family**: Proxima Nova (fallback to system sans-serif)
- **Font Weight**: 600 (semibold)
- **Background**: Pure white (#ffffff) bubbles
- **Text Color**: Dark gray (#131313)
- **Border Radius**: 20px rounded corners
- **Padding**: 12px vertical, 20px horizontal
- **Shadow**: Subtle drop shadow for depth

## 🚀 Deployment Options

### Option 1: Integrated with Existing API
The preview tool runs alongside your main API server using PM2:
- **API**: Port 3000
- **Preview**: Port 3001
- **Shared Logs**: Centralized PM2 logging
- **Production Ready**: Same deployment pipeline

### Option 2: Standalone Deployment
Deploy the preview tool independently:
```bash
# Just run the preview server
node serve-preview.js
```

### Option 3: Static File Hosting
The `public/index.html` file is completely self-contained and can be:
- Uploaded to any web server
- Hosted on CDN (CloudFlare, AWS S3, etc.)
- Served from GitHub Pages
- Run locally by opening the HTML file directly

## 🔗 Integration with Main API

The preview tool is designed to work seamlessly with your existing TikTok text overlay API:

### Export Format Matches API Parameters
```javascript
// Preview tool exports:
fontSize: 24px
lineHeight: 1.2
position: center

// Direct usage in API call:
const formData = new FormData();
formData.append('fontSize', '24');
formData.append('lineHeight', '1.2');
formData.append('position', 'center');
```

### Same Text Processing Logic
The preview tool uses identical text splitting logic as the backend API, ensuring consistency between preview and final output.

## 🎯 Problem Solved

This tool directly addresses the client feedback about text overlapping with TikTok UI elements:

> "Can we set a width limit for the captions so that the text is not covered by these icons on TikTok?"

**Solution Features:**
- **Visual UI Simulation**: See exactly where TikTok buttons will appear
- **Safe Text Zone**: Text area automatically avoids icon overlap
- **Real-time Feedback**: Instantly see if text conflicts with UI elements
- **Production Values**: Export exact settings for implementation

## 📋 Troubleshooting

### Text Not Appearing
- Check that text input has content
- Verify position setting (try "center" if others don't work)
- Ensure font size is reasonable (try 24px)

### Image Upload Issues
- Use supported formats: JPEG, PNG, WebP
- Keep file size reasonable (under 10MB)
- Check browser permissions for file access

### Copy Button Not Working
- Modern browsers required for clipboard API
- Fallback method will work on older browsers
- Try manually selecting text from export area

### Styling Differences
- Preview is optimized for 375x667 container
- Production API uses 1024x1536 canvas
- Relative positioning ensures consistency

## 🎉 Success Criteria

✅ **Accurate TikTok Simulation**: Mobile UI elements positioned correctly  
✅ **Text Conflict Prevention**: Clear safe zones avoid button overlap  
✅ **Real-time Feedback**: Instant preview of font and position changes  
✅ **Production Integration**: Export values work directly with main API  
✅ **Easy Deployment**: Runs alongside existing PM2 setup  
✅ **Client Problem Solved**: Visual tool prevents text/UI conflicts  

---

**Ready to use!** The tool is designed to be simple, effective, and solve the exact problem your client identified with TikTok text overlays.
