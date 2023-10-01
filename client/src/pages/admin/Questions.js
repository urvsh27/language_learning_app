import React, { useEffect, useState } from 'react';
import DashboardScreen from '../../components/DashboardScreen';
import axios from 'axios';
import { backendApi } from '../../utils/constants';
import LoaderBar from '../../components/LoaderBar';
import { IsNotNullOrEmpty } from '../../utils/enum';
import toast, { Toaster } from 'react-hot-toast';
import './questions.css';
import { useNavigate } from 'react-router-dom';

const Questions = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const exerciseId = queryParams.get('exerciseId');
  const languageName = queryParams.get('languageName');
  const [loader, setLoader] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [isCreateQuestionModalOpen, setIsCreateQuestionModalOpen] =
    useState(false);
  const [newQuestionName, setNewQuestionName] = useState('');
  const navigate = useNavigate();
  const [isEditQuestionModalOpen, setIsEditQuestionModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState('A');
  const [marks, setMarks] = useState(0);
  const [editedQuestionText, setEditedQuestionText] = useState('');
  const [editedOptions, setEditedOptions] = useState(['', '', '', '']);
  const [editedCorrectOption, setEditedCorrectOption] = useState('');
  const [editedMarks, setEditedMarks] = useState(0);

  // Function to get all the questions
  const getQuestions = () => {
    axios
      .get(`${backendApi}questions/${exerciseId}`)
      .then((response) => {
        setQuestions(response.data.data);
      })
      .catch((error) => {
        if (error.response && error.response.data.status === '0') {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
        setTimeout(() => {
          window.history.back();
          // navigate('/languages');
        }, 4000);
      });
  };

  // Function to open the edit question modal
  const handleEditQuestion = (question) => {
    setSelectedQuestion(question);
    setEditedQuestionText(question.questionName);
    setEditedOptions([ ...question.options]);
    setEditedCorrectOption( question.correctAnswer);
    setEditedMarks(question.marks);
    setIsEditQuestionModalOpen(true);
  };

  // Function to get correct options index
  const getCorrectOptionIndex = (optionLetter) => {
    return optionLetter.charCodeAt(0) - 'A'.charCodeAt(0);
  };

  // Function to handle create question
  const handleCreateQuestion = () => {
    setLoader(true);
    setIsCreateQuestionModalOpen(false);
    const correctOptionIndex = getCorrectOptionIndex(correctOption);
    axios
      .post(`${backendApi}question`, {
        question: newQuestionName,
        exerciseId: exerciseId,
        options: options, 
        correctAnswer: correctOptionIndex, 
        marks: marks,
      })
      .then((response) => {
        toast.success(response.data.message);
        setNewQuestionName('');
        setOptions(['', '', '', '']); 
        setCorrectOption('A'); 
        getQuestions();
        setLoader(false);
        setMarks(0); 
      })
      .catch((error) => {
        if (error.response && error.response.data.status === '0') {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
        setLoader(false);
        getQuestions();
      });
  };

  // Function to update the question details
  const handleUpdateQuestion = () => {
    setLoader(true);
    const questionId = selectedQuestion.questionId;
    setIsEditQuestionModalOpen(false);
    axios
      .patch(`${backendApi}question/${questionId}`, {
        question: editedQuestionText, 
        options: editedOptions, 
        correctAnswer: parseInt(editedCorrectOption),
        marks: editedMarks, 
      })
      .then((response) => {
        toast.success(response.data.message);
        getQuestions();
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
  //Function to delete the question
  const handleActiveOrDeleteQuestion = (questionId, type) => {
    if (type === 'deleted') {
      requestBody = { deleted: true };
    }  else {
      toast.error('Query not defined.');
    }
    setLoader(true);
    axios
      .patch(`${backendApi}question/${questionId}`, requestBody)
      .then((response) => {
        toast.success(response.data.message);
        setIsEditQuestionModalOpen(false);
        getQuestions();
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

  useEffect(() => {
    axios
      .get(`${backendApi}questions/${exerciseId}`)
      .then((response) => {
        setQuestions(response.data.data);
        setLoader(false);
      })
      .catch((error) => {
        if (error.response && error.response.data.status === '0') {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
        setTimeout(() => {
          window.history.back();
          // navigate('/languages');
        }, 4000);
      });
  }, [exerciseId, navigate]);

  return (
    <DashboardScreen title={'Questions'} screenName={`Manage ${languageName} questions`}>
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
          onClick={() => setIsCreateQuestionModalOpen(true)}
        >
          Create question
        </button>
        <div className="btn btn-secondary font-weight-bold" disabled>
          You can backup your deleted questions. Contact Developer to backup
          your questions.
        </div>
      </div>
      {/* Create question Modal Start*/}
      {isCreateQuestionModalOpen && (
        <div className="modal" style={{ display: 'block', marginTop: '50px' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Question</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsCreateQuestionModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="questionName">Question</label>
                  <input
                    type="text"
                    className="form-control"
                    id="questionName"
                    value={newQuestionName}
                    onChange={(e) => setNewQuestionName(e.target.value)}
                  />
                </div>

                <div className="form-group options-container">
                  <label className="option-label">Options</label>
                  {options.map((option, index) => (
                    <div className="option-wrapper" key={index}>
                      <div className="option-row">
                        <div className="optionName">{`${String.fromCharCode(
                          65 + index
                        )}`}</div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`Option ${String.fromCharCode(
                            65 + index
                          )}`}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...options];
                            newOptions[index] = e.target.value;
                            setOptions(newOptions);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="form-group">
                  <label>Correct Option</label>
                  <select
                    className="form-select"
                    value={correctOption}
                    onChange={(e) => setCorrectOption(e.target.value)}
                  >
                    {['A', 'B', 'C', 'D'].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="marks">Marks</label>
                  <input
                    type="number"
                    className="form-control"
                    id="marks"
                    value={marks}
                    min="0"
                    max="10"
                    onChange={(e) => setMarks(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreateQuestion}
                >
                  Create
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsCreateQuestionModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Create question Modal End*/}

      <div className="question-card-container">
        {/* Question list Start*/}
        {loader ? (
          <>
            <LoaderBar />
          </>
        ) : (
          <>
            {IsNotNullOrEmpty(questions) &&
              questions.map((question) => (
                <div className="col-md-8" key={question.questionId}>
                  <div className="card mb-3 question-card">
                    <div className="card-body">
                      {question.activated ? (
                        <span className="live-label live">
                          Question is Live
                        </span>
                      ) : (
                        <span className="live-label not-live">
                          Question is not Live
                        </span>
                      )}
                      <h5 className="question-title">
                        Question : {question.questionName}
                      </h5>
                      <p className="question-marks">
                        Question Marks: {question.marks}
                      </p>
                      <p className="question-options">
                        Question Options: {JSON.stringify(question.options)}
                      </p>
                      <div className="d-flex gap-2">
                        <button
                          className="question-buttons question-edit-button"
                          onClick={() => handleEditQuestion(question)}
                        >
                          Edit question
                        </button>
                        {/* Edit question Modal */}
                        {isEditQuestionModalOpen && (
                          <div
                            className="modal"
                            style={{ display: 'block', marginTop: '50px' }}
                          >
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title">Edit question</h5>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() =>
                                      setIsEditQuestionModalOpen(false)
                                    }
                                  ></button>
                                </div>
                                <div className="modal-body">
                                  <div className="form-group">
                                    <label htmlFor="editedQuestionText">
                                      Question Text
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="editedQuestionText"
                                      value={editedQuestionText}
                                      onChange={(e) =>
                                        setEditedQuestionText(e.target.value)
                                      }
                                    />
                                  </div>
                                  {/* Update options */}
                                  <div className="form-group options-container">
                                    <label className="option-label">
                                      Options
                                    </label>
                                    {editedOptions.map((option, index) => (
                                      <div
                                        className="option-wrapper"
                                        key={index}
                                      >
                                        <div className="option-row">
                                          <div className="optionName">{`${String.fromCharCode(
                                            65 + index
                                          )}`}</div>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder={`Option ${String.fromCharCode(
                                              65 + index
                                            )}`}
                                            value={option}
                                            onChange={(e) => {
                                              const newOptions = [
                                                ...editedOptions,
                                              ];
                                              newOptions[index] =
                                                e.target.value;
                                              setEditedOptions(newOptions);
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  {/* Update correct answer */}
                                  <div className="form-group">
                                    <label>Correct Option</label>
                                    <select
                                      className="form-select"
                                      value={editedCorrectOption}
                                      onChange={(e) =>
                                        setEditedCorrectOption(e.target.value)
                                      }
                                    >
                                      {['A', 'B', 'C', 'D'].map((option, index) => (
                                        <option key={option} value={index}>
                                          {option}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  {/* Update marks */}
                                  <div className="form-group">
                                    <label htmlFor="editedMarks">Marks</label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      id="editedMarks"
                                      value={editedMarks}
                                      min="0"
                                      max="10"
                                      onChange={(e) =>
                                        setEditedMarks(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleUpdateQuestion}
                                  >
                                    Update
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() =>
                                      setIsEditQuestionModalOpen(false)
                                    }
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Delete question Start */}

                        <button
                          className="question-buttons question-delete-button"
                          onClick={() =>
                            handleActiveOrDeleteQuestion(
                              question.questionId,
                              'deleted'
                            )
                          }
                        >
                          Delete Question
                        </button>
                        {/* Delete Exercise End */}

                        {/* Active deActive Exercise End */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {/* Edit question Modal */}
          </>
        )}
        {/* Question list End*/}
      </div>
    </DashboardScreen>
  );
};

export default Questions;
