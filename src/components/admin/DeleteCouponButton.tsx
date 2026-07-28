"use client";

import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface DeleteCouponButtonProps {
  couponId: string;
}

export default function DeleteCouponButton({ couponId }: DeleteCouponButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Bu kuponu silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/kupon/${couponId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Kupon başarıyla silindi.");
        router.refresh();
      } else {
        toast.error("Silme işlemi başarısız.");
      }
    } catch (error) {
      toast.error("Bir hata oluştu.");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50"
      title="Kuponu Sil"
    >
      <Trash2 size={16} />
    </button>
  );
}
