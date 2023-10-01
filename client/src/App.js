import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PageNotFound from './pages/PageNotFound';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import UserDashboard from './pages/user/UserDashboard';
import AdminLogin from './pages/auth/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserPrivateRoutes from './components/Routes/UserPrivateRoutes';
import AdminPrivateRoutes from './components/Routes/AdminPrivateRoutes';
import Leaderboard from './pages/Leaderboard';
import Users from './pages/admin/Users';
import Languages from './pages/admin/Languages';
import Exercises from './pages/admin/Exercises';
import Questions from './pages/admin/Questions';
import LanguagePreference from './pages/user/LanguagePreference';
import UserExercises from './pages/user/UserExercises';
import QuizDashboard from './pages/user/QuizDashboard';

function App() {
  return (
    <>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        {/* Users Private routes */}
        <Route path="/user-dashboard" element={<UserPrivateRoutes />}>
          <Route path="" element={<UserDashboard />} />
        </Route>
        <Route path="/language-preference" element={<UserPrivateRoutes />}>
          <Route path="" element={<LanguagePreference />} />
        </Route>
        <Route path="/leaderboard" element={<UserPrivateRoutes />}>
          <Route path="" element={<Leaderboard />} />
        </Route>
        <Route path="/user-exercises" element={<UserPrivateRoutes />}>
          <Route path="" element={<UserExercises />} />
        </Route>
        <Route path="/quiz-dashboard" element={<UserPrivateRoutes />}>
          <Route path="" element={<QuizDashboard />} />
        </Route>
        {/* Users Private routes */}

        {/* Admin Private routes */}
        <Route path="/admin-dashboard" element={<AdminPrivateRoutes />}>
          <Route path="" element={<AdminDashboard />} />
        </Route>
        <Route path="/languages" element={<AdminPrivateRoutes />}>
          <Route path="" element={<Languages />} />
        </Route>
        <Route path="/users" element={<AdminPrivateRoutes />}>
          <Route path="" element={<Users />} />
        </Route>
        <Route path="/exercises" element={<AdminPrivateRoutes />}>
          <Route path="" element={<Exercises />} />
        </Route>
        <Route path="/questions" element={<AdminPrivateRoutes />}>
          <Route path="" element={<Questions />} />
        </Route>
        {/* Admin Private routes */}
      </Routes>
    </>
  );
}

export default App;
