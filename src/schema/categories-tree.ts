export type CategoryTreeItem = {
  name: string;
  description: string | undefined;
  categories: CategoryTreeItem[] | undefined;
};

export const categoriesTree = {
  categories: [
    {
      name: "vehicles",
      categories: [
        {
          name: "electric-cars",
          categories: [
            {
              name: "Tesla",
            },
          ],
        },
        {
          name: "gas-cars",
        },
      ],
    },
    {
      name: "mobiles-and-tablets",
      categories: [
        { name: "mobile-phones" },
        { name: "tablets" },
        { name: "accessories" },
      ],
    },
  ],
};
