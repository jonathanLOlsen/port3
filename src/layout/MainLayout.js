import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import './MainLayout.css'; // Optional if you want to style the layout

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Header />
      <Breadcrumbs />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
