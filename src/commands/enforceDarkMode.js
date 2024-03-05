const DenyList = new RegExp("/settings/graphql_explorer");

function enforceDarkMode() {
  // Block certain URLs
  if (DenyList.test(location.pathname)) {
    return;
  }

  document.body.classList.add("dark-mode-allowed");
  document.body.dataset.theme = "dark";

  if (window.themeStore) {
    window.themeStore.theme = "dark";
  }

  // Re-render all aha-cards to blend w/ dark mode
  document.querySelectorAll("aha-card").forEach((card) => {
    // Hack to re-render aha-card
    card.attributeChangedCallback("selected");
  });
}

enforceDarkMode();

window.addEventListener("load", enforceDarkMode);

if (window.$) {
  $(document).on("page:change", enforceDarkMode);
}
