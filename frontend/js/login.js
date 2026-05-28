document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#login-form");

  // ─── Password Visibility Toggle ───────────────────────────────────────────
  // Kept exactly as-is — no changes needed
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

  // ─── Form Submission ──────────────────────────────────────────────────────
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const emailInput    = loginForm.querySelector('input[type="email"]');
      const passwordInput = loginForm.querySelector('input[type="password"]');
      const submitBtn     = loginForm.querySelector('button[type="submit"]');

      const email    = emailInput?.value?.trim();
      const password = passwordInput?.value;

      // Basic client-side check
      if (!email || !password) {
        mlAlert('Please enter your email and password.', 'error');
        return;
      }

      // Show loading state
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
      submitBtn.disabled  = true;

      // ── Call the real API ─────────────────────────────────────────────────
      const res = await AuthAPI.login(email, password);

      if (res?.success) {
        // Auth.setSession() was already called inside AuthAPI.login()
        // Just redirect to the correct dashboard based on role
        const role = res.data.role;

        const routes = {
          citizen:  '../citizen/citizen-dashboard.html',
          pharmacy: '../pharmacy/pharmacy-dashboard.html',
          admin:    '../admin/admin-dashboard.html',
        };

        window.location.href = routes[role] || routes.citizen;

      } else {
        // Restore button and show error
        submitBtn.innerHTML = originalText;
        submitBtn.disabled  = false;

        const message = res?.message || 'Invalid email or password. Please try again.';
        mlAlert(message, 'error');

        // Highlight password field on auth failure
        if (passwordInput) {
          passwordInput.style.borderColor = '#ef4444';
          passwordInput.addEventListener('input', () => {
            passwordInput.style.borderColor = '';
          }, { once: true });
        }
      }
    });
  }
});
