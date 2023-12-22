// aha.on("enforceDarkMode", ({ record }, { identifier, settings }) => {
//   if (record) {
//     aha.commandOutput(
//       `Running sample command for record: ${record.typename} / ${record.referenceNum}.`
//     );
//   } else {
//     aha.commandOutput(`Running sample command without a record.`);
//   }
// });

function enforceDarkMode() {
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
