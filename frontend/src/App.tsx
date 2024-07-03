import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserSettings from './components/User/userSettings';
import UserSignup from './components/User/userSignup';
import UserSignIn from './components/User/userSignin';
import ProtectedRoute from './security/ProtectedRoute';
import Navbar from './components/Navbar';
import FameRating from './components/FameRating';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Match from './components/Match';
import { useAuth } from './security/useAuth';
import { AuthProvider } from './security/authContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import UserProfile from './components/User/userProfile';
import UserProfileDisplay from './components/User/userProfileDisplay';
import { ProfileProvider, useProfile } from './components/User/profileContext';
import { useEffect } from 'react';
import { isPromise } from 'util/types';

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : null;
};

const ContentComplete: React.FC = () => {
  const { isProfileComplete } = useProfile();

  console.log("\n\n\n --------+++++++++----------- \n profile complete ? ", isProfileComplete, "\n-----+++++--------");
  return (
    <Routes>
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