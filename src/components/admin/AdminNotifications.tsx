"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, BellOff, X, CheckCircle, Package } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

function playDing() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.error("Audio error", e);
  }
}

export default function AdminNotifications() {
  const [enabled, setEnabled] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastSeenTime, setLastSeenTime] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Ref to hold the latest lastSeenTime inside the interval
  const lastSeenRef = useRef<string | null>(null);

  useEffect(() => {
    const savedTime = localStorage.getItem("adminLastSeenOrderTime");
    if (savedTime) {
      setLastSeenTime(savedTime);
      lastSeenRef.current = savedTime;
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/recent-orders");
        if (!res.ok) return;
        const data = await res.json();

        if (Array.isArray(data)) {
          setOrders(data);

          if (data.length > 0) {
            const latestOrderTime = new Date(data[0].createdAt).getTime();
            const storedSeenTime = lastSeenRef.current ? new Date(lastSeenRef.current).getTime() : 0;

            let unread = 0;
            data.forEach(order => {
              if (new Date(order.createdAt).getTime() > storedSeenTime) {
                unread++;
              }
            });

            setUnreadCount(unread);

            // If we detected a new order that wasn't there in the previous poll, play sound
            // We use a separate localStorage key to track the absolute last notified time
            const lastNotifiedTimeStr = localStorage.getItem("adminLastNotifiedTime");
            const lastNotifiedTime = lastNotifiedTimeStr ? new Date(lastNotifiedTimeStr).getTime() : 0;

            if (latestOrderTime > lastNotifiedTime) {
              playDing();
              localStorage.setItem("adminLastNotifiedTime", data[0].createdAt);
              // Auto open if new notification arrives
              setIsOpen(true);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch recent orders for notifications", err);
      }
    };

    fetchOrders(); // Initial fetch
    const interval = setInterval(fetchOrders, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [enabled]);

  const toggleEnable = () => {
    if (!enabled) {
      // User intent to enable, initialize audio context
      playDing();
      setEnabled(true);
      if (orders.length > 0) {
        setLastSeenTime(orders[0].createdAt);
        lastSeenRef.current = orders[0].createdAt;
        localStorage.setItem("adminLastSeenOrderTime", orders[0].createdAt);
      }
    } else {
      setEnabled(false);
    }
  };

  const markAllAsRead = () => {
    if (orders.length > 0) {
      const latestTime = orders[0].createdAt;
      setLastSeenTime(latestTime);
      lastSeenRef.current = latestTime;
      localStorage.setItem("adminLastSeenOrderTime", latestTime);
      setUnreadCount(0);
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={toggleEnable}
        className="admin-sidebar-link w-full text-left text-sm"
      >
        {enabled ? <Bell size={16} /> : <BellOff size={16} />}
        {enabled ? "Canlı Bildirimler Açık" : "Canlı Bildirimleri Başlat"}
      </button>

      {enabled && (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
          {/* Popover Window */}
          {isOpen && (
            <div className="mb-4 w-80 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 animate-in slide-in-from-bottom-5">
              <div className="flex items-center justify-between border-b border-gray-100 bg-brand-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Bell size={18} className="text-brand-600" />
                  <h3 className="font-semibold text-brand-900">Sipariş Bildirimleri</h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1 text-gray-500 hover:bg-black/5 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto p-2">
                {orders.length === 0 ? (
                  <p className="p-4 text-center text-sm text-gray-500">Henüz sipariş yok.</p>
                ) : (
                  <div className="space-y-1">
                    {orders.map((order) => {
                      const isUnread = lastSeenTime
                        ? new Date(order.createdAt).getTime() > new Date(lastSeenTime).getTime()
                        : true;

                      const itemsStr = order.items?.map((i: any) => i.productName).join(", ");

                      return (
                        <div
                          key={order.id}
                          className={`flex items-start gap-3 rounded-xl p-3 text-sm transition-colors ${
                            isUnread ? "bg-brand-50/50" : "hover:bg-gray-50"
                          }`}
                        >
                          <div className={`mt-0.5 rounded-full p-1.5 ${isUnread ? "bg-brand-100 text-brand-600" : "bg-gray-100 text-gray-500"}`}>
                            <Package size={14} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {order.customerName}
                            </p>
                            <p className="line-clamp-2 text-xs text-gray-600">
                              <span className="font-medium">Aldığı ürün:</span> {itemsStr || "Ürün(ler)"}
                            </p>
                            <p className="mt-1 text-[10px] text-gray-400">
                              {formatDistanceToNow(new Date(order.createdAt), {
                                addSuffix: true,
                                locale: tr,
                              })}
                            </p>
                          </div>
                          {isUnread && (
                            <div className="h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 p-2">
                <button
                  onClick={markAllAsRead}
                  className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                  <CheckCircle size={14} />
                  Tümünü Okundu İşaretle
                </button>
              </div>
            </div>
          )}

          {/* Floating Bell Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/30 transition-transform hover:scale-105 active:scale-95"
          >
            <Bell size={24} className={unreadCount > 0 ? "animate-pulse" : ""} />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        </div>
      )}
    </>
  );
}
