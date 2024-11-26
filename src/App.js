import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Allmodel from './components/Allmodel';
import RateSoySauce from './components/RateSoySauce';
import Home from './components/Home';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import PostDetail from './components/PostDetail';
import Eachmodel from './components/Eachmodel';

const App = () => {
  return (
    <Router>
      <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/material/input/allmodel" element={<Allmodel />} />
            <Route path="/material/input/eachmodel" element={<Eachmodel />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:user_id" element={<Profile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add/eachmodel" element={<RateSoySauce />} />
            <Route path="/" element={<RateSoySauce />} />
            <Route path="/postdetail/:post_id" element={<PostDetail />} />
          </Routes>
        </div>
    </Router>
  );
};
 
export default App;