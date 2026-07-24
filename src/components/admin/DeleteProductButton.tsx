"use client";

import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface DeleteProductButtonProps {
  productId: string;
}

export default function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Bu ürünü silmek (pasife almak) istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/urunler/${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Ürün başarıyla silindi (pasife alındı).");
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
      className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50"
      title="Ürünü Sil"
    >
      <Trash2 size={15} />
    </button>
  );
}
