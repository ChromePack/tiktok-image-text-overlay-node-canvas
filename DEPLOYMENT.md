# Deployment Guide for TikTok Text Overlay API

## Render Deployment

This application has been configured to deploy successfully on Render using Docker. The deployment includes all necessary system dependencies for the `canvas` package.

### Files Added for Deployment

1. **Dockerfile** - Contains the Docker configuration with all required system dependencies
2. **.dockerignore** - Excludes unnecessary files from the Docker build
3. **render.yaml** - Render-specific deployment configuration
4. **package.json** - Updated with Node.js engine requirements

### Deployment Steps

1. **Push to Git Repository**

   ```bash
   git add .
   git commit -m "Add Docker configuration for Render deployment"
   git push origin main
   ```

2. **Deploy on Render**

   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your Git repository
   - Configure the service:
     - **Name**: tiktok-text-overlay-api
     - **Environment**: Docker
     - **Region**: Choose your preferred region
     - **Branch**: main
     - **Root Directory**: Leave empty (root)
   - Click "Create Web Service"

3. **Environment Variables** (Optional)
   - `NODE_ENV`: production
   - `ALLOWED_ORIGINS`: Your frontend domain(s) separated by commas

### What the Dockerfile Does

The Dockerfile installs all necessary system dependencies for the `canvas` package:

- **Cairo**: Graphics library
- **JPEG libraries**: Image processing
- **Pango**: Text layout and rendering
- **Build tools**: Required for native module compilation

### Troubleshooting

If you encounter any issues:

1. **Check Render logs** in the dashboard
2. **Verify Docker build** by testing locally:

   ```bash
   docker build -t tiktok-text-overlay-api .
   docker run -p 3000:3000 tiktok-text-overlay-api
   ```

3. **Common issues**:
   - Memory limits: Consider upgrading to a higher plan if processing large images
   - Timeout issues: The free tier has limitations on request duration

### Local Testing

To test the Docker configuration locally:

```bash
# Build the image
docker build -t tiktok-text-overlay-api .

# Run the container
docker run -p 3000:3000 tiktok-text-overlay-api

# Test the API
curl http://localhost:3000/health
```

The application should now deploy successfully on Render without the `libjpeg.so.8` error!
