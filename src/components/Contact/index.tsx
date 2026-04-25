"use client";
import { useState } from "react";
import SectionTitle from "../Common/SectionTitle";
import { useTranslations } from "next-intl";

export default function Contact({ joinUs = false }: { joinUs?: boolean }) {
  const t = useTranslations("home.contact");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="bg-black py-[120px]">
      <div className="container">
        <SectionTitle
          mainTitle={t("smallTitle")}
          title={t("title")}
          paragraph={t("subtitle")}
          center
          color="white"
        />
        <div className="-mx-4 flex justify-center">
          <div className="w-full px-4 lg:w-9/12">
            <form onSubmit={handleSubmit}>
              <div className="-mx-4 flex flex-wrap">
                <div className="w-full px-4 md:w-1/2">
                  <div className="mb-6">
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder={t("form.name.placeholder")}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="w-full px-4 md:w-1/2">
                  <div className="mb-6">
                    <input
                      type="text"
                      name="company"
                      placeholder={t("form.company.placeholder")}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="w-full px-4 md:w-1/2">
                  <div className="mb-6">
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder={t("form.email.placeholder")}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="w-full px-4 md:w-1/2">
                  <div className="mb-6">
                    <input
                      type="text"
                      name="phone"
                      placeholder={t("form.phone.placeholder")}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="w-full px-4">
                  <div className="mb-6">
                    <textarea
                      rows={4}
                      name="message"
                      required
                      placeholder={t("form.message.placeholder")}
                      className="input-field resize-none"
                    ></textarea>
                  </div>
                </div>
                <div className="w-full px-4">
                  <div className="pt-4 text-center">
                    {status === "success" ? (
                      <p className="text-green-400 font-semibold">{t("form.success")}</p>
                    ) : status === "error" ? (
                      <p className="text-red-400 font-semibold">{t("form.error")}</p>
                    ) : (
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="mx-auto inline-flex items-center justify-center rounded-full bg-primary px-9 py-4 font-semibold text-white transition duration-300 ease-in-out hover:bg-opacity-90 hover:shadow-signUp disabled:opacity-60"
                      >
                        {status === "loading" ? t("form.sending") : t("form.button")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
