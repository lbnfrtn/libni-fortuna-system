import { isLoggedIn } from "@/lib/auth";
import DeskLogin from "../DeskLogin";
import ImportClient from "./ImportClient";
import AdminNav from "@/app/components/AdminNav";

export const dynamic = "force-dynamic";

export default async function ImportPage() {
  const session = await isLoggedIn();
  if (!session) return <DeskLogin />;
  return (
    <>
      <AdminNav current="/desk/import" user={session} />
      <ImportClient />
    </>
  );
}
