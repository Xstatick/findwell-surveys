# Findwell - Patient Survey (Draft for Review)

## Purpose

This document captures the patient-side discovery survey developed by the Findwell founding team. The survey is designed to be sent to the founders' friends and family network as a first-round validation of the patient pain points the product is being built to solve.

This is a companion piece to the therapist survey. Where the therapist survey validates the clinician-side problem, this one validates the patient-side problem.

---

## Survey Goals

**Primary goals (this survey):**
- A. Validate that finding the right therapist is a real and meaningful pain point for patients
- B. Map current patient behavior, where people search, what they try, what they give up on, and the language they use to describe the experience

**Deferred to a later, more representative survey:**
- C. Matching criteria research (what patients actually use to decide on a therapist)
- D. Trust and willingness research (comfort sharing sensitive information with a matching service)

C and D are explicitly out of scope for this survey because the friends-and-family sample is too biased to support product or UX decisions on those topics. They will be revisited with a more diverse sample once a working prototype exists.

---

## Audience and Approach

- **Audience:** The founders' friends and family network
- **Coverage:** Both people who have sought therapy and those who have not, with branching logic to route them appropriately
- **Platform:** Typeform preferred (warmer feel, supports branching cleanly)
- **Anonymity:** Anonymous by default
- **Opt-in:** Optional contact opt-in at the end, with a brief reveal of the project at that point
- **Length target:** 10 minutes or less

---

## Framing and Bias Mitigation

Friends-and-family surveys carry a known bias: respondents who like the founder will be generous with their answers and may overstate problems or downplay skepticism. The survey mitigates this through:

1. **Delayed reveal.** The project is not described at the start. Respondents answer questions about their lived experience before learning what is being built.
2. **Neutral question wording.** Questions ask about experience, not opinion. We ask "what happened" rather than "was it hard."
3. **Story prompts over scale ratings.** Open-text questions that invite specific memories tend to surface real friction. Rating scales tend to invite politeness.
4. **No mention of Findwell (or any product name) until the opt-in page.**

Data from this survey should be treated as directional, useful for confirming the problem space and surfacing patient language, not as a basis for hard product decisions.

---

## Final Survey

### Intro Text

*Your responses are completely anonymous. I'm researching how people experience finding mental health support, and I'd love your honest take. There are no right or wrong answers, and you can skip anything you don't want to answer. At the end, you'll have the option to share your contact information if you'd like to stay involved. This should take about 10 minutes.*

---

### Section 1: For Everyone

**Q1. Have you ever considered trying therapy or counseling?**
- Yes, and I have tried it
- Yes, but I've never tried it
- No, I haven't really considered it

*Branching logic:*
- *"Yes, and I have tried it" routes to Section 2 (the full survey)*
- *"Yes, but I've never tried it" routes to Section 3 (shorter path)*
- *"No, I haven't really considered it" routes to Section 4 (minimal path) and the opt-in*

*Rationale: This is the routing question. It's deliberately phrased to make all three answers feel equally valid. We avoid loaded language like "have you ever sought help" which can feel judgmental to the third group.*

---

### Section 2: For People Who Have Tried Therapy

**Q2. Roughly how long ago was your most recent search for a therapist?**
- Within the last year
- 1 to 3 years ago
- 3 to 10 years ago
- More than 10 years ago

*Rationale: Recency matters. A search experience from 2010 tells us very little about today's market. This lets us segment the data and weight recent experiences more heavily.*

---

**Q3. The most recent time you tried to find a therapist, where did you start looking?**
*(Open text)*

*Rationale: The most important question in the survey. Open-ended on purpose, we want to hear the answer in their own words. Likely to surface Psychology Today, BetterHelp, Google searches, insurance directories, friend recommendations, primary care referrals, and other unprompted mentions. The pattern of answers will tell us what we are competing with and replacing. We focus on the most recent search because the goal is to understand today's market, not historical search behavior.*

---

**Q4. After that initial start, walk me through what came next. We're curious about the whole experience: who you contacted, who you talked to, what worked, what didn't.**
*(Open text)*

*Rationale: The journey question. Where Q3 captures the starting point, Q4 captures the arc that followed, the pivots, the dead ends, the moments people leaned on others or gave up. The "walk me through" framing invites a narrative rather than a list, which produces specific, quotable detail we can use for product design and pitch material. The illustrative prompts are deliberately broad so respondents who took non-outreach paths (talking to friends, asking a doctor, giving up and trying later) feel free to describe those too.*

---

**Q5. Roughly how many therapists did you reach out to (calls, emails, intake forms, contact requests) before you found one you stuck with?**
*Counts every therapist you contacted, even ones who never responded or who you didn't end up meeting.*
- 1
- 2 to 3
- 4 to 6
- More than 6
- I never found one I stuck with

*Rationale: Quantifies the search burden. The "never found one" option is critical, it surfaces the people who churned out of the system entirely, which is the cost of the matching problem in its starkest form.*

---

**Q6. Of the therapists you actually met with, how many did you cycle through before finding one who felt right?**
- 1, the first one was a good fit
- 2 to 3
- 4 or more
- I never found one who felt right

*Rationale: Different from Q5. Q5 measures friction in the search, Q6 measures friction in the matching itself. Together they tell us where in the funnel the system is breaking.*

---

**Q7. If you tried therapists who didn't feel like a good fit, what made it not work?**
*(Open text)*

*Rationale: Surfaces patient-side matching criteria in their own words. We are deliberately not asking "what makes a good fit" because that invites idealized answers. Asking what didn't work surfaces real, specific failures.*

---

**Q8. Was there ever a point where you considered giving up on finding a therapist altogether?**
- Yes
- No
- I did give up, at least for a while

*If yes or "I did give up": What was happening at that point?*
*(Open text)*

*Rationale: The stakes question. This is the one that surfaces stories like the founder's New Orleans experience, moments where the broken system had real human cost. Critical for narrative and pitch material. The third option ("I did give up") is important because some respondents will have actually walked away rather than just considered it.*

---

**Q9. What, if anything, would have made finding the right therapist easier the first time?**
*(Open text)*

*Rationale: Lets respondents articulate the solution in their own words without us leading them. Some will describe TheraMatch unprompted. Others will describe something different, which is equally valuable.*

---

*All Section 2 respondents now route to the opt-in page.*

---

### Section 3: For People Who Considered Therapy but Never Tried

**Q10. What drew you to consider therapy in the first place?**
*(Open text)*

*Rationale: Establishes the trigger, the moment something pushed them toward seeking help. Useful for understanding patient motivation and for marketing language.*

---

**Q11. What stopped you from trying?**
*(Open text)*

*Rationale: The most important question for this group. We want to hear about cost, stigma, overwhelm, fear, time, not knowing where to start, fear of getting it wrong, all of it. The answers here will tell us what TheraMatch needs to overcome to convert a "considering" patient into an active one.*

---

**Q12. If you imagined trying to find a therapist tomorrow, where would you start?**
*(Open text)*

*Rationale: Maps the mental model of someone who hasn't been through the process. Very different data from Q3, which captures actual behavior. This tells us what intuitions people bring before they know how broken the current system is.*

---

**Q13. What would have to be true for you to take that first step?**
*(Open text)*

*Rationale: Surfaces the gap between consideration and action. The answers describe the conditions TheraMatch would need to meet to be the thing that finally tips someone into trying.*

---

*All Section 3 respondents now route to the opt-in page.*

---

### Section 4: For People Who Haven't Considered Therapy

**Q14. If a close friend told you they were thinking about trying therapy, what advice would you give them about how to find one?**
*(Open text)*

*Rationale: Even people who haven't sought therapy themselves often have informed opinions from friends, family, or media. This question respects them as observers of the space without forcing them to manufacture personal experience.*

---

**Q15. Is there anything that has shaped your view of therapy, positive or negative?**
*(Open text)*

*Rationale: Optional, low-pressure question that may surface useful context. Some respondents will pass on this; others will share family experiences, cultural context, or media exposure that shapes how they think about mental health support.*

---

*All Section 4 respondents now route to the opt-in page.*

---

### Optional Opt-In and Project Reveal, Final Page

*Thank you. Your input is genuinely valuable, and reading these answers is going to directly shape what we build.*

*Here's a bit about what this survey was for:*

*"This survey is part of the early research for Findwell, a curated service we're building that matches people with the right therapist on the first try, instead of cycling through bad fits the way most people do today. Our team includes a practicing clinical psychologist and operators with backgrounds in software, design, and health technology. We're positioning Findwell as the more boutique alternative to the directory sites and big-box services that exist today, and your input is shaping what we build."*

*If you'd like to stay involved, whether that's joining a future conversation, getting early access when there's something to show, or simply hearing about how this develops, we'd love to stay in touch. Sharing your information below is entirely optional.*

- Name
- Email
- I'm interested in: [ ] Joining a focus group or conversation [ ] Early access when available [ ] Just keep me updated

---

## For Sharing the Survey (Not Part of the Survey Itself)

The text below is a template for any team member to use when sharing the survey link with their personal network. Adapt the signature and personalization to fit your relationship with the recipient. These are personal outreach messages, not survey content.

### Email Version

> **Subject:** Quick favor, can you fill out this survey I built exploring how people find therapy?
>
> Hi [name],
>
> I'm part of an early-stage team working on an idea in mental health. Before we tell you what we're building, we'd love to understand your experience first - would you take 10 minutes to fill out an anonymous survey?
>
> It's about how people find (or don't find) mental health support. There are no right or wrong answers, and you can skip anything you don't want to answer. At the end, you'll have the option to share your contact info if you'd like to stay involved.
>
> Link: [survey URL]
>
> Thank you,
> [Your name]

### Text/SMS Version

> Hey! I'm part of an early-stage team working on an idea in mental health and I'd love your help. Before we tell you what we're building, we want to understand your experience first - would you take 10 minutes to fill out an anonymous survey? [survey URL]

### Why this framing

This outreach framing tells respondents the sender is part of a project (so they aren't surprised by the reveal at the end) without telegraphing what the project is. It explicitly delays the pitch, which signals we want their real answers rather than a vote of confidence. It does not mention Findwell, therapists specifically, or any solution language.

---

## Open Questions and Notes

1. **Sample size target.** Aiming for 50 responses from the friends-and-family sample. This is enough to be directionally useful without overcommitting; below 20 starts to feel anecdotal.

2. **Section 4 length.** Only two questions. We could add more, but for the "haven't considered therapy" group, brevity is respectful, they have less to say on the topic and we shouldn't manufacture questions to fill space.
