const generalMessages = {
  dbConnectionSuccess : 'Postgresql connected successfully.',
  dbConnectionFail : 'Unable to connect to the database.',
  dbSyncSuccess : 'Database synced.',
  welcomeMessage : 'Welcome to the quiz app',
  jwtTokenRequired : 'Authorization token required.',
  jwtTokenExpired : 'JWT token expired.',
  unableToVerifyJwtToken : 'Unable to verify jwt token.',
};

const userMessages = {
  userRegisterSuccess: 'User registered successfully.',
  userRegisterFail: 'User registration failed, please try again later.',
  userAlreadyExists: 'User already exists with this email address.',
  userNotFound : 'User not found with this email address.',
  userLoginSuccess : 'User login successfully.',
  userLoginFailure : 'User login failed, please check email and password.',
  usersListFound : 'Users list found successfully'
};

const roleMessages = {
  rolesNotFound : 'Roles not found.',
  rolesFound : 'Roles found successfully.'
};

const userRolesMessages = {
  userRolesNotFound : 'User roles not found.',
  userRolesFound : 'User roles found successfully.',
  noAccess : 'You don\'t have access to exceed further, Contact administrator for access.',
  noUserAccess : 'You don\'t have user access.',
  noAdminAccess : 'You don\'t have admin access.',
}

const languagesMessages = {
 languagesNotFound : 'Languages not found.',
 languagesFound : 'Languages found successfully.',
 languageNotFound : 'Language not found.',
 languageFound : 'Language found successfully.',
};

const exercisesMessages = {
  exercisesNotFound : 'Exercises not found.',
  exercisesFound : 'Exercises found successfully.',
  exerciseNotFound : 'Exercise not found.',
  exerciseFound : 'Exercise found successfully.',
  exerciseCreateFail : 'Failed to create exercise.',
  exerciseCreateSuccess : 'Exercises created successfully.',
  exerciseUpdateFail : 'Failed to update exercise.',
  exerciseUpdateSuccess : 'Exercises updated successfully.',
  exerciseActivateFail : 'Failed to activate exercise.',
  deActivateExercise : 'Deactivate exercise before deleting.',
 };


 const questionsMessages = {
  questionsNotFound : 'Questions not found.',
  questionsFound : 'Questions found successfully.',
  questionNotFound : 'Question not found.',
  questionFound : 'Question found successfully.',
  questionCreateFail : 'Failed to create question.',
  questionCreateSuccess : 'Questions created successfully.',
  questionUpdateFail : 'Failed to update question.',
  questionUpdateSuccess : 'Questions updated successfully.',
  addQuestionsToExercise : 'Add Or Update the questions before activating the exercise.',
  addWeightageToExercise : 'Add weightage before activating the exercise.',
 }

const userPreferenceMessages = {
    userPreferenceCreateFail : 'Unable to create user preference.',
    userPreferenceCreateSuccess : 'User preference created successfully.',  
    userPreferenceAlreadyExists : 'User preference already exists.',
};

const quizzesMessages = {
 quizStartSuccess : 'Quiz started successfully.',
};


const resultsMessages ={
  resultsNotFound: 'Results not found.',
  resultsFound: 'Results found successfully.',
  resultNotFound: 'Result not found.',
  resultFound: 'Result found successfully.',
  resultCreateFail: 'Failed to create result.',
  resultCreateSuccess: 'Result created successfully.',
  resultUpdateFail: 'Failed to update result.',
  resultUpdateSuccess: 'Result updated successfully.',
  resultGenerateFail: 'Failed to generate result.',
}


module.exports = {
  generalMessages,
  userMessages,
  roleMessages,
  userRolesMessages,
  languagesMessages,
  exercisesMessages,
  questionsMessages,
  userPreferenceMessages,
  quizzesMessages,
  resultsMessages
};
