document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#checkout-form");
  const summary = document.querySelector("#checkout-summary");
  const cart = MV.storage.getCartDetailed();

  if (summary) {
    if (!cart.items.length) {
      summary.innerHTML = `
        <div class="empty-state">
          <p>Your cart is empty, so checkout is waiting on your next pickup-worthy order.</p>
          <a class="button button-primary" href="shop.html">Back to Shop</a>
        </div>
      `;
    } else {
      summary.innerHTML = `
        <div class="summary-card">
          <h3>Checkout Summary</h3>
          ${cart.items.map((item) => `<div class="summary-line"><span>${item.title} × ${item.quantity}</span><strong>${MV.ui.formatCurrency(item.lineTotal)}</strong></div>`).join("")}
          <div class="summary-line"><span>Subtotal</span><strong>${MV.ui.formatCurrency(cart.subtotal)}</strong></div>
          <div class="summary-line"><span>Shipping</span><strong>${cart.estimatedShipping === 0 ? "Free" : MV.ui.formatCurrency(cart.estimatedShipping)}</strong></div>
          <div class="summary-line"><span>Tax</span><strong>${MV.ui.formatCurrency(cart.tax)}</strong></div>
          <div class="summary-line total-line"><span>Total</span><strong>${MV.ui.formatCurrency(cart.total)}</strong></div>
        </div>
      `;
    }
  }

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!cart.items.length) {
      MV.ui.showModal({
        title: "Cart Required",
        message: "Add products to your cart before checking out.",
        tone: "warning",
      });
      return;
    }

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const requiredFields = ["fullName", "email", "phone", "address", "city", "state", "zip", "cardName", "cardNumber", "expiry", "cvv"];
    const missing = requiredFields.filter((field) => !String(payload[field] || "").trim());

    if (missing.length) {
      MV.ui.showModal({
        title: "Missing Information",
        message: "Please complete all required checkout fields before placing the order.",
        tone: "warning",
      });
      return;
    }

    if (!/^\d{16}$/.test(payload.cardNumber.replace(/\s+/g, ""))) {
      MV.ui.showModal({
        title: "Payment Format Error",
        message: "Enter a 16-digit card number for this simulated checkout.",
        tone: "error",
      });
      return;
    }

    if (!/^\d{3,4}$/.test(payload.cvv)) {
      MV.ui.showModal({
        title: "Security Code Error",
        message: "Enter a valid 3 or 4 digit CVV.",
        tone: "error",
      });
      return;
    }

    const order = MV.storage.createOrder(payload);
    MV.ui.refreshCartBadges();
    window.location.href = `order-confirmation.html?order=${encodeURIComponent(order.orderNumber)}`;
  });
});
