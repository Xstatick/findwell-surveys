"use client";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="qc-progress-bar-sticky">
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "18px clamp(28px, 5vw, 64px)",
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--tm-font-sans)",
              fontSize: 12.5,
              color: "var(--tm-text-tertiary)",
              fontWeight: 500,
            }}
          >
            <span>
              Question {current} of {total}
            </span>
            <span style={{ color: "var(--tm-text-primary)", fontWeight: 600 }}>
              {pct}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: "var(--tm-bg-muted)",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background:
                  "linear-gradient(90deg, var(--app-plum), var(--app-peach-500))",
                borderRadius: 999,
                transition: "width 380ms var(--tm-ease-standard)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
