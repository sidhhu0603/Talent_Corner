// App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Filter from "./pages/Filter";
import Profiles from "./pages/Profiles";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ExcelUploader from "./pages/ExcelUploader"
import { auth } from "./firebase";
import "../src/styles/main.scss";

function App() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified) {
          setUserName(user.displayName);
          setUserEmail(user.email);
          setIsAuthenticated(true);
        } else {
          setUserName("");
          setUserEmail("");
          setIsAuthenticated(false);
        }
      } else {
        setUserName("");
        setUserEmail("");
        setIsAuthenticated(false);
      }
    });
  }, []);

  return (
      <Router>
          <div className="App">
              <Routes>
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
              </Routes>

        {isAuthenticated && (
          <Sidebar
            name={userName}
            email={userEmail}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        )}

        {isAuthenticated && (
          <Routes>
            <Route path="/dashboard" element={<Dashboard sidebarOpen={sidebarOpen} />} />
            <Route path="/profiles/:contactNo" element={<Profiles sidebarOpen={sidebarOpen} />} />
            <Route path="/excel" element={<ExcelUploader sidebarOpen={sidebarOpen}/>} />
            <Route path="/filter" element={<Filter sidebarOpen={sidebarOpen}/>} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
