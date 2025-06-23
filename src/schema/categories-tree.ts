export type CategoryAttributeDefinition = {
  name: string;
  type: "text" | "number" | "select" | "multiselect";
  required?: boolean;
  options?: string[];
  unit?: string;
};

export type CategoryTreeItem = {
  id: number;
  name: string;
  attributes?: CategoryAttributeDefinition[];
  inheritParentAttributes?: boolean;
  description?: string;
  categories?: CategoryTreeItem[];
};

export const categoriesTree: CategoryTreeItem[] = [
  {
    id: 1,
    name: "vehicles",
    attributes: [
      { name: "brand", type: "text" },
      { name: "model", type: "text" },
      { name: "year", type: "number" },
      { name: "condition", type: "select", options: ["new", "used"] },
    ],
    categories: [
      {
        id: 2,
        name: "cars-for-sale",
        attributes: [
          { name: "horse-power", type: "number", unit: "HP" },
          { name: "engine-type", type: "select", options: ["gasoline", "diesel", "hybrid", "electric"] },
          { name: "engine-capacity", type: "number", unit: "CC" },
          { name: "fuel-type", type: "select", options: ["petrol-benzine", "diesel", "hybrid", "electric"] },
          { name: "transmission", type: "select", options: ["manual", "automatic"] },
          { name: "seats", type: "number" },
          { name: "color", type: "text" },
          { name: "installation-location", type: "text" },
          { name: "fuel-consumption", type: "number", unit: "l/100km" },
        ],
      },
      {
        id: 3,
        name: "cars-for-rent",
        attributes: [
          { name: "horse-power", type: "number", unit: "HP" },
          { name: "engine-type", type: "select", options: ["gasoline", "diesel", "hybrid", "electric"] },
          { name: "engine-capacity", type: "number", unit: "CC" },
          { name: "fuel-type", type: "select", options: ["petrol-benzine", "diesel", "hybrid", "electric"] },
          { name: "transmission", type: "select", options: ["manual", "automatic"] },
          { name: "seats", type: "number" },
          { name: "color", type: "text" },
          { name: "installation-location", type: "text" },
          { name: "fuel-consumption", type: "number", unit: "1/100km" },
        ],
      },
      {
        id: 4,
        name: "tyres-batteries-oils-accessories",
        inheritParentAttributes: false,
        attributes: [
          { name: "category", type: "select", options: ["tyre", "battery", "oil", "accessory"] },
          { name: "compatible-with", type: "text" },
          { name: "brand", type: "text" },
        ],
      },
      { id: 5, name: "car-spare-parts", inheritParentAttributes: false },
      { id: 6, name: "motorcycles-accessories", inheritParentAttributes: false },
      { id: 7, name: "boats-watercraft", inheritParentAttributes: false },
      { id: 8, name: "heavy-trucks-buses-other-vehicles", inheritParentAttributes: false },
    ],
  },
  {
    id: 9,
    name: "properties",
    attributes: [
      { name: "area", type: "number", unit: "Sqm" },
      { name: "bedrooms", type: "number" },
      { name: "bathrooms", type: "number" },
      { name: "floor", type: "number" },
      { name: "furnished", type: "select", options: ["yes", "no"] },
    ],
    categories: [
      { id: 10, name: "apartments-for-sale" },
      { id: 11, name: "apartments-for-rent" },
      { id: 12, name: "villas-for-sale" },
      { id: 13, name: "villas-for-rent" },
      { id: 14, name: "vacation-homes-for-sale" },
      { id: 15, name: "vacation-homes-for-rent" },
      { id: 16, name: "commercial-for-sale" },
      { id: 17, name: "commercial-for-rent" },
      { id: 18, name: "buildings-lands" },
    ],
  },
  {
    id: 19,
    name: "mobiles-tablets",
    attributes: [
      { name: "processor", type: "text" },
      { name: "gpu", type: "text" },
      { name: "ram", type: "select", options: ["1GB", "2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB"] },
      { name: "storage", type: "select", options: ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1tb"] },
      { name: "screen-size", type: "number", unit: "Inches" }
    ],
    categories: [
      { id: 20, name: "mobile-phones" },
      { id: 21, name: "tablets" },
      {
        id: 22,
        name: "mobile-tablet-accessories",
        inheritParentAttributes: false,
        attributes: [
          { name: "compatible-with", type: "text" },
          { name: "type", type: "select", options: ["case", "screen-protector", "charger", "cable", "other"] }
        ]
      },
      { id: 23, name: "mobile-numbers" }
    ],
  },
  {
    id: 24,
    name: "jobs",
    attributes: [
      { name: "employment-type", type: "select", options: ["full-time", "part-time", "contract"] },
      { name: "salary", type: "number" },
      { name: "experience", type: "number" },
      { name: "education-level", type: "select", options: ["high-school", "bachelors", "masters", "phd"] }
    ],
    categories: [
      { id: 25, name: "accounting-finance-banking" },
      { id: 26, name: "engineering" },
      { id: 27, name: "designers" },
      { id: 28, name: "customer-service-call-center" },
      { id: 29, name: "workers-technicians" },
      { id: 30, name: "management-consulting" },
      { id: 31, name: "drivers-delivery" },
      { id: 32, name: "education" },
      { id: 33, name: "hr" },
      { id: 34, name: "tourism-travel-hospitality" },
      { id: 35, name: "it-telecom" },
      { id: 36, name: "marketing-pr" },
      { id: 37, name: "medical-healthcare-nursing" },
      { id: 38, name: "sales" },
      { id: 39, name: "secretarial" },
      { id: 40, name: "guards-security" },
      { id: 41, name: "legal-lawyers" },
      { id: 42, name: "other-jobs" }
    ],
  },
  {
    id: 43,
    name: "electronics-home-appliances",
    attributes: [
      { name: "condition", type: "select", options: ["new", "used"] },
      { name: "warranty", type: "select", options: ["yes", "no"] },
    ],
    categories: [
      { id: 44, name: "tv-audio-video" },
      { id: 45, name: "computers-accessories" },
      { id: 46, name: "video-games-consoles" },
      { id: 47, name: "cameras-imaging" },
      { id: 48, name: "home-appliances" }
    ],
  },
  {
    id: 49,
    name: "home-garden",
    attributes: [
      { name: "condition", type: "select", options: ["new", "used"] },
    ],
    categories: [
      { id: 50, name: "furniture" },
      { id: 51, name: "office-furniture" },
      { id: 52, name: "home-decoration-accessories" },
      { id: 53, name: "bathroom-kitchen" },
      { id: 54, name: "fabric-bedding-curtains" },
      { id: 55, name: "garden-outdoor" },
      { id: 56, name: "kitchenware" },
      { id: 57, name: "lighting" }
    ],
  },
  {
    id: 58,
    name: "fashion-beauty",
    attributes: [
      { name: "brand", type: "text" },
      { name: "size", type: "select", options: ["XS", "S", "M", "L", "XL", "XXL", "special-sizes"] },
      { name: "condition", type: "select", options: ["new", "used"] },
      { name: "color", type: "text" }
    ],
    categories: [
      { id: 59, name: "womens-clothing" },
      { id: 60, name: "mens-clothing" },
      { id: 61, name: "womens-cosmetics" },
      { id: 62, name: "womens-accessories-personal-care" },
      { id: 63, name: "mens-accessories-personal-care" }
    ],
  },
  {
    id: 64,
    name: "pets-animals",
    categories: [
      { id: 65, name: "dogs" },
      { id: 66, name: "cats" },
      { id: 67, name: "birds-pigeons" },
      { id: 68, name: "other-pets-animals" },
      { id: 69, name: "pet-accessories-care-products" }
    ],
  },
  {
    id: 70,
    name: "kids-babies",
    attributes: [
      { name: "age-group", type: "select", options: ["newborn", "infant", "toddler", "preschooler", "school-age"] },
      { name: "condition", type: "select", options: ["new", "used"] }
    ],
    categories: [
      { id: 71, name: "baby-mom-healthcare" },
      { id: 72, name: "baby-clothing" },
      { id: 73, name: "baby-feeding-tools" },
      { id: 74, name: "cribs-strollers-carriers" },
      { id: 75, name: "toys" },
      { id: 76, name: "other-baby-items" }
    ],
  },
  {
    id: 77,
    name: "hobbies-books-sports",
    attributes: [
      { name: "condition", type: "select", options: ["new", "used"] }
    ],
    categories: [
      { id: 78, name: "antiques-collectibles" },
      { id: 79, name: "bicycles" },
      { id: 80, name: "books" },
      { id: 81, name: "board-card-games" },
      { id: 82, name: "movies-music" },
      { id: 83, name: "musical-instruments" },
      { id: 84, name: "sports-equipment" },
      { id: 85, name: "study-tools" },
      { id: 86, name: "tickets-vouchers" },
      { id: 87, name: "luggage" },
      { id: 88, name: "other-items" }
    ],
  },
  {
    id: 89,
    name: "business-industrial",
    attributes: [
      { name: "condition", type: "select", options: ["new", "used"] },
      { name: "brand", type: "text" }
    ],
    categories: [
      { id: 90, name: "agriculture" },
      { id: 91, name: "construction" },
      { id: 92, name: "industrial-equipment" },
      { id: 93, name: "medical-equipment" },
      { id: 94, name: "office-furniture-equipment" },
      { id: 95, name: "restaurants-equipment" },
      { id: 96, name: "whole-business-for-sale" },
      { id: 97, name: "other-business-industrial-agriculture" }
    ],
  },
  {
    id: 98,
    name: "services",
    categories: [
      { id: 99, name: "business-services" },
      { id: 100, name: "car-services" },
      { id: 101, name: "event-services" },
      { id: 102, name: "health-beauty-services" },
      { id: 103, name: "home-maintenance" },
      { id: 104, name: "medical-services" },
      { id: 105, name: "movers" },
      { id: 106, name: "pet-services" },
      { id: 107, name: "education-services" },
      { id: 108, name: "other-services" }
    ],
  }
];
