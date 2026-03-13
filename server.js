const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer();
const io = socketIo(server);

const publicKeyRegistry = {};

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);

  socket.on("registerPublicKey", (data) => {
    const { username, publicKey } = data;
    publicKeyRegistry[username] = publicKey;
    console.log(`Registered public key for ${username}`);
    // Broadcast updated registry to all clients
    io.emit("publicKeyRegistry", publicKeyRegistry);
  });

  socket.on("message", (data) => {
    const { username, message } = data;
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
