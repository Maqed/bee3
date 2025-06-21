import { defineStepper } from "@stepperize/react";

export const { Scoped, useStepper, utils } = defineStepper(
  { id: "category", name: "category" },
  { id: "subcategory", name: "subcategory" },
  { id: "information", name: "information" },
);
