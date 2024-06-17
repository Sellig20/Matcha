import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import FameRating from './components/FameRating'
// import Sample from './components/User/sample';
import UserSettings from './components/User/userSettings';
import UserSignup from './components/User/UserSignup';
import ProtectedRoute from './ProtectedRoute';
import Navbar from './components/Navbar';
import FameRating from './components/FameRating';
import { AuthProvider } from './components/authContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {

  return (
    <AuthProvider>
      <Router>
          <Navbar/>
          <Routes>
            <Route path="/us/:id" element={<UserSettings />} />
            <Route path="/signup" element={<UserSignup />} />
            <Route path="/fm" element={<ProtectedRoute component={FameRating} />} />
            <Route path="/apiServeur/usersettings" element={<ProtectedRoute component={UserSettings} />} />
          </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App