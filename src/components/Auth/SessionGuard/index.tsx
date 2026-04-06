"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

export default function Guard() {
  const { data: session } = useSession(); // For this to work, the Page should be wrapped inside the SessionProvider component in Layout
  useEffect(() => {
    if (session?.error !== "RefreshTokenError") return;
    signOut({ callbackUrl: "/auth/signin" }); // Force sign in to obtain a new set of access and refresh tokens
  }, [session?.error]);
  return null;
}
