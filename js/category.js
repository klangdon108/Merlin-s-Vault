document.addEventListener("DOMContentLoaded", () => {
  const categoryId = MV.ui.getQueryParam("category") || MV_DATA.categories[0].id;
  const category = MV.ui.getCategoryById(categoryId);
  const products = MV_DATA.products.filter((product) => product.category === categoryId);

  MV.ui.setText("#category-title", category ? category.name : "Category");
  MV.ui.setText("#category-description", category ? category.description : "Browse the collection.");

  const banner = document.querySelector("#category-banner");
  if (banner && category) {
    banner.src = category.image;
    banner.alt = category.name;
  }

  MV.ui.renderCategoryChips("#category-chips", categoryId);

  const grid = document.querySelector("#category-grid-products");
  if (grid) {
    grid.innerHTML = products.map(MV.ui.buildProductCard).join("");
    MV.ui.attachAddToCartEvents(grid);
  }
});
