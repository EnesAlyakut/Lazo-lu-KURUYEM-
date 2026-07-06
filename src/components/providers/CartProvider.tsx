"use client";

// CartProvider - simply wraps children, real logic is in Zustand store
export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
