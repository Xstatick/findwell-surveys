"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import BrandPanel from "@/components/ui/BrandPanel";
import { IconChevronRight, IconChevronLeft } from "@/components/ui/Icons";

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

function Field({
  label,
  value,
  onChange,
  onBlur,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  type?: string;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{
        fontFamily: "var(--tm-font-sans)", fontSize: 12, letterSpacing: "0.05em",
        textTransform: "uppercase", color: "var(--tm-text-tertiary)", fontWeight: 600,
      }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="fw-input"
        style={{
          background: "var(--tm-bg-subtle)", borderColor: "transparent",
          fontSize: 15.5, padding: "13px 16px", borderRadius: 12,
        }}
      />
    </label>
  );
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const surveyType = searchParams.get("from") as "therapist" | "patient" | null;
  const isTherapist = surveyType === "therapist";
  const interests = isTherapist ? THERAPIST_INTERESTS : PATIENT_INTERESTS;

  const [contact, setContact] = useState<ContactFormData>({
    name: "", email: "", phone: "", interests: [],
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim());
  const showEmailError = emailTouched && contact.email.length > 0 && !emailIsValid;

  const toggleInterest = (v: string) => {
    setContact((prev) => ({
      ...prev,
      interests: prev.interests.includes(v)
        ? prev.interests.filter((i) => i !== v)
        : [...prev.interests, v],
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
      setSubmitting(false);
      setSubmitted(true);
      return;
    }

    const { error } = await getSupabase()
      .from(tableName)
      .update({ contact_optin: contactData })
      .eq("id", responseId);

    if (!error) {
      sessionStorage.removeItem(`findwell-${surveyType}-response-id`);
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="qc-shell">
      <BrandPanel
        eyebrow="Response received"
        headline={
          <>
            <em style={{ fontStyle: "italic" }}>thank</em>
            <br />you.
          </>
        }
        support={
          isTherapist
            ? "Your input is genuinely valuable and will directly shape what we build."
            : "Reading your answers is going to directly shape what we build."
        }
      >
        {!isTherapist && (
          <div style={{
            marginTop: 8, padding: "18px 20px",
            background: "var(--tm-bg-surface)", borderRadius: 14,
            boxShadow: "inset 0 0 0 1px var(--tm-border-default)",
            maxWidth: 420,
          }}>
            <div style={{
              fontFamily: "var(--tm-font-sans)", fontSize: 12.5, letterSpacing: "0.06em",
              textTransform: "uppercase", color: "var(--tm-text-tertiary)",
              fontWeight: 600, marginBottom: 10,
            }}>
              About this research
            </div>
            <p style={{
              fontFamily: "var(--tm-font-sans)", fontSize: 13.5, lineHeight: 1.55,
              color: "var(--tm-text-secondary)", margin: 0,
            }}>
              This survey is part of early research for{" "}
              <strong style={{ color: "var(--tm-text-primary)" }}>Findwell</strong>, a curated
              service that matches people with the right therapist on the first try — instead of
              cycling through bad fits. Our team includes a practicing clinical psychologist and
              operators in software, design, and health technology.
            </p>
          </div>
        )}
      </BrandPanel>

      <main className="qc-content-pane">
        <div className="qc-content-inner">
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Submitted badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 56, height: 56, borderRadius: 18,
                background: "var(--app-butter)",
                display: "grid", placeItems: "center",
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                  stroke="var(--app-plum)" strokeWidth="2.4"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <div>
                <div style={{
                  fontFamily: "var(--tm-font-sans)", fontSize: 12.5, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: "var(--tm-text-tertiary)", fontWeight: 600,
                }}>
                  Submitted
                </div>
                <h2 style={{
                  fontFamily: "var(--tm-font-sans)", fontWeight: 600,
                  fontSize: 28, lineHeight: 1.2,
                  letterSpacing: "-0.015em", color: "var(--tm-text-primary)", margin: 0,
                }}>
                  You&apos;re all set.
                </h2>
              </div>
            </div>

            {/* Contact opt-in form */}
            {!submitted && (
              <div style={{
                padding: "clamp(24px, 3vw, 32px)",
                background: "var(--tm-bg-surface)",
                borderRadius: 20,
                boxShadow: "inset 0 0 0 1px var(--tm-border-default), 0 4px 24px rgba(71,36,57,0.04)",
                display: "flex", flexDirection: "column", gap: 18,
              }}>
                <div>
                  <h3 style={{
                    fontFamily: "var(--tm-font-sans)", fontWeight: 600,
                    fontSize: 24, lineHeight: 1.2,
                    letterSpacing: "-0.015em", color: "var(--tm-text-primary)", margin: 0,
                  }}>
                    Want to stay involved?
                  </h3>
                  <p style={{
                    fontFamily: "var(--tm-font-sans)", fontSize: 14, lineHeight: 1.55,
                    color: "var(--tm-text-secondary)", margin: "8px 0 0", maxWidth: 520,
                  }}>
                    {isTherapist
                      ? "Whether that's joining a future focus group, a brief call, or simply hearing about what we develop — drop your details below. Optional, but we need a valid email to actually reach you."
                      : "Whether that's a future conversation, early access, or simply hearing about how this develops — drop your details below. Optional, but we need a valid email to actually reach you."}
                  </p>
                </div>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 12,
                }}>
                  <Field
                    label="Name"
                    value={contact.name}
                    onChange={(v) => setContact((c) => ({ ...c, name: v }))}
                  />
                  <div>
                    <Field
                      label="Email"
                      type="email"
                      value={contact.email}
                      onChange={(v) => setContact((c) => ({ ...c, email: v }))}
                      onBlur={() => setEmailTouched(true)}
                    />
                    {showEmailError && (
                      <p style={{
                        fontFamily: "var(--tm-font-sans)", fontSize: 12.5,
                        color: "var(--tm-status-danger-fg, #C65A51)", margin: "4px 0 0 2px",
                      }}>
                        Please enter a valid email address.
                      </p>
                    )}
                  </div>
                  {isTherapist && (
                    <Field
                      label="Phone (optional)"
                      type="tel"
                      value={contact.phone}
                      onChange={(v) => setContact((c) => ({ ...c, phone: v }))}
                    />
                  )}
                </div>

                <div>
                  <div style={{
                    fontFamily: "var(--tm-font-sans)", fontSize: 13,
                    color: "var(--tm-text-tertiary)", fontWeight: 500, marginBottom: 10,
                  }}>
                    I&apos;m interested in:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {interests.map((it) => {
                      const sel = contact.interests.includes(it.value);
                      return (
                        <button
                          key={it.value}
                          type="button"
                          onClick={() => toggleInterest(it.value)}
                          style={{
                            border: "none", cursor: "pointer",
                            padding: "10px 16px", borderRadius: 999,
                            background: sel ? "var(--app-plum)" : "transparent",
                            color: sel ? "var(--tm-text-inverse)" : "var(--tm-text-primary)",
                            boxShadow: "inset 0 0 0 1.5px " + (sel ? "var(--app-plum)" : "var(--tm-border-default)"),
                            fontFamily: "var(--tm-font-sans)", fontSize: 13.5, fontWeight: 500,
                            transition: "all 160ms",
                          }}
                        >
                          {it.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                  <button
                    onClick={handleContactSubmit}
                    disabled={!emailIsValid || submitting}
                    className="fw-btn"
                  >
                    {submitting ? "Sending…" : "Count me in"}
                    {!submitting && <IconChevronRight size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirmed state */}
            {submitted && (
              <div style={{
                padding: "22px 24px", borderRadius: 16,
                background: "var(--app-butter)",
                fontFamily: "var(--tm-font-sans)", fontSize: 15, fontWeight: 500,
                color: "var(--tm-text-primary)",
                display: "flex", alignItems: "center", gap: 12,
                maxWidth: 600,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="var(--app-plum)" strokeWidth="2.4"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                We&apos;ll be in touch — thanks for your interest.
              </div>
            )}

            <div style={{ marginTop: 8 }}>
              <Link
                href="/"
                style={{
                  background: "transparent", border: "none", cursor: "pointer",
                  color: "var(--tm-text-tertiary)",
                  fontFamily: "var(--tm-font-sans)", fontSize: 13.5,
                  display: "inline-flex", alignItems: "center", gap: 6,
                  textDecoration: "none",
                }}
              >
                <IconChevronLeft size={16} /> back to start
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--tm-text-tertiary)", fontFamily: "var(--tm-font-sans)",
      }}>
        Loading…
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
