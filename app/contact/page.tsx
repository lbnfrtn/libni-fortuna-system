import Link from "next/link";
import { SitePage } from "@/app/components/Chrome";
import { EdHeroSimple } from "@/app/components/Editorial";
import ContactForm from "./ContactForm";

export const dynamic = "force-dynamic";

export default function Contact() {
  return (
    <SitePage>
      <EdHeroSimple
        eyebrow="Contact"
        title="Say hello."
        lede="Whether it’s working together, a corporate experience, a talk or a collaboration — tell me a little and a real person (often me) will reply within one business day."
      />
      <section className="ed-sec-sm ed-ivory" style={{ paddingTop: 0 }}>
        <div className="ed-wrap ed-split ed-split-top">
          <div className="ed-c7 ed-form ed-reveal"><ContactForm /></div>
          <aside className="ed-off-right5 ed-stack ed-reveal" style={{ transitionDelay: ".15s" }}>
            <div>
              <p className="ed-eyebrow">Email</p>
              <p className="ed-lede" style={{ marginTop: 8 }}><a href="mailto:hello@libni.co">hello@libni.co</a></p>
            </div>
            <div>
              <p className="ed-eyebrow">Instagram</p>
              <p className="ed-lede" style={{ marginTop: 8 }}><a href="https://instagram.com/libnifortuna" target="_blank" rel="noreferrer">@libnifortuna</a></p>
            </div>
            <div>
              <p className="ed-eyebrow">Not sure what you need?</p>
              <div className="ed-copy" style={{ marginTop: 8 }}><p>A few gentle questions and I’ll point you to the right door.</p><p><Link href="/start" className="ed-link">Find your path</Link></p></div>
            </div>
          </aside>
        </div>
      </section>
    </SitePage>
  );
}
