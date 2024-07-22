const DenyList = new RegExp("/settings/graphql_explorer");

// CSS styles for the toggle (updated)
const styles = `
  .dark-mode-toggle-wrapper.top-nav__item {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 10px;
    background: none !important;
    border-left: none !important;
    border-right: none !important;
  }
  .dark-mode-toggle-wrapper.top-nav__item:hover,
  .dark-mode-toggle-wrapper.top-nav__item:focus,
  .dark-mode-toggle-wrapper.top-nav__item:active {
    background: none !important;
    border-left: none !important;
    border-right: none !important;
  }
  .dark-mode-toggle {
    position: relative;
    width: 60px;
    height: 30px;
    background-color: #e0e0e0;
    border-radius: 15px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: visible !important;
  }
  .dark-mode-toggle:focus,
  .dark-mode-toggle:hover,
  .dark-mode-toggle:active {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
    background-color: #e0e0e0 !important;
  }
  .dark-mode-toggle.dark {
    background-color: #3a3a3a !important;
  }
  .dark-mode-toggle.dark:focus,
  .dark-mode-toggle.dark:hover,
  .dark-mode-toggle.dark:active {
    background-color: #3a3a3a !important;
  }
  .toggle-handle {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 26px;
    height: 26px;
    background-color: #fff;
    border-radius: 50%;
    transition: transform 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible !important;
  }
  .dark-mode-toggle.dark .toggle-handle {
    transform: translateX(30px);
  }
  .toggle-icon {
    width: 22px !important;
    height: 22px !important;
    transition: opacity 0.3s ease;
    display: block !important;
    position: absolute !important;
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%, -50%) !important;
    z-index: auto !important;
  }
  .sun-icon {
    opacity: 1;
  }
  .moon-icon {
    opacity: 0;
  }
  .dark-mode-toggle.dark .sun-icon {
    opacity: 0;
  }
  .dark-mode-toggle.dark .moon-icon {
    opacity: 1;
  }
`;

// Save the current mode to local storage
function saveMode(isDark) {
  localStorage.setItem("ahaDarkMode", isDark);
}

// Load the saved mode from local storage
function loadMode() {
  return localStorage.getItem("ahaDarkMode") === "true";
}

// Create and add the toggle to the navbar
function addDarkModeToggle() {
  // Check if the toggle already exists
  if (document.getElementById("dark-mode-toggle")) {
    return document.getElementById("dark-mode-toggle");
  }

  const navbar = document.querySelector("ul.top-nav__secondary");
  if (!navbar) return null;

  const toggleLi = document.createElement("li");
  toggleLi.className = "top-nav__item dark-mode-toggle-wrapper";

  const toggle = document.createElement("button");
  toggle.id = "dark-mode-toggle";
  toggle.className = "dark-mode-toggle";
  toggle.setAttribute("aria-label", "Toggle dark mode");
  toggle.innerHTML = `
    <div class="toggle-handle">
      <svg class="toggle-icon sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFD700" stroke="#FF8C00" stroke-width="2">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <svg class="toggle-icon moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#C0C0C0" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </div>
  `;

  toggleLi.appendChild(toggle);
  navbar.insertBefore(toggleLi, navbar.firstChild);

  return toggle;
}

// Add CSS styles only once
function addStyles() {
  if (!document.getElementById("dark-mode-toggle-styles")) {
    const styleElement = document.createElement("style");
    styleElement.id = "dark-mode-toggle-styles";
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }
}

// Update the toggle appearance
function updateToggle(isDark) {
  const toggle = document.getElementById("dark-mode-toggle");
  if (!toggle) return;

  if (isDark) {
    toggle.classList.add("dark");
  } else {
    toggle.classList.remove("dark");
  }
}

function enforceDarkMode(isDark) {
  // Block certain URLs
  if (DenyList.test(location.pathname)) {
    return;
  }

  if (isDark) {
    document.body.classList.add("dark-mode-allowed");
    document.body.dataset.theme = "dark";
    if (window.themeStore) {
      window.themeStore.theme = "dark";
    }
  } else {
    document.body.classList.remove("dark-mode-allowed");
    document.body.dataset.theme = "light";
    if (window.themeStore) {
      window.themeStore.theme = "light";
    }
  }

  // Re-render all aha-cards to blend w/ current mode
  document.querySelectorAll("aha-card").forEach((card) => {
    // Hack to re-render aha-card
    card.attributeChangedCallback("selected");
  });

  updateToggle(isDark);
  saveMode(isDark);
}

// Initialize dark mode
function initDarkMode() {
  addStyles();
  const toggle = addDarkModeToggle();
  if (!toggle) return;

  const isDark = loadMode();
  enforceDarkMode(isDark);

  // Remove any existing event listeners before adding a new one
  toggle.removeEventListener("click", toggleDarkMode);
  toggle.addEventListener("click", toggleDarkMode);
}

// Toggle dark mode
function toggleDarkMode() {
  const newMode = !document.body.classList.contains("dark-mode-allowed");
  enforceDarkMode(newMode);
}

// Run initialization
initDarkMode();

if (window.iripo) {
  window.iripo.in("ul.top-nav__secondary", initDarkMode);
}

addEventListener("storage", (event) => {
  if (event.key === "ahaDarkMode") {
    initDarkMode();
  }
});
