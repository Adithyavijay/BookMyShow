module.exports = {
    apps: [
      {
        name: "client-build", // Process for building the client
        script: "npm",
        args: "run build",
        cwd: "/root/BookMyShow/client", // Replace with your client's directory path
        autorestart: false, // No need to restart the build process
      },
      {
        name: "client-start", // Process for starting the client
        script: "npm",
        args: "start",
        cwd: "/root/BookMyShow/client", // Replace with your client's directory path
      },
    ],
  };
  