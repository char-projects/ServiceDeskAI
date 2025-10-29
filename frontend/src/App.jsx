import { BrowserRouter } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Upload from "./views/Upload.jsx";
import NavBar from "./components/NavBar.jsx"

const App = () => {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-600 text-white w-full">
                <Upload />
                <NavBar />
            </div>
        </BrowserRouter>
    );
};

export default App;