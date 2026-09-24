/** PM2 — Next.js wedding site. Nginx proxies ducanhphamhuyen.love → :3001 */
module.exports = {
  apps: [
    {
      name: 'wedding-love',
      cwd: __dirname,
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: '3001',
      },
    },
  ],
};
