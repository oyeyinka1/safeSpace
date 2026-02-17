document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("togglePassword");
  const registerForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      register();
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      login();
    });
  }

  if (toggle) {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      const password = document.getElementById("password");
      if (!password) return;

      if (password.type === "password") {
        password.type = "text";
        toggle.classList.remove("fa-eye");
        toggle.classList.add("fa-eye-slash");
      } else {
        password.type = "password";
        toggle.classList.remove("fa-eye-slash");
        toggle.classList.add("fa-eye");
      }
    });
  }
});

const API = "https://safespace-api-39qb.onrender.com/api";

function parseJwt(token) {
  return JSON.parse(atob(token.split(".")[1]));
}

function protectRoute(requiredRole) {
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "./auth/login.html";

  const payload = parseJwt(token);

  if (payload.role !== requiredRole) {
    window.location.href = "./auth/login.html";
  }
}

async function login() {
  const role = document.getElementById("role").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const endpoint = role === "admin" ? "/auth/admin/login" : "/auth/user/login";

  const res = await fetch(API + endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  console.log("response from user login:", data);

  if (data.success) {
    localStorage.setItem("token", data.data.token);

    const payload = parseJwt(data.data.token);

    if (payload.role === "admin") {
      window.location.href = "/admin/dashboard.html";
    } else {
      window.location.href = "/user/dashboard.html";
    }
  } else {
    alert(data.error);
  }
}

async function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API + "/auth/user/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  console.log("response from server:", data);

  if (data.success) {
    localStorage.setItem("token", data.data.token);
    window.location.href = "/user/dashboard.html";
  } else {
    alert(data.error);
  }
}
