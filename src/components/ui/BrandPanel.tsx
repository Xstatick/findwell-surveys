import { LogoMark, IconLock, IconClock } from "./Icons";

interface BrandPanelProps {
  eyebrow?: string;
  headline: React.ReactNode;
  support?: string;
  children?: React.ReactNode;
}

export default function BrandPanel({
  eyebrow,
  headline,
  support,
  children,
}: BrandPanelProps) {
  return (
    <aside className="qc-brand-panel">
      {/* Soft radial washes */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -100,
          width: 380,
          height: 380,
          borderRadius: "50%",
          background:
            "radial-gradient(closest-side, var(--app-brand-wash-1), transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -160,
          left: -120,
          width: 460,
          height: 460,
          borderRadius: "50%",
          background:
            "radial-gradient(closest-side, var(--app-brand-wash-2), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          flex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <LogoMark size={36} stroke={2.6} />
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

        {eyebrow && (
          <div
            style={{
              fontFamily: "var(--tm-font-sans)",
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--tm-text-tertiary)",
              fontWeight: 600,
              marginTop: 24,
            }}
          >
            {eyebrow}
          </div>
        )}

        {headline && (
          <h1
            style={{
              fontFamily: "var(--tm-font-display)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(36px, 4vw, 48px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "var(--tm-text-primary)",
              margin: 0,
            }}
          >
            {headline}
          </h1>
        )}

        {support && (
          <p
            style={{
              fontFamily: "var(--tm-font-sans)",
              fontSize: 17,
              lineHeight: 1.55,
              color: "var(--tm-text-secondary)",
              margin: 0,
              maxWidth: 420,
            }}
          >
            {support}
          </p>
        )}

        {children}

        <div style={{ flex: 1 }} />

        {/* Footer reassurance */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 14,
            alignItems: "center",
            fontFamily: "var(--tm-font-sans)",
            fontSize: 13,
            color: "var(--tm-text-tertiary)",
            paddingTop: 24,
            borderTop: "1px solid var(--tm-border-subtle)",
          }}
        >
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <IconLock /> anonymous by default
          </span>
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <IconClock /> about ten minutes
          </span>
        </div>
      </div>
    </aside>
  );
}
