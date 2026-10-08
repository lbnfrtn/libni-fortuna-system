# Come Home to Yourself — the email flow

**Page:** https://libni.co/come-home · **Price:** ₱299 (set in `config/offers.ts`) · **What they get:** the 17-page workbook (PDF) + the 15-minute guided meditation (MP3)

## Who sends what

| When | Sent by | What |
|---|---|---|
| They start checkout | the site → EmailOctopus | Added to your EmailOctopus list, tagged `come-home-checkout` |
| They don't pay | the site (Resend) | "Your workbook is still waiting" (1 day later), "The door stays open" (3 days later). Stops the moment they pay. Edit at `/admin/email`. |
| They pay | the site (Resend) | **"Your workbook and meditation are here"** with their personal download link, straight away. Edit at `/admin/email`. |
| They pay | the site → EmailOctopus | Tag `come-home-buyer` added (`come-home-checkout` removed), and their personal link saved in the field `ComeHomeLink` |
| Days 1–30 after buying | **the site (Resend)** | The 7 letters below: practice → Project Me → Power Hour → The Becoming. All in the `paid-come-home` sequence in `lib/funnel.ts`. Edit at `/admin/email`. |

**Decision 2026-10-08 (Libni): the site sends the whole journey, not EmailOctopus.** The free EmailOctopus plan kept blocking us (5 steps per automation, 3 automations total), and the site's own sender has no limits and already emails buyers. So all 7 follow-up letters now live in the site's `paid-come-home` sequence, days 1/3/6/9/14/21/30 after purchase. EmailOctopus still collects every buyer (tag `come-home-buyer`) for broadcasts. The two draft automations built in EmailOctopus earlier are kept **OFF** so nothing double-sends — leave them off, or delete them.

The EmailOctopus automation copy is kept below only as a reference/backup in case Libni ever upgrades and wants it there instead.

## One-time setup in EmailOctopus

1. **API key** — your name (top right) → **Integrations & API** → **API keys** → **Create key**. Name it `libni.co`. ✅ Done 2026-10-08 (saved in Vercel as `EMAILOCTOPUS_API_KEY`).
2. **List** — nothing to do. EmailOctopus's new app hides list ids, so the site finds your list (your Contacts) by itself. (`EMAILOCTOPUS_LIST_ID` in Vercel would override it, only needed if you ever have several lists.)
3. Without the key the site only *logs* what it would send to EmailOctopus — sales and downloads work either way.
4. **Field** — the site creates the `ComeHomeLink` field itself on the first sale. (Or make it now: list → **Fields** → add a text field, tag `ComeHomeLink`.)
5. **Automation** — **Automations** → **Create automation** → trigger **"Contact tag added"** → tag `come-home-buyer` → add the emails below with a **Delay** before each. Turn it **on** before the first sale (automations only catch tags added while they're active).

Merge tags: `{{FirstName}}` (set its default to **love** when you insert it, so a missing name reads "Hi love,") and `{{ComeHomeLink}}`.

---

## The automation — 7 letters

### 1 · Delay 1 day
**Subject:** Did you arrive?
**Preview:** Not all five. One.

Hi {{FirstName}},

Yesterday you did something small that isn't small. You chose to come home to yourself.

If you haven't opened your workbook yet, here it is again: {{ComeHomeLink}}

Tonight, start with Practice 1, Arrive in Your Body. Not all five. One.

Feet flat on the floor. One hand on your heart, one on your belly. Breathe in slowly through your nose, and let the out-breath be a little longer than the in-breath. Five times. Let your shoulders drop. Then softly tell yourself: "I'm here. I've arrived."

That's the whole practice. Coming home doesn't start with figuring it all out. It starts with arriving.

— Libni

P.S. If you'd rather be guided, press play on the meditation first and let the pen move after.

---

### 2 · Delay 2 days
**Subject:** The little you is still in there
**Preview:** And the person they've been waiting for is you.

Hi {{FirstName}},

So many of the ways we abandon ourselves were learned when we were small.

The little one who learned to be good so they'd be loved. Who learned to be quiet so there'd be peace. Who learned they had to be okay so everyone else could be okay.

That little one isn't gone. They're in the way you over-explain, over-give, and wait to be chosen. And the person they've been waiting for is you.

Practice 2 is where you go back for them. Kneel down to their level and tell them: "I see you. You didn't do anything wrong. You don't have to earn my love. I'm here now." Then make them one small promise you can actually keep this week.

If heavy memories come up, you don't have to go there alone. Just reply to this. I read every one.

Your pages are here: {{ComeHomeLink}}

— Libni

---

### 3 · Delay 3 days
**Subject:** What happens after day seven
**Preview:** It's a choice you make again and again.

Hi {{FirstName}},

By now you might be near the end of your 7-day tracker. Or you might still be on Practice 1. Both are perfect.

Before the week ends, I want you to hear this: coming home isn't one big moment where everything suddenly feels better. Some days you'll feel so close to yourself. Other days the old stories will come back loud.

That doesn't mean you're back at the start. It means you're human. And now you know the way back.

What makes the difference isn't one perfect week. It's having somewhere to come back to, every day.

That's why I made Project Me. It's a pocket sanctuary. Tell it how you feel and it walks you through it: something to listen to, a way to breathe, something to understand, a place to write it out.

Inside: daily practices matched to how you feel, breathwork and guided audio, journaling prompts, and The Circle, a monthly live call.

It's ₱1,499 for three months.

See Project Me: https://projectme.libni.co

— Libni

---

### 4 · Delay 3 days
**Subject:** You don't need a two-hour ritual
**Preview:** Something you'll actually open at 11 p.m.

Hi {{FirstName}},

You don't need a two-hour ritual to come home to yourself.

You need something you'll actually open at 11 p.m. when it's heavy.

Project Me is that: a daily practice built around how you feel right now, with breathwork, guided audio, reflection prompts and a monthly circle. Small, soft, consistent. The kind of support that stays.

If these five practices helped you feel even a little closer to yourself, this is how you keep that going on the ordinary days, not just the brave ones.

Start here: https://projectme.libni.co

— Libni

---

### 5 · Delay 5 days
**Subject:** If something opened
**Preview:** This is the work I love doing.

Hi {{FirstName}},

These practices are a doorway. If something opened in you and you'd like someone to walk through it with you, this is the work I love doing.

Not because there's something wrong with you. Because there is so much more of you waiting to be lived.

If you keep circling the same pattern, start with a Power Hour. Ninety minutes, just the two of us. Not a discovery call: this is the work. We go straight to what's really underneath, and you leave with clarity and a next step.

Online (₱7,777) or in person (₱8,888). You pay, then choose a time that's yours.

Book your Power Hour: https://libni.co/programs/ignite

— Libni

---

### 6 · Delay 7 days
**Subject:** The deepest work I offer
**Preview:** You can name the thing and still be run by it.

Hi {{FirstName}},

You have language for your patterns now. You've named the part that's been running the show. You've rewritten the story.

But language isn't the same as freedom. You can name the thing and still be run by it.

The Becoming is my deepest private container. Twelve weeks of sustained 1:1 work with the subconscious, the nervous system and the body. Every week we sit down, you and me, and go to the root. We stop circling the pattern and meet what's underneath, together.

I only take a handful of people into it at a time, so it begins with an application, and then we talk, honestly, about whether it's right.

Read about The Becoming: https://libni.co/programs/the-becoming

Not sure which one is right for you? Reply and tell me a little about where you are right now, and we'll figure it out together.

— Libni

---

### 7 · Delay 9 days
**Subject:** Come back to these pages
**Preview:** On the good days. On the hard days, too.

Hi {{FirstName}},

It's been about a month since you started coming home to yourself.

Come back to these pages anytime you need them. On the good days. On the hard days, too: {{ComeHomeLink}}

You can honor who you were and still choose to become someone new.

And whenever you want company on the way:

Every day: Project Me, https://projectme.libni.co
One focused conversation: Power Hour, https://libni.co/programs/ignite
Twelve weeks, 1:1: The Becoming, https://libni.co/programs/the-becoming

See you on the other side,
Libni
