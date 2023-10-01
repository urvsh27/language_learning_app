import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardScreen from '../../components/DashboardScreen';
import { backendApi } from '../../utils/constants';
import LoaderBar from '../../components/LoaderBar';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LanguagePreference = () => {
  const [languagePreferences, setLanguagePreferences] = useState([]);
  const [loader, setLoader] = useState(true);

  // Get user preferences
  const getUserPreferences = ()=>{
    axios
    .get(`${backendApi}user-settings`)
    .then((response) => {
      setLanguagePreferences(response.data.data);
      toast.success(response.data.message);
      setLoader(false);
    })
    .catch((error) => {
      if (error.response && error.response.data.status === '0') {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    });
  };

  // Handle language preferences
  const handleUpdateLanguagePreference = (languageId) => {
    setLoader(true);
    axios
      .post(`${backendApi}user-preference`, {
        languageId: languageId,
      })
      .then((response) => {
        toast.success(response.data.message);
        setLoader(false);
        getUserPreferences();
      })
      .catch((error) => {
        if (error.response && error.response.data.status === '0') {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
        setTimeout(()=>{
          navigate(`/user-dashboard`);
        }, 3000)
      });
  };
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${backendApi}user-settings`)
      .then((response) => {
        setLanguagePreferences(response.data.data);
        toast.success(response.data.message);
        setLoader(false);
      })
      .catch((error) => {
        if (error.response && error.response.data.status === '0') {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      });
  }, []); // Empty dependency array ensures the effect runs once after the initial render

  return (
    <DashboardScreen
      title={'Language preference'}
      screenName={'Language preference'}
    >
      <Toaster />
      <div className="d-flex gap-3 mb-3">
        <button
          className="btn btn-primary"
          onClick={() => {
            navigate(`/user-dashboard`);
          }}
        >
          Go Back
        </button>
        <button className="btn btn-primary">Update language preference </button>
      </div>
      <div className="row">
        {loader ? (
          <>
            <LoaderBar />
          </>
        ) : (
          <>
            {languagePreferences.map((language) => (
              <div key={language.languageId} className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">{language.languageName}</h4>
                    {language.userPreferences ? (
                      <>
                        <div className="d-flex gap-1">
                          <div className="btn btn-success" disabled>
                            Added to preference
                          </div>
                          <div
                            className="btn btn-dark"
                            onClick={() =>
                              navigate(
                                `/user-exercises?languageId=${language.languageId}&languageName=${language.languageName}`
                              )
                            }
                          >
                            Open exercises
                          </div>
                        </div>
                        <div className="d-flex gap-1">
                        <div
                            className="btn btn-outline-primary mt-2"
                            onClick={() =>
                              navigate(
                                `/leaderBoard?languageId=${language.languageId}&languageName=${language.languageName}`
                              )
                            }
                          >
                            Open leaderboard
                          </div>
                          <div
                            className="btn btn-outline-primary mt-2"
                            onClick={() =>
                              navigate(
                                `/user-progress?languageId=${language.languageId}&languageName=${language.languageName}`
                              )
                            }
                          >
                            Check your progress
                          </div>
                        </div>
                 
                      </>
                    ) : (
                      <div className="d-flex flex-row gap-1">
                        <div className="btn btn-warning" disabled>
                          Not added to preference
                        </div>
                        <div
                          className="btn btn-dark"
                          onClick={() =>
                            handleUpdateLanguagePreference(language.languageId)
                          }
                        >
                          Add
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </DashboardScreen>
  );
};

export default LanguagePreference;
