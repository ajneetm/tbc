import Navbar from "@/components/Navbar";
import { SupabaseAuthProvider } from "../context/SupabaseAuthContext";

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseAuthProvider>
      <Navbar />
      <div className="pt-[80px]">
        {children}
      </div>
    </SupabaseAuthProvider>
  );
}
