import { footerSocialLinks } from "@/static-data/footer";

export default function FooterBottom() {
  return (
    <>
      <div className="mt-10 border-t border-white border-opacity-10 pt-12">
        <div className="mb-5 flex items-center justify-center">
          {footerSocialLinks.map((link) => (
            <a
              key={link?.id}
              href={link?.href}
              aria-label="social-link"
              target="_blank"
              rel="nofollow noreferrer noopener"
              className="mx-2 flex h-8 w-8 items-center justify-center rounded-full bg-body-color text-dark duration-200 hover:bg-primary hover:text-white"
            >
              {link?.icon}
            </a>
          ))}
        </div>
        <p className="text-center text-base font-medium text-body-color">
        The Business Clock - &copy; {new Date().getFullYear()}
        </p>
      </div>
    </>
  );
}
