"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminGirisPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/giris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Giriş başarılı. Yönlendiriliyorsunuz...");
        router.push("/admin");
        router.refresh();
      } else {
        toast.error(data.message || "Giriş başarısız.");
      }
    } catch {
      toast.error("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-900 via-brand-800 to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="relative mx-auto mb-6 h-32 w-32 sm:h-40 sm:w-40 transition-transform duration-500 hover:scale-105">
            <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl" />
            <Image
              src="/images/logo_circular.png"
              alt="LAZOĞLU KURUYEMİŞ"
              fill
              className="object-contain drop-shadow-2xl"
              priority
              quality={100}
            />
          </div>
          <h1 className="font-display text-3xl font-bold text-white drop-shadow-md">
            LAZOĞLU KURUYEMİŞ
          </h1>
          <p className="mt-2 text-brand-300 font-medium tracking-wide">Yönetim Paneli</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <h2 className="mb-6 text-center text-xl font-bold text-gray-900">
            Yönetici Girişi
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="input-label">Kullanıcı Adı</label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  required
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  className="input-field pl-10"
                  placeholder="lazoglu"
                />
              </div>
            </div>

            <div>
              <label className="input-label">Şifre</label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((visible) => !visible)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPass ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center rounded-2xl py-4 text-base"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            Şifrenizi unuttuysanız yönetici kaydını güncelleyin veya seed scriptini tekrar çalıştırın.
          </p>
        </div>
      </div>
    </div>
  );
}
