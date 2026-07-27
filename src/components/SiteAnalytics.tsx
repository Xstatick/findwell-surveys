"use client";

import { Analytics } from "@vercel/analytics/next";

export default function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        // Skip the password-gated admin area. Those are our own visits while
        // checking on results, and counting them would inflate the survey
        // traffic numbers we actually care about.
        try {
          if (new URL(event.url).pathname.startsWith("/admin")) return null;
        } catch {
          // Malformed URL - let the event through rather than dropping data.
        }
        return event;
      }}
    />
  );
}
