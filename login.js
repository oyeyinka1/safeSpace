const password = document.getElementById("password");
const toggle = document.getElementById("togglePassword");

document
  .getElementById("LoginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const passwordValue = password.value;

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: passwordValue,
        }),
      });

      if (response.status === 200) {
        const userData = await response.json();
        localStorage.setItem("safeSpaceUser", JSON.stringify(userData));
        alert("Login successful! ❤️");
        window.location.href = "Dashboard.html";
      } else {
        alert("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again.");
    }
  });

toggle.addEventListener("click", function (e) {
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
