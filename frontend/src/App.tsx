import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/User/Home'
import FameRating from './components/FameRating'
import UserSettings from './components/User/UserSettings';
import UserSignup from './components/User/UserSignup';
import ProtectedRoute from './ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {

  return (
    <Router>
       <Routes>
         <Route path="/fm" element={<FameRating />}/>
         <Route path="/us/:id" element={<UserSettings />}/>
         <Route path="/signup" element={<UserSignup />}/>
         <Route path="/apiServeur/home" element={<ProtectedRoute component={Home} />} />
       </Routes>
     </Router>
  )
}

export default App