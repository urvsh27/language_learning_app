import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import Logout from '../pages/auth/Logout';
import './header.css';

const Header = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const userRoles = JSON.stringify(auth.userRoles);
  const [logout, setLogout] = useState(false);
  const handleLogout = async () => {
    setAuth({
      ...auth,
      userDetails: null,
      token: '',
      userRoles: null,
    });
    localStorage.removeItem('auth');
    setLogout(true);
    setTimeout(() => {
      navigate('/');
    }, 4000);
  };
  return !logout ? (
    <>
      <div className="navbar-div">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarTogglerDemo01"
              aria-controls="navbarTogglerDemo01"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
              <Link to="/" className="navbar-brand">
                Quiz App
              </Link>
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <NavLink to="/" className="nav-link ">
                    Home
                  </NavLink>
                </li>
                {!auth.userDetails ? (
                  <>
                    <li className="nav-item">
                      <NavLink to="/admin-login" className="nav-link ">
                        Admin Login
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/register" className="nav-link">
                        Register
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/login" className="nav-link">
                        Login
                      </NavLink>
                    </li>
                  </>
                ) : (
                  <>
                    {userRoles.includes('user') && (
                      <>
                        <li className="nav-item">
                          <NavLink to="/user-dashboard" className="nav-link">
                            User dashboard
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink to="/language-preference" className="nav-link">
                            Language preference
                          </NavLink>
                        </li>
                        
                      </>
                    )}
                    {userRoles.includes('admin') && (
                      <>
                        <li className="nav-item">
                          <NavLink to="/admin-dashboard" className="nav-link">
                            Admin dashboard
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink to="/languages" className="nav-link">
                          Languages
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink to="/users" className="nav-link">
                            Users
                          </NavLink>
                        </li>
                      </>
                    )}

                    <li className="nav-item">
                      <NavLink onClick={handleLogout} className="nav-link">
                        Logout
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </>
  ) : (
    <>
      {logout && (
        <>
          <Logout/>
        </>
      )}
    </>
  );
};

export default Header;
