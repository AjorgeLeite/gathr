import React, { ReactNode } from "react";
import Navbar from "./Navbar";

type LayoutTypes = {
  children: ReactNode;
};

const Layout: React.FC<LayoutTypes> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default Layout;