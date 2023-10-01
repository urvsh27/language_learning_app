import React, { useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import BarLoader from 'react-spinners/BarLoader';
import { NavLink } from 'react-router-dom';
import { backendApi } from '../../utils/constants';
import './auth.css';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e) => {
    setButtonLoader(true);
    e.preventDefault();
    try {
      const registerResponse = await axios.post(`${backendApi}register`, {
        name,
        email,
        password,
      });
      if (registerResponse && registerResponse.data.status === '1') {
        toast.success(registerResponse.data.message);
        setTimeout(() => {
          setLoader(true);
        }, 2000);
        setTimeout(() => {
          navigate('/login');
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
    <Layout title={'Register'}>
      <div className="auth-display">
        <div>
          <Toaster />
          {loader && (
            <>
              <div>
                <center className="mb-3">
                  <BarLoader height={4} width={200} />
                </center>
                <p className="page-text">Redirecting to the Login page</p>
              </div>
            </>
          )}
        </div>
        {!loader && (
          <>
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="mb-3">
                <h1>Register</h1>
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control input-field"
                  id="name"
                  style={{ width: '300px' }}
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
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
                    Register
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
              <NavLink to="/login" className="nav-link mt-3 text-center">
                Already have an account?{' '}
                <span className="text-primary">Login</span>
              </NavLink>
            </form>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Register;
