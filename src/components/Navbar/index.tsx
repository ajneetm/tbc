"use client";

import { navbarData } from "@/static-data/navbar";
import { onScroll } from "@/utils/scrollActive";
import { useSupabaseAuth } from "@/app/context/SupabaseAuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ClockLogo from "../clock/ClockLogo";
import { useLocale, useTranslations } from "next-intl";
import { setUserLocale } from "@/lib/i18n/getUserLocale";
import LanguageDropdown from "./LanguageDropdown";

export default function Navbar() {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const { user, signOut } = useSupabaseAuth();
  const pathUrl = usePathname();

  const navigationHandler = () => {
    setNavigationOpen(!navigationOpen);
  };

  // Sticky menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
  });

  // ==== onePage nav active ====
  useEffect(() => {
    if (window.location.pathname === "/") {
      window.addEventListener("scroll", onScroll);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const currentLocale = useLocale();
  const t = useTranslations("navbar");
  return (
    <>
      <header
        className={`${stickyMenu ? "sticky-navbar" : ""} header absolute left-0 top-0 z-40 flex w-full items-center bg-transparent transition`}
      >
        <div className="mx-auto w-full px-4 xl:container">
          <div className="relative flex items-center justify-between">
            <div className="w-[32rem] max-w-full px-4 ">
              <Link
                href="/"
                className="header-logo flex w-full items-center py-6 max-md:py-4 lg:py-8"
              >
                <ClockLogo />
                <span className="ps-4 text-[19px] font-[700] leading-[29px] text-[#090E34] max-md:text-base xl:text-[23px]">
                  The Business Clock
                </span>
              </Link>
            </div>
            <div className="flex w-full items-center justify-between px-4">
            <div />

              <div className="">
                <button
                  onClick={navigationHandler}
                  name="navbarToggler"
                  aria-label="navbarToggler"
                  className="absolute ltr:right-4 rtl:left-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden"
                >
                  <span
                    className={`relative my-[6px] block h-[2px] w-[30px] bg-dark ${navigationOpen ? "top-[7px] rotate-45" : ""}`}
                  ></span>
                  <span
                    className={`relative my-[6px] block h-[2px] w-[30px] bg-dark ${navigationOpen ? "opacity-0" : ""}`}
                  ></span>
                  <span
                    className={`relative my-[6px] block h-[2px] w-[30px] bg-dark ${navigationOpen ? "top-[-8px] rotate-[135deg]" : ""}`}
                  ></span>
                </button>
                <nav
                  id="navbarCollapse"
                  className={`${!navigationOpen ? "hidden lg:block" : ""} absolute ltr:right-4 rtl:left-4 top-full w-full max-w-[250px] rounded-lg bg-white p-5 py-5 shadow-lg max-lg:max-h-[380px] max-lg:overflow-y-auto lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:px-2 lg:py-0 lg:shadow-none xl:px-5`}
                >
                  <ul className="block lg:flex">
                    {navbarData.map((item) => (
                      <li
                        key={item?.id}
                        className={`group relative px-2 xl:px-5 ${item?.submenu ? "submenu-item" : ""}`}
                      >
                        {item?.href ? (
                          <Link
                            href={
                              item?.href
                                ? item?.external
                                  ? item.href
                                  : item?.href
                                    ? `/${item.href}`
                                    : "/"
                                : "/"
                            }
                            onClick={navigationHandler}
                            className={`${pathUrl === `/${item?.href}` ? "text-primary" : ""} flex py-2 text-base text-black group-hover:text-primary lg:mr-0 lg:inline-flex lg:px-0 lg:py-6 ${item?.href?.startsWith("#") ? "menu-scroll" : ""}`}
                          >
                            {t(item?.title)}
                          </Link>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                setDropdownToggler(!dropdownToggler)
                              }
                              className="flex w-full items-center justify-between py-2 text-base text-black group-hover:text-primary lg:mr-0 lg:inline-flex lg:px-0 lg:py-6"
                            >
                              {t(item?.title)}

                              <span className="pl-3">
                                <svg
                                  width="14"
                                  height="8"
                                  viewBox="0 0 14 8"
                                  className={`fill-current duration-200 lg:group-hover:-scale-y-100 ${dropdownToggler ? "max-lg:-scale-y-100" : ""}`}
                                >
                                  <path d="M6.54564 5.09128L11.6369 0L13.0913 1.45436L6.54564 8L0 1.45436L1.45436 0L6.54564 5.09128Z" />
                                </svg>
                              </span>
                            </button>
                            {item?.submenu && (
                              <ul
                                className={`${dropdownToggler ? "" : "hidden lg:block"} submenu relative left-0 top-full rounded-sm bg-white transition-[top] duration-300 group-hover:opacity-100 lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[250px] lg:p-4 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full`}
                              >
                                {item?.submenu.map((item) => (
                                  <li key={item?.id}>
                                    <Link
                                      href={item?.href}
                                      onClick={navigationHandler}
                                      className={`block rounded px-4 py-[10px] text-sm ${pathUrl === item?.href ? "text-primary" : "text-black hover:text-primary"}`}
                                    >
                                      {t(item?.title)}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        )}
                      </li>
                    ))}
                    {!user ? (
                      <li className="block p-2 font-semibold text-red-500 sm:hidden">
                        <Link href="/auth/signin">{t("signIn")}</Link>
                      </li>
                    ) : (
                      <>
                        <li className="block p-2 sm:hidden">
                          <Link href="/dashboard/profile" className="font-semibold text-primary">
                            {currentLocale === "ar" ? "لوحة التحكم" : "Dashboard"}
                          </Link>
                        </li>
                        <li className="block p-2 sm:hidden">
                          <button onClick={() => signOut()} className="font-semibold text-gray-600">
                            {t("signOut")}
                          </button>
                        </li>
                      </>
                    )}
                    <button
                    className="p-2 lg:hidden"
                      onClick={() => {
                        setUserLocale(currentLocale === "en" ? "ar" : "en");
                      }}
                    >
                      {currentLocale === "en" ? "AR" : "EN"}
                    </button>
                  </ul>
                </nav>
              </div>
              <div className={`hidden lg:block ${currentLocale === "en" ? "mr-3" : "ml-3"}`}>
                <LanguageDropdown />
              </div>

              <div className={`hidden items-center justify-end gap-4 sm:flex lg:pr-0 ${currentLocale === "en" ? "pr-16" : "pl-16"}`}>
                {!user ? (
                  <Link
                    href="/auth/signin"
                    className="w-[120px] rounded-full bg-red-500 px-8 py-2 text-center text-base font-bold text-white transition duration-300 ease-in-out hover:bg-opacity-90 hover:shadow-signUp whitespace-nowrap flex items-center justify-center"
                  >
                    {t("signIn")}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/dashboard/profile"
                      className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-white transition hover:bg-opacity-90 whitespace-nowrap"
                    >
                      {currentLocale === "ar" ? "لوحة التحكم" : "Dashboard"}
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="rounded-full border border-gray-300 px-6 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-100 whitespace-nowrap"
                    >
                      {t("signOut")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
