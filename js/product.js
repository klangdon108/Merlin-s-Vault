document.addEventListener("DOMContentLoaded", () => {
  const productId = MV.ui.getQueryParam("id") || MV_DATA.products[0].id;
  const product = MV.ui.getProductById(productId);
  if (!product) return;

  const category = MV.ui.getCategoryById(product.category);
  document.title = `${product.title} | Merlin's Vault`;

  const mapping = {
    "#product-image": product.image,
    "#product-title": product.title,
    "#product-description": product.description,
    "#product-price": MV.ui.formatCurrency(product.price),
    "#product-badge": product.badge,
    "#product-stock": product.stock,
    "#product-category": category ? category.name : "Product",
  };

  Object.entries(mapping).forEach(([selector, value]) => {
    const node = document.querySelector(selector);
    if (!node) return;
    if (selector === "#product-image") {
      node.src = value;
      node.alt = product.title;
    } else {
      node.textContent = value;
    }
  });

  const features = document.querySelector("#product-features");
  if (features) {
    features.innerHTML = product.features.map((item) => `<li>${item}</li>`).join("");
  }

  const details = document.querySelector("#product-details-list");
  if (details) {
    details.innerHTML = product.details.map((item) => `<li>${item}</li>`).join("");
  }

  const quantityInput = document.querySelector("#product-quantity");
  const addButton = document.querySelector("#product-add");

  addButton?.addEventListener("click", () => {
    const quantity = Math.max(1, Number(quantityInput.value) || 1);
    MV.storage.addToCart(product.id, quantity);
    MV.ui.refreshCartBadges();
    MV.ui.showModal({
      title: "Added to Cart",
      message: `${product.title} was added to your cart.`,
      tone: "success",
    });
  });

  const related = MV_DATA.products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);

  const relatedTarget = document.querySelector("#related-products");
  if (relatedTarget) {
    relatedTarget.innerHTML = related.map(MV.ui.buildProductCard).join("");
    MV.ui.attachAddToCartEvents(relatedTarget);
  }
});
