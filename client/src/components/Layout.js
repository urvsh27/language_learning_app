import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Helmet } from 'react-helmet';
import './layout.css';

const Layout = ({ children, title, description, keywords }) => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Helmet>
      <Header />
      <main className="main-area">{children}</main>
      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: 'Quiz app',
  description: 'Quiz app assignment using pern stack.',
  keywords: 'postgresql, express, react, nodejs',
};

export default Layout;
