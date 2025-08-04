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
};
