document.addEventListener("DOMContentLoaded", () => {
  const productsGrid = document.querySelector("#shop-grid");
  const searchInput = document.querySelector("#shop-search");
  const categorySelect = document.querySelector("#shop-category");
  const sortSelect = document.querySelector("#shop-sort");
  const countTarget = document.querySelector("#shop-count");

  if (!productsGrid) return;

  categorySelect.innerHTML =
    `<option value="all">All Categories</option>` +
    MV_DATA.categories.map((category) => `<option value="${category.id}">${category.name}</option>`).join("");

  function getFilteredProducts() {
    const term = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;
    const sort = sortSelect.value;

    let filtered = MV_DATA.products.filter((product) => {
      const categoryMatch = category === "all" || product.category === category;
      const textMatch =
        !term ||
        product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.badge.toLowerCase().includes(term);
      return categoryMatch && textMatch;
    });

    filtered = filtered.sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "name") return a.title.localeCompare(b.title);
      return 0;
    });

    return filtered;
  }

  function renderProducts() {
    const filtered = getFilteredProducts();
    countTarget.textContent = `${filtered.length} products shown`;
    productsGrid.innerHTML = filtered.map(MV.ui.buildProductCard).join("");
    MV.ui.attachAddToCartEvents(productsGrid);
  }

  [searchInput, categorySelect, sortSelect].forEach((element) => {
    element.addEventListener("input", renderProducts);
    element.addEventListener("change", renderProducts);
  });

  renderProducts();
});
