document.addEventListener("DOMContentLoaded", () => {
  const orderNumber = MV.ui.getQueryParam("order");
  const order = orderNumber ? MV.storage.findOrder(orderNumber) : null;
  const target = document.querySelector("#confirmation-root");
  if (!target) return;

  if (!order) {
    target.innerHTML = `
      <div class="empty-state">
        <p>We couldn't find that order in this browser yet.</p>
        <a class="button button-primary" href="order-status.html">Check Order Status</a>
      </div>
    `;
    return;
  }

  target.innerHTML = `
    <section class="confirmation-card">
      <span class="eyebrow">Order Confirmed</span>
      <h1>Thanks, ${order.customer.fullName}.</h1>
      <p>Your prototype checkout is complete. No payment was processed, but your order is stored locally so it can be tracked from the Order Status page.</p>
      <div class="order-number-banner">${order.orderNumber}</div>
      <div class="status-pills">
        <span class="status-pill is-live">${order.status}</span>
        <span class="status-pill">Pickup or ship flow simulated</span>
      </div>
    </section>

    <section class="content-grid two-column">
      <article class="summary-card">
        <h2>Order Summary</h2>
        ${order.items.map((item) => `<div class="summary-line"><span>${item.title} × ${item.quantity}</span><strong>${MV.ui.formatCurrency(item.lineTotal)}</strong></div>`).join("")}
        <div class="summary-line"><span>Subtotal</span><strong>${MV.ui.formatCurrency(order.subtotal)}</strong></div>
        <div class="summary-line"><span>Shipping</span><strong>${order.shipping === 0 ? "Free" : MV.ui.formatCurrency(order.shipping)}</strong></div>
        <div class="summary-line"><span>Tax</span><strong>${MV.ui.formatCurrency(order.tax)}</strong></div>
        <div class="summary-line total-line"><span>Total</span><strong>${MV.ui.formatCurrency(order.total)}</strong></div>
      </article>

      <article class="summary-card">
        <h2>Next Steps</h2>
        <ol class="timeline-list">
          ${order.timeline.map((step) => `<li class="${step.state}">${step.label}</li>`).join("")}
        </ol>
        <div class="button-row">
          <a class="button button-primary" href="order-status.html?order=${encodeURIComponent(order.orderNumber)}">Track This Order</a>
          <a class="button button-secondary" href="shop.html">Continue Shopping</a>
        </div>
      </article>
    </section>
  `;
});
