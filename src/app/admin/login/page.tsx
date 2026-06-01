"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/ui/Icons";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
      return;
    }

    const data = await res.json().catch(() => ({}));
    setError(data?.error ?? "Login failed.");
    setSubmitting(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--app-brand-panel-bg)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 380,
          background: "var(--tm-bg-surface)",
          borderRadius: "var(--tm-radius-2xl)",
          boxShadow: "var(--tm-shadow-lg)",
          padding: "40px 36px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LogoMark size={34} stroke={2.6} />
          <span
            style={{
              fontFamily: "var(--tm-font-display)",
              fontSize: 22,
              color: "var(--tm-text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            Findwell
          </span>
        </div>

        <div>
          <h1
            style={{
              fontFamily: "var(--tm-font-sans)",
              fontSize: 22,
              fontWeight: 600,
              color: "var(--tm-text-primary)",
              margin: "0 0 6px",
              letterSpacing: "-0.01em",
            }}
          >
            Survey results
          </h1>
          <p
            style={{
              fontFamily: "var(--tm-font-sans)",
              fontSize: 14.5,
              color: "var(--tm-text-secondary)",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Enter the admin password to view responses.
          </p>
        </div>

        <input
          type="password"
          className="fw-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
        />

        {error && (
          <p style={{ color: "var(--tm-peach-700)", fontSize: 13.5, margin: 0 }}>{error}</p>
        )}

        <button type="submit" className="fw-btn" disabled={submitting || password.length === 0}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
