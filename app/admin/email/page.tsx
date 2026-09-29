import { isLoggedIn } from "@/lib/auth";
import DeskLogin from "../../desk/DeskLogin";
import AdminNav from "@/app/components/AdminNav";
import { getFunnel } from "@/lib/funnel";
import { mailConfigured, mailFrom } from "@/lib/mail";
import FunnelClient from "./FunnelClient";

export const dynamic = "force-dynamic";

export default async function EmailAdmin() {
  const session = await isLoggedIn();
  if (!session) return <DeskLogin />;
  const funnel = await getFunnel();
  return (
    <>
      <AdminNav current="/admin/email" user={session} />
      <div className="wrap-wide">
        <p className="kicker">Email &amp; funnel</p>
        <h1 style={{ margin: "4px 0 6px" }}>Every letter the site sends.</h1>
        <p className="muted" style={{ maxWidth: "70ch" }}>
          People are enrolled by what they do — sign up, apply, get a payment link, pay — and dropped out by what happens next. Edit any word below; changes apply to the next letter that goes out.
        </p>
        <FunnelClient initial={funnel} configured={mailConfigured()} from={mailFrom()} me={session.email} owner={session.role === "owner"} />
      </div>
    </>
  );
}
