module.exports = {
  apps: [
    {
      name: "codeskill-backend",
      script: "node",
      args: "dist/main.js",
      cwd: "./backend-nestjs",
      instances: 1, // Single instance — child_process code execution conflicts with cluster mode
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 5001,
      },
      log_date_format: "YYYY-MM-DD HH:mm Z",
      error_file: "../logs/backend-error.log",
      out_file: "../logs/backend-out.log",
      merge_logs: true,
    },
    {
      name: "codeskill-frontend",
      script: "npm",
      args: "start",
      cwd: "./frontend-v2",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      log_date_format: "YYYY-MM-DD HH:mm Z",
      error_file: "../logs/frontend-error.log",
      out_file: "../logs/frontend-out.log",
      merge_logs: true,
    }
  ]
};
