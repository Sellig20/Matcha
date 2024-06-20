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

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : null;
};

function App() {

  return (
    <AuthProvider>
      <Router>
          <Navbar/>
          <AuthWrapper>
          <Sidebar />
          </AuthWrapper>
          <Routes>
            {/* <Route path="/us/:id" element={<UserSettings />} /> */}
            <Route path="/signup" element={<UserSignup />} />            
            <Route path="/signin" element={<UserSignIn />} />
            <Route path="/apiServeur/match" element={<Match />} />
            <Route path="/apiServeur/chat" element={<Chat />} />
            <Route path="/apiServeur/fm" element={<ProtectedRoute component={FameRating} />} />
            <Route path="/apiServeur/usersettings" element={<ProtectedRoute component={UserSettings} />} />
            <Route path="/apiServeur/userprofile" element={<ProtectedRoute component={UserProfile} />} />
          </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App