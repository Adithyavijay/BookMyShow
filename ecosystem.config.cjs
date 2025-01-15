module.exports = {
    apps: [
      {
        name: "bookmyshow--client", // Process for building the client
        script: "npm",
        args: "run build-and-start-client",
        cwd: "/root/BookMyShow", // Root directory
        autorestart: false, // No need to restart the build process
      },
      {
        name: "bookmyshow--server", // Process for starting the server
        script: "npm",
        args: "start",
        cwd: "/root/BookMyShow", // Root directory
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  