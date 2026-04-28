document.addEventListener("DOMContentLoaded", () => {
  const itemsTarget = document.querySelector("#cart-items");
  const summaryTarget = document.querySelector("#cart-summary");
  if (!itemsTarget || !summaryTarget) return;

  function renderCart() {
    const cart = MV.storage.getCartDetailed();

    if (!cart.items.length) {
      itemsTarget.innerHTML = `
        <div class="empty-state">
          <p>Your cart is empty. Add some cards, games, or merch to keep the quest moving.</p>
          <a class="button button-primary" href="shop.html">Browse Shop</a>
        </div>
      `;
      summaryTarget.innerHTML = "";
      return;
    }

    itemsTarget.innerHTML = cart.items
      .map(
        (item) => `
          <article class="cart-item">
            <img src="${item.image}" alt="${item.title}">
            <div>
              <span class="eyebrow">${MV.ui.getCategoryById(item.category)?.short || "Item"}</span>
              <h3>${item.title}</h3>
              <p>${item.description}</p>
              <button class="text-button" type="button" data-remove-item="${item.id}">Remove</button>
            </div>
            <div>
              <label class="field-label" for="qty-${item.id}">Qty</label>
              <input class="field-input" id="qty-${item.id}" type="number" min="1" value="${item.quantity}" data-qty-input="${item.id}">
            </div>
            <div class="cart-price">${MV.ui.formatCurrency(item.lineTotal)}</div>
          </article>
        `
      )
      .join("");

    summaryTarget.innerHTML = `
      <div class="summary-card">
        <h3>Order Summary</h3>
        <div class="summary-line"><span>Subtotal</span><strong>${MV.ui.formatCurrency(cart.subtotal)}</strong></div>
        <div class="summary-line"><span>Estimated shipping</span><strong>${cart.estimatedShipping === 0 ? "Free" : MV.ui.formatCurrency(cart.estimatedShipping)}</strong></div>
        <div class="summary-line"><span>Estimated tax</span><strong>${MV.ui.formatCurrency(cart.tax)}</strong></div>
        <div class="summary-line total-line"><span>Total</span><strong>${MV.ui.formatCurrency(cart.total)}</strong></div>
        <a class="button button-primary button-block" href="checkout.html">Proceed to Checkout</a>
      </div>
    `;

    itemsTarget.querySelectorAll("[data-remove-item]").forEach((button) => {
      button.addEventListener("click", () => {
        MV.storage.removeCartItem(button.getAttribute("data-remove-item"));
        MV.ui.refreshCartBadges();
        renderCart();
      });
    });

    itemsTarget.querySelectorAll("[data-qty-input]").forEach((input) => {
      input.addEventListener("change", () => {
        const quantity = Math.max(1, Number(input.value) || 1);
        MV.storage.updateCartItem(input.getAttribute("data-qty-input"), quantity);
        MV.ui.refreshCartBadges();
        renderCart();
      });
    });
  }

  renderCart();
});
