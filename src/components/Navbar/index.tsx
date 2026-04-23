"use client";

import { navbarData } from "@/static-data/navbar";
import { onScroll } from "@/utils/scrollActive";
import { useSupabaseAuth } from "@/app/context/SupabaseAuthContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ClockLogo from "../clock/ClockLogo";
import { useLocale, useTranslations } from "next-intl";
import { setUserLocale } from "@/lib/i18n/getUserLocale";
import LanguageDropdown from "./LanguageDropdown";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase());

export default function Navbar() {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [dashboardPath, setDashboardPath] = useState("/dashboard/profile");
  const { user, signOut } = useSupabaseAuth();
  const pathUrl = usePathname();
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Sticky menu
  useEffect(() => {
    const handleStickyMenu = () => setStickyMenu(window.scrollY >= 80);
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  // Scroll nav active
  useEffect(() => {
    if (window.location.pathname === "/") {
      window.addEventListener("scroll", onScroll);
    }
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Detect role to set correct dashboard path
  useEffect(() => {
    if (!user) { setDashboardPath("/dashboard/profile"); return; }
    const email = user.email?.toLowerCase() || "";

    // Admin check first (no DB query needed)
    if (ADMIN_EMAILS.includes(email)) {
      setDashboardPath("/admin");
      return;
    }

    // Trainer check
    supabase
      .from("trainers")
      .select("status")
      .ilike("email", email)
      .single()
      .then(({ data }) => {
        setDashboardPath(data?.status === "active" ? "/trainer" : "/user");
      });
  }, [user]);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut();
    router.push("/");
  };

  const currentLocale = useLocale();
  const t = useTranslations("navbar");

  const userName = user?.user_metadata?.first_name || user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "";

  return (
    <header
      className={`${stickyMenu ? "sticky-navbar" : ""} header absolute left-0 top-0 z-40 flex w-full items-center bg-transparent transition`}
    >
      <div className="mx-auto w-full px-4 xl:container">
        <div className="relative flex items-center justify-between">

          {/* Logo */}
          <div className="w-[32rem] max-w-full px-4">
            <Link href="/" className="header-logo flex w-full items-center py-6 max-md:py-4 lg:py-8">
              <ClockLogo />
              <span className="ps-4 text-[19px] font-[700] leading-[29px] text-[#090E34] max-md:text-base xl:text-[23px]">
                The Business Clock
              </span>
            </Link>
          </div>

          <div className="flex w-full items-center justify-between px-4">
            <div />

            {/* Nav links */}
            <div>
              <button
                onClick={() => setNavigationOpen(!navigationOpen)}
                name="navbarToggler"
                aria-label="navbarToggler"
                className="absolute ltr:right-4 rtl:left-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
              >
                <span className={`relative my-[6px] block h-[2px] w-[30px] bg-dark ${navigationOpen ? "top-[7px] rotate-45" : ""}`} />
                <span className={`relative my-[6px] block h-[2px] w-[30px] bg-dark ${navigationOpen ? "opacity-0" : ""}`} />
                <span className={`relative my-[6px] block h-[2px] w-[30px] bg-dark ${navigationOpen ? "top-[-8px] rotate-[135deg]" : ""}`} />
              </button>

              <nav
                id="navbarCollapse"
                className={`${!navigationOpen ? "hidden lg:block" : ""} absolute ltr:right-4 rtl:left-4 top-full w-full max-w-[250px] rounded-lg bg-white p-5 shadow-lg max-lg:max-h-[380px] max-lg:overflow-y-auto lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:px-2 lg:py-0 lg:shadow-none xl:px-5`}
              >
                <ul className="block lg:flex">
                  {navbarData.map((item) => (
                    <li key={item?.id} className={`group relative px-2 xl:px-5 ${item?.submenu ? "submenu-item" : ""}`}>
                      {item?.href ? (
                        <Link
                          href={item?.external ? item.href : `/${item?.href}`}
                          onClick={() => setNavigationOpen(false)}
                          className={`${pathUrl === `/${item?.href}` ? "text-primary" : ""} flex py-2 text-base text-black group-hover:text-primary lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${item?.href?.startsWith("#") ? "menu-scroll" : ""}`}
                        >
                          {t(item?.title)}
                        </Link>
                      ) : (
                        <>
                          <button
                            onClick={() => setDropdownToggler(!dropdownToggler)}
                            className="flex w-full items-center justify-between py-2 text-base text-black group-hover:text-primary lg:mr-0 lg:inline-flex lg:px-0 lg:py-6"
                          >
                            {t(item?.title)}
                            <span className="pl-3">
                              <svg width="14" height="8" viewBox="0 0 14 8" className={`fill-current duration-200 lg:group-hover:-scale-y-100 ${dropdownToggler ? "max-lg:-scale-y-100" : ""}`}>
                                <path d="M6.54564 5.09128L11.6369 0L13.0913 1.45436L6.54564 8L0 1.45436L1.45436 0L6.54564 5.09128Z" />
                              </svg>
                            </span>
                          </button>
                          {item?.submenu && (
                            <ul className={`${dropdownToggler ? "" : "hidden lg:block"} submenu relative left-0 top-full rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full`}>
                              {item.submenu.map((sub) => (
                                <li key={sub?.id}>
                                  <Link
                                    href={sub?.href}
                                    onClick={() => setNavigationOpen(false)}
                                    className={`block rounded px-4 py-[10px] text-sm ${pathUrl === sub?.href ? "text-primary" : "text-black hover:text-primary"}`}
                                  >
                                    {t(sub?.title)}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      )}
                    </li>
                  ))}

                  {/* Mobile: language toggle */}
                  <button className="p-2 lg:hidden" onClick={() => setUserLocale(currentLocale === "en" ? "ar" : "en")}>
                    {currentLocale === "en" ? "AR" : "EN"}
                  </button>

                  {/* Mobile: auth link */}
                  <li className="block p-2 lg:hidden">
                    {!user ? (
                      <Link href="/auth/signin" className="font-semibold text-primary" onClick={() => setNavigationOpen(false)}>
                        {t("signIn")}
                      </Link>
                    ) : (
                      <div className="space-y-1">
                        <Link href={dashboardPath} className="block font-semibold text-primary" onClick={() => setNavigationOpen(false)}>
                          {t("dashboard")}
                        </Link>
                        <button onClick={handleSignOut} className="block font-semibold text-gray-500">
                          {t("signOut")}
                        </button>
                      </div>
                    )}
                  </li>
                </ul>
              </nav>
            </div>

            {/* Desktop right side */}
            <div className="hidden lg:flex items-center gap-3">
              <LanguageDropdown />

              {/* ── Single auth button ── */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => !user ? router.push("/auth/signin") : setUserMenuOpen(v => !v)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 transition shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm-7 8a7 7 0 0 1 14 0H5z" clipRule="evenodd" />
                  </svg>
                  {user && <span className="max-w-[100px] truncate">{userName}</span>}
                  {user && (
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>

                {/* Dropdown */}
                {user && userMenuOpen && (
                  <div className="absolute ltr:right-0 rtl:left-0 top-full mt-2 w-52 rounded-xl bg-white border border-gray-100 shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-400">{t("welcome")}</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                    </div>
                    <Link
                      href={dashboardPath}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                      </svg>
                      {t("dashboard")}
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06z" clipRule="evenodd" />
                      </svg>
                      {t("signOut")}
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
