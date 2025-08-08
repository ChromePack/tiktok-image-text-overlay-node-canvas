# 🎬 TikTok Image Text Overlay - Complete Solution

## 📋 Project Overview

This project now includes **two main components**:

### 1. 🔧 **TikTok Text Overlay API** (Original)
- Express.js backend API for processing images
- Node-Canvas powered text overlay generation  
- RESTful endpoints for image processing
- Production-ready with comprehensive error handling

### 2. 🎨 **TikTok Text Overlay Preview Tool** (New)
- **Client-side web application** for previewing text overlays
- **Real-time interactive controls** (font size, line height, positioning)
- **TikTok UI simulation** to prevent icon overlap conflicts
- **Export functionality** for production integration

## 🎯 Problem Solved

**Client Issue**: *"Can we set a width limit for the captions so that the text is not covered by these icons on TikTok?"*

**Solution**: A visual preview tool that simulates TikTok's mobile interface, allowing users to see exactly where UI elements will appear and adjust text accordingly.

## 🚀 Quick Start

### Option 1: Run Preview Tool Only
```bash
# Install dependencies (first time only)
yarn install

# Start the preview tool
yarn preview
```
**Access at**: http://localhost:3001

### Option 2: Run Both API and Preview Tool
```bash
# Start both services with PM2
yarn start:all
```
- **API Server**: http://localhost:3000  
- **Preview Tool**: http://localhost:3001

### Option 3: Individual Services
```bash
# Just the API server
yarn start

# Just the preview tool  
yarn preview

# Development mode with auto-reload
yarn dev              # API with nodemon
yarn preview:dev       # Preview with nodemon
```

## 📁 Project Structure

```
tiktok-image-text-overlay-node-canvas/
├── 📄 server.js                    # Main API server
├── 📄 text-overlay.js              # Core text overlay logic
├── 📄 serve-preview.js             # Preview tool server
├── 📄 package.json                 # Dependencies & scripts
├── 📄 ecosystem.config.js          # PM2 configuration
├── 📁 public/
│   └── 📄 index.html               # Preview tool (standalone)
├── 📁 Playfair_Display/            # Custom fonts
├── 📄 README.md                    # API documentation
├── 📄 PREVIEW_TOOL_README.md       # Preview tool docs
└── 📄 PROJECT_SUMMARY.md           # This file
```

## 🎯 Preview Tool Features

### ✅ Interactive Controls
- **Font Size**: 12px - 48px slider with real-time preview
- **Line Height**: 1.0 - 2.0 with 0.1 precision
- **Position**: Top, Center, Bottom placement options
- **Text Input**: Live text editing with `\n` line break support

### ✅ TikTok UI Simulation
- **Accurate Mobile Layout**: 9:16 aspect ratio (375x667)
- **Right-Side Icons**: Profile, like, comment, share, music buttons
- **Safe Text Zone**: Automatic avoidance of UI element overlap
- **Visual Feedback**: See exactly where text conflicts occur

### ✅ Image Upload Support
- **Drag & Drop**: Easy image upload interface
- **Multiple Formats**: JPEG, PNG, WebP support
- **Real Background Testing**: Preview on actual images

### ✅ Export & Integration
- **One-Click Copy**: Export fontSize, lineHeight, position values
- **API Compatible**: Values work directly with main API
- **Production Ready**: Seamless workflow integration

## 🔄 Workflow Integration

### Step 1: Design Phase (Preview Tool)
1. Open preview tool: http://localhost:3001
2. Upload target image or use placeholder
3. Enter caption text (use `\n` for line breaks)
4. Adjust font size until text fits in safe zone
5. Fine-tune line height for optimal readability  
6. Choose position (top/center/bottom)
7. Copy export values

### Step 2: Production Phase (API)
```bash
# Use exported values in API call
curl -X POST http://localhost:3000/api/text-overlay \
  -F "avatar=@image.jpg" \
  -F "text=Your caption text" \
  -F "fontSize=24" \
  -F "lineHeight=1.2" \
  -F "position=center"
```

## 🛠️ PM2 Deployment Commands

```bash
# Start all services
pm2 start ecosystem.config.js
# or 
yarn start:all

# View running processes
pm2 list

# View logs
pm2 logs
# or
yarn logs

# Stop all services  
pm2 stop ecosystem.config.js
# or
yarn stop:all

# Restart all services
pm2 restart ecosystem.config.js  
# or
yarn restart:all

# Production deployment (existing setup)
pm2 start ecosystem.config.js --env production
```

## 📊 Service Ports

| Service | Port | URL |
|---------|------|-----|
| **TikTok Text Overlay API** | 3000 | http://localhost:3000 |
| **TikTok Preview Tool** | 3001 | http://localhost:3001 |

## 🎨 Preview Tool Usage Example

### Input:
```
Text: "I've been a sleep doctor for a decade.\nThese are the best dr*g-free things you\ncan use to fall asleep faster"
Font Size: 24px (slider)
Line Height: 1.2 (slider)  
Position: Center (button)
```

### Output:
```
fontSize: 24px
lineHeight: 1.2
position: center
```

### Visual Result:
- Text appears in TikTok mobile simulation
- White bubble backgrounds on each line
- Proper spacing avoids right-side UI icons
- Real-time updates as you adjust settings

## 🎯 Key Benefits

### For Developers:
✅ **Visual Feedback**: See text conflicts before processing  
✅ **Time Saving**: No need to process images to test layouts  
✅ **Client-Side**: Fast, responsive, no server calls needed  
✅ **Production Integration**: Export values work directly with API  

### For Content Creators:
✅ **No Technical Knowledge**: Visual, intuitive interface  
✅ **Real-Time Preview**: Instant feedback on changes  
✅ **Conflict Prevention**: Visual safe zones prevent UI overlap  
✅ **Professional Results**: TikTok-accurate styling  

### For Client Requirements:
✅ **Problem Solved**: Text no longer overlaps TikTok icons  
✅ **Visual Validation**: See exactly how text will appear  
✅ **Easy Deployment**: Runs alongside existing PM2 setup  
✅ **Minimal Changes**: Uses existing API infrastructure  

## 🔧 Technical Details

### Text Processing
Both tools use identical text splitting logic:
```javascript
// Convert escaped newlines to actual newlines
const processedText = text.replace(/\\n/g, '\n');
return processedText.split('\n').filter(line => line.trim().length > 0);
```

### Positioning Algorithm  
Consistent positioning across preview and production:
- **Top**: 15% from container top
- **Center**: Vertically centered considering text height
- **Bottom**: 15% from container bottom

### Safe Zone Calculation
- **Text Area Width**: Container width - 80px (for right icons)
- **Icon Zone**: Fixed 80px from right edge
- **Visual Feedback**: Real-time conflict detection

## 🎉 Success Metrics

✅ **Client Problem Solved**: Text overlay conflicts eliminated  
✅ **Workflow Improved**: Visual design → Export → Production  
✅ **Time Saved**: No iteration cycles for text positioning  
✅ **Quality Increased**: Professional TikTok-style results  
✅ **Easy Deployment**: Seamless PM2 integration  
✅ **Zero Dependencies**: Client-side processing for speed  

---

## 🚀 Ready to Use!

The complete solution is now ready:
1. **Preview Tool** for design and testing
2. **Production API** for final image generation  
3. **PM2 Deployment** for easy management
4. **Seamless Integration** between both tools

**Start using**: `yarn start:all` and open http://localhost:3001
