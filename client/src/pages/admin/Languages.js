import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import DashboardScreen from '../../components/DashboardScreen';
import axios from 'axios';
import { backendApi } from '../../utils/constants';
import { IsNotNullOrEmpty } from '../../utils/enum';
import LoaderBar from '../../components/LoaderBar';
import toast, { Toaster } from 'react-hot-toast';

const Languages = () => {
  const [languages, setLanguages] = useState([]);
  const navigate = useNavigate(); 
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    axios
      .get(`${backendApi}languages`)
      .then((response) => {
        setLanguages(response.data.data);
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
  }, []);

  const handleOpenExercises = (languageId, languageName) => {
    navigate(`/exercises?languageId=${languageId}&languageName=${languageName}`);
  };

  return (
    <DashboardScreen
      title={'Exercises'}
      screenName={'All Active Languages'}
    >    <Toaster/>

      <div className="row">
        {loader ? (
          <>
            <LoaderBar />
          </>
        ) : (
          <>
            {IsNotNullOrEmpty(languages) &&
              languages.map((language) => (
                <div className="col-md-4" key={language.languageId}>
                  <div className="card mb-4">
                    <div className="card-body">
                      <h5 className="card-title">{language.languageName}</h5>
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            handleOpenExercises(language.languageId, language.languageName)
                          } 
                        >
                          Open exercises
                        </button>
                      </div>
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

export default Languages;
