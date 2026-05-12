"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { getSupabase } from "@/lib/supabase";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  interests: string[];
}

const THERAPIST_INTERESTS = [
  { label: "Focus group", value: "focus-group" },
  { label: "One-on-one conversation", value: "one-on-one" },
  { label: "Just keep me updated", value: "updates" },
];

const PATIENT_INTERESTS = [
  { label: "Joining a focus group or conversation", value: "focus-group" },
  { label: "Early access when available", value: "early-access" },
  { label: "Just keep me updated", value: "updates" },
];

function ThankYouContent() {
  const searchParams = useSearchParams();
  const surveyType = searchParams.get("from") as "therapist" | "patient" | null;

  const [contact, setContact] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    interests: [],
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim());
  const showEmailError = emailTouched && contact.email.length > 0 && !emailIsValid;

  const isTherapist = surveyType === "therapist";
  const interests = isTherapist ? THERAPIST_INTERESTS : PATIENT_INTERESTS;

  const toggleInterest = (value: string) => {
    setContact((prev) => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter((i) => i !== value)
        : [...prev.interests, value],
    }));
  };

  const handleContactSubmit = async () => {
    if (!surveyType) return;

    setSubmitting(true);
    const tableName = isTherapist ? "therapist_responses" : "patient_responses";

    const contactData = {
      name: contact.name || undefined,
      email: contact.email || undefined,
      phone: contact.phone || undefined,
      interests: contact.interests.length > 0 ? contact.interests : undefined,
    };

    const responseId = sessionStorage.getItem(`findwell-${surveyType}-response-id`);
    if (!responseId) {
      console.error("No response ID found in session - cannot attach contact info");
      setSubmitting(false);
      setSubmitted(true);
      return;
    }

    const { error } = await getSupabase()
      .from(tableName)
      .update({ contact_optin: contactData })
      .eq("id", responseId);

    if (error) {
      console.error("Contact submission error:", error);
    } else {
      sessionStorage.removeItem(`findwell-${surveyType}-response-id`);
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  const canSubmitContact = emailIsValid;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold mb-4">Thank you!</h1>
          <p className="text-foreground/60 text-lg">
            {isTherapist
              ? "Your input is genuinely valuable and will directly shape what we build."
              : "Your input is genuinely valuable, and reading these answers is going to directly shape what we build."}
          </p>
        </div>

        {!isTherapist && !submitted && (
          <div className="bg-foreground/5 rounded-2xl p-6 mb-8 text-sm text-foreground/70 leading-relaxed">
            <p className="font-medium text-foreground mb-2">Here&apos;s a bit about what this survey was for:</p>
            <p>
              This survey is part of the early research for FindWell, a curated service we&apos;re building
              that matches people with the right therapist on the first try - instead of cycling through
              bad fits the way most people do today. Our team includes a practicing clinical psychologist
              and operators with backgrounds in software, design, and health technology. We&apos;re positioning
              FindWell as the more boutique alternative to the directory sites and big-box services that
              exist today, and your input is shaping what we build.
            </p>
          </div>
        )}

        {!submitted && (
          <div className="bg-foreground/5 rounded-2xl p-8">
            <h2 className="text-xl font-medium mb-2">Want to stay involved?</h2>
            <p className="text-foreground/60 mb-6 text-sm">
              {isTherapist
                ? "If you'd like to stay involved - whether that's joining a future focus group, a brief call, or simply hearing about what we develop - we'd love to stay in touch. This whole section is optional, but if you do share your info, we'll need a valid email so we can actually reach you."
                : "If you'd like to stay involved - whether that's joining a future conversation, getting early access when there's something to show, or simply hearing about how this develops - we'd love to stay in touch. This whole section is optional, but if you do share your info, we'll need a valid email so we can actually reach you."}
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={contact.name}
                onChange={(e) => setContact((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 rounded-xl border-2 border-foreground/10 bg-transparent text-foreground placeholder:text-foreground/30 focus:border-amber-500 focus:outline-none transition-colors"
              />
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={contact.email}
                  onChange={(e) => setContact((prev) => ({ ...prev, email: e.target.value }))}
                  onBlur={() => setEmailTouched(true)}
                  className={`w-full p-3 rounded-xl border-2 bg-transparent text-foreground placeholder:text-foreground/30 focus:outline-none transition-colors ${
                    showEmailError
                      ? "border-red-500 focus:border-red-500"
                      : "border-foreground/10 focus:border-amber-500"
                  }`}
                />
                {showEmailError && (
                  <p className="text-sm text-red-500 mt-1.5 ml-1">Please enter a valid email address.</p>
                )}
              </div>
              {isTherapist && (
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={contact.phone}
                  onChange={(e) => setContact((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-3 rounded-xl border-2 border-foreground/10 bg-transparent text-foreground placeholder:text-foreground/30 focus:border-amber-500 focus:outline-none transition-colors"
                />
              )}

              <div className="pt-2">
                <p className="text-sm text-foreground/50 mb-3">I&apos;m interested in:</p>
                <div className="space-y-2">
                  {interests.map((interest) => (
                    <label
                      key={interest.value}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={contact.interests.includes(interest.value)}
                        onChange={() => toggleInterest(interest.value)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          contact.interests.includes(interest.value)
                            ? "border-amber-500 bg-amber-500"
                            : "border-foreground/30"
                        }`}
                      >
                        {contact.interests.includes(interest.value) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm">{interest.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleContactSubmit}
                disabled={!canSubmitContact || submitting}
                className="w-full px-8 py-3 rounded-xl bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2"
              >
                {submitting ? "Sending..." : "Count me in"}
              </button>
            </div>
          </div>
        )}

        {submitted && (
          <p className="text-center text-amber-500 font-medium">
            We&apos;ll be in touch - thanks for your interest!
          </p>
        )}
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-foreground/40">Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
