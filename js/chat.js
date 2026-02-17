let currentConversationId = null;
window.currentConversationId = null;

document.addEventListener("DOMContentLoaded", async () => {
  if (!localStorage.getItem("token")) {
    window.location.href = "../auth/login.html";
    return;
  }

  connectSocket();
  await loadProfile();
  await loadConversations();
  attachEventListeners();
});

/* =========================
   API HELPER
========================= */

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(API + endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
      ...options.headers
    }
  });

  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(result.error || "Request failed");
  }

  return result.data;
}

/* =========================
   PROFILE
========================= */

async function loadProfile() {
  try {
    const user = await apiRequest("/auth/profile");
    const profileInitial = document.getElementById("profileInitial");
    const userName = document.getElementById("userName");

    userName.textContent = user.email?.split("@")[0];
    profileInitial.textContent =
      user.email?.split("@")[0].charAt(0).toUpperCase() ?? "SP";
  } catch (err) {
    console.error(err.message);
  }
}

/* =========================
   CONVERSATIONS
========================= */

async function loadConversations() {
  try {
    const conversations = await apiRequest("/messages/my-conversations");

    if (!conversations.length) return;

    const firstConversation = conversations[0];
    switchConversation(firstConversation._id);

    updateInboxBadge(conversations);
  } catch (err) {
    console.error(err.message);
  }
}

function switchConversation(conversationId) {
  if (currentConversationId) {
    leaveConversationRoom(currentConversationId);
  }

  currentConversationId = conversationId;
  window.currentConversationId = conversationId;

  joinConversationRoom(conversationId);
  loadMessages(conversationId);
}

/* =========================
   MESSAGES
========================= */

async function loadMessages(conversationId) {
  const messagesArea = document.getElementById("messagesArea");
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API}/messages/conversations/${conversationId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      messagesArea.innerHTML = `<p>Failed to load messages</p>`;
      return;
    }

    const { messages } = result.data; // ← extract messages from backend response

    messagesArea.innerHTML = ""; // clear old messages

    messages.forEach(msg => addMessageToUI(msg)); // add all previous messages

    scrollToBottom();

  } catch (err) {
    console.error(err);
    messagesArea.innerHTML = `<p>Error loading messages</p>`;
  }
}


async function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text) return;

  try {
    const result = await apiRequest("/messages", {
      method: "POST",
      body: JSON.stringify({ message: text })
    });

    const { conversationId, message } = result;

    if (!currentConversationId) {
      switchConversation(conversationId);
    }

    addMessageToUI(message);
    input.value = "";
    scrollToBottom();
  } catch (err) {
    alert(err.message);
  }
}

function addMessageToUI(message) {
  const messagesArea = document.getElementById("messagesArea");
  const div = document.createElement("div");

  const isUser = message.sender === "user";

  div.className = `message ${isUser ? "user-message" : "admin-message"}`;

  div.innerHTML = `
    <p>${escapeHtml(message.content)}</p>
    <span>${new Date(message.createdAt).toLocaleTimeString()}</span>
  `;

  messagesArea.appendChild(div);
}

/* =========================
   READ STATUS
========================= */

async function markConversationAsRead(conversationId) {
  try {
    await apiRequest(`/messages/${conversationId}/read`, {
      method: "PATCH"
    });
  } catch (err) {
    console.error(err.message);
  }
}

/* =========================
   BADGE
========================= */

function updateInboxBadge(conversations) {
  const totalUnread = conversations.reduce(
    (sum, c) => sum + (c.unreadCount || 0),
    0
  );

  const badge = document.getElementById("inboxBadge");

  if (totalUnread > 0) {
    badge.textContent = totalUnread;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}

function incrementInboxBadge() {
  const badge = document.getElementById("inboxBadge");
  const current = parseInt(badge.textContent || "0", 10);
  badge.textContent = current + 1;
  badge.classList.remove("hidden");
}

/* =========================
   UTILITIES
========================= */

function attachEventListeners() {
  document
    .getElementById("sendBtn")
    .addEventListener("click", sendMessage);

  document
    .getElementById("messageInput")
    .addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });
}

function scrollToBottom() {
  const area = document.getElementById("messagesArea");
  area.scrollTop = area.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
