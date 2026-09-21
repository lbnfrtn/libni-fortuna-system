import { redirect } from "next/navigation";

// TODO(Libni): point this at the GHL calendar link at go-live.
export default function Book() {
  redirect("/contact");
}
