module.exports = {
    apps: [
      {
        name: "client-build-start", // Process for building the client
        script: "npm",
        args: "run build-and-start-client",
        cwd: "/root/BookMyShow/client", // Root directory
        autorestart: false, // No need to restart the build process
      },
      {
        name: "server", // Process for starting the server
        script: "npm",
        args: "start-server",
        cwd: "/root/BookMyShow", // Root directory
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  