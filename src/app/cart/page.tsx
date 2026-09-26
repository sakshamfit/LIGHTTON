import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]} title="Your cart" />
      <CartView />
    </>
  );
}
