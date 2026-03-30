document.addEventListener("DOMContentLoaded", () => {
  // Selectors
  const step1Info = document.querySelector(".info-step-1");
  const step2Info = document.querySelector(".info-step-2");
  const step1Form = document.querySelector(".form-step-1");
  const step2Form = document.querySelector(".form-step-2");

  const selectionCards = document.querySelectorAll(".selection-card");
  const continueBtnStep1 = document.querySelector(".form-step-1 .btn-continue");
  const backBtn = document.querySelector(".btn-back");
  const tabBtns = document.querySelectorAll(".tab-btn");

  const citizenFields = document.querySelector("#citizen-fields");
  const pharmacyFields = document.querySelector("#pharmacy-fields");
  const pharmacyNotice = document.querySelector(".pharmacy-only");

  // Core Function: Switch Role
  function updateRole(type) {
    // 1. Update Tabs
    if (tabBtns) {
      tabBtns.forEach((btn) => {
        if (btn.dataset.target === type) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    }

    // 2. Update Selection Cards (Step 1)
    if (selectionCards) {
      selectionCards.forEach((card) => {
        if (card.dataset.type === type) {
          card.classList.add("selected");
        } else {
          card.classList.remove("selected");
        }
      });
    }

    // 3. Toggle Form Fields
    if (type === "pharmacy") {
      if (citizenFields) citizenFields.classList.add("hidden");
      if (pharmacyFields) pharmacyFields.classList.remove("hidden");
      if (pharmacyNotice) pharmacyNotice.classList.remove("hidden");
    } else {
      if (pharmacyFields) pharmacyFields.classList.add("hidden");
      if (citizenFields) citizenFields.classList.remove("hidden");
      if (pharmacyNotice) pharmacyNotice.classList.add("hidden");
    }
  }

  // Event Listeners: Step 1 Selection
  if (selectionCards) {
    selectionCards.forEach((card) => {
      card.addEventListener("click", () => {
        const type = card.dataset.type;
        updateRole(type);
      });
    });
  }

  // Event Listeners: Step 2 Tabs
  if (tabBtns) {
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.target;
        updateRole(type);
      });
    });
  }

  // Step Transitions
  if (continueBtnStep1) {
    continueBtnStep1.addEventListener("click", () => {
      goToStep(2);
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      goToStep(1);
    });
  }

  function goToStep(step) {
    // Update Sidebar Info if it exists
    const info1 = document.getElementById('info-step-1');
    const info2 = document.getElementById('info-step-2');
    
    if (info1 && info2) {
      if (step === 1) {
        info1.classList.remove('hidden');
        info2.classList.add('hidden');
      } else {
        info1.classList.add('hidden');
        info2.classList.remove('hidden');
      }
    }

    if (step === 2) {
      if (step1Form) step1Form.classList.add("hidden");
      if (step2Form) step2Form.classList.remove("hidden");
    } else {
      if (step2Form) step2Form.classList.add("hidden");
      if (step1Form) step1Form.classList.remove("hidden");
    }
  }

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

  // Form Submission
  const form = document.querySelector("#registration-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const passwordInputs = form.querySelectorAll('input[type="password"]');
      const errorText = form.querySelector(".error-text");

      if (passwordInputs.length >= 2) {
        const pass = passwordInputs[0].value;
        const confirmPass = passwordInputs[1].value;

        if (pass !== confirmPass) {
          if (errorText) errorText.classList.remove("hidden");
          passwordInputs[1].style.borderColor = "#ef4444";
          return;
        }

        if (errorText) errorText.classList.add("hidden");
        passwordInputs[1].style.borderColor = "var(--border)";
      }

      // Simulate submission
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        // Determine selected role
        const activeRoleBtn = document.querySelector('.tab-btn.active');
        const role = activeRoleBtn ? activeRoleBtn.dataset.target : 'citizen';

        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        setTimeout(() => {
          // Extract User Details and save to local storage
          let nameInput, emailInput;
          if (role === 'pharmacy') {
            nameInput = document.querySelector('#pharmacy-fields input[type="text"]');
            emailInput = document.querySelector('#pharmacy-fields input[type="email"]');
          } else {
            nameInput = document.querySelector('#citizen-fields input[type="text"]');
            emailInput = document.querySelector('#citizen-fields input[type="email"]');
          }
          
          if (nameInput && nameInput.value) {
            localStorage.setItem('medlink_userName', nameInput.value);
            localStorage.setItem('medlink_firstName', nameInput.value.split(' ')[0]);
          } else {
            localStorage.setItem('medlink_userName', 'Ahmed Ali');
            localStorage.setItem('medlink_firstName', 'Ahmed');
          }
          if (emailInput && emailInput.value) {
            localStorage.setItem('medlink_userEmail', emailInput.value);
          } else {
            localStorage.setItem('medlink_userEmail', 'ahmed@example.com');
          }

          // Dynamic Redirection based on Role
          if (role === 'pharmacy') {
            window.location.href = "pharmacy-dashboard.html";
          } else {
            window.location.href = "citizen-dashboard.html";
          }
        }, 1500);
      }
    });
  }
});
