import { FooterLink, FooterSocial } from "@/types/footer";
import { v4 as uuid } from "uuid";

export const footerLinks: FooterLink[] = [
  {
    id: uuid(),
    title: "CPD",
    href: "https://cpduk.co.uk/",
    external: false,
  },
  {
    id: uuid(),
    title: "Loida British",
    href: "https://www.loidabritish.com/",
    external: false,
  },
  {
    id: uuid(),
    title: "Ajnee",
    href: "https://www.ajnee.com/",
    external: false,
  },
];

export const footerHotLinks: FooterLink[] = [
  {
    id: uuid(),
    title: "Opportunity Hour",
    href: "/programs/opportunity-hour",
    external: false,
  },
  {
    id: uuid(),
    title: "Ding Model",
    href: "/overview",
    external: false,
  },
];

export const footerQuickLinks: FooterLink[] = [
  {
    id: uuid(),
    title: "Services",
    href: "/#services",
    external: false,
  },
  {
    id: uuid(),
    title: "Programs",
    href: "/programs",
    external: false,
  },
];

export const footerSocialLinks: FooterSocial[] = [
  {
    id: uuid(),
    title: "Facebook",
    href: "https://www.facebook.com/share/14NuALFwdq/?mibextid=wwXIfr",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.1 10.494V7.42717C12.1 6.23996 13.085 5.27753 14.3 5.27753H16.5V2.05308L13.5135 1.84464C10.9664 1.66688 8.8 3.63794 8.8 6.13299V10.494H5.5V13.7184H8.8V20.1668H12.1V13.7184H15.4L16.5 10.494H12.1Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    id: uuid(),
    title: "Instagram",
    href: "https://www.instagram.com/loida.british?igsh=c2ZtNGt0Mm9majRv&utm_source=qr",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_1073_724)">
          <path
            d="M6.46875 0C2.91797 0 0 2.91406 0 6.46875V15.5312C0 19.082 2.91406 22 6.46875 22H15.5312C19.082 22 22 19.0859 22 15.5312V6.46875C22 2.91797 19.0859 0 15.5312 0H6.46875ZM6.46875 2H15.5312C18.0039 2 20 3.99609 20 6.46875V15.5312C20 18.0039 18.0039 20 15.5312 20H6.46875C3.99609 20 2 18.0039 2 15.5312V6.46875C2 3.99609 3.99609 2 6.46875 2ZM16.9062 4.1875C16.4023 4.1875 16 4.58984 16 5.09375C16 5.59766 16.4023 6 16.9062 6C17.4102 6 17.8125 5.59766 17.8125 5.09375C17.8125 4.58984 17.4102 4.1875 16.9062 4.1875ZM11 5C7.69922 5 5 7.69922 5 11C5 14.3008 7.69922 17 11 17C14.3008 17 17 14.3008 17 11C17 7.69922 14.3008 5 11 5ZM11 7C13.2227 7 15 8.77734 15 11C15 13.2227 13.2227 15 11 15C8.77734 15 7 13.2227 7 11C7 8.77734 8.77734 7 11 7Z"
            fill="currentColor"
          />
        </g>
      </svg>
    ),
  },
  {
    id: uuid(),
    title: "Linkedin",
    href: "https://www.linkedin.com/company/loida-british-ltd/",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_1073_724)">
          <path
            d="M6.94043 5.00002C6.94017 5.53046 6.7292 6.03906 6.35394 6.41394C5.97868 6.78883 5.46986 6.99929 4.93943 6.99902C4.409 6.99876 3.90039 6.78779 3.52551 6.41253C3.15062 6.03727 2.94016 5.52846 2.94043 4.99802C2.9407 4.46759 3.15166 3.95899 3.52692 3.5841C3.90218 3.20922 4.411 2.99876 4.94143 2.99902C5.47186 2.99929 5.98047 3.21026 6.35535 3.58552C6.73024 3.96078 6.9407 4.46959 6.94043 5.00002ZM7.00043 8.48002H3.00043V21H7.00043V8.48002ZM13.3204 8.48002H9.34043V21H13.2804V14.43C13.2804 10.77 18.0504 10.43 18.0504 14.43V21H22.0004V13.07C22.0004 6.90002 14.9404 7.13002 13.2804 10.16L13.3204 8.48002Z"
            fill="currentColor"
          />
        </g>
        <defs>
          <clipPath id="clip0_1073_724">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
  },
];
