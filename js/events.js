document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("#events-grid");
  if (!grid) return;
  grid.innerHTML = MV_DATA.events.map(MV.ui.buildEventCard).join("");
});
