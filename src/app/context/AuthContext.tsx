"use client";
import Guard from "@/components/Auth/SessionGuard";
import { SessionProvider } from "next-auth/react";
import { REFRESH_INTERVAL_SECONDS } from "../libs/helper/auth";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider refetchInterval={REFRESH_INTERVAL_SECONDS} >
      <Guard />
      {children}
    </SessionProvider>
  );
}
