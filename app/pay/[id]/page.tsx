import { store } from "@/lib/store";
import PaymentClient from "./PaymentClient";
import { SitePage } from "@/app/components/Chrome";

export const dynamic = "force-dynamic";

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let order = null;
  try {
    order = await store().get(id);
  } catch (err) {
    console.error("Order lookup failed:", err);
  }

  if (!order) {
    return (
      <SitePage>
        <div className="wrap" style={{ maxWidth: 600, paddingTop: 100, paddingBottom: 100, textAlign: "center" }}>
          <h1 style={{ fontSize: 30, marginBottom: 10 }}>Order not found</h1>
          <p className="muted">This payment link doesn&rsquo;t exist or has expired. If you think this is a mistake, just reply to your email and I&rsquo;ll help.</p>
        </div>
      </SitePage>
    );
  }

  const bank = process.env.BANK_ACCOUNT_NUMBER
    ? {
        name: process.env.BANK_NAME || "",
        accountName: process.env.BANK_ACCOUNT_NAME || "",
        accountNumber: process.env.BANK_ACCOUNT_NUMBER || "",
      }
    : null;

  return (
    <SitePage>
      <PaymentClient order={order} orderId={id} bank={bank} />
    </SitePage>
  );
}
