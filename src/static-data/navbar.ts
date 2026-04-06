import { NavbarItem } from "@/types/navbar";
import { v4 as uuid } from "uuid";

export const navbarData: NavbarItem[] = [
  {
    id: uuid(),
    title: "overview", // translation key
    href: "#overview",
    external: false,
  },
  {
    id: uuid(),
    title: "services",
    href: "#services",
    external: false,
  },
  {
    id: uuid(),
    title: "programs",
    href: "programs",
    external: false,
  },
  {
    id: uuid(),
    title: "test",
    href: "dashboard/assessment",
    external: false,
  },
  {
    id: uuid(),
    title: "accreditation",
    href: "#accreditation",
    external: false,
  },
  {
    id: uuid(),
    title: "contact",
    href: "#contact",
    external: false,
  },
];
