document.addEventListener("DOMContentLoaded", () => {
  const eventId = MV.ui.getQueryParam("id") || MV_DATA.events[0].id;
  const eventItem = MV.ui.getEventById(eventId);
  if (!eventItem) return;

  document.title = `${eventItem.title} | Merlin's Vault`;

  const image = document.querySelector("#event-image");
  if (image) {
    image.src = eventItem.image;
    image.alt = eventItem.title;
  }

  MV.ui.setText("#event-title", eventItem.title);
  MV.ui.setText("#event-summary", eventItem.description);
  MV.ui.setText("#event-date", eventItem.fullDate);
  MV.ui.setText("#event-location", eventItem.location);
  MV.ui.setText("#event-fee", eventItem.fee === 0 ? "Free Event" : MV.ui.formatCurrency(eventItem.fee));
  MV.ui.setText("#event-spots", `${eventItem.spotsLeft} spots left`);

  const bring = document.querySelector("#event-bring");
  if (bring) bring.innerHTML = eventItem.bring.map((item) => `<li>${item}</li>`).join("");

  const schedule = document.querySelector("#event-schedule");
  if (schedule) schedule.innerHTML = eventItem.schedule.map((item) => `<li>${item}</li>`).join("");

  const form = document.querySelector("#event-registration-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());
    if (!payload.name || !payload.email) {
      MV.ui.showModal({
        title: "Registration Incomplete",
        message: "Please enter your name and email to register.",
        tone: "warning",
      });
      return;
    }

    const registration = MV.storage.saveEventRegistration({
      ...payload,
      eventId: eventItem.id,
      eventTitle: eventItem.title,
    });

    MV.ui.showModal({
      title: "Registration Saved",
      message: `${eventItem.title} registration complete. Reference: ${registration.reference}`,
      tone: "success",
    });

    form.reset();
  });
});
