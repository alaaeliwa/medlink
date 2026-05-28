document.addEventListener("DOMContentLoaded", () => {
  // ─── Selectors ────────────────────────────────────────────────────────────
  // All kept exactly as-is — no HTML changes needed
  const step1Form       = document.querySelector(".form-step-1");
  const step2Form       = document.querySelector(".form-step-2");
  const selectionCards  = document.querySelectorAll(".selection-card");
  const continueBtnStep1= document.querySelector(".form-step-1 .btn-continue");
  const backBtn         = document.querySelector(".btn-back");
  const tabBtns         = document.querySelectorAll(".tab-btn");
  const citizenFields   = document.querySelector("#citizen-fields");
  const pharmacyFields  = document.querySelector("#pharmacy-fields");
  const pharmacyNotice  = document.querySelector(".pharmacy-only");

  // ─── Core: Switch Role ────────────────────────────────────────────────────
  // Kept exactly as-is — no changes needed
  function updateRole(type) {
    if (tabBtns) {
      tabBtns.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.target === type);
      });
    }

    if (selectionCards) {
      selectionCards.forEach((card) => {
        card.classList.toggle("selected", card.dataset.type === type);
      });
    }

    if (type === "pharmacy") {
      citizenFields?.classList.add("hidden");
      pharmacyFields?.classList.remove("hidden");
      pharmacyNotice?.classList.remove("hidden");
    } else {
      pharmacyFields?.classList.add("hidden");
      citizenFields?.classList.remove("hidden");
      pharmacyNotice?.classList.add("hidden");
    }
  }

  // ─── Step 1 Selection Cards ───────────────────────────────────────────────
  selectionCards?.forEach((card) => {
    card.addEventListener("click", () => updateRole(card.dataset.type));
  });

  // ─── Step 2 Tabs ─────────────────────────────────────────────────────────
  tabBtns?.forEach((btn) => {
    btn.addEventListener("click", () => updateRole(btn.dataset.target));
  });

  // ─── Step Navigation ──────────────────────────────────────────────────────
  // Kept exactly as-is
  continueBtnStep1?.addEventListener("click", () => goToStep(2));
  backBtn?.addEventListener("click", () => goToStep(1));

  function goToStep(step) {
    const info1 = document.getElementById('info-step-1');
    const info2 = document.getElementById('info-step-2');

    if (info1 && info2) {
      info1.classList.toggle('hidden', step !== 1);
      info2.classList.toggle('hidden', step !== 2);
    }

    step1Form?.classList.toggle("hidden", step === 2);
    step2Form?.classList.toggle("hidden", step === 1);
  }

  // ─── Password Visibility Toggle ───────────────────────────────────────────
  // Kept exactly as-is
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
  const form = document.querySelector("#registration-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Password match check — kept exactly as-is
      const passwordInputs = form.querySelectorAll('input[type="password"]');
      if (passwordInputs.length >= 2) {
        const pass        = passwordInputs[0].value;
        const confirmPass = passwordInputs[1].value;

        if (pass !== confirmPass) {
          mlAlert('Passwords do not match!', 'error');
          passwordInputs[1].style.borderColor = "#ef4444";
          return;
        }
        passwordInputs[1].style.borderColor = "var(--border)";
      }

      // Determine selected role
      const activeRoleBtn = document.querySelector('.tab-btn.active');
      const role          = activeRoleBtn?.dataset.target || 'citizen';

      const submitBtn   = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
      submitBtn.disabled  = true;

      // ── Collect fields based on role ──────────────────────────────────────
      let payload = {};

      if (role === 'pharmacy') {
        // Grab pharmacy-specific fields
        const pharmacyName    = document.querySelector('#pharmacy-fields input[placeholder*="Pharmacy"], #pharmacy-fields input[name="pharmacy_name"], #pharmacy-fields input[type="text"]')?.value?.trim();
        const email           = document.querySelector('#pharmacy-fields input[type="email"]')?.value?.trim();
        const phone           = document.querySelector('#pharmacy-fields input[type="tel"], #pharmacy-fields input[placeholder*="phone"], #pharmacy-fields input[name="phone"]')?.value?.trim();
        const password        = passwordInputs[0]?.value;
        const address         = document.querySelector('#pharmacy-fields textarea, #pharmacy-fields input[placeholder*="address"], #pharmacy-fields input[name="address"]')?.value?.trim();
        const licenseNumber   = document.querySelector('#pharmacy-fields input[placeholder*="license"], #pharmacy-fields input[placeholder*="License"], #pharmacy-fields input[name="license_number"]')?.value?.trim();

        payload = {
          role:             'pharmacy',
          pharmacyName:     pharmacyName || '',
          email:            email || '',
          phone:            phone || '',
          password:         password,
          address:          address || '',
          licenseNumber:    licenseNumber || '',
          deliveryAvailable: false,
          deliveryFee:      0,
        };

      } else {
        // Citizen fields
        const fullName  = document.querySelector('#citizen-fields input[type="text"]')?.value?.trim();
        const email     = document.querySelector('#citizen-fields input[type="email"]')?.value?.trim();
        const phone     = document.querySelector('#citizen-fields input[type="tel"], #citizen-fields input[placeholder*="phone"], #citizen-fields input[name="phone"]')?.value?.trim();
        const password  = passwordInputs[0]?.value;
        const nameParts = (fullName || '').split(' ');

        payload = {
          role:      'citizen',
          firstName: nameParts[0] || '',
          lastName:  nameParts.slice(1).join(' ') || '',
          email:     email || '',
          phone:     phone || '',
          password:  password,
        };
      }

      // ── Call the real API ─────────────────────────────────────────────────
      const res = await AuthAPI.register(payload);

      if (res?.success) {
        // Save token and user info from the API response
        Auth.setSession(res.data);

        // Show a quick success message then redirect
        mlAlert('Account created successfully! Redirecting...', 'success');

        setTimeout(() => {
          const routes = {
            citizen:  '../citizen/citizen-dashboard.html',
            pharmacy: '../pharmacy/pharmacy-dashboard.html',
          };
          window.location.href = routes[role] || routes.citizen;
        }, 1200);

      } else {
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled  = false;

        // Show the error from the API (e.g. "Email already taken")
        const message = res?.message || 'Registration failed. Please try again.';
        mlAlert(message, 'error');

        // If there are field-level validation errors, highlight them
        if (res?.errors) {
          if (res.errors.email) {
            const emailInput = form.querySelector('input[type="email"]');
            if (emailInput) emailInput.style.borderColor = '#ef4444';
          }
          if (res.errors.licenseNumber) {
            const licenseInput = document.querySelector('input[name="license_number"], input[placeholder*="license"]');
            if (licenseInput) licenseInput.style.borderColor = '#ef4444';
          }
        }
      }
    });
  }
});
