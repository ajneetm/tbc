import { StaticImageData } from "next/image";

export type Brand = {
  id: string | number;
  name: string;
  image: string | StaticImageData;
  link: string;
};
