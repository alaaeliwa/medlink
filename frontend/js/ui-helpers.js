// ui-helpers.js – reusable UI utilities
// Create a card element from HTML string and apply fade-in animation
export function createCard(html) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html.trim();
  const card = wrapper.firstElementChild;
  if (card) {
    applyFadeIn(card);
  }
  return card;
}

// Apply fade-in animation using CSS class
export function applyFadeIn(element) {
  element.classList.add('fade-in');
  // Remove the class after animation ends to allow re-triggering
  element.addEventListener('animationend', () => {
    element.classList.remove('fade-in');
  }, { once: true });
}

// Apply fade-out animation before removal
export function applyFadeOut(element, callback) {
  element.classList.add('fade-out');
  element.addEventListener('animationend', () => {
    if (typeof callback === 'function') callback();
  }, { once: true });
}
