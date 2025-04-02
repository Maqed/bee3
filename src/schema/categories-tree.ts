export type CategoryAttributeDefinition = {
  name: string;
  type: "text" | "number" | "select" | "multiselect";
  required?: boolean;
  options?: string[];
  unit?: string;
};

export type CategoryTreeItem = {
  id: number;
  name_en: string;
  name_ar: string;
  attributes?: CategoryAttributeDefinition[];
  inheritParentAttributes?: boolean;
  description?: string;
  categories?: CategoryTreeItem[];
};

export const categoriesTree: CategoryTreeItem[] = [
  {
    id: 1,
    name_en: "Vehicles",
    name_ar: "عربيات",
    attributes: [
      { name: "horse_power", type: "number", unit: "HP" },
      { name: "engine_type", type: "select", options: ["Gasoline", "Diesel", "Hybrid", "Electric"] },
      { name: "seats", type: "number", unit: "seats" }
    ],
    categories: [
      {
        id: 2,
        name_en: "Electric Cars",
        name_ar: "عربيات كهرباء",
        attributes: [
          { name: "charger_type", type: "select", options: ["Type 1", "Type 2", "CCS", "CHAdeMO"] },
          { name: "battery_capacity", type: "number", unit: "kWh" },
          { name: "range", type: "number", unit: "km" }
        ],
        categories: [
          {
            id: 3,
            name_en: "Tesla",
            name_ar: "تيسلا",
            attributes: [
              { name: "autopilot_version", type: "select", options: ["Basic", "Enhanced", "Full Self-Driving"] }
            ]
          }
        ],
      },
      {
        id: 4,
        name_en: "Gas Cars",
        name_ar: "عربيات غاز",
        attributes: [
          { name: "fuel_tank_capacity", type: "number", unit: "L" },
          { name: "fuel_economy", type: "number", unit: "km/L" }
        ],
      },
    ],
  },
  {
    id: 5,
    name_en: "Mobiles and Tablets",
    name_ar: "موبايلات و تابلت",
    attributes: [
      { name: "processor", type: "text" },
      { name: "gpu", type: "text" },
      { name: "ram", type: "select", options: ["1GB", "2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB"] },
      { name: "storage", type: "select", options: ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"] },
      { name: "screen_size", type: "number", unit: "inches" }
    ],
    categories: [
      {
        id: 6,
        name_en: "Mobile Phones",
        name_ar: "موبايلات",
        attributes: [
          { name: "camera_mp", type: "number", unit: "MP" },
          { name: "battery", type: "number", unit: "mAh" }
        ]
      },
      {
        id: 7,
        name_en: "Tablets",
        name_ar: "تابلت",
        attributes: [
          { name: "stylus_support", type: "select", options: ["Yes", "No"] }
        ]
      },
      {
        id: 8,
        name_en: "Accessories",
        name_ar: "اكسسوارات",
        inheritParentAttributes: false,
        attributes: [
          { name: "compatible_with", type: "text" },
          { name: "type", type: "select", options: ["Case", "Screen Protector", "Charger", "Cable", "Other"] }
        ]
      },
    ],
  },
];