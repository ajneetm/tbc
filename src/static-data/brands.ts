import CPD from "@/../public/images/brands/CPD_trusted.svg";
import loida from "@/../public/images/brands/loida.png";
import ajnee from "@/../public/images/brands/Ajnee-business-hub.svg";
import { Brand } from "@/types/brands";
import { v4 as uuid } from "uuid";

export const heroClientsData: (Brand & { className?: string })[] = [
  {
    id: uuid(),
    name: "CPD Accredited",
    image: CPD,
    link: "https://cpduk.co.uk/",
  },
  {
    id: uuid(),
    name: "Loida",
    image: loida,
    link: "https://www.loidabritish.com/",
  },
  {
    id: uuid(),
    name: "Ajnee",
    image: ajnee,
    link: "https://www.ajnee.com/",
  },
];
