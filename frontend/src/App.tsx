import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserSettings from './components/User/userSettings';
import UserSignup from './components/User/UserSignup';
import UserSignIn from './components/User/userSignIn';
import ProtectedRoute from './ProtectedRoute';
import Navbar from './components/Navbar';
import FameRating from './components/FameRating';
import Sidebar from './components/Sidebar';
import { useAuth } from './components/useAuth';
import { AuthProvider } from './components/authContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

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
            <Route path="/us/:id" element={<UserSettings />} />
            <Route path="/signup" element={<UserSignup />} />            
            <Route path="/signin" element={<UserSignIn />} />
            <Route path="/fm" element={<ProtectedRoute component={FameRating} />} />
            <Route path="/apiServeur/usersettings" element={<ProtectedRoute component={UserSettings} />} />
          </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App