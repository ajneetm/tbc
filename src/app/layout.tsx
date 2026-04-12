import "@/styles/globals.css";
import { cn } from "@/utils/cn";
import { Inter } from "next/font/google";

import { StoreProviders } from "@/store/providers";
import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script
          src="https://kit.fontawesome.com/0fbbd5fcd2.js"
          crossOrigin="anonymous"
          async
        />
      </head>
      <body
        className={cn(
          inter.className,
          "h-screen",
          locale === "ar" ? "font-tajawal" : "font-inter"
        )}
        style={{ fontFamily: locale === "ar" ? "'MontserratArabic', sans-serif" : inter.style.fontFamily }}
      >
        <NextIntlClientProvider>
          <StoreProviders>{children}</StoreProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
