document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());
    if (!payload.name || !payload.email || !payload.message) {
      MV.ui.showModal({
        title: "Message Incomplete",
        message: "Please fill out the required contact fields.",
        tone: "warning",
      });
      return;
    }

    MV.storage.saveContactMessage(payload);
    MV.ui.showModal({
      title: "Message Saved",
      message: "Your message was saved locally in this prototype.",
      tone: "success",
    });
    form.reset();
  });
});
