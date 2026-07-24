self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(self.registration.showNotification(data.title || "Yeni siparişiniz var!", {
    body: data.body || "Yeni bir sipariş alındı.", icon: "/images/logo_circular.png", badge: "/icon.png",
    tag: data.tag || "new-order", vibrate: [200, 100, 200], data: { url: data.url || "/admin/siparisler" },
  }));
});
self.addEventListener("notificationclick", (event) => { event.notification.close(); event.waitUntil(clients.openWindow(event.notification.data.url)); });
