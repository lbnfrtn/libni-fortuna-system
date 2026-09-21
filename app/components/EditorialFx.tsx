"use client";

import { useEffect } from "react";

// Scroll-driven polish shared by every public page: the overlay nav turns
// ivory once the hero is passed, and `.ed-reveal` blocks fade up as they enter.
export default function EditorialFx() {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(".sitenav");
    const pending = new Set(document.querySelectorAll<HTMLElement>(".ed-reveal, .lb-reveal"));
    const update = () => {
      nav?.classList.toggle("ed-scrolled", window.scrollY > 80);
      // Anything at or above the viewport's lower edge is revealed, so fast scrolling never skips a block.
      const limit = window.innerHeight * 0.92;
      pending.forEach((el) => { if (el.getBoundingClientRect().top < limit) { el.classList.add("is-in"); pending.delete(el); } });
    };
    update();
    const settle = window.setTimeout(update, 600);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); window.clearTimeout(settle); nav?.classList.remove("ed-scrolled"); };
  }, []);
  return null;
}
