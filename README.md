# TikTok Text Overlay API

## Overview

This is an Express.js backend API for creating TikTok-style text overlays using Node-Canvas. The API accepts an avatar image and text as input, then returns a processed image with TikTok-style white bubble text overlays.

## Features

- ✅ **RESTful API** with Express.js backend
- ✅ **TikTok-style text overlays** with white bubble backgrounds
- ✅ **Multiple positioning options** (top, center, bottom)
- ✅ **Automatic text wrapping** with balanced line layout
- ✅ **File upload handling** with validation
- ✅ **Real-time text preview** functionality
- ✅ **Configuration management** via API endpoints
- ✅ **9:16 aspect ratio** optimized for TikTok
- ✅ **Clean code principles** with comprehensive error handling
- ✅ **Web interface** for easy usage

## Quick Start

### 1. Install Dependencies

```bash
yarn install
```

### 2. Start the Server

```bash
# Development mode with auto-reload
yarn dev

# Production mode
yarn start
```

### 3. Access the Web Interface

Open your browser and navigate to:

```
http://localhost:3000
```

## API Endpoints

### Health Check

```http
GET /health
```

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "TikTok Text Overlay API",
  "version": "1.0.0"
}
```

### Text Overlay Processing

```http
POST /api/text-overlay
Content-Type: multipart/form-data
```

**Request Body:**

- `avatar` (file): Image file (JPEG, PNG, WebP)
- `text` (string): Text content for overlay
- `position` (string, optional): "top", "center", or "bottom" (default: "bottom")
- `fontSize` (number, optional): Font size in pixels

**Response:**

```json
{
  "success": true,
  "message": "Text overlay processed successfully",
  "data": {
    "imageBase64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    "originalImage": "avatar.jpg",
    "text": "Your text content",
    "position": "bottom",
    "fontSize": 65,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Configuration Management

```http
POST /api/configure
Content-Type: application/json
```

**Request Body:**

```json
{
  "fontSize": 60,
  "position": "bottom",
  "fontFamily": "Playfair Display",
  "fontWeight": "normal",
  "textColor": "#131313",
  "bubbleColor": "#FFFFFF"
}
```

### Text Preview

```http
POST /api/preview-text
Content-Type: application/json
```

**Request Body:**

```json
{
  "text": "Your text content here",
  "options": {
    "targetWordsPerLine": 3.5,
    "maxWordsPerLine": 5,
    "minWordsPerLine": 2
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Text preview generated successfully",
  "data": {
    "originalText": "Your text content here",
    "balancedLines": ["Line 1", "Line 2", "Line 3"],
    "lineCount": 3,
    "preview": [
      {
        "lineNumber": 1,
        "text": "Line 1",
        "wordCount": 2,
        "characterCount": 6
      }
    ]
  }
}
```

## Usage Examples

### Using cURL

```bash
# Process an image with text overlay
curl -X POST http://localhost:3000/api/text-overlay \
  -F "avatar=@path/to/your/image.jpg" \
  -F "text=Your TikTok caption text here" \
  -F "position=bottom" \
  -F "fontSize=60"
```

### Using JavaScript/Fetch

```javascript
const formData = new FormData();
formData.append("avatar", fileInput.files[0]);
formData.append("text", "Your TikTok caption text here");
formData.append("position", "bottom");
formData.append("fontSize", "60");

fetch("http://localhost:3000/api/text-overlay", {
  method: "POST",
  body: formData,
})
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
      console.log(
        "Generated base64 image length:",
        data.data.imageBase64.length
      );
      // Use the base64 image directly
      const img = document.createElement("img");
      img.src = `data:image/png;base64,${data.data.imageBase64}`;
      document.body.appendChild(img);
    }
  })
  .catch((error) => console.error("Error:", error));
```

### Using Python/Requests

```python
import requests

url = 'http://localhost:3000/api/text-overlay'
files = {'avatar': open('path/to/image.jpg', 'rb')}
data = {
    'text': 'Your TikTok caption text here',
    'position': 'bottom',
    'fontSize': '60'
}

response = requests.post(url, files=files, data=data)
result = response.json()

if result['success']:
    print('Generated base64 image length:', len(result['data']['imageBase64']))
# Use the base64 image directly
with open('output.png', 'wb') as f:
    import base64
    f.write(base64.b64decode(result['data']['imageBase64']))
```

## Configuration Options

| Option          | Default            | Description                        |
| --------------- | ------------------ | ---------------------------------- |
| `width`         | 1024               | Canvas width (9:16 aspect ratio)   |
| `height`        | 1536               | Canvas height                      |
| `fontSize`      | 65                 | Text size in pixels                |
| `fontFamily`    | "Playfair Display" | Font family                        |
| `fontWeight`    | "normal"           | Font weight                        |
| `textColor`     | "#131313"          | Text color                         |
| `bubbleColor`   | "#FFFFFF"          | Background bubble color            |
| `bubbleOpacity` | 1                  | Background opacity                 |
| `bubblePadding` | 20                 | Padding around text                |
| `bubbleRadius`  | 25                 | Corner radius                      |
| `position`      | "bottom"           | Text position (top/center/bottom)  |
| `maxWidth`      | 900                | Maximum text width before wrapping |

## Error Handling

The API includes comprehensive error handling:

### File Upload Errors

- **File too large**: Maximum 10MB
- **Invalid file type**: Only JPEG, PNG, WebP allowed
- **Missing file**: Avatar image required

### Processing Errors

- **Invalid text**: Text content required
- **Image processing**: Canvas creation errors
- **File system**: Read/write permission errors

### Error Response Format

```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Project Structure

```
tiktok-text-overlay-api/
├── server.js                 # Main Express server
├── text-overlay.js           # Core text overlay logic
├── package.json              # Dependencies and scripts
├── README.md                 # This documentation
├── public/
│   └── index.html           # Web interface
├── temp/                   # Temporary processing files (auto-cleaned)
├── outputs/                 # Generated images
└── Playfair_Display/        # Custom fonts
    ├── PlayfairDisplay-VariableFont_wght.ttf
    └── static/
        └── PlayfairDisplay-Regular.ttf
```

## Development

### Environment Variables

```bash
PORT=3000                    # Server port (default: 3000)
NODE_ENV=development         # Environment mode
ALLOWED_ORIGINS=*           # CORS origins
```

### Scripts

```bash
yarn start      # Start production server
yarn dev        # Start development server with nodemon

```

### File Cleanup

The API automatically manages file cleanup:

- Uploaded files are processed and can be cleaned up
- Generated images are served statically
- Temporary files are handled appropriately

## Performance

- **Processing Time**: ~100-200ms per image
- **Memory Usage**: Efficient canvas operations
- **File Size**: Optimized PNG output
- **Concurrent Requests**: Handles multiple simultaneous requests
- **File Size Limit**: 10MB per upload

## Security Features

- **Input Validation**: File type and size validation
- **CORS Configuration**: Configurable cross-origin requests
- **Helmet Security**: HTTP headers security
- **File Upload Limits**: Size and type restrictions
- **Error Sanitization**: Safe error messages in production

## Integration Examples

### Frontend Integration

```javascript
// React component example
const TextOverlayComponent = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("text", text);

    const response = await fetch("/api/text-overlay", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      setResult(data.data);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleSubmit}>Generate Overlay</button>
      {result && (
        <img
          src={`data:image/png;base64,${result.imageBase64}`}
          alt="Generated overlay"
        />
      )}
    </div>
  );
};
```

### Backend Integration

```javascript
// Node.js integration example
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function processImage(imagePath, text) {
  const formData = new FormData();
  formData.append("avatar", fs.createReadStream(imagePath));
  formData.append("text", text);
  formData.append("position", "bottom");

  const response = await axios.post(
    "http://localhost:3000/api/text-overlay",
    formData,
    {
      headers: formData.getHeaders(),
    }
  );

  return response.data;
}

// Example of saving base64 to file
function saveBase64ToFile(base64Data, outputPath) {
  const buffer = Buffer.from(base64Data, "base64");
  fs.writeFileSync(outputPath, buffer);
  console.log(`Image saved to: ${outputPath}`);
}
```

## Troubleshooting

### Common Issues

1. **Canvas not found**: Install canvas dependencies

   ```bash
   yarn add canvas
   ```

2. **Font loading errors**: Ensure Playfair Display fonts are in the correct directory

3. **Port already in use**: Change PORT environment variable

   ```bash
   PORT=3001 yarn start
   ```

4. **File upload fails**: Check file size and type restrictions

### Debug Mode

Enable debug logging:

```bash
DEBUG=* yarn dev
```

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review the error responses
3. Use the web interface to try it out
4. Check server logs for detailed error information
