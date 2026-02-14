const password = document.getElementById("password");
const toggle = document.getElementById("togglePassword");

document.getElementById("signupForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const passwordValue = password.value;
  
  const user = {
    name: name,
    email: email,
    password: passwordValue
  };

  localStorage.setItem("safeSpaceUser", JSON.stringify(user));
  
  const response = await fetch("http://localhost:8000/api", {
    method: "POST",
    body: JSON.stringify(user)
  });
  
  const userResponse = await response.json();
  console.log("response from user create:", userResponse);
  alert("Account created successfully ❤️");

  if (response.status === 201) {
    window.location.href = "Dashboard.html";
  }
});

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