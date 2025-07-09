import {
  FaCar,
  FaHome,
  FaMobileAlt,
  FaBriefcase,
  FaTv,
  FaCouch,
  FaTshirt,
  FaBaby,
  FaGamepad,
} from "react-icons/fa";

import { MdPets, MdFactory, MdMiscellaneousServices } from "react-icons/md";

import type { IconType } from "react-icons";

export type CategoryIconType = IconType;

type CategoryIconsType = Record<
  string,
  { icon: CategoryIconType; categories?: CategoryIconsType }
>;

export const categoryIcons: CategoryIconsType = {
  vehicles: {
    icon: FaCar,
  },
  properties: {
    icon: FaHome,
  },
  "mobiles-tablets": {
    icon: FaMobileAlt,
  },
  jobs: {
    icon: FaBriefcase,
  },
  "electronics-home-appliances": {
    icon: FaTv,
  },
  "home-office": {
    icon: FaCouch,
  },
  "fashion-beauty": {
    icon: FaTshirt,
  },
  "pets-animals": {
    icon: MdPets,
  },
  "kids-babies": {
    icon: FaBaby,
  },
  "hobbies-books-sports": {
    icon: FaGamepad,
  },
  "business-industrial": {
    icon: MdFactory,
  },
  services: {
    icon: MdMiscellaneousServices,
  },
};
