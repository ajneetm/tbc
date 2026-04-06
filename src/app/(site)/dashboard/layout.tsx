import { auth } from "@/app/libs/helper/auth";
import Guard from "@/components/Auth/SessionGuard";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface PageProps {
  children: ReactNode;
}

export default async function layout({ children }: PageProps) {
  // const session = await auth();
  // if (!session?.access_token) redirect("/auth/signin");
  return <>{children}</>;
}
