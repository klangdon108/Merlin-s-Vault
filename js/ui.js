window.MV = window.MV || {};

(function () {
  const state = {
    mobileMenuOpen: false,
  };

  function getCartCount() {
    return MV.storage.getCart().reduce((sum, item) => sum + item.quantity, 0);
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }

  function getCategoryById(categoryId) {
    return MV_DATA.categories.find((category) => category.id === categoryId);
  }

  function getProductById(productId) {
    return MV_DATA.products.find((product) => product.id === productId);
  }

  function getEventById(eventId) {
    return MV_DATA.events.find((eventItem) => eventItem.id === eventId);
  }

  function getQueryParam(key) {
    return new URLSearchParams(window.location.search).get(key);
  }

  function createNavLinks(activePage) {
    const links = [
      { label: "Home", href: "index.html", key: "home" },
      { label: "Shop", href: "shop.html", key: "shop" },
      { label: "Events", href: "events.html", key: "events" },
      { label: "Order Status", href: "order-status.html", key: "order-status" },
      { label: "About", href: "about.html", key: "about" },
      { label: "Contact", href: "contact.html", key: "contact" },
      { label: "FAQ", href: "faq.html", key: "faq" },
    ];

    return links
      .map(
        (link) => `
          <a class="nav-link ${activePage === link.key ? "is-active" : ""}" href="${link.href}">
            ${link.label}
          </a>`
      )
      .join("");
  }

  function renderHeader() {
    const target = document.querySelector("[data-header]");
    if (!target) return;

    const page = document.body.dataset.page || "";
    target.innerHTML = `
      <header class="site-header">
        <div class="shell">
          <div class="header-inner">
            <a class="brand" href="index.html" aria-label="Merlin's Vault home page">
              <span class="brand-mark">MV</span>
              <span>
                <strong>${MV_DATA.site.name}</strong>
                <small>${MV_DATA.site.tagline}</small>
              </span>
            </a>

            <button class="mobile-menu-button" type="button" aria-expanded="false" aria-controls="site-nav">
              <span></span><span></span><span></span>
            </button>

            <nav class="site-nav" id="site-nav">
              ${createNavLinks(page)}
              <a class="cart-link" href="cart.html">
                Cart
                <span class="cart-badge" data-cart-count>${getCartCount()}</span>
              </a>
            </nav>
          </div>
        </div>
      </header>
    `;

    const button = target.querySelector(".mobile-menu-button");
    const nav = target.querySelector(".site-nav");

    button?.addEventListener("click", () => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
      nav.classList.toggle("is-open", state.mobileMenuOpen);
      button.setAttribute("aria-expanded", String(state.mobileMenuOpen));
    });
  }

  function renderFooter() {
    const target = document.querySelector("[data-footer]");
    if (!target) return;

    const hours = MV_DATA.site.hours.map((line) => `<li>${line}</li>`).join("");

    target.innerHTML = `
      <footer class="site-footer">
        <div class="shell footer-grid">
          <section>
            <h3>${MV_DATA.site.name}</h3>
            <p>${MV_DATA.site.tagline}</p>
          </section>
          <section>
            <h4>Shop</h4>
            <ul>
              ${MV_DATA.categories.map((category) => `<li><a href="category.html?category=${category.id}">${category.name}</a></li>`).join("")}
            </ul>
          </section>
          <section>
            <h4>Visit</h4>
            <p>${MV_DATA.site.address}</p>
            <p>${MV_DATA.site.phone}<br>${MV_DATA.site.email}</p>
          </section>
          <section>
            <h4>Hours</h4>
            <ul>${hours}</ul>
          </section>
        </div>
      </footer>
    `;
  }

  function refreshCartBadges() {
    document.querySelectorAll("[data-cart-count]").forEach((badge) => {
      badge.textContent = getCartCount();
    });
  }

  function setText(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.textContent = value;
  }

  function showModal({ title = "Notice", message = "", tone = "info" } = {}) {
    let modal = document.querySelector("#app-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "app-modal";
      modal.className = "modal";
      modal.innerHTML = `
        <div class="modal-backdrop" data-close-modal></div>
        <div class="modal-card">
          <button class="modal-close" type="button" aria-label="Close modal" data-close-modal>&times;</button>
          <div class="modal-pill" data-modal-tone></div>
          <h3 data-modal-title></h3>
          <p data-modal-message></p>
          <button class="button button-primary" type="button" data-close-modal>Close</button>
        </div>
      `;
      document.body.appendChild(modal);

      modal.addEventListener("click", (event) => {
        if (event.target.matches("[data-close-modal]")) {
          modal.classList.remove("is-visible");
        }
      });
    }

    modal.querySelector("[data-modal-title]").textContent = title;
    modal.querySelector("[data-modal-message]").textContent = message;
    modal.querySelector("[data-modal-tone]").setAttribute("data-tone", tone);
    modal.classList.add("is-visible");
  }

  function buildProductCard(product) {
    const category = getCategoryById(product.category);

    return `
      <article class="product-card">
        <a class="media-frame" href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.title}" loading="lazy">
        </a>
        <div class="card-copy">
          <span class="eyebrow">${category ? category.short : "Product"}</span>
          <h3><a href="product.html?id=${product.id}">${product.title}</a></h3>
          <p>${product.description}</p>
          <div class="card-meta">
            <strong>${formatCurrency(product.price)}</strong>
            <span>${product.badge}</span>
          </div>
          <div class="card-actions">
            <a class="button button-secondary" href="product.html?id=${product.id}">View Details</a>
            <button class="button button-primary" type="button" data-add-product="${product.id}">Add to Cart</button>
          </div>
        </div>
      </article>
    `;
  }

  function attachAddToCartEvents(scope = document) {
    scope.querySelectorAll("[data-add-product]").forEach((button) => {
      button.addEventListener("click", () => {
        const productId = button.getAttribute("data-add-product");
        const product = getProductById(productId);
        MV.storage.addToCart(productId, 1);
        refreshCartBadges();
        showModal({
          title: "Added to Cart",
          message: `${product?.title || "Item"} was added to your cart.`,
          tone: "success",
        });
      });
    });
  }

  function buildEventCard(eventItem) {
    return `
      <article class="event-card">
        <a class="media-frame event-media" href="event.html?id=${eventItem.id}">
          <img src="${eventItem.image}" alt="${eventItem.title}" loading="lazy">
        </a>
        <div class="card-copy">
          <span class="eyebrow">${eventItem.type}</span>
          <h3><a href="event.html?id=${eventItem.id}">${eventItem.title}</a></h3>
          <p>${eventItem.summary}</p>
          <ul class="inline-meta">
            <li>${eventItem.fullDate}</li>
            <li>${eventItem.location}</li>
            <li>${eventItem.fee === 0 ? "Free" : formatCurrency(eventItem.fee)}</li>
          </ul>
          <div class="card-actions">
            <a class="button button-secondary" href="event.html?id=${eventItem.id}">View Event</a>
            <a class="button button-primary" href="event.html?id=${eventItem.id}#register">Register</a>
          </div>
        </div>
      </article>
    `;
  }

  function renderCategoryChips(targetSelector, activeCategoryId) {
    const target = document.querySelector(targetSelector);
    if (!target) return;

    target.innerHTML = MV_DATA.categories
      .map(
        (category) => `
          <a class="chip ${activeCategoryId === category.id ? "is-active" : ""}" href="category.html?category=${category.id}">
            ${category.name}
          </a>
        `
      )
      .join("");
  }

  function populateMiniCartSummary(selector) {
    const target = document.querySelector(selector);
    if (!target) return;
    const cart = MV.storage.getCartDetailed();
    if (!cart.items.length) {
      target.innerHTML = `<div class="empty-state"><p>Your cart is empty. Head to the shop to start building an order.</p><a class="button button-primary" href="shop.html">Browse Shop</a></div>`;
      return;
    }

    target.innerHTML = `
      <div class="summary-stack">
        ${cart.items
          .map(
            (item) => `
              <div class="summary-line">
                <span>${item.title} × ${item.quantity}</span>
                <strong>${formatCurrency(item.lineTotal)}</strong>
              </div>
            `
          )
          .join("")}
        <div class="summary-line">
          <span>Subtotal</span>
          <strong>${formatCurrency(cart.subtotal)}</strong>
        </div>
      </div>
    `;
  }

  function initPageChrome() {
    renderHeader();
    renderFooter();
    refreshCartBadges();
  }

  MV.ui = {
    initPageChrome,
    formatCurrency,
    getCategoryById,
    getProductById,
    getEventById,
    getQueryParam,
    setText,
    showModal,
    buildProductCard,
    buildEventCard,
    attachAddToCartEvents,
    refreshCartBadges,
    renderCategoryChips,
    populateMiniCartSummary,
  };

  document.addEventListener("DOMContentLoaded", initPageChrome);
})();
