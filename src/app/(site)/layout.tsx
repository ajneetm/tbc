import ChatPot from "@/components/chat-bot";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import NextTopLoader from "nextjs-toploader";
import ToasterContext from "../context/ToastContext";
import { SupabaseAuthProvider } from "../context/SupabaseAuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SupabaseAuthProvider>
      <NextTopLoader
        color="#006BFF"
        crawlSpeed={300}
        showSpinner={false}
        shadow="none"
        zIndex={9999999}
      />
      <ToasterContext />
      <Navbar />
      {children}
      {/* <ChatPot /> */}
      <Footer />
    </SupabaseAuthProvider>
  );
}
