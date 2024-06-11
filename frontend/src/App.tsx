import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';import Home from './components/Home'
import FameRating from './components/FameRating'
import UserSettings from './components/User/UserSettings';
import UserSignup from './components/User/UserSignup';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
       <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/fm" element={<FameRating />}/>
         <Route path="/us/:id" element={<UserSettings />}/>
         <Route path="/signup" element={<UserSignup />}/>
       </Routes>
     </Router>
  )
}

export default App


// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Home from "./components/Home";
// import FameRating from "./components/FameRating";
// import './App.css'

// const App = () => {
//   const [count, setCount] = useState(0)

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/fm" element={<FameRating />}/>
//       </Routes>
//     </BrowserRouter>
//   );

// }
// export default App;
