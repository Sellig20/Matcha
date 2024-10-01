import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './security/useAuth';
import { AuthProvider } from './security/authContext';
import { ProfileProvider, useProfile } from './components/Navbar/User/profileContext';
import UserSettings from './components/Sidebar/UserSettings';
import UserSignup from './components/Navbar/User/UserSignup';
import UserSignIn from './components/Navbar/User/UserSignIn';
import ProtectedRoute from './security/ProtectedRoute';
import Navbar from './components/Navbar/Navbar';
import FameRating from './components/Navbar/FameRating';
import Sidebar from './components/Sidebar/Sidebar';
import Chat from './components/Navbar/Chat';
import Match from './components/Navbar/Match';
import HomePage from './components/HomePage';
import UserProfile from './components/Navbar/User/UserProfile';
import UserProfileDisplay from './components/Navbar/User/UserProfileDisplay';

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : null;
};

const ContentComplete: React.FC = () => {
  const { isProfileComplete } = useProfile();

  console.log("\n\n\n --------+++++++++----------- \n profile complete ? ", isProfileComplete, "\n-----+++++--------");
  return (
    <Routes>
      <Route path="/" element={<HomePage />} /> 
      <Route path="/signup" element={<UserSignup />} /> 
      <Route path="/signin" element={<UserSignIn />} />
          <Route path="/apiServeur/match" element={<Match />} />
          <Route path="/apiServeur/chat" element={<Chat />} />
          <Route path="/apiServeur/fm" element={<ProtectedRoute component={FameRating} />} />
          <Route path="/apiServeur/usersettings" element={<ProtectedRoute component={UserSettings} />} />
        {( isProfileComplete === false &&
          <Route path="/apiServeur/userprofile" element={<ProtectedRoute component={UserProfile} />} />
        )}
        {( isProfileComplete === true &&
          <Route path="/apiServeur/userprofile/display" element={<ProtectedRoute component={UserProfileDisplay} />} />
        )}
    </Routes>
  );
};

const App: React.FC = () => {

    return (
      <AuthProvider>
        <ProfileProvider>
          <Router>
            <Navbar />
            <AuthWrapper>
              <Sidebar />
            </AuthWrapper>
            <ContentComplete />
          </Router>
        </ProfileProvider>
      </AuthProvider>
    );
};

export default App;