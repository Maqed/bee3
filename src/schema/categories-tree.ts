export type CategoryTreeItem = {
  id: number;
  name_ar: string;
  name_en: string;
  description?: string;
  categories?: CategoryTreeItem[];
};

export const categoriesTree: CategoryTreeItem[] = [
  {
    id: 0,
    name_en: "Vehicles",
    name_ar: "عربيات",
    categories: [
      {
        id: 1,
        name_en: "Electric Cars",
        name_ar: "عربيات كهرباء",
        categories: [
          { id: 2, name_en: "Tesla", name_ar: "تيسلا", },
        ],
      },
      {
        id: 3,
        name_en: "Gas Cars",
        name_ar: "عربيات غاز",
      },
    ],
  },
  {
    id: 4,
    name_en: "Mobiles and Tablets",
    name_ar: "موبايلات و تابلت",
    categories: [
      { id: 5, name_en: "Mobile Phones", name_ar: "موبايلات" },
      { id: 6, name_en: "Tablets", name_ar: "تابلت" },
      { id: 7, name_en: "Accessories", name_ar: "أكسسوارات" },
    ],
  }
];
