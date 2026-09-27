# Findwell - Work Tracker

Last updated: 2026-09-26

## How to use this file

- **Epics** are the top-level buckets. Each has a one-line goal and a status.
- **Requirements** are what must be true for the epic to be done.
- **Tasks** are the concrete work, with checkboxes. Owner in brackets where known.
- Dependencies are called out at the epic level so sequencing stays visible.

Status key: `Not started` / `In progress` / `Blocked` / `Done`

---

## Links

**Surveys (live)**
- Patient survey: https://findwell-surveys.vercel.app/patient
- Therapist survey: https://findwell-surveys.vercel.app/therapist
- Survey admin (response monitoring): https://findwell-surveys.vercel.app/admin

**Code and data**
- Survey repo: https://github.com/Xstatick/findwell-surveys
- App repo: https://github.com/Xstatick/Findwell
- Survey database (Supabase): https://ztzpwctvypakdrnapefx.supabase.co/

**Design**
- Theme source of truth: the July 2026 design exports (`Findwell_Survey.zip`, `Match_Review.zip`), specifically `colors_and_type.css`, the `fonts/` folder, and `assets/logo-mark*.svg`
- Brand summary: `brand-assets-reference.md` in project files

---

## Sequencing at a glance

1. **Epic 1 (Matching model)** gates the detailed work in Epics 2 and 3.
2. **Epic 5 (Trust, safety, compliance)** has two items that must move early: the crisis protocol and the matching-not-therapy positioning, since both shape the interviewer design.
3. **Epic 4 (Architecture)** and **Epic 7 (UI and brand)** can run in parallel at the component and theme level.
4. **Epic 6 (Therapist supply)** starts once the therapist-side dimensions exist.
5. **Epic 8 (Discovery surveys)** is live; the remaining work is response monitoring and synthesis.

---

## Epic 1: Matching model

**Goal:** Define the dimensions, scoring, and feedback loop that turn a patient profile and a therapist profile into a ranked match.
**Status:** In progress
**Gates:** Epic 2 (detailed journeys), Epic 3 (interviewer design)

### Requirement 1.1: Matching dimensions are defined and clinically reviewed
- [ ] Draft v1 taxonomy built on the goals / tasks / bond framework, plus concern areas, identity comfort, and logistics
- [ ] Shannon review using the open questions in the research reference [Shannon]
- [ ] Define the therapist-side mirror of every patient dimension
- [ ] Decide whether to capture intensity (how much it affects daily life) or leave it out
- [ ] Confirm every dimension can be captured without diagnosis

### Requirement 1.2: Fit scoring approach is defined
- [ ] Separate hard filters (licensure, insurance or budget, format, exclusions) from ranked dimensions
- [ ] Define initial weighting, with a note on what is hypothesis vs. evidence
- [ ] Define how "what didn't work before" acts as a negative signal
- [ ] Define what earns the fit-tier labels already in the Match Review mocks (Excellent / Strong / Good fit)

### Requirement 1.3: Feedback loop is defined
- [ ] Post-session patient fit check (timing, questions, scale)
- [ ] Lightweight therapist fit rating
- [ ] Rematch rules: when it triggers, what it uses, who pays
- [ ] Session 3 to 4 check-in

### Requirement 1.4: Research base is verified
- [ ] Verify Constantino et al. (2021) matching trial before citing
- [ ] Verify Swift et al. (2018) preference accommodation meta-analysis before citing
- [ ] Review cultural and identity matching evidence

---

## Epic 2: User journeys and prototype

**Goal:** Produce the journeys that drive the demo, marketing materials, and software design.
**Status:** In progress
**Depends on:** Epic 1 for detail; sketches can start now

### Requirement 2.1: Core journeys are documented
- [ ] Patient journey end to end (Maya): arrival, consent, check-in, intake, match reveal, handoff, fit check
- [ ] Therapist journey: onboarding, profile, receiving a match profile, fit rating
- [ ] Rematch journey
- [ ] Crisis path: what the patient sees if risk language appears

### Requirement 2.2: Demo scope is chosen
- [ ] Decide which journeys become the prototype
- [ ] Demo script
- [ ] Marketing narrative drawn from the journeys

---

## Epic 3: AI intake interviewer

**Goal:** A conversational interviewer that gets rich answers to a fixed set of matching questions and produces structured output. Modeled on the Anthropic interviewer pattern: structured underneath, conversational on top.
**Status:** Not started
**Depends on:** Epic 1 (dimensions), Epic 5 (crisis protocol, positioning)
**Design starting point:** the "conversation" direction in the survey redesign mocks (light and dark)

### Requirement 3.1: Interview guide covers every matching field
- [ ] One spec per field: goal, opening prompt, probe rules, done-when, output
- [ ] Question order and transitions
- [ ] Reflect-back and end-of-interview summary the patient can edit

### Requirement 3.2: Tone and guardrails are defined
- [ ] Tone and voice guidelines (warm, brief, never interprets or diagnoses)
- [ ] Follow-up cap per field
- [ ] Every field skippable; missing data handled by the algorithm
- [ ] No probing of emotional or trauma content
- [ ] Progress indicator behavior
- [ ] Decision: text only vs. optional spoken voice

### Requirement 3.3: Output is consumable by the matching model
- [ ] Output schema: structured tags plus the patient's own words for match explanations
- [ ] Match profile format shared with the therapist (with consent)

### Requirement 3.4: Interviewer is tested before it meets a real user
- [ ] Synthetic transcript set covering common and edge cases
- [ ] Shannon review of tone and accuracy [Shannon]
- [ ] Crisis detection tests
- [ ] Extraction accuracy checks against the schema

---

## Epic 4: System architecture

**Goal:** A high-level design the team can build against.
**Status:** Not started
**Can run in parallel with Epic 1 at the component level**
**Starting assets:** App repo (github.com/Xstatick/Findwell), survey repo (Next.js on Vercel, Supabase)

### Requirement 4.1: Components and data model are defined
- [ ] Component map: intake, matching, therapist profiles, scheduling, messaging, feedback
- [ ] Data model: patient profile, therapist profile, match, fit ratings, rematch history
- [ ] Consent and data retention rules reflected in the model
- [ ] Design system as a shared package: tokens, fonts, and logo consumed by every surface, not copied per app

### Requirement 4.2: Platform decisions are made
- [ ] AI provider approach and cost model
- [ ] Build vs. buy: scheduling, forms, messaging, video
- [ ] Hosting and environment strategy (Vercel and Supabase are already in use for surveys; confirm for the product)
- [ ] Security and privacy posture (see Epic 5 for the HIPAA question)

---

## Epic 5: Trust, safety, and compliance

**Goal:** Findwell is clearly a matching service, not therapy, and handles crisis and sensitive data responsibly.
**Status:** Not started
**Early items:** crisis protocol and positioning gate Epic 3

### Requirement 5.1: Legal positioning is clear
- [ ] Legal review of matching-not-therapy positioning
- [ ] Review of state rules on AI in mental health. Starting points: Illinois WOPR Act (Aug 2025) bars AI from therapy conversations, treatment decisions, and reading emotions; Nevada (2025) similar ban; Colorado, Maine, Rhode Island, Tennessee, Vermont enacted restrictions in 2026; Utah and New York took a disclosure and crisis-routing approach. Florida has no law yet. Design for the strictest state.
- [ ] Confirm whether Findwell has any mandated reporting obligations
- [ ] Decide whether Findwell is a HIPAA covered entity or business associate

### Requirement 5.2: Crisis protocol exists
- [ ] Risk language detection approach
- [ ] Pause-and-route behavior (988, emergency options)
- [ ] Persistent "need help now" link on every screen
- [ ] What the patient is told up front about crisis handling

### Requirement 5.3: Consent and disclosure language is written
- [ ] What Findwell is and isn't
- [ ] Data use, who sees what, and when
- [ ] Consent to share the match profile with the therapist

---

## Epic 6: Therapist supply

**Goal:** A vetted, high-quality therapist pool that lives up to the "It's Just Lunch" positioning.
**Status:** Not started
**Depends on:** Epic 1 (therapist-side dimensions)

### Requirement 6.1: Quality bar is defined
- [ ] Vetting and quality criteria
- [ ] Credential verification approach
- [ ] Exclusion handling (concerns and populations a therapist won't treat)

### Requirement 6.2: Therapist onboarding is designed
- [ ] Profile design mirroring the matching dimensions
- [ ] Style self-description that maps to patient language [Shannon input]
- [ ] Intro video guidance

### Requirement 6.3: Early recruiting plan
- [ ] Shannon's network and SMHCA outreach [Shannon]
- [ ] Target pool size for the pilot

---

## Epic 7: UI and brand design

**Goal:** One theme applied consistently across the product, demo, and every artifact (slides, whitepapers, documents).
**Status:** In progress
**Source of truth:** the July 2026 design exports (see Links). The full token system lives in `colors_and_type.css`.

### Requirement 7.1: Theme is consolidated and shared
- [x] Review existing design theme and mocks
- [x] Decide the source of truth: the design exports, not the survey repo
- [ ] Update `brand-assets-reference.md` to cover the full token system (plum, peach, lavender, butter, paper, rose; light and dark; type scale)
- [x] Reconcile the survey repo with the exports: the current repo `globals.css` already carries the full token system (the July export snapshot was stale)
- [ ] Clean the "TheraMatch" header and `--tm-` prefix once naming settles
- [ ] Theme guide for non-product artifacts: slides, documents, whitepapers. Fonts embed in HTML and PDF; native Office files need a fallback (Georgia for display, system sans for body)

### Requirement 7.2: Logo is finalized
- [ ] Decide naming first (Findwell vs. alternatives); blocks the wordmark
- [ ] Finalize logomark and wordmark, then re-export
- [ ] Dark and light variants confirmed

### Requirement 7.3: Product UI is designed
- [ ] Pick a survey redesign direction (notebook, quiet card, conversation) or confirm the shipped survey stays as is
- [ ] Pick a Match Review variant (A compact, B featured top match, C rich equal hierarchy)
- [ ] Mocks for the patient intake journey [Aral]
- [ ] Mocks for the fit check and rematch [Aral]
- [ ] Mocks for the therapist journey [Aral]
- [ ] Component library aligned to the theme

---

## Epic 8: Discovery surveys

**Goal:** Validate the market need on both sides and capture patient and therapist language for product and pitch.
**Status:** In progress (both surveys live)

### Requirement 8.1: Surveys are live
- [x] Therapist survey built and live
- [x] Patient survey built and live
- [x] Admin area for monitoring responses

### Requirement 8.2: Responses are collected
- [ ] Therapist outreach via Shannon and SMHCA [Shannon]
- [ ] Patient outreach to friends and family (Discord, text, email)
- [ ] Track responses by channel (link parameter)
- [ ] Decide the sample-size target for this round (30 to 50 patient responses is the working number)

### Requirement 8.3: Results are synthesized
- [x] Patient survey synthesis: search behavior, fit failures, language
- [x] Therapist survey synthesis: referral pain, screening burden, fit criteria
- [x] Feed fit-failure language into Epic 1 (dimensions) and Epic 2 (narrative)
- [ ] Contact list from opt-ins for focus groups and early access

---

## In flight elsewhere

- [ ] Team bios: Erika's needs Shannon's detail; Andrew's needs his TheraMatch hinge
- [ ] Naming and domain: Findwell.com owned by a Seattle real estate company; findwell.co is the fallback

---

## Decisions log

- 2026-09-26: Intake is a matching survey, not a clinical interview. No history-taking, no emotional pattern insights.
- 2026-09-26: Interviewer follows the Anthropic interviewer pattern: fixed fields, open-ended questions, AI probes for rich answers, structured output.
- 2026-09-26: Matching dimensions come from the goals / tasks / bond alliance framework, plus concern areas, identity comfort, and logistics. Concern areas use plain language, never DSM categories.
- 2026-09-26: Matching dimensions are separate from the discovery surveys. Surveys validate market need; dimensions define fit.
- 2026-09-26: UI and brand design is its own epic and the theme applies to every artifact, not just the product.
- 2026-09-26: The July 2026 design exports are the theme source of truth, not the survey repo.
- 2026-09-26: Surveys shipped on the custom Next.js app (Vercel, Supabase), not Typeform. Earlier project docs that reference Typeform are superseded.
- 2026-09-26: Round 1 survey synthesis complete. 26 valid patient responses, 10 therapist. See findwell-survey-synthesis.md.
