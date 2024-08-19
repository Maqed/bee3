export type CategoryTreeItem = {
    name: string;
    description: string | undefined;
    categories: CategoryTreeItem[] | undefined;
}

export const categoriesTree = {
    categories: [
        {
            name: "Vehicles",
            description: "Epic vehicles description.",
            categories: [
                {
                    name: "Electric Cars",
                    categories: [
                        {
                            name: "Tesla",
                            description: "Tesla CARS BatChest!"
                        }
                    ]
                },
                {
                    name: "Gas Cars",
                    categories: [
                        {
                            name: "BMW",
                            description: "BMW CARS BatChest!"
                        },
                        {
                            name: "Lambourghini",
                            description: "LAMBO POGGERS!"
                        }
                    ]
                },
            ]
        },
        {
            name: "Mobiles & Tablets",
            description: "For the zoomers.",
            categories: [
                { name: "Mobile Phones" },
                { name: "Tablets" },
                { name: "Mobile & Tablet Accessories" },
            ]
        }
    ]
};