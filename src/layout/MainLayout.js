import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs from "./Breadcrumbs";
import ScrollTop from "./ScrollTop";

const MainLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <ScrollTop />
      <Header />
      <Breadcrumbs />
      <main className="flex-grow-1 py-4 bg-light">
        <div className="container">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
