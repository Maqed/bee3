import Footer from "@/components/footer";
import Navbar from "@/components/navbar/navbar";
import React, { ReactNode } from "react";

function ProtectedLayoutWithNavbar({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default ProtectedLayoutWithNavbar;
