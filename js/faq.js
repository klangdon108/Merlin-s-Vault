document.addEventListener("DOMContentLoaded", () => {
  const target = document.querySelector("#faq-list");
  if (!target) return;

  target.innerHTML = MV_DATA.faq
    .map(
      (item, index) => `
        <details class="faq-item" ${index === 0 ? "open" : ""}>
          <summary>${item.question}</summary>
          <p>${item.answer}</p>
        </details>
      `
    )
    .join("");
});
