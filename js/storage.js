window.MV = window.MV || {};

(function () {
  const KEYS = {
    cart: "mv-cart",
    orders: "mv-orders",
    registrations: "mv-event-registrations",
    contacts: "mv-contact-messages",
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn(`Unable to read ${key}`, error);
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getCart() {
    return read(KEYS.cart, []);
  }

  function saveCart(cart) {
    write(KEYS.cart, cart);
  }

  function getCartDetailed() {
    const items = getCart()
      .map((item) => {
        const product = MV_DATA.products.find((entry) => entry.id === item.productId);
        if (!product) return null;
        return {
          ...product,
          quantity: item.quantity,
          lineTotal: Number((product.price * item.quantity).toFixed(2)),
        };
      })
      .filter(Boolean);

    const subtotal = Number(items.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
    const estimatedShipping = subtotal >= 75 ? 0 : subtotal === 0 ? 0 : 8.99;
    const tax = Number((subtotal * 0.0825).toFixed(2));
    const total = Number((subtotal + estimatedShipping + tax).toFixed(2));

    return { items, subtotal, estimatedShipping, tax, total };
  }

  function addToCart(productId, quantity) {
    const cart = getCart();
    const existing = cart.find((item) => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }
    saveCart(cart);
  }

  function updateCartItem(productId, quantity) {
    const cart = getCart()
      .map((item) => {
        if (item.productId !== productId) return item;
        return { ...item, quantity: Number(quantity) };
      })
      .filter((item) => item.quantity > 0);

    saveCart(cart);
  }

  function removeCartItem(productId) {
    saveCart(getCart().filter((item) => item.productId !== productId));
  }

  function clearCart() {
    saveCart([]);
  }

  function getOrders() {
    return read(KEYS.orders, []);
  }

  function generateOrderNumber() {
    const stamp = Date.now().toString(36).toUpperCase();
    const random = Math.floor(Math.random() * 46656).toString(36).toUpperCase().padStart(3, "0");
    return `MV-${stamp}-${random}`;
  }

  function saveOrder(orderPayload) {
    const orders = getOrders();
    orders.unshift(orderPayload);
    write(KEYS.orders, orders);
    return orderPayload;
  }

  function createOrder(checkoutForm) {
    const cart = getCartDetailed();
    const orderNumber = generateOrderNumber();
    const order = {
      orderNumber,
      placedAt: new Date().toISOString(),
      status: "Processing",
      timeline: [
        { label: "Order received", state: "complete" },
        { label: "Payment simulated", state: "complete" },
        { label: "Packing in progress", state: "current" },
        { label: "Ready for pickup / shipment", state: "upcoming" },
      ],
      customer: checkoutForm,
      items: cart.items,
      subtotal: cart.subtotal,
      shipping: cart.estimatedShipping,
      tax: cart.tax,
      total: cart.total,
    };

    saveOrder(order);
    clearCart();
    return order;
  }

  function findOrder(orderNumber) {
    return getOrders().find(
      (order) => order.orderNumber.trim().toLowerCase() === orderNumber.trim().toLowerCase()
    );
  }

  function getRegistrations() {
    return read(KEYS.registrations, []);
  }

  function saveEventRegistration(payload) {
    const registrations = getRegistrations();
    registrations.unshift({
      ...payload,
      savedAt: new Date().toISOString(),
      reference: `EV-${Date.now().toString(36).toUpperCase()}`,
    });
    write(KEYS.registrations, registrations);
    return registrations[0];
  }

  function saveContactMessage(payload) {
    const messages = read(KEYS.contacts, []);
    messages.unshift({
      ...payload,
      savedAt: new Date().toISOString(),
    });
    write(KEYS.contacts, messages);
  }

  MV.storage = {
    getCart,
    saveCart,
    getCartDetailed,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    getOrders,
    findOrder,
    createOrder,
    getRegistrations,
    saveEventRegistration,
    saveContactMessage,
  };
})();
