import { redirect } from "next/navigation";

// TODO(Libni): point this at the booking calendar link (Calendly) at go-live.
export default function Book() {
  redirect("/contact");
}
