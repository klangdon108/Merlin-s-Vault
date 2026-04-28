document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#order-status-form");
  const result = document.querySelector("#order-status-result");
  const queryOrder = MV.ui.getQueryParam("order");
  const input = document.querySelector("#order-number");

  if (queryOrder && input) input.value = queryOrder;

  function renderOrder(order) {
    result.innerHTML = `
      <article class="summary-card">
        <span class="eyebrow">Order Lookup</span>
        <h2>${order.orderNumber}</h2>
        <p>Placed ${new Date(order.placedAt).toLocaleString()}</p>
        <div class="summary-line"><span>Current status</span><strong>${order.status}</strong></div>
        <div class="summary-line"><span>Total</span><strong>${MV.ui.formatCurrency(order.total)}</strong></div>
        <div class="summary-line"><span>Items</span><strong>${order.items.length}</strong></div>
        <ol class="timeline-list">
          ${order.timeline.map((step) => `<li class="${step.state}">${step.label}</li>`).join("")}
        </ol>
      </article>
      <article class="summary-card">
        <h3>Items in this order</h3>
        ${order.items.map((item) => `<div class="summary-line"><span>${item.title} × ${item.quantity}</span><strong>${MV.ui.formatCurrency(item.lineTotal)}</strong></div>`).join("")}
      </article>
    `;
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const orderNumber = input.value.trim();
    if (!orderNumber) {
      MV.ui.showModal({
        title: "Order Number Required",
        message: "Enter the order number from your confirmation page.",
        tone: "warning",
      });
      return;
    }

    const order = MV.storage.findOrder(orderNumber);
    if (!order) {
      result.innerHTML = `<div class="empty-state"><p>No order was found for <strong>${orderNumber}</strong> in this browser yet.</p></div>`;
      return;
    }

    renderOrder(order);
  });

  if (queryOrder) {
    const order = MV.storage.findOrder(queryOrder);
    if (order) renderOrder(order);
  }
});
