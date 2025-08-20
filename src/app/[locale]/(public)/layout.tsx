import { type ReactNode } from "react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";

type Props = {
  children: ReactNode;
};

function PublicRoutesLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default PublicRoutesLayout;
