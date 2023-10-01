import React, { useEffect, useState } from 'react';
import DashboardScreen from '../../components/DashboardScreen';
import axios from 'axios';
import { backendApi } from '../../utils/constants';
import LoaderBar from '../../components/LoaderBar';
import { IsNotNullOrEmpty } from '../../utils/enum';
import toast, { Toaster } from 'react-hot-toast';
import './exercises.css';
import { useNavigate } from 'react-router-dom';

const Exercises = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const languageId = queryParams.get('languageId');
  const languageName = queryParams.get('languageName');
  const [loader, setLoader] = useState(true);
  const [exercises, setExercises] = useState([]);
  const [isCreateExerciseModalOpen, setIsCreateExerciseModalOpen] =
    useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const navigate = useNavigate();
  const [isEditExerciseModalOpen, setIsEditExerciseModalOpen] = useState(false);
  const [editedExerciseName, setEditedExerciseName] = useState('');
  const [editedExerciseWeightage,setEditedExerciseWeightage] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Function to get all the exercises
  const getExercises = () => {
    axios
      .get(`${backendApi}exercises/${languageId}`)
      .then((response) => {
        setExercises(response.data.data);
      })
      .catch((error) => {
        if (error.response && error.response.data.status === '0') {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
        setTimeout(() => {
          navigate('/languages');
        }, 4000);
      });
  };

  // Function to handle opening the edit exercise modal
  const handleEditExercise = (exercise) => {
    setSelectedExercise(exercise);
    setEditedExerciseName(exercise.exerciseName);
    setEditedExerciseWeightage(exercise.exerciseWeightage);
    setIsEditExerciseModalOpen(true);
  };

  // Function to create exercise
  const handleCreateExercise = () => {
    setLoader(true);
    setIsCreateExerciseModalOpen(false); // Close the modal here
    axios
      .post(`${backendApi}exercise`, {
        name: newExerciseName,
        languageId: languageId,
      })
      .then((response) => {
        toast.success(response.data.message);
        setNewExerciseName('');
        getExercises();
        setLoader(false);
      })
      .catch((error) => {
        if (error.response && error.response.data.status === '0') {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
        setLoader(false);
        getExercises();
      });
  };

  // Function to handle updating the exercise name
  const handleUpdateExercise = () => {
    setLoader(true);
    const exerciseId = selectedExercise.exerciseId;
    setIsEditExerciseModalOpen(false);
    axios
      .patch(`${backendApi}exercise/${exerciseId}`, {
        name: editedExerciseName,
        exerciseWeightage : editedExerciseWeightage,
      })
      .then((response) => {
        toast.success(response.data.message);
        setIsEditExerciseModalOpen(false);
        getExercises();
        setLoader(false);
      })
      .catch((error) => {
        if (error.response && error.response.data.status === '0') {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
        setLoader(false);
      });
  };


  let requestBody = {};
  //Function to delete the exercise
  const handleActiveOrDeleteExercise = (exerciseId, type) => {
    if(type === 'deleted'){
      requestBody= { deleted: true };
    }else if(type === 'activate'){
      requestBody= { activated : true };
    }else if(type === 'deActivate'){
      requestBody= { activated: false };
    }else{
      toast.error('Query not defined.');

    }
    setLoader(true);
    axios
      .patch(`${backendApi}exercise/${exerciseId}`,requestBody)
      .then((response) => {
        toast.success(response.data.message);
        setIsEditExerciseModalOpen(false);
        getExercises();
        setLoader(false);
      })
      .catch((error) => {
        if (error.response && error.response.data.status === '0') {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
        setLoader(false);
      });
  };

    // Function to redirect question tab
  const handleManageQuestions = (exerciseId, activated) =>{
    if(activated){
      toast.error('Deactivate Exercise to manage questions.');
    }else{
      navigate(`/questions?exerciseId=${exerciseId}&languageName=${languageName}`);
    }
  };

  useEffect(() => {
    axios
      .get(`${backendApi}exercises/${languageId}`)
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
          navigate('/languages');
        }, 4000);
      });
  }, [languageId, navigate]);

  return (
    <DashboardScreen title={'Exercises'} screenName={`Manage ${languageName} exercises`}>
      <Toaster />
          <div className="d-flex gap-3 mb-3">
        <button
          className="btn btn-primary"
          onClick={() => {
            window.history.back();
          }}
        >
          Go Back
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setIsCreateExerciseModalOpen(true)}
        >
          Create exercise
        </button>
        <div className="btn btn-secondary font-weight-bold" disabled>You can backup your deleted exercises. Contact Developer to backup your exercises.</div>
      </div>

      {/* Create Exercise Modal Start*/}
      {isCreateExerciseModalOpen && (
        <div className="modal" style={{ display: 'block', marginTop: '50px' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Exercise</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsCreateExerciseModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="exerciseName">Exercise Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exerciseName"
                    value={newExerciseName}
                    onChange={(e) => setNewExerciseName(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreateExercise}
                >
                  Create
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsCreateExerciseModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Create Exercise Modal End*/}

      <div className="exercise-card-container">
        {/* Exercise list Start*/}
        {loader ? (
          <>
            <LoaderBar />
          </>
        ) : (
          <>
            {IsNotNullOrEmpty(exercises) &&
              exercises.map((exercise) => (
                <div className="col-md-5" key={exercise.exerciseId}>
                  <div className="card mb-3 exercise-card">
                    <div className="card-body">
                      {exercise.activated ? (
                        <span className="live-label live">
                          Exercise is Live
                        </span>
                      ) : (
                        <span className="live-label not-live">
                          Exercise is not Live
                        </span>
                      )}
                      <h5 className="exercise-title">
                        {exercise.exerciseName}
                      </h5>
                      <p className="exercise-paragraphs">
                        Exercise Weightage: {exercise.exerciseWeightage}
                      </p>
                      <p className="exercise-paragraphs">
                        Total Active Questions: {exercise.questions.length}
                      </p>
                      <p className="exercise-paragraphs">
                      Total Marks : {exercise.totalMarks}
                      </p>
                      
                      <div className="d-flex gap-2">
                        {/* Edit Exercise Start */}

                        <button
                          className="exercise-buttons exercise-edit-button"
                          onClick={() => handleEditExercise(exercise)}
                        >
                          Edit exercise
                        </button>
                        {/* Edit Exercise End */}

                        {/* Delete Exercise Start */}

                        <button
                          className="exercise-buttons exercise-delete-button"
                          onClick={() =>
                            handleActiveOrDeleteExercise(exercise.exerciseId,"deleted")
                          }
                        >
                          Delete exercise
                        </button>
                        {/* Delete Exercise End */}

                         {/* Active deActive Exercise Start */}
                          {exercise.activated ? (<><button
                          className="exercise-buttons exercise-deActivate-button "
                          onClick={() =>
                            handleActiveOrDeleteExercise(exercise.exerciseId,"deActivate")
                          }
                        >
                          Deactivate exercise
                        </button></>) : (<> <button
                          className="exercise-buttons exercise-activate-button"
                          onClick={() =>
                            handleActiveOrDeleteExercise(exercise.exerciseId,"activate")
                          }
                        >
                          Activate exercise
                        </button></>)}
                        
                        {/* Active deActive Exercise End */}

                        <button
                          className="exercise-buttons manage-questions-button"
                          onClick={
                          ()=>handleManageQuestions(exercise.exerciseId, exercise.activated)}
                        >
                          Manage Questions
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {/* Edit Exercise Modal */}
            {isEditExerciseModalOpen && (
              <div
                className="modal"
                style={{ display: 'block', marginTop: '50px' }}
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Edit Exercise</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setIsEditExerciseModalOpen(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <div className="form-group">
                        <label htmlFor="editedExerciseName">
                          Exercise Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="editedExerciseName"
                          value={editedExerciseName}
                          onChange={(e) =>
                            setEditedExerciseName(e.target.value)
                          }
                        />
                        <label htmlFor="exerciseWeightage">
                          Exercise weightage
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="exerciseWeightage"
                          value={editedExerciseWeightage}
                          onChange={(e) =>
                            setEditedExerciseWeightage(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleUpdateExercise}
                      >
                        Update
                      </button>
                      <button
                        exerciseDelete
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setIsEditExerciseModalOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        {/* Exercise list End*/}
      </div>
    </DashboardScreen>
  );
};

export default Exercises;
