// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80, // Account for fixed header height
        behavior: "smooth",
      });
    }
  });
});

// Dynamic header background on scroll
const header = document.querySelector("header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
    header.style.boxShadow = "var(--shadow-md)";
  } else {
    header.style.backgroundColor = "rgba(255, 255, 255, 0.85)";
    header.style.boxShadow = "none";
  }
});
