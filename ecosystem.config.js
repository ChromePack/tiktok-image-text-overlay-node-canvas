module.exports = {
  apps: [
    {
      name: "tiktok-text-overlay-api",
      script: "./server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        ALLOWED_ORIGINS: "*",
      },
      // Logging configuration
      log_file: "./logs/combined.log",
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      // Process management
      max_memory_restart: "200M",
      restart_delay: 4000,
      max_restarts: 10,

      // Watch mode for development (disabled in production)
      watch: false,
      ignore_watch: ["node_modules", "logs", "outputs", "temp"],

      // Environment variables
      env_file: ".env",
    },
  ],

  // PM2 Deploy Configuration
  deploy: {
    production: {
      user: "root",
      host: "148.230.93.128",
      ref: "origin/main",
      repo: "git@github.com:ChromePack/tiktok-image-text-overlay-node-canvas.git", // Update this with your actual repo
      path: "/var/www/tiktok-text-overlay-api",
      "pre-deploy-local": "echo 'This is a local executed command'",
      "post-deploy":
        "yarn install --production && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "echo 'This runs on the server before the setup process'",
    },
  },
};
