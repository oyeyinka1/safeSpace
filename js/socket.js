// socket.js

let socket = null;

function connectSocket() {
  const token = localStorage.getItem("token");
  if (!token) return;

  socket = io("https://safespace-api-39qb.onrender.com", {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket auth error:", err.message);
  });

  socket.on("admin-reply", ({ message }) => {
    handleIncomingAdminReply(message);
  });
}

function joinConversationRoom(conversationId) {
  if (!socket) return;
  socket.emit("join-conversation", conversationId);
}

function leaveConversationRoom(conversationId) {
  if (!socket) return;
  socket.emit("leave-conversation", conversationId);
}

function handleIncomingAdminReply(message) {
  if (message.conversationId === window.currentConversationId) {
    addMessageToUI(message);
    markConversationAsRead(window.currentConversationId);
  } else {
    incrementInboxBadge();
  }
}
