import React, { useEffect, useState } from 'react';
import DashboardScreen from '../../src/components/DashboardScreen';
import axios from 'axios';
import { backendApi } from '../../src/utils/constants';
import LoaderBar from '../../src/components/LoaderBar';
import toast, { Toaster } from 'react-hot-toast';
import './leaderboard.css';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const languageId = queryParams.get('languageId');
  const languageName = queryParams.get('languageName');  
  const [users, setUsers] = useState([]);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${backendApi}leaderboard/${languageId}`)
      .then((response) => {
        setUsers(response.data.data);
        setLoader(false);
      })
      .catch((error) => {
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
    <DashboardScreen title={'LeaderBoard'} screenName={`${languageName} Leaderboard`}>
       <div className="d-flex gap-3 mb-3">
        <button
          className="btn btn-primary"
          onClick={() => {
            navigate('/language-preference');
          }}
        >
          Go Back
        </button>
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
                    <td>{user.languagePercentage === 0 ? user.languagePercentage : user.languagePercentage.toFixed(1)} % </td>
                    <td>{user.proficiencyLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No leaderboard data</p>
          )}
        </>
      )}
    </DashboardScreen>
  );
};

export default Leaderboard;
