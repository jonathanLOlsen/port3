import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Home from './views/Home';
import About from './views/About';
import Movies from './views/Movies'; // Import the Movies page
import MovieDetail from "./views/MovieDetail";
import People from "./views/People"
import PersonDetail from './views/PersonDetail';

const App = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/movies" element={<Movies />} /> {/* Add Movies route */}
          <Route path="/people" element={<People />} />
          <Route path="/people/:nConst" element={<PersonDetail />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
