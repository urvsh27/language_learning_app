# Quiz app 🔥

# Tech stack : PostgreSQL, Nodejs, Express js, React js
1. git clone
2. npm install
3. copy the .env file from envFile
4. cd client
5. npm install
6. npm run start
7. move back to server
8. npm run start
11. I have added the login details on Admin and User Login Screen.
    
# Working  
1. So, I have used PERN stack for this particular app and sequelize as an ORM.
2. It is fully dynamic, excluding some stuffs that can not be done from frontend.
3. User can login and register thorogh it's relavant pages.
4. One use can have multiple roles. As of now I have included user,admin,moderator roles.
5. Admin creation has been done via seeder files. (We can add user roles edit feature.)
6. Admin can view the languages which are active. Languages arw coming from server.
7. Each languages can have multiple exercises.
8. Exercise has the questions, weightage, totalMarks.
9. Admin can add, update, delete, activate, deactivate the exercises.
10. Once admin add the exercise by default it will be set to deactivate. 
11. Only after adding the questions to that particular exercise and adding the weightage admin can activate the exercise.
12. If the exercise is active it will show to the user dashboard.
13. Coming to the user dashboard, user can manage the language preference.
14. As of now users can add the language preference and can not perform any other actions on langauges.
15. After adding the preference they can view the exercises and give the quizzes.
16. After completing the quiz they can see the obtained marks.
17. Users can also view the leaderboard by languages and they can view their own progess and can reset the progress if they want.
18. User proficiency has been calculated by ((obtained marks/ total marks) * exerciseWeightage).
19. On admin panel admin can view the all users list.
 

# Screenshots
home

![home](./screenshots/home.png)

register

![Register](./screenshots/register.png)

login

![login](./screenshots/login.png)

adminLogin

![adminLogin](./screenshots/adminLogin.png)

adminLanguages

![adminLanguages](./screenshots/adminLanguages.png)

adminExercise1

![adminExercise1](./screenshots/adminExercise1.png)

adminExercise2

![adminExercise2](./screenshots/adminExercise2.png)

adminExercise3

![adminExercise3](./screenshots/adminExercise3.png)

adminQuestion1

![adminQuestion1](./screenshots/adminQuestion1.png)

adminQuestion2

![adminQuestion2](./screenshots/adminQuestion2.png)

adminQuestion3

![adminQuestion3](./screenshots/adminQuestion3.png)

allUsers

![allUsers](./screenshots/allUsers.png)

userDashboard

![userDashboard](./screenshots/userDashboard.png)

userLanguagePreference1

![userLanguagePreference1](./screenshots/userLanguagePreference1.png)

userLanguagePreference2

![userLanguagePreference2](./screenshots/userLanguagePreference2.png)

userExercise

![userExercise](./screenshots/userExercise.png)

userQuiz1

![userQuiz1](./screenshots/userQuiz1.png)

userQuiz2

![userQuiz2](./screenshots/userQuiz2.png)

userProgress

![userProgress](./screenshots/userProgress.png)

languageLeaderboard

![languageLeaderboard](./screenshots/languageLeaderboard.png)

