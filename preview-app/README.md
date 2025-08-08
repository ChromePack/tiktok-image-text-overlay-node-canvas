# TikTok Text Overlay Preview Tool

A React-based preview tool for the TikTok Text Overlay API that provides real-time visualization of text overlays with TikTok UI safe zones.

## 🎯 Purpose

This preview tool solves the problem of not knowing how your text overlays will look in the actual TikTok app before making an API request. It shows:

- **Real-time preview** of text overlays with the exact same styling as your API
- **TikTok UI safe zones** to avoid text being hidden by app buttons (like, comment, share)
- **Live adjustment** of font size, line height, and positioning
- **100% accurate representation** of the final API output

## 🚀 Features

- **Exact API Matching**: Uses the same dimensions (1024x1536), fonts, and styling as your Node.js API
- **TikTok Safe Zones**: Visual indicators showing where TikTok UI elements appear
- **Real-time Controls**: 
  - Font size adjustment (30-120px)
  - Line height control (0.8-2.0)
  - Position presets (top, center, bottom)
  - Bubble radius customization
- **Image Upload**: Test with your actual background images
- **Responsive Design**: Works on desktop and mobile devices

## 🔧 Installation & Setup

1. **Install dependencies**:
   ```bash
   cd preview-app
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Open your browser**:
   ```
   http://localhost:3001
   ```
   (The app runs on port 3001 to avoid conflicts with your API on port 3000)

## 🎨 How to Use

1. **Upload a background image** using the file input
2. **Enter your text** in the textarea (use `\\n` for line breaks)
3. **Adjust settings** using the controls:
   - Font Size: Match your API's fontSize parameter
   - Line Height: Match your API's lineHeight parameter
   - Position: Choose top, center, or bottom placement
4. **Toggle safe zones** to see where TikTok UI elements appear
5. **Fine-tune** until your text doesn't overlap with red safe zones

## 🔍 TikTok UI Safe Zones

The red zones indicate where TikTok interface elements appear:

- **Top Zone (120px)**: Profile info, follow button
- **Bottom Zone (336px)**: Like, comment, share buttons, description text
- **Right Zone (154px)**: Action buttons (like, comment, share, profile)

Keep your text outside these zones for optimal visibility.

## ⚙️ Configuration Matching

The preview tool uses the exact same configuration as your API:

```javascript
{
  fontSize: 65,           // Default font size
  fontFamily: 'Proxima Nova', // Same font as API
  fontWeight: '600',      // Semibold weight
  textColor: '#131313',   // Dark gray text
  bubbleColor: '#FFFFFF', // White bubbles
  bubblePadding: 20,      // Inner padding
  bubbleRadius: 25,       // Rounded corners
  lineHeight: 1.2,        // Line spacing
  position: 'center'      // Default position
}
```

## 🎯 Perfect API Integration

Once you're happy with your preview:

1. Note the **font size** and **line height** values
2. Use the **same text** (with `\\n` line breaks)
3. Send these exact parameters to your API
4. The result will be **100% identical** to the preview

## 🛠️ Technical Details

- **Framework**: React 18
- **Canvas**: Konva.js for high-performance 2D rendering
- **Dimensions**: 1024x1536 (9:16 aspect ratio for TikTok)
- **Font**: Proxima Nova Semibold (fallback to Arial)
- **Responsive**: Scales down for smaller screens

## 🚀 Production Build

To build for production:

```bash
npm run build
```

The build folder will contain the optimized app ready for deployment.

## 📱 Mobile Support

The preview tool is fully responsive and works on mobile devices, making it easy to test your overlays on the go.

---

**Perfect for**: Content creators, developers, and agencies who need to ensure their TikTok text overlays are positioned correctly and won't be hidden by the app's interface elements.
