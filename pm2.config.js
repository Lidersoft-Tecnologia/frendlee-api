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
        PUBLISHABLE_KEY:"pk_test_5ozzXcwRmPpfh1nhCEsgBpFl00d042bAHN",
        SECRET_KEY: "",
        CLOUDINARY_API_KEY: "",
        CLOUDINARY_API_SECRET: "",
        CLOUDINARY_CLOUD_NAME:"frendlee",
        CACHE_VIEWS:false,
        SMTP_HOST:"smtp-relay.sendinblue.com",
        SMTP_PORT:587,
        SMTP_USERNAME:"csfrendlee@gmail.com",
        SMTP_PASSWORD:"",
        PG_HOST:"frendlee-do-user-4403983-0.b.db.ondigitalocean.com",
        PG_PORT:25060,
        PG_USER:"doadmin",
        PG_PASSWORD:"2jJzKlBQpI7Iphjm",
        PG_DB_NAME:"defaultdb",
    }
  };
  