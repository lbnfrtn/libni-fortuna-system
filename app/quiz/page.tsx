import { SitePage } from "@/app/components/Chrome";
import { EdHeroSimple } from "@/app/components/Editorial";
import QuizClient from "./QuizClient";

export const dynamic = "force-dynamic";

export default function QuizPage() {
  return (
    <SitePage>
      <EdHeroSimple
        eyebrow="A 60-second quiz"
        title="Which space are you in?"
        lede="Four honest questions. No wrong answers. I’ll tell you where you are in the five spaces — and the right door to begin."
      />
      <section className="ed-sec-sm ed-ivory" style={{ paddingTop: 0 }}>
        <div className="ed-wrap ed-narrow ed-form ed-reveal" style={{ marginLeft: 0 }}>
          <QuizClient />
          <p className="ed-note" style={{ marginTop: 24 }}>Your answers aren’t stored. This is just for you.</p>
        </div>
      </section>
    </SitePage>
  );
}
