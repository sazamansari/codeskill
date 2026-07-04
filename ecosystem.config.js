module.exports = {
  apps: [
    {
      name: "codeskill-backend",
      script: "./backend/server.js",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
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
      instances: 1, // Next.js typically runs best in fork mode unless properly scaled
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
