import { type ReactNode } from "react";
import Navbar from "@/components/navbar/navbar";

type Props = {
  children: ReactNode;
};

function PublicRoutesLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default PublicRoutesLayout;
