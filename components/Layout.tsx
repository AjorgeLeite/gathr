import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

type LayoutTypes = {
  children: ReactNode;
};

const Layout: React.FC<LayoutTypes> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
