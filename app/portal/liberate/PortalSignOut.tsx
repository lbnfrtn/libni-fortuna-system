"use client";

export default function PortalSignOut({ admin, adminHref = "/admin/liberate" }: { admin: boolean; adminHref?: string }) {
  if (admin) return <a href={adminHref}>{adminHref.includes("liberate") ? "Liberate HQ" : "Admin"}</a>;
  return (
    <button
      type="button"
      onClick={async () => { await fetch("/api/portal/login", { method: "DELETE" }); location.href = "/portal"; }}
    >
      Sign out
    </button>
  );
}
