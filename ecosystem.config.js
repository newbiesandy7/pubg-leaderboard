module.exports = {
  apps: [
    {
      name: 'pubg-leaderboard',
      script: 'npx',
      args: 'serve -s build -l 3000',
      env: {
        NODE_ENV: 'production'
      },
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
