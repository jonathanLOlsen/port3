import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Home from './views/Home';
import About from './views/About';
import Movies from './views/Movies'; // Import the Movies page
import Login from './views/Login';
import MovieDetail from "./views/MovieDetail";

const App = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/movies" element={<Movies />} /> {/* Add Movies route */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
