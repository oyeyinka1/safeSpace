let socket = null;

function connectSocket(namespace) {
  const token = localStorage.getItem("token");

  socket = io(`http://localhost:8000/${namespace}`, {
    auth: { token }
  });

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
}
