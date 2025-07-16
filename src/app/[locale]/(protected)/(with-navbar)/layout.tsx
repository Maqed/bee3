import Navbar from "@/components/navbar/navbar";
import React, { ReactNode } from "react";

function ProtectedLayoutWithNavbar({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default ProtectedLayoutWithNavbar;
