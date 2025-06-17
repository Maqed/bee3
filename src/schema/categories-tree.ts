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
        name: "cars_for_sale",
        attributes: [
          { name: "horse_power", type: "number", unit: "HP" },
          { name: "engine_type", type: "select", options: ["gasoline", "diesel", "hybrid", "electric"] },
          { name: "engine_capacity", type: "number", unit: "CC" },
          { name: "fuel_type", type: "select", options: ["petrol_benzine", "diesel", "hybrid", "electric"] },
          { name: "transmission", type: "select", options: ["manual", "automatic"] },
          { name: "seats", type: "number" },
          { name: "color", type: "text" },
          { name: "installation_location", type: "text" },
          { name: "fuel_consumption", type: "number", unit: "l/100km" },
        ],
      },
      {
        id: 3,
        name: "cars_for_rent",
        attributes: [
          { name: "horse_power", type: "number", unit: "HP" },
          { name: "engine_type", type: "select", options: ["gasoline", "diesel", "hybrid", "electric"] },
          { name: "engine_capacity", type: "number", unit: "CC" },
          { name: "fuel_type", type: "select", options: ["petrol_benzine", "diesel", "hybrid", "electric"] },
          { name: "transmission", type: "select", options: ["manual", "automatic"] },
          { name: "seats", type: "number" },
          { name: "color", type: "text" },
          { name: "installation_location", type: "text" },
          { name: "fuel_consumption", type: "number", unit: "1/100km" },
        ],
      },
      {
        id: 4,
        name: "tyres_batteries_oils_accessories",
        inheritParentAttributes: false,
        attributes: [
          { name: "category", type: "select", options: ["tyre", "battery", "oil", "accessory"] },
          { name: "compatible_with", type: "text" },
          { name: "brand", type: "text" },
        ],
      },
      { id: 5, name: "car_spare_parts", inheritParentAttributes: false },
      { id: 6, name: "motorcycles_accessories", inheritParentAttributes: false },
      { id: 7, name: "boats_watercraft", inheritParentAttributes: false },
      { id: 8, name: "heavy_trucks_buses_other_vehicles", inheritParentAttributes: false },
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
      { id: 10, name: "apartments_for_sale" },
      { id: 11, name: "apartments_for_rent" },
      { id: 12, name: "villas_for_sale" },
      { id: 13, name: "villas_for_rent" },
      { id: 14, name: "vacation_homes_for_sale" },
      { id: 15, name: "vacation_homes_for_rent" },
      { id: 16, name: "commercial_for_sale" },
      { id: 17, name: "commercial_for_rent" },
      { id: 18, name: "buildings_lands" },
    ],
  },
  {
    id: 19,
    name: "mobiles_tablets",
    attributes: [
      { name: "processor", type: "text" },
      { name: "gpu", type: "text" },
      { name: "ram", type: "select", options: ["1GB", "2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB"] },
      { name: "storage", type: "select", options: ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1tb"] },
      { name: "screen_size", type: "number", unit: "Inches" }
    ],
    categories: [
      { id: 20, name: "mobile_phones" },
      { id: 21, name: "tablets" },
      {
        id: 22,
        name: "mobile_tablet_accessories",
        inheritParentAttributes: false,
        attributes: [
          { name: "compatible_with", type: "text" },
          { name: "type", type: "select", options: ["case", "screen_protector", "charger", "cable", "other"] }
        ]
      },
      { id: 23, name: "mobile_numbers" }
    ],
  },
  {
    id: 24,
    name: "jobs",
    attributes: [
      { name: "employment_type", type: "select", options: ["full_time", "part_time", "contract"] },
      { name: "salary", type: "number" },
      { name: "experience", type: "number" },
      { name: "education_level", type: "select", options: ["high_school", "bachelors", "masters", "phd"] }
    ],
    categories: [
      { id: 25, name: "accounting_finance_banking" },
      { id: 26, name: "engineering" },
      { id: 27, name: "designers" },
      { id: 28, name: "customer_service_call_center" },
      { id: 29, name: "workers_technicians" },
      { id: 30, name: "management_consulting" },
      { id: 31, name: "drivers_delivery" },
      { id: 32, name: "education" },
      { id: 33, name: "hr" },
      { id: 34, name: "tourism_travel_hospitality" },
      { id: 35, name: "it_telecom" },
      { id: 36, name: "marketing_pr" },
      { id: 37, name: "medical_healthcare_nursing" },
      { id: 38, name: "sales" },
      { id: 39, name: "secretarial" },
      { id: 40, name: "guards_security" },
      { id: 41, name: "legal_lawyers" },
      { id: 42, name: "other_jobs" }
    ],
  },
  {
    id: 43,
    name: "electronics_home_appliances",
    attributes: [
      { name: "condition", type: "select", options: ["new", "used"] },
      { name: "warranty", type: "select", options: ["yes", "no"] },
    ],
    categories: [
      { id: 44, name: "tv_audio_video" },
      { id: 45, name: "computers_accessories" },
      { id: 46, name: "video_games_consoles" },
      { id: 47, name: "cameras_imaging" },
      { id: 48, name: "home_appliances" }
    ],
  },
  {
    id: 49,
    name: "home_garden",
    attributes: [
      { name: "condition", type: "select", options: ["new", "used"] },
    ],
    categories: [
      { id: 50, name: "furniture" },
      { id: 51, name: "office_furniture" },
      { id: 52, name: "home_decoration_accessories" },
      { id: 53, name: "bathroom_kitchen" },
      { id: 54, name: "fabric_bedding_curtains" },
      { id: 55, name: "garden_outdoor" },
      { id: 56, name: "kitchenware" },
      { id: 57, name: "lighting" }
    ],
  },
  {
    id: 58,
    name: "fashion_beauty",
    attributes: [
      { name: "brand", type: "text" },
      { name: "size", type: "select", options: ["XS", "S", "M", "L", "XL", "XXL", "Special Sizes"] },
      { name: "condition", type: "select", options: ["new", "used"] },
      { name: "color", type: "text" }
    ],
    categories: [
      { id: 59, name: "womens_clothing" },
      { id: 60, name: "mens_clothing" },
      { id: 61, name: "womens_cosmetics" },
      { id: 62, name: "womens_accessories_personal_care" },
      { id: 63, name: "mens_accessories_personal_care" }
    ],
  },
  {
    id: 64,
    name: "pets_animals",
    attributes: [
      { name: "breed", type: "select", options: ["dog", "cat", "bird", "other"] },
    ],
    categories: [
      { id: 65, name: "dogs" },
      { id: 66, name: "cats" },
      { id: 67, name: "birds_pigeons" },
      { id: 68, name: "other_pets_animals" },
      { id: 69, name: "pet_accessories_care_products" }
    ],
  },
  {
    id: 70,
    name: "kids_babies",
    attributes: [
      { name: "age_group", type: "select", options: ["newborn", "infant", "toddler", "preschooler", "school_age"] },
      { name: "condition", type: "select", options: ["new", "used"] }
    ],
    categories: [
      { id: 71, name: "baby_mom_healthcare" },
      { id: 72, name: "baby_clothing" },
      { id: 73, name: "baby_feeding_tools" },
      { id: 74, name: "cribs_strollers_carriers" },
      { id: 75, name: "toys" },
      { id: 76, name: "other_baby_items" }
    ],
  },
  {
    id: 77,
    name: "hobbies_books_sports",
    attributes: [
      { name: "condition", type: "select", options: ["new", "used"] }
    ],
    categories: [
      { id: 78, name: "antiques_collectibles" },
      { id: 79, name: "bicycles" },
      { id: 80, name: "books" },
      { id: 81, name: "board_card_games" },
      { id: 82, name: "movies_music" },
      { id: 83, name: "musical_instruments" },
      { id: 84, name: "sports_equipment" },
      { id: 85, name: "study_tools" },
      { id: 86, name: "tickets_vouchers" },
      { id: 87, name: "luggage" },
      { id: 88, name: "other_items" }
    ],
  },
  {
    id: 89,
    name: "business_industrial",
    attributes: [
      { name: "condition", type: "select", options: ["new", "used"] },
      { name: "brand", type: "text" }
    ],
    categories: [
      { id: 90, name: "agriculture" },
      { id: 91, name: "construction" },
      { id: 92, name: "industrial_equipment" },
      { id: 93, name: "medical_equipment" },
      { id: 94, name: "office_furniture_equipment" },
      { id: 95, name: "restaurants_equipment" },
      { id: 96, name: "whole_business_for_sale" },
      { id: 97, name: "other_business_industrial_agriculture" }
    ],
  },
  {
    id: 98,
    name: "services",
    categories: [
      { id: 99, name: "business_services" },
      { id: 100, name: "car_services" },
      { id: 101, name: "event_services" },
      { id: 102, name: "health_beauty_services" },
      { id: 103, name: "home_maintenance" },
      { id: 104, name: "medical_services" },
      { id: 105, name: "movers" },
      { id: 106, name: "pet_services" },
      { id: 107, name: "education_services" },
      { id: 108, name: "other_services" }
    ],
  }
];
