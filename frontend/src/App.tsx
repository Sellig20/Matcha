import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FameRating from './components/FameRating'
import UserSettings from './components/User/sample';
import UserSignup from './components/User/UserSignup';
import ProtectedRoute from './ProtectedRoute';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {

  return (
    <Router>
      <div>
        <Navbar />
      </div>
       <Routes>
         <Route path="/us/:id" element={<UserSettings />} />
         <Route path="/signup" element={<UserSignup />} />
         <Route path="/apiServeur/usersettings" element={<ProtectedRoute component={Home} />} />
       </Routes>
     </Router>
  )
}

export default App