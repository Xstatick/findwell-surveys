"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        fontFamily: "var(--tm-font-sans)",
        fontSize: 13.5,
        color: "var(--tm-text-tertiary)",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "6px 4px",
      }}
    >
      Log out
    </button>
  );
}
