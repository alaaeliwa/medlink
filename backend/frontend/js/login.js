document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#login-form");

  // Password Visibility Toggle
  document.querySelectorAll(".toggle-password").forEach((icon) => {
    icon.addEventListener("click", () => {
      const input = icon.previousElementSibling;
      if (input && input.tagName === "INPUT") {
        if (input.type === "password") {
          input.type = "text";
          icon.classList.replace("fa-eye", "fa-eye-slash");
        } else {
          input.type = "password";
          icon.classList.replace("fa-eye-slash", "fa-eye");
        }
      }
    });
  });

  // Form Submission with Automatic Role Detection
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Extract email to simulate role checking
      const emailInput = loginForm.querySelector('input[type="email"]');
      const email = emailInput ? emailInput.value.toLowerCase() : '';

      const submitBtn = loginForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        submitBtn.disabled = true;

        setTimeout(() => {
          // Determine role based on email input (Mocking Backend Response)
          // If the email contains 'pharmacy', treat it as a pharmacy account.
          let detectedRole = 'citizen';
          if (email.includes('pharmacy')) {
            detectedRole = 'pharmacy';
          }

          // Optional: Store the user details for future use across the app
          localStorage.setItem('medlink_user_role', detectedRole);
          localStorage.setItem('medlink_user_email', email);

          // Route to the appropriate dashboard
          const routes = {
            citizen: '../citizen/citizen-dashboard.html',
            pharmacy: '../pharmacy/pharmacy-dashboard.html',
          };

          window.location.href = routes[detectedRole] || routes.citizen;
        }, 1500);
      }
    });
  }
});
