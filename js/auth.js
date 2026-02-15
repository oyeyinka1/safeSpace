const toggle = document.getElementById("togglePassword");


const API = "http://localhost:5000";

function parseJwt(token) {
  return JSON.parse(atob(token.split('.')[1]));
}

function protectRoute(requiredRole) {
  const token = localStorage.getItem("token");
  if (!token) window.location.href = "/login.html";

  const payload = parseJwt(token);

  if (payload.role !== requiredRole) {
    window.location.href = "/login.html";
  }
}

async function login() {
  const role = document.getElementById("role").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const endpoint =
    role === "admin"
      ? "/auth/admin/login"
      : "/auth/user/login";

  const res = await fetch(API + endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

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
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("token", data.data.token);
    window.location.href = "/user/dashboard.html";
  } else {
    alert(data.error);
  }
}



toggle.addEventListener("click", function(e) {
  e.preventDefault();
  
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