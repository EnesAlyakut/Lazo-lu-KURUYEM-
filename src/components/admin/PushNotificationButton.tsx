"use client";
import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import toast from "react-hot-toast";

function decodeKey(value: string) {
  const base64 = (value + "=".repeat((4 - value.length % 4) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
}

export default function PushNotificationButton() {
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const available = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    setSupported(available);
    if (available) navigator.serviceWorker.register("/admin-sw.js").then(async (r) => setEnabled(Boolean(await r.pushManager.getSubscription()))).catch(() => undefined);
  }, []);
  if (!supported) return null;
  const toggle = async () => {
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const current = await registration.pushManager.getSubscription();
      if (current) {
        await fetch("/api/admin/push-subscription", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ endpoint: current.endpoint }) });
        await current.unsubscribe(); setEnabled(false); toast.success("Sipariş bildirimleri kapatıldı."); return;
      }
      if (Notification.permission === "denied") return toast.error("Bildirim izni tarayıcı ayarlarından engellenmiş.");
      if (await Notification.requestPermission() !== "granted") return;
      const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!key) throw new Error("Bildirim anahtarı eksik.");
      const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decodeKey(key) });
      const response = await fetch("/api/admin/push-subscription", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(subscription) });
      if (!response.ok) throw new Error("Bildirim kaydedilemedi.");
      setEnabled(true); toast.success("Yeni siparişler artık bu telefona bildirilecek.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Bildirim açılamadı."); }
    finally { setBusy(false); }
  };
  return <button type="button" onClick={toggle} disabled={busy} className="admin-sidebar-link w-full text-left text-sm disabled:opacity-60">{enabled ? <Bell size={16} /> : <BellOff size={16} />}{busy ? "Ayarlanıyor..." : enabled ? "Bildirimler Açık" : "Sipariş Bildirimi Aç"}</button>;
}
