import React, { useEffect, useState } from 'react';
import DashboardScreen from '../../components/DashboardScreen';
import axios from 'axios';
import { backendApi } from '../../utils/constants';
import LoaderBar from '../../components/LoaderBar';
import toast, { Toaster } from 'react-hot-toast';
import './userExercises.css';
import { useNavigate } from 'react-router-dom';

const UserExercises = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const languageId = queryParams.get('languageId');
  const languageName = queryParams.get('languageName');
  const [loader, setLoader] = useState(true);
  const [exercises, setExercises] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${backendApi}user-exercises/${languageId}`)
      .then((response) => {
        setExercises(response.data.data);
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
    <DashboardScreen title={`${languageName} exercises`} screenName={`${languageName} exercises`}>
      <Toaster />
          <div className="d-flex gap-3 mb-3">
        <button
          className="btn btn-primary"
          onClick={() => {
           navigate(`/language-preference`)
          }}
        >
          Go Back
        </button>      </div>

      <div className="exercise-card-container">
        {/* Exercise list Start*/}
        {loader ? (
          <>
            <LoaderBar />
          </>
        ) : (
          <>
            {exercises.length>0 &&
              exercises.map((exercise) => (
                <div className="col-md-5" key={exercise.exerciseId}>
                  <div className="card mb-3 exercise-card">
                    <div className="card-body">
                      <h4 className="exercise-title">
                        {exercise.exerciseName}
                      </h4>
                      <p className="exercise-paragraphs">
                        Exercise Weightage: {exercise.exerciseWeightage}
                      </p>
                      <p className="exercise-paragraphs">
                        Total Questions: {exercise.questions.length}
                      </p>
                      <p className="btn btn-success">
                        Obtained marks: {exercise.userObtainedMarks}
                      </p>
                      <div className="d-flex gap-2">
                        <button
                          className="exercise-buttons exercise-edit-button"
                          onClick={()=>navigate(`/quiz-dashboard?exerciseId=${exercise.exerciseId}&languageId=${languageId}&languageName=${languageName}`)}
                        >
                          Start
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </>
        )}
        {/* Exercise list End*/}
      </div>
    </DashboardScreen>
  );
};

export default UserExercises;
