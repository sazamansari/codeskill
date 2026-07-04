module.exports = {
  apps: [
    {
      name: "codeskill-backend",
      script: "npm",
      args: "start",
      cwd: "./backend",
      env: {
        NODE_ENV: "production",
      }
    },
    {
      name: "codeskill-frontend",
      script: "npm",
      args: "start",
      cwd: "./frontend-v2",
      env: {
        NODE_ENV: "production",
      }
    }
  ]
};
