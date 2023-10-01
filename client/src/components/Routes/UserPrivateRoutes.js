import { useState, useEffect } from 'react';
import { useAuth } from '../../context/Auth';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BarLoader from 'react-spinners/BarLoader';
import toast, { Toaster } from 'react-hot-toast';
import { backendApi } from '../../utils/constants';
import Layout from '../Layout';

export default function UserPrivateRoutes() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();
  const localStorageData = localStorage.getItem('auth');
  if (localStorageData) {
    var { accessToken } = JSON.parse(localStorageData);
  }
  useEffect(() => {
    const authCheck = async () => {
      try {
        const headers = {
          Authorization: accessToken,
        };
        const { data } = await axios.get(`${backendApi}user-auth`, {
          headers,
        });
        if (data?.status === '1') {
          setOk(true);
          setLoader(false);
        } else {
          setOk(false);
        }
      } catch (error) {
        setTimeout(() => {
          setAuth({
            ...auth,
            userDetails: null,
            token: '',
          });
          localStorage.removeItem('auth');
          navigate('/login');
        }, 4000);
        if (error.response?.data.status === '0' || error.response?.data.status === '5' ) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    };
    if (accessToken === null || accessToken === undefined) {
      setTimeout(() => {
        navigate('/login');
      }, 4000);
    } else {
      authCheck();
    }
  }, [auth, navigate, setAuth, accessToken]);

  return ok ? (
    <>
      <Outlet />
    </>
  ) : (
    <>
      {loader && (
        <>
          <Layout title={'Loading'}>
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
          </Layout>
        </>
      )}
    </>
  );
}
