document.addEventListener("DOMContentLoaded", () => {
  const featuredProducts = MV_DATA.products.slice(0, 6);
  const featuredEvents = MV_DATA.events.slice(0, 3);

  const categoriesTarget = document.querySelector("#category-grid");
  if (categoriesTarget) {
    categoriesTarget.innerHTML = MV_DATA.categories
      .map(
        (category) => `
          <article class="category-card">
            <a class="media-frame" href="category.html?category=${category.id}">
              <img src="${category.image}" alt="${category.name}" loading="lazy">
            </a>
            <div class="card-copy">
              <span class="eyebrow">${category.short}</span>
              <h3><a href="category.html?category=${category.id}">${category.name}</a></h3>
              <p>${category.description}</p>
              <a class="button button-secondary" href="category.html?category=${category.id}">Explore Category</a>
            </div>
          </article>
        `
      )
      .join("");
  }

  const productsTarget = document.querySelector("#featured-products");
  if (productsTarget) {
    productsTarget.innerHTML = featuredProducts.map(MV.ui.buildProductCard).join("");
    MV.ui.attachAddToCartEvents(productsTarget);
  }

  const eventsTarget = document.querySelector("#featured-events");
  if (eventsTarget) {
    eventsTarget.innerHTML = featuredEvents.map(MV.ui.buildEventCard).join("");
  }

  const statsTarget = document.querySelector("#home-stats");
  if (statsTarget) {
    statsTarget.innerHTML = `
      <article class="stat-card"><strong>90</strong><span>Sample products</span></article>
      <article class="stat-card"><strong>5</strong><span>Weekly event types</span></article>
      <article class="stat-card"><strong>1</strong><span>Order lookup system</span></article>
      <article class="stat-card"><strong>12+</strong><span>Responsive pages</span></article>
    `;
  }
});
