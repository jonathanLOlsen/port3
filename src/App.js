import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import MainLayout from './layout/MainLayout'; // Import MainLayout
import Home from './views/Home';
import About from './views/About';
import Profile from './views/Profile';
import Bookmarks from './views/Bookmarks';
import Login from './views/Login';
import Register from './views/Register';
import MovieDetail from "./views/MovieDetail";
import People from "./views/People";
import PersonDetail from './views/PersonDetail';
import Movies from "./views/Movies";

// ProtectedRoute function to guard routes
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

// PublicRoute to redirect authenticated users away from login and register pages
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Navigate to="/profile" /> : children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <MainLayout> {/* Wrap routes with MainLayout */}
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                        <Route path="/people" element={<People />} />
                        <Route path="/people/:nConst" element={<PersonDetail />} />
                        <Route path="/movies" element={<Movies />} />
                        <Route path="/movies/:id" element={<MovieDetail />} />

                        {/* Protected Routes */}
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
                    </Routes>
                </MainLayout>
            </Router>
        </AuthProvider>
    );
}

export default App;
