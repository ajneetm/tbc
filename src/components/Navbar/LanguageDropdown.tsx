import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { setUserLocale } from "@/lib/i18n/getUserLocale";

export default function LanguageDropdown() {
  const [open, setOpen] = useState(false);
  const currentLocale = useLocale();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const otherLocale = currentLocale === "en" ? "ar" : "en";

  return (
    <div className="relative font-inter text-sm" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-16 flex items-center justify-between cursor-pointer rounded-xl bg-black px-3 py-2 text-white font-semibold focus:outline-none"
      >
        {currentLocale.toUpperCase()}
        <svg
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-full rounded-xl bg-white shadow-lg z-50">
          <button
            onClick={() => {
              setUserLocale(otherLocale);
              setOpen(false);
            }}
            className={`w-full px-3 py-2 text-left rounded-xl cursor-pointer font-semibold ${currentLocale === "en" ? "text-black bg-white" : "text-white bg-black text-right"}`}
          >
            {otherLocale.toUpperCase()}
          </button>
        </div>
      )}
    </div>
  );
} 