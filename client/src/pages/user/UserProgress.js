import React, { useEffect, useState } from 'react';
import DashboardScreen from '../../components/DashboardScreen';
import axios from 'axios';
import { backendApi } from '../../utils/constants';
import LoaderBar from '../../components/LoaderBar';
import toast, { Toaster } from 'react-hot-toast';
import '../leaderboard.css';
import { useNavigate } from 'react-router-dom';

const UserProgress = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const languageId = queryParams.get('languageId');
  const languageName = queryParams.get('languageName');  
  const [users, setUsers] = useState([]);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();

  const getUseProgressData = ()=>{
    axios
    .get(`${backendApi}user-progress/${languageId}`)
    .then((response) => {
      setUsers(response.data.data);
      setLoader(false);
    })
    .catch((error) => {
      console.log(error);
      if (error.response && error.response.data.status === '0') {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
      setTimeout(() => {
        navigate('/language-preference');
      }, 4000);
    });
  }
  const handleDeleteUserProgress = ()=>{
    axios
      .post(`${backendApi}reset-progress/${languageId}`)
      .then((response) => {
        toast.success(response.data.message);
        setLoader(false);
        getUseProgressData();
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.data.status === '0') {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      });
  }
  useEffect(() => {
    axios
      .get(`${backendApi}user-progress/${languageId}`)
      .then((response) => {
        setUsers(response.data.data);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.data.status === '0') {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
        setTimeout(() => {
          navigate('/language-preference');
        }, 4000);
      });
  }, [languageId, navigate]);

  return (
    <DashboardScreen title={'User progress'} screenName={`Progress details of ${languageName} language`}>
       <div className="d-flex gap-3 mb-3">
        <button
          className="btn btn-primary"
          onClick={() => {
            navigate('/language-preference');
          }}
        >
          Go Back
        </button>
      {  users.length >0 && <><button
          className="btn btn-danger"
          onClick={handleDeleteUserProgress}
        >
         Delete progress data
        </button></>}
      </div>
      <Toaster />
      {loader ? (
        <>
          <LoaderBar />
        </>
      ) : (
        <>
          {users.length > 0 ? (
            
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">User Name</th>
                  <th scope="col">Language Percentage</th>
                  <th scope="col">Proficiency Level</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.languagePercentage === 0 ? user.languagePercentage : user.languagePercentage} % </td>
                    <td>{user.proficiencyLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h6>No progress data</h6>
          )}
        </>
      )}
    </DashboardScreen>
  );
};

export default UserProgress;
