import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Allmodel from './components/Allmodel';
import Addeachmodel from './components/Addeachmodel';
import Home from './components/Home';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import PostDetail from './components/PostDetail';
import Eachmodel from './components/Eachmodel';
import CreatePost from './components/CreatePost';
import RateSoySauce from './components/RateSoySauce';

const App = () => {
  return (
    <Router>
      <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/create" element={<CreatePost />} />
            <Route path="/material/input/allmodel" element={<Allmodel />} />
            <Route path="/material/input/eachmodel" element={<Eachmodel />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:user_id" element={<Profile />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add/eachmodel" element={<Addeachmodel />} />
            <Route path="/user/TKG/rating" element={<RateSoySauce />} />
            <Route path="/postdetail/:post_id" element={<PostDetail />} />
          </Routes>
        </div>
    </Router>
  );
};

export default App; 