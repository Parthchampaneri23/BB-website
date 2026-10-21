module.exports = {
    apps: [
        {
            name: "BB-website",
            cwd: "/var/www/rndprojects/BB-website",
            script: "npm",
            args: "start",
            env: {
                NODE_ENV: "production",
                PORT: 4035,
                HOSTNAME: "127.0.0.1"
            },
            autorestart: true,
            watch: false,
            max_memory_restart: "1G",
            restart_delay: 5000
        }
    ]
};