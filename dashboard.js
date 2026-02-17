// Affirmations array - using "I" statements
const affirmations = [
  "I am not defined by my past. God's grace is making all things new in me — even now, even here.",
  "I have survived 100% of my worst days. I am stronger than I know.",
  "I deserve peace, healing, and love. I deserve to be here.",
  "Every day is a new opportunity for me to choose myself and my healing.",
  "My worth is not determined by what others think. I am enough, exactly as I am.",
  "I am allowed to take up space. My voice matters.",
  "My healing is not linear, and that's okay. I'm doing better than I think.",
  "I am brave for facing my pain. My strength is real.",
  "I will be gentle with myself. I'm doing the best I can.",
  "My feelings are valid. My pain is real, and so is my strength.",
  "I am worthy of love, even when I don't feel like it.",
  "This moment is temporary. I will get through this.",
  "I am capable of change and growth.",
  "I choose to believe in myself today.",
  "I am healing, one day at a time.",
];

const storageKeys = {
  profileImage: "safeSpace_profileImage",
  messages: "safeSpace_messages",
  inboxMessages: "safeSpace_inboxMessages",
};

function parseJwt(token) {
  return JSON.parse(atob(token.split(".")[1]));
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  // loadProfile();
  loadAffirmation();
  // loadMessages();
  // updateInboxBadge();
  attachEventListeners();
  scrollToBottom();
});

// Profile Image Management
function attachEventListeners() {
  // Profile dropdown
  const profileBtn = document.getElementById("profileBtn");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const changePhotoBtn = document.getElementById("changePhotoBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const photoInput = document.getElementById("photoInput");

  profileBtn.addEventListener("click", () => {
    dropdownMenu.classList.toggle("active");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".profile-menu")) {
      dropdownMenu.classList.remove("active");
    }
  });

  // changePhotoBtn.addEventListener("click", () => {
  //   photoInput.click();
  //   dropdownMenu.classList.remove("active");
  // });

  // photoInput.addEventListener("change", handlePhotoUpload);

  logoutBtn.addEventListener("click", () => {
    alert("Logout functionality would redirect to login page.");
    dropdownMenu.classList.remove("active");
  });

  // Inbox functionality
  const inboxBtn = document.getElementById("inboxBtn");
  const inboxModal = document.getElementById("inboxModal");
  const closeInboxBtn = document.getElementById("closeInboxBtn");

  inboxBtn.addEventListener("click", openInbox);
  closeInboxBtn.addEventListener("click", closeInbox);

  // Close inbox when clicking outside modal
  inboxModal.addEventListener("click", (e) => {
    if (e.target === inboxModal) {
      closeInbox();
    }
  });

  // Chat functionality
  // const messageInput = document.getElementById("messageInput");
  // const sendBtn = document.getElementById("sendBtn");

  // sendBtn.addEventListener("click", sendMessage);
  // messageInput.addEventListener("keypress", (e) => {
  //   if (e.key === "Enter") {
  //     sendMessage();
  //   }
  // });
}

// function handlePhotoUpload(e) {
//     const file = e.target.files[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.onload = (event) => {
//             const imageData = event.target.result;
//             localStorage.setItem(storageKeys.profileImage, imageData);
//             displayProfileImage(imageData);
//         };
//         reader.readAsDataURL(file);
//     }
// }

let profileData = {};

function getAuthToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("no token provided");
    window.location.href = "./auth/login.html";
  }

  return token ?? null;
}

// async function loadProfile() {

//   const profileInitial = document.getElementById("profileInitial");
//   const token = getAuthToken();

//   const res = await fetch(API + "/auth/profile", {
//     headers: { authorization: `Bearer ${token}` }
//   });

//   const result = await res.json();

//   if (!res.ok || !result.success) {
//     console.error(result.error);
//     return;
//   }

//   const user = result.data;

//   profileData = user;

//   profileInitial.textContent =
//     user.name?.split(" ")[0]?.charAt(0) ?? "S";
// }


// function displayProfileImage(imageData) {
//   const profileImage = document.getElementById("profileImage");
//   const profileInitial = document.getElementById("profileInitial");

//   profileImage.src = imageData;
//   profileImage.classList.add("active");
//   profileInitial.classList.add("hidden");
// }

// Affirmation Management - Changes daily based on day of year
function loadAffirmation() {
  const affirmation = getAffirmationForToday();
  document.getElementById("affirmationText").textContent = `"${affirmation}"`;
}

function getAffirmationForToday() {
  // Get day of the year (0-364)
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today - startOfYear) / 86400000); // milliseconds in a day

  // Use day number to select affirmation
  const index = dayOfYear % affirmations.length;
  return affirmations[index];
}

// Inbox Management
function openInbox() {
  const inboxModal = document.getElementById("inboxModal");
  inboxModal.classList.add("active");
  loadInboxMessages();
}

function closeInbox() {
  const inboxModal = document.getElementById("inboxModal");
  inboxModal.classList.remove("active");
}

// async function loadConversations() {
//   const token = getAuthToken();

//   const res = await fetch(API + "/messages/my-conversations", {
//     headers: { authorization: `Bearer ${token}` }
//   });

//   const result = await res.json();

//   if (!res.ok || !result.success) return;

//   const conversations = result.data;

//   if (conversations.length > 0) {
//     currentConversationId = conversations[0]._id;
//     loadMessages(currentConversationId);
//   }
// }

// async function loadMessages(conversationId) {
//   const messagesArea = document.getElementById("messagesArea");
//   const token = getAuthToken();

//   const res = await fetch(
//     API + `/messages/${conversationId}`,
//     {
//       headers: { authorization: `Bearer ${token}` }
//     }
//   );

//   const result = await res.json();

//   if (!res.ok || !result.success) {
//     messagesArea.innerHTML = "Failed to load messages";
//     return;
//   }

//   const messages = result.data.messages;

//   messagesArea.innerHTML = "";
//   messages.forEach(addMessageToUI);

//   scrollToBottom();
// }


async function loadInboxMessages() {
  const inboxMessagesList = document.getElementById("inboxMessagesList");
  if (!inboxMessagesList) {
    console.error("Inbox container not found in DOM");
    return;
  }

  const token = getAuthToken();
  if (!token) return;

  try {
    const res = await fetch(API + `/messages/my-conversations`, {
      headers: { authorization: `Bearer ${token}` },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      inboxMessagesList.innerHTML = `
        <div class="inbox-empty">
          <div class="inbox-empty-icon">⚠️</div>
          <p>${result.error || "Failed to load messages"}</p>
        </div>
      `;
      return;
    }

    const inboxMessages = result.data || [];

    inboxMessagesList.innerHTML = "";

    if (inboxMessages.length === 0) {
      inboxMessagesList.innerHTML = `
        <div class="inbox-empty">
          <div class="inbox-empty-icon">📭</div>
          <p>No messages yet. Your admin will reach out soon.</p>
        </div>
      `;
      return;
    }

    // Display messages (newest first)
    inboxMessages
      .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
      .forEach((conv) => {
        const messageElement = document.createElement("div");
        messageElement.className = `inbox-message-item ${
          conv.unreadCount > 0 ? "" : "unread"
        }`;

        messageElement.innerHTML = `
          <div class="inbox-message-sender">🛡️ Safe Space Admin</div>
          <div class="inbox-message-time">${new Date(
            conv.lastMessageAt
          ).toLocaleDateString()}</div>
        `;

        inboxMessagesList.appendChild(messageElement);
      });

    updateInboxBadge();
  } catch (err) {
    console.error("Failed to load inbox messages:", err);
    inboxMessagesList.innerHTML = `
      <div class="inbox-empty">
        <div class="inbox-empty-icon">⚠️</div>
        <p>Error loading messages</p>
      </div>
    `;
  }
}



function saveInboxMessage(message) {
  const inboxMessages = JSON.parse(
    localStorage.getItem(storageKeys.inboxMessages) || "[]"
  );
  inboxMessages.push({
    ...message,
    isRead: false,
  });
  localStorage.setItem(
    storageKeys.inboxMessages,
    JSON.stringify(inboxMessages)
  );
  updateInboxBadge();
}

// function updateInboxBadge(conversations) {
//   const totalUnread = conversations.reduce(
//     (sum, conv) => sum + (conv.unreadCount || 0),
//     0
//   );

//   const badge = document.getElementById("inboxBadge");

//   if (totalUnread > 0) {
//     badge.textContent = totalUnread;
//     badge.classList.remove("hidden");
//   } else {
//     badge.classList.add("hidden");
//   }
// }


// async function sendMessage() {
//   const messageInput = document.getElementById("messageInput");
//   const messageText = messageInput.value.trim();
//   if (!messageText) return;

//   const token = getAuthToken();

//   const res = await fetch(API + "/messages", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       authorization: `Bearer ${token}`
//     },
//     body: JSON.stringify({ message: messageText })
//   });

//   const result = await res.json();

//   if (!res.ok || !result.success) {
//     alert(result.error);
//     return;
//   }

//   const { conversationId, message } = result.data;

//   currentConversationId = conversationId;
//   addMessageToUI(message);

//   messageInput.value = "";
//   scrollToBottom();
// }


// function addMessageToUI(message) {
//   const messagesArea = document.getElementById("messagesArea");
//   const messageElement = document.createElement("div");

//   const messageClass =
//     message.sender === "user" ? "user-message" : "admin-message";
//   messageElement.className = `message ${messageClass}`;

//   messageElement.innerHTML = `
//         <p class="message-text">${escapeHtml(message.content)}</p>
//         <span class="message-time">${new Date(
//           message.createdAt
//         ).toLocaleDateString()}</span>
//     `;

//   messagesArea.appendChild(messageElement);
//   scrollToBottom();
// }

function scrollToBottom() {
  const messagesArea = document.getElementById("messagesArea");
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

async function loadMessages() {
  const messagesArea = document.getElementById("messagesArea");

  const token = getAuthToken();
  const res = await fetch(API + `/messages/my-conversations`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const result = await res.json();
  console.log("conversations fetched:", result.data);

  if (!res.ok || !result.success) {
    messagesArea.innerHTML = "An error occured";
    throw new Error(result.error || "Request failed");
  }

  const data = result.data;

  messagesArea.innerHTML = "";
  data.forEach((msg) => addMessageToUI(msg));
}

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Utility function to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
