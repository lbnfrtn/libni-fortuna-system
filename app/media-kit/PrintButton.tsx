"use client";

export default function PrintButton() {
  return <button type="button" className="ed-btn ed-btn-ghost ed-noprint" onClick={() => window.print()}>Print / save as PDF</button>;
}
