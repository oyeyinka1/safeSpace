// Track current step
let currentStep = 1;
let userEmail = "";

// Initialize OTP input navigation
window.addEventListener("DOMContentLoaded", () => {
  setupOTPInputs();
  setupPasswordValidation();
});

// Setup OTP Input auto-focus
function setupOTPInputs() {
  const otpInputs = document.querySelectorAll(".otp-input");

  otpInputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      if (e.target.value.length === 1) {
        if (index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && e.target.value === "") {
        if (index > 0) {
          otpInputs[index - 1].focus();
        }
      }
    });
  });
}

// Setup Password Validation
function setupPasswordValidation() {
  const newPasswordInput = document.getElementById("newPassword");

  if (newPasswordInput) {
    newPasswordInput.addEventListener("input", validatePassword);
  }
}

// Validate Password Requirements
function validatePassword() {
  const password = document.getElementById("newPassword").value;

  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  updateCheckIcon("check-length", checks.length);
  updateCheckIcon("check-upper", checks.upper);
  updateCheckIcon("check-lower", checks.lower);
  updateCheckIcon("check-number", checks.number);
  updateCheckIcon("check-special", checks.special);

  return Object.values(checks).every((check) => check);
}

// Update Check Icon
function updateCheckIcon(id, isValid) {
  const icon = document.getElementById(id);
  const listItem = icon.parentElement;

  if (isValid) {
    icon.classList.add("valid");
    icon.textContent = "✓";
    listItem.classList.add("valid");
  } else {
    icon.classList.remove("valid");
    icon.textContent = "✓";
    listItem.classList.remove("valid");
  }
}

// Toggle Password Visibility
document.addEventListener("DOMContentLoaded", () => {
  const togglePassword1 = document.getElementById("togglePassword1");
  const togglePassword2 = document.getElementById("togglePassword2");

  if (togglePassword1) {
    togglePassword1.addEventListener("click", () => {
      togglePasswordVisibility("newPassword", togglePassword1);
    });
  }

  if (togglePassword2) {
    togglePassword2.addEventListener("click", () => {
      togglePasswordVisibility("confirmPassword", togglePassword2);
    });
  }
});

function togglePasswordVisibility(inputId, icon) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

// Navigate to specific step
function goToStep(step) {
  const steps = document.querySelectorAll(".form-step");
  steps.forEach((s) => s.classList.remove("active"));

  const targetStep = document.getElementById(`step${step}`);
  if (targetStep) {
    targetStep.classList.add("active");
    currentStep = step;
  }
}

// Step 1: Send Reset Code
function sendResetCode(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;

  // Validate email
  if (!email || !isValidEmail(email)) {
    showAlert("Please enter a valid email address", "error");
    return;
  }

  userEmail = email;

  // Here you would typically make an API call to send the reset code
  console.log("Sending reset code to:", email);

  // Simulate API call
  showAlert("Reset code sent to your email!", "success");

  // Move to step 2
  setTimeout(() => {
    goToStep(2);
  }, 1500);
}

// Step 2: Verify Code
function verifyCode(event) {
  event.preventDefault();

  const otpInputs = document.querySelectorAll(".otp-input");
  const code = Array.from(otpInputs).map((input) => input.value).join("");

  if (code.length !== 6) {
    showAlert("Please enter the complete 6-digit code", "error");
    return;
  }

  console.log("Verifying code:", code);

  // Simulate API call
  showAlert("Code verified successfully!", "success");

  // Move to step 3
  setTimeout(() => {
    goToStep(3);
  }, 1500);
}

// Step 3: Reset Password
function resetPassword(event) {
  event.preventDefault();

  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validate passwords
  if (!newPassword || !confirmPassword) {
    showAlert("Please fill in all password fields", "error");
    return;
  }

  if (newPassword !== confirmPassword) {
    showAlert("Passwords do not match", "error");
    return;
  }

  if (!validatePassword()) {
    showAlert("Password does not meet all requirements", "error");
    return;
  }

  console.log("Resetting password for:", userEmail);

  // Simulate API call
  showAlert("Password reset successfully!", "success");

  // Move to step 4
  setTimeout(() => {
    goToStep(4);
  }, 1500);
}

// Resend Code
function resendCode(event) {
  event.preventDefault();

  console.log("Resending code to:", userEmail);

  // Clear previous OTP inputs
  const otpInputs = document.querySelectorAll(".otp-input");
  otpInputs.forEach((input) => (input.value = ""));

  // Focus first input
  if (otpInputs.length > 0) {
    otpInputs[0].focus();
  }

  showAlert("New code sent to your email!", "success");
}

// Validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Show Alert Messages
function showAlert(message, type = "success") {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.textContent = message;

  // Add styles
  alert.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 1000;
    animation: slideInRight 0.3s ease-out;
    ${
      type === "success"
        ? "background: #4caf50; color: white;"
        : "background: #f44336; color: white;"
    }
  `;

  document.body.appendChild(alert);

  // Remove after 3 seconds
  setTimeout(() => {
    alert.style.animation = "slideOutRight 0.3s ease-out";
    setTimeout(() => alert.remove(), 300);
  }, 3000);
}

// Add animation styles
const style = document.createElement("style");
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
