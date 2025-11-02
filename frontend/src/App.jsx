import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Upload from "./views/Upload.jsx";
import Report from "./views/Report.jsx";
import Profile from "./views/Profile.jsx";
import Login from "./views/Login.jsx";
import Admin from "./views/Admin.jsx";
import NavBar from "./components/NavBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-600 text-white w-full">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Upload />
                        </ProtectedRoute>
                    } />

                    <Route path="/report" element={
                        <ProtectedRoute>
                            <Report />
                        </ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />

                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <Admin />
                        </ProtectedRoute>
                    } />
                </Routes>
                {localStorage.getItem('token') && <NavBar />}
            </div>
        </BrowserRouter>
    );
};

export default App;