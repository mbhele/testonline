// socket.js

let io;

module.exports = {
  init: (server) => {
    io = require('socket.io')(server);
    return io;
  },
  getIO: () => {
    return io; // Don't throw an error; just return 'io', which will be 'null' if not initialized
  },
};
