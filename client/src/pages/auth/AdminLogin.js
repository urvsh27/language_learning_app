import React, { useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Auth';
import BarLoader from 'react-spinners/BarLoader';
import { backendApi } from '../../utils/constants';
import './auth.css';
import LoaderBar from '../../components/LoaderBar';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [loader, setLoader] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleAdminLogin = async (e) => {
    setButtonLoader(true);
    e.preventDefault();
    try {
      const loginResponse = await axios.post(`${backendApi}admin-login`, {
        email,
        password,
      });
      if (loginResponse && loginResponse.data.status === '1') {
        toast.success(loginResponse.data.message);
        setTimeout(() => {
          setLoader(true);
          setAuth({
            ...auth,
            userDetails: loginResponse.data.data.userDetails,
            token: loginResponse.data.data.accessToken,
            userRoles: loginResponse.data.data.userRoles,
          });
          localStorage.setItem(
            'auth',
            JSON.stringify(loginResponse.data.data, null, 4)
          );
        }, 2000);
        setTimeout(() => {
          navigate('/admin-dashboard');
        }, 4000);
      }
    } catch (error) {
      setButtonLoader(false);
      if (error.response && error.response.data.status === '0') {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <Layout title={'Admin login'}>
      <div className="auth-display">
        <div>
          <Toaster />
          {loader && (
            <>
              <LoaderBar />
            </>
          )}
        </div>
        {!loader && (
          <>
            <form className="auth-form" onSubmit={handleAdminLogin}>
              <div className="mb-3">
                <h1>Admin Login</h1>
                admin@gmail.com <br></br> Admin@1234
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control input-field"
                  id="email"
                  style={{ width: '300px' }}
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control input-field password-input"
                    id="password"
                    style={{ width: '300px' }}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <span
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </span>
                </div>
              </div>
              {!buttonLoader ? (
                <>
                  <button
                    type="submit"
                    className="btn btn-dark button-submit"
                    style={{ width: '300px' }}
                  >
                    Admin Login
                  </button>
                </>
              ) : (
                <>
                  <>
                    <center className="m-3">
                      <BarLoader height={4} width={200} />
                    </center>
                  </>
                </>
              )}
            </form>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminLogin;
