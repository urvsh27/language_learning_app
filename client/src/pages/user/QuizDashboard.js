import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendApi } from '../../utils/constants';
import LoaderBar from '../../components/LoaderBar';
import toast, { Toaster } from 'react-hot-toast';
import './quizDashboard.css';
import { IsNotNullOrEmpty } from '../../utils/enum';
import { useNavigate } from 'react-router-dom';

const QuizDashboard = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const exerciseId = queryParams.get('exerciseId');
  const languageId = queryParams.get('languageId');
  const languageName = queryParams.get('languageName');
  const [loader, setLoader] = useState(true);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  useEffect(() => {
    axios
      .get(`${backendApi}quiz-questions/${exerciseId}`)
      .then((response) => {
        toast.success(response.data.message);
        const initialSelectedOptions = {};
        response.data.data.forEach((question) => {
          initialSelectedOptions[question.questionId] = null;
        });
        setSelectedOptions(initialSelectedOptions);
        setQuizQuestions(response.data.data);
        setLoader(false);
      })
      .catch((error) => {
        // Handle error
      });
  }, [exerciseId]);
  const navigate = useNavigate();

  const handleOptionChange = (questionId, optionIndex) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    setLoader(true);
    const userEndQuizData = Object.entries(selectedOptions).map(
      ([questionId, optionIndex]) => ({
        questionId,
        selectedOptionIndex: optionIndex,
      })
    );
    axios
      .post(`${backendApi}end-quiz/${exerciseId}`, { userEndQuizData })
      .then((response) => {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate(`/user-exercises?exerciseId=${exerciseId}&languageId=${languageId}&languageName=${languageName}`); 
         }, 4000);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setTimeout(() => {
          navigate(`/user-exercises?exerciseId=${exerciseId}&languageId=${languageId}&languageName=${languageName}`); 
         }, 4000);
      });
  };

  return (
    <div className="quiz-dashboard">
      <div className="container mt-4">
        <Toaster />
        {loader ? (
          <LoaderBar />
        ) : (
          <div className="row justify-content-center">
            <div className="col-md-12 text-center mb-4">
              <div className="flex">
                <h1 className="bold-text">{`${languageName} Quiz`}</h1>
                <button
                  className="btn btn-dark"
                  onClick={() =>
                    navigate(
                      `/user-exercises?exerciseId=${exerciseId}&languageId=${languageId}&languageName=${languageName}`
                    )
                  }
                >
                  Quit
                </button>
              </div>
            </div>
            {IsNotNullOrEmpty(quizQuestions) &&
              quizQuestions.map((question, index) => (
                <div key={index} className="col-md-8 mb-4">
                  <div className="card shadow">
                    <div className="card-body">
                      <h5 className="card-title">
                        {index + 1}. {question.questionName}
                      </h5>
                      <form>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="form-check mb-2">
                            <input
                              className="form-check-input"
                              type="radio"
                              name={`question-${index}`}
                              id={`option-${optionIndex}`}
                              value={option}
                              onChange={() =>
                                handleOptionChange(
                                  question.questionId,
                                  optionIndex
                                )
                              }
                              required 
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`option-${optionIndex}`}
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            <div className="col-md-8 mb-4 text-center">
              <button className="btn btn-primary" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizDashboard;
