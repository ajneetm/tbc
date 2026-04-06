import SectionTitle from "../Common/SectionTitle";
import { useTranslations } from "next-intl";

export default function Contact({ joinUs = false }: { joinUs?: boolean }) {
  const t = useTranslations("home.contact");
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
            <form>
              <div className="-mx-4 flex flex-wrap">
                <div className="w-full px-4 md:w-1/2">
                  <div className="mb-6">
                    <input
                      type="text"
                      name="name"
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
                      placeholder={t("form.email.placeholder")}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="w-full px-4 md:w-1/2">
                  <div className="mb-6">
                    <input
                      type="text"
                      name="phone number"
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
                      placeholder={t("form.message.placeholder")}
                      className="input-field resize-none"
                    ></textarea>
                  </div>
                </div>
                <div className="w-full px-4">
                  <div className="pt-4 text-center">
                    <button className="mx-auto inline-flex items-center justify-center rounded-full bg-primary px-9 py-4 font-semibold text-white transition duration-300 ease-in-out hover:bg-opacity-90 hover:shadow-signUp">
                      {t("form.button")}
                    </button>
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
