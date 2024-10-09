import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/assets/styles/App.css'
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
import LandingPage from './components/LandingPage';
import UserProfile from './components/Navbar/User/UserProfile';
import UserProfileDisplay from './components/Navbar/User/UserProfileDisplay';
import MatchaProfile from './components/Navbar/User/MatchaProfile';
import Map from './components/Navbar/Map';
import ConfidentialityPolitic from './components/Sidebar/ConfidentialityPolitic';
import Report from './components/Sidebar/Report';
import UserProfileUpdate from './components/Navbar/User/UserProfileUpdate';
import UserSettingsUpdate from './components/Sidebar/UserSettingsUpdate';

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : null;
};

const ContentComplete: React.FC = () => {
  const { isProfileComplete } = useProfile();

  console.log("\n\n Welcome to the app. Is profile completed ? ", isProfileComplete);
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} /> 
      <Route path="/signup" element={<UserSignup />} /> 
      <Route path="/signin" element={<UserSignIn />} />
          <Route path="/apiServeur/mymatchaprofile" element={<ProtectedRoute component={MatchaProfile} />} />
          <Route path="/apiServeur/match" element={<ProtectedRoute component={Match} />} />
          <Route path="/apiServeur/chat" element={<ProtectedRoute component={Chat} />} />
          <Route path="/apiServeur/fm" element={<ProtectedRoute component={FameRating} />} />
          <Route path="/apiServeur/map" element={<ProtectedRoute component={Map} />} />
          <Route path="/apiServeur/usersettings" element={<ProtectedRoute component={UserSettings} />} />
          <Route path="/apiServeur/usersettings/update" element={<ProtectedRoute component={UserSettingsUpdate} />} />
          <Route path="/apiServeur/confidentialitypolitic" element={<ProtectedRoute component={ConfidentialityPolitic} />} />
          <Route path="/apiServeur/report" element={<ProtectedRoute component={Report} />} />
        {( isProfileComplete === false &&
          <Route path="/apiServeur/userprofile" element={<ProtectedRoute component={UserProfile} />} />
        )}
        {( isProfileComplete === true &&
          <Route path="/apiServeur/userprofile/display" element={<ProtectedRoute component={UserProfileDisplay} />} />
        )}
        {( isProfileComplete === true &&
        <Route path="/apiServeur/userprofile/display/update" element={<ProtectedRoute component={UserProfileUpdate} />} />
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