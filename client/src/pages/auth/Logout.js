import React from 'react';
import BarLoader from 'react-spinners/BarLoader';
import { Toaster } from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
const Logout = () => {
  return (
    <>
      <Header />
      <div className="auth-display">
        <Toaster />
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: '100vh' }}
        >
          <center className="mb-3">
            <BarLoader height={4} width={200} />
            <p className="page-text">Redirecting...</p>
          </center>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Logout;
