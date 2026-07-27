"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { logEvent } from "@/lib/events";

// Records an anonymous page view on each route change. Mounted once from the
// root layout; logEvent() itself skips /admin so our own visits don't inflate
// the numbers.
export default function VisitLogger() {
  const pathname = usePathname();

  useEffect(() => {
    logEvent("page_view", { path: pathname });
  }, [pathname]);

  return null;
}
