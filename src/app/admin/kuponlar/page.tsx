import { prisma } from "@/lib/prisma";
import KuponlarClient from "./KuponlarClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kupon Yönetimi" };

export default async function AdminKuponlarPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <KuponlarClient coupons={coupons} />;
}

