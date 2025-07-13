export type CategoryAttributeDefinition = {
  name: string;
  type: "number" | "select";
  required?: boolean;
  options?: string[];
  unit?: string;
};

export type CategoryTreeItem = {
  id: string;
  name: string;
  attributes?: CategoryAttributeDefinition[];
  inheritParentAttributes?: boolean;
  description?: string;
  categories?: CategoryTreeItem[];
};

/*
Categories IDs: Based on its depth & position, 
For example: 1,2,3,4, ... , 9, a, b, c, ...., z for categories with depth 0
if category of ID 2 has sub categories: their IDs will be: 21, 22, 23, ... ,29, 2a, 2b, 2c, ..., 2z
*/
export const categoriesTree: CategoryTreeItem[] = [
  {
    id: "1",
    name: "vehicles",
    attributes: [
      { name: "year", type: "number" },
      { name: "condition", type: "select", options: ["new", "used"] },
    ],
    categories: [
      {
        id: "12",
        name: "cars-for-sale",
        attributes: [
          {
            name: "fuel-type",
            type: "select",
            options: ["petrol-benzine", "diesel", "hybrid", "electric"],
          },
          {
            name: "transmission",
            type: "select",
            options: ["manual", "automatic"],
          },
          { name: "seats", type: "number" },
        ],
      },
      {
        id: "13",
        name: "cars-for-rent",
        attributes: [
          {
            name: "engine-type",
            type: "select",
            options: ["gasoline", "diesel", "hybrid", "electric"],
          },
          {
            name: "fuel-type",
            type: "select",
            options: ["petrol-benzine", "diesel", "hybrid", "electric"],
          },
          {
            name: "transmission",
            type: "select",
            options: ["manual", "automatic"],
          },
          { name: "seats", type: "number" },
        ],
      },
      {
        id: "14",
        name: "tyres-batteries-oils-accessories",
        inheritParentAttributes: false,
        attributes: [
          {
            name: "category",
            type: "select",
            options: ["tyre", "battery", "oil", "accessory"],
          },
        ],
      },
      { id: "15", name: "car-spare-parts", inheritParentAttributes: false },
      {
        id: "16",
        name: "motorcycles-accessories",
        inheritParentAttributes: false,
      },
      { id: "17", name: "boats-watercraft", inheritParentAttributes: false },
      {
        id: "18",
        name: "heavy-trucks-buses-other-vehicles",
        inheritParentAttributes: false,
      },
    ],
  },
  {
    id: "2",
    name: "properties",
    attributes: [
      { name: "area", type: "number", unit: "Sqm" },
      { name: "bedrooms", type: "number" },
      { name: "bathrooms", type: "number" },
      { name: "floor", type: "number" },
      { name: "furnished", type: "select", options: ["yes", "no"] },
    ],
    categories: [
      { id: "21", name: "apartments-for-sale" },
      { id: "22", name: "apartments-for-rent" },
      { id: "23", name: "villas-for-sale" },
      { id: "24", name: "villas-for-rent" },
      { id: "25", name: "vacation-homes-for-sale" },
      { id: "26", name: "vacation-homes-for-rent" },
      { id: "27", name: "commercial-for-sale" },
      { id: "28", name: "commercial-for-rent" },
      { id: "29", name: "buildings-lands" },
    ],
  },
  {
    id: "3",
    name: "mobiles-tablets",
    attributes: [
      {
        name: "ram",
        type: "select",
        options: [
          "1GB",
          "2GB",
          "3GB",
          "4GB",
          "6GB",
          "8GB",
          "12GB",
          "16GB",
          ">16GB",
        ],
      },
      {
        name: "storage",
        type: "select",
        options: [
          "4GB",
          "16GB",
          "32GB",
          "64GB",
          "128GB",
          "256GB",
          "512GB",
          "1TB",
        ],
      },
    ],
    categories: [
      { id: "31", name: "mobile-phones" },
      { id: "32", name: "tablets" },
      {
        id: "33",
        name: "mobile-tablet-accessories",
        inheritParentAttributes: false,
        attributes: [
          {
            name: "type",
            type: "select",
            options: ["case", "screen-protector", "charger", "cable", "other"],
          },
        ],
      },
      { id: "34", name: "mobile-numbers" },
    ],
  },
  {
    id: "4",
    name: "jobs",
    attributes: [
      {
        name: "employment-type",
        type: "select",
        options: ["full-time", "part-time", "contract"],
      },
      { name: "experience", type: "number" },
      {
        name: "education-level",
        type: "select",
        options: ["high-school", "bachelors", "masters", "phd"],
      },
    ],
    categories: [
      { id: "41", name: "accounting-finance-banking" },
      { id: "42", name: "engineering" },
      { id: "43", name: "designers" },
      { id: "44", name: "customer-service-call-center" },
      { id: "45", name: "workers-technicians" },
      { id: "46", name: "management-consulting" },
      { id: "47", name: "drivers-delivery" },
      { id: "48", name: "education" },
      { id: "49", name: "hr" },
      { id: "4a", name: "tourism-travel-hospitality" },
      { id: "4b", name: "it-telecom" },
      { id: "4c", name: "marketing-pr" },
      { id: "4d", name: "medical-healthcare-nursing" },
      { id: "4e", name: "sales" },
      { id: "4f", name: "secretarial" },
      { id: "4g", name: "guards-security" },
      { id: "4h", name: "legal-lawyers" },
      { id: "4i", name: "other-jobs" },
    ],
  },
  {
    id: "5",
    name: "electronics-home-appliances",
    attributes: [
      { name: "condition", type: "select", options: ["new", "used"] },
      { name: "warranty", type: "select", options: ["yes", "no"] },
    ],
    categories: [
      {
        id: "51",
        name: "tv-audio-video",
        categories: [
          { id: "511", name: "televisions" },
          { id: "512", name: "dvd-home-theater" },
          { id: "513", name: "home-audio" },
          { id: "514", name: "mp3-players-portable-audio" },
          { id: "515", name: "satellite-tv-receivers" },
        ],
      },
      {
        id: "52",
        name: "computers-accessories",
        categories: [
          {
            id: "521",
            name: "desktop-computers",
            attributes: [
              {
                name: "ram",
                type: "select",
                options: [
                  "<4GB",
                  "4GB",
                  "8GB",
                  "16GB",
                  "32GB",
                  "64GB",
                  ">64GB",
                ],
              },
              {
                name: "storage",
                type: "select",
                options: ["<128GB", "128GB", "256GB", "512GB", "1TB", ">1TB"],
              },
            ],
          },
          {
            id: "522",
            name: "laptop-computers",
            attributes: [
              {
                name: "ram",
                type: "select",
                options: [
                  "<4GB",
                  "4GB",
                  "8GB",
                  "16GB",
                  "32GB",
                  "64GB",
                  ">64GB",
                ],
              },
              {
                name: "storage",
                type: "select",
                options: ["<128GB", "128GB", "256GB", "512GB", "1TB", ">1TB"],
              },
            ],
          },
          {
            id: "523",
            name: "computer-accessories-spare-parts",
            attributes: [
              {
                name: "type",
                type: "select",
                options: [
                  "keyboard",
                  "mouse",
                  "monitor",
                  "speaker",
                  "headset",
                  "webcam",
                  "cable",
                  "adapter",
                  "memory",
                  "hard-drive",
                  "motherboard",
                  "power-supply",
                  "cooling-fan",
                  "case",
                  "other",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "53",
        name: "video-games-consoles",
        categories: [
          { id: "531", name: "video-game-consoles" },
          { id: "532", name: "video-games-accessories" },
        ],
      },
      {
        id: "54",
        name: "cameras-imaging",
        categories: [
          { id: "541", name: "cameras" },
          { id: "542", name: "security-cameras" },
          { id: "543", name: "camera-accessories" },
          { id: "544", name: "binoculars-telescopes" },
        ],
      },
      {
        id: "55",
        name: "home-appliances",
        categories: [
          { id: "551", name: "refrigerators-freezers" },
          { id: "552", name: "ovens-microwaves" },
          { id: "553", name: "dishwashers" },
          { id: "554", name: "cooking-tools" },
          { id: "555", name: "washers-dryers" },
          { id: "556", name: "water-coolers-kettles" },
          { id: "557", name: "air-conditioners-fans" },
          { id: "558", name: "cleaning-appliances" },
          { id: "559", name: "other-home-appliances" },
          { id: "55a", name: "heaters" },
        ],
      },
    ],
  },
  {
    id: "6",
    name: "home-office",
    attributes: [
      { name: "condition", type: "select", options: ["new", "used"] },
    ],
    categories: [
      {
        id: "61",
        name: "furniture",
        categories: [
          { id: "611", name: "beds" },
          { id: "612", name: "full-rooms" },
          { id: "613", name: "full-kitchen" },
          { id: "614", name: "chairs" },
          { id: "615", name: "sofas" },
          { id: "616", name: "tables" },
          { id: "617", name: "storage" },
          { id: "618", name: "other" },
        ],
      },
      {
        id: "62",
        name: "office-furniture",
        categories: [
          { id: "621", name: "office-chairs" },
          { id: "622", name: "desks" },
          { id: "623", name: "office-storage" },
          { id: "624", name: "office-accessories" },
          { id: "625", name: "reception-counter" },
          { id: "626", name: "gaming-furniture" },
          { id: "627", name: "other-furniture" },
        ],
      },
      {
        id: "63",
        name: "home-decoration-accessories",
        categories: [
          { id: "631", name: "mirrors" },
          { id: "632", name: "home-decoration" },
        ],
      },
      {
        id: "64",
        name: "bathroom-kitchen",
        categories: [
          { id: "641", name: "bathroom" },
          { id: "642", name: "kitchenware" },
        ],
      },
      {
        id: "65",
        name: "fabric-bedding-curtains",
        categories: [
          { id: "651", name: "mattresses" },
          { id: "652", name: "curtains" },
          { id: "653", name: "pillows" },
          { id: "654", name: "bed-linens-covers" },
          { id: "655", name: "fabrics" },
          { id: "656", name: "towels" },
          { id: "657", name: "cushions" },
          { id: "658", name: "table-runners" },
          { id: "659", name: "carpets" },
          { id: "65a", name: "blankets" },
          { id: "65b", name: "bedding-sets" },
          { id: "65c", name: "other" },
        ],
      },
      {
        id: "66",
        name: "garden-outdoor",
        categories: [
          { id: "661", name: "garden-furniture" },
          { id: "662", name: "swings-hanging-chairs" },
          { id: "663", name: "pergolas-tents" },
          { id: "664", name: "pools-and-accessories" },
          { id: "665", name: "grills" },
          { id: "666", name: "other" },
        ],
      },
      { id: "67", name: "kitchenware" },
      { id: "68", name: "lighting" },
    ],
  },
  {
    id: "7",
    name: "fashion-beauty",
    attributes: [
      {
        name: "size",
        type: "select",
        options: ["XS", "S", "M", "L", "XL", "XXL", "special-sizes"],
      },
      { name: "condition", type: "select", options: ["new", "used"] },
    ],
    categories: [
      { id: "71", name: "womens-clothing" },
      { id: "72", name: "mens-clothing" },
      { id: "73", name: "womens-cosmetics" },
      { id: "74", name: "womens-accessories-personal-care" },
      { id: "75", name: "mens-accessories-personal-care" },
    ],
  },
  {
    id: "8",
    name: "pets-animals",
    categories: [
      { id: "81", name: "dogs" },
      { id: "82", name: "cats" },
      { id: "83", name: "birds-pigeons" },
      { id: "84", name: "other-pets-animals" },
      { id: "85", name: "pet-accessories-care-products" },
    ],
  },
  {
    id: "9",
    name: "kids-babies",
    attributes: [
      {
        name: "age-group",
        type: "select",
        options: ["newborn", "infant", "toddler", "preschooler", "school-age"],
      },
      { name: "condition", type: "select", options: ["new", "used"] },
    ],
    categories: [
      { id: "91", name: "baby-mom-healthcare" },
      { id: "92", name: "baby-clothing" },
      { id: "93", name: "baby-feeding-tools" },
      { id: "94", name: "cribs-strollers-carriers" },
      { id: "95", name: "toys" },
      { id: "96", name: "other-baby-items" },
    ],
  },
  {
    id: "a",
    name: "hobbies-books-sports",
    attributes: [
      { name: "condition", type: "select", options: ["new", "used"] },
    ],
    categories: [
      { id: "a1", name: "antiques-collectibles" },
      { id: "a2", name: "bicycles" },
      { id: "a3", name: "books" },
      { id: "a4", name: "board-card-games" },
      { id: "a5", name: "movies-music" },
      { id: "a6", name: "musical-instruments" },
      { id: "a7", name: "sports-equipment" },
      { id: "a8", name: "study-tools" },
      { id: "a9", name: "tickets-vouchers" },
      { id: "aa", name: "luggage" },
      { id: "ab", name: "other-items" },
    ],
  },
  {
    id: "b",
    name: "business-industrial",
    attributes: [
      { name: "condition", type: "select", options: ["new", "used"] },
    ],
    categories: [
      { id: "b1", name: "agriculture" },
      { id: "b2", name: "construction" },
      { id: "b3", name: "industrial-equipment" },
      { id: "b4", name: "medical-equipment" },
      { id: "b5", name: "office-furniture-equipment" },
      { id: "b6", name: "restaurants-equipment" },
      { id: "b7", name: "whole-business-for-sale" },
      { id: "b8", name: "other-business-industrial-agriculture" },
    ],
  },
  {
    id: "c",
    name: "services",
    categories: [
      { id: "c1", name: "business-services" },
      { id: "c2", name: "car-services" },
      { id: "c3", name: "event-services" },
      { id: "c4", name: "health-beauty-services" },
      { id: "c5", name: "home-maintenance" },
      { id: "c6", name: "medical-services" },
      { id: "c7", name: "movers" },
      { id: "c8", name: "pet-services" },
      { id: "c9", name: "education-services" },
      { id: "ca", name: "other-services" },
    ],
  },
];
