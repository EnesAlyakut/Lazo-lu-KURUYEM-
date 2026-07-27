"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

export default function DeleteOrderButton({ id, status }: { id: string, status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Bu siparişi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/siparis/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Sipariş silinemedi.");

      toast.success("Sipariş başarıyla silindi.");
      router.refresh();
    } catch (error) {
      toast.error("Silme işlemi başarısız oldu.");
    } finally {
      setLoading(false);
    }
  };

  if (status !== "CANCELLED") return null;

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      title="Siparişi Sil"
      className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
    >
      <Trash2 size={14} />
    </button>
  );
}
