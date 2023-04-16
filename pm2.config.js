module.exports = {
    name: 'FL',
    script: './build/server.js', // Path to your compiled JavaScript file
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '2G',
    env: {
        NODE_ENV: 'production',
        PORT:3333,
        HOST:"0.0.0.0",
        NODE_ENV:"production",
        APP_KEY:"93s4wM-yAMQ8_tTHX9xZPTRidTqMO1zb",
        DRIVE_DISK:"local",
        DB_CONNECTION:"pg",
    }
  };
  