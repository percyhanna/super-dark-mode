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
}

enforceDarkMode();

window.addEventListener("load", enforceDarkMode);

if (window.$) {
  $(document).on("page:change", enforceDarkMode);
}
