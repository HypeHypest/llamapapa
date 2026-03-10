module.exports = {
    apps: [
        {
            name: 'llamapapa',
            script: 'index.js',
            cwd: __dirname,
            env_file: '.env',
            watch: false,
            autorestart: true,
            max_restarts: 10,
            restart_delay: 3000,
        },
    ],
};
