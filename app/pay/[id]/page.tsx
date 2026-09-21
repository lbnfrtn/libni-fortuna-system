import { store } from "@/lib/store";
import PaymentClient from "./PaymentClient";
import { SitePage } from "@/app/components/Chrome";

export const dynamic = "force-dynamic";

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = store();

  let order: any = null;
  try {
    order = await db.get(id);
  } catch (err) {
    console.error("Order not found:", err);
  }

  if (!order) {
    return (
      <SitePage>
        <div className="wrap" style={{ paddingTop: 100, textAlign: "center" }}>
          <h1>Order Not Found</h1>
          <p>The payment link you're looking for doesn't exist or has expired.</p>
        </div>
      </SitePage>
    );
  }

  return (
    <SitePage>
      <PaymentClient order={order} orderId={id} />
    </SitePage>
  );
}
