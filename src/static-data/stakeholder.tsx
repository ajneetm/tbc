import { Stakeholder } from "@/types/stakeholder";
import { v4 as uuid } from "uuid";

const stakeHolderDetails = (
  <div>
    <p className="mb-8 text-base text-body-color sm:text-lg lg:text-base xl:text-lg">
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
      dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat.
    </p>
    <p className="mb-10 text-base text-body-color sm:text-lg lg:text-base xl:text-lg">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Quis enim lobortis
      scelerisque fermentum. Neque sodales ut etiam sit amet. Ligula ullamcorper
      proin libero nunc consequat interdum varius. Quam pellentesque nec nam.
    </p>
    <h4 className="mb-8 text-xl font-bold text-black sm:text-2xl lg:text-xl xl:text-2xl">
      <span className="text-primary">01.</span> Marketing solutions
    </h4>
    <ul className="list mb-7 list-inside list-disc">
      <li className="mb-3 text-base text-primary sm:text-lg lg:text-base xl:text-lg">
        <span className="text-body-color">
          {" "}
          Consectetur adipiscing elit in voluptate velit.{" "}
        </span>
      </li>
      <li className="mb-3 text-base text-primary sm:text-lg lg:text-base xl:text-lg">
        <span className="text-body-color"> Mattis vulputate cupidatat. </span>
      </li>
      <li className="mb-3 text-base text-primary sm:text-lg lg:text-base xl:text-lg">
        <span className="text-body-color">
          {" "}
          Vulputate enim nulla aliquet porttitor odio pellentesque{" "}
        </span>
      </li>
      <li className="mb-3 text-base text-primary sm:text-lg lg:text-base xl:text-lg">
        <span className="text-body-color">
          {" "}
          Ligula ullamcorper malesuada proin{" "}
        </span>
      </li>
    </ul>
    <p className="mb-10 text-base text-body-color sm:text-lg lg:text-base xl:text-lg">
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
      dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat.
    </p>
    <h4 className="mb-8 text-xl font-bold text-black sm:text-2xl lg:text-xl xl:text-2xl">
      <span className="text-primary">02.</span> Branding solutions
    </h4>
    <p className="mb-8 text-base text-body-color sm:text-lg lg:text-base xl:text-lg">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Quis enim lobortis
      scelerisque fermentum. Neque sodales ut etiam sit door telium sieat amet.
    </p>
  </div>
);

export const stakeHolderDataEn: Stakeholder[] = [
  {
    id: uuid(),
    title: "Ajnee Business Hub",
    slug: "job-portal-landing-page",
    link: "https://www.ajnee.com/",
    sortDescription:
      "Headquartered in Qatar, Ajnee Business Hub is the visionary creator of The Business Clock. As the driving force behind this transformative management system, Ajnee combines innovation and expertise to redefine business success.",
    image: "/images/stakeholder/ajnee-bg.jpg",
    tags: ["app"],
    details: stakeHolderDetails,
  },
  {
    id: uuid(),
    title: "Loida British Ltd.",
    slug: "saas-landing-page",
    link: "https://www.loidabritish.com/",
    sortDescription:
      "Operating from the UK, Loida British Ltd. is the exclusive provider of The Business Clock training sessions. Delivering CPD-accredited programs, Loida British ensures a world-class learning experience that empowers professionals to excel.",
    image: "/images/stakeholder/loida-bg.jpg",
    tags: ["app"],
    details: stakeHolderDetails,
  },
];

export const stakeHolderDataAr: Stakeholder[] = [
  {
    id: uuid(),
    title: "مركز أجني للأعمال",
    slug: "job-portal-landing-page",
    link: "https://www.ajnee.com/",
    sortDescription:
      "يقع مقره الرئيسي في قطر، ويُعد مركز أجني للأعمال المبتكر والرؤية وراء ابتكار \"ساعة العمل\". باعتباره القوة الدافعة لهذا النظام الإداري التحويلي، يجمع أجني بين الابتكار والخبرة لإعادة تعريف مفهوم النجاح في عالم الأعمال.", 
    image: "/images/stakeholder/ajnee-bg.jpg",
    tags: ["app"],
    details: stakeHolderDetails,
  },
  {
    id: uuid(),
    title: "شركة لويدا بريتيش المحدودة",
    slug: "saas-landing-page",
    link: "https://www.loidabritish.com/",
    sortDescription:
      "تعمل من المملكة المتحدة، وهي المزود الحصري لجلسات التدريب على \"ساعة العمل\". من خلال تقديم برامج معتمدة من CPD، تضمن لويدا بريتيش تجربة تعليمية عالمية المستوى تمكّن المهنيين من التميّز في مجالاتهم.",
    image: "/images/stakeholder/loida-bg.jpg",
    tags: ["app"],
    details: stakeHolderDetails,
  },
];

export const stakeHolderData = (locale: string) => {
  if (locale === "en") {
    return stakeHolderDataEn;
  } else {
    return stakeHolderDataAr;
  }
};
