// Sidebar.jsx
import React from "react";
import Talent from "../Images/talentlogo.png";
import Profile from "../Images/profile.png";
import Dashboard from "../Images/dashboard.svg";
import Transactions from "../Images/transactions.svg";
import Performance from "../Images/performance.svg";
import Logout from "../Images/logout.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import './Sidebar.css'; // Add this import to link the Sidebar CSS

const Sidebar = ({ name, email, sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleCloseMenu = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleIconClick = (path) => {
        if (path === "/logout") {
            signOut(auth)
                .then(() => {
                    // Log out successful
                    navigate("/"); // Redirect to the home page
                })
                .catch((error) => {
                    // An error happened
                    console.error(error);
                });
        } else {
            navigate(path);
        }
    };

    return (
        <div className={sidebarOpen ? "sidebar active" : "sidebar"}>
            <div className={sidebarOpen ? "logoContainer active" : "logoContainer"}>
                <img src={Talent} alt="icon" className="logo" />
            </div>
            <div className={sidebarOpen ? "burgerContainer active" : "burgerContainer"}>
                <div
                    className="burgerTrigger"
                    onClick={handleCloseMenu}
                ></div>
                <div className="burgerMenu"></div>
            </div>
            <div className={sidebarOpen ? "profileContainer active" : "profileContainer"}>
                <img src={Profile} alt="profile" className="profile" />
                <div className="profileContents">
                    <p className="name">Hello, {name}👋</p>
                    <p>{email}</p>
                </div>
            </div>
            <div className={sidebarOpen ? "contentsContainer active" : "contentsContainer"}>
                <ul>
                    <li className={location.pathname === "/dashboard" ? "active" : ""}>
                        <div onClick={() => handleIconClick("/dashboard")}>
                            <img src={Dashboard} alt="dashboard" />
                            {!sidebarOpen && <span className="label">Home</span>}
                            {sidebarOpen && <span className="text">Home</span>}
                        </div>
                    </li>
                    <li className={location.pathname === "/filter" ? "active" : ""}>
                        <div onClick={() => handleIconClick("/filter")}>
                            <img src={Performance} alt="filter" />
                            {!sidebarOpen && <span className="label">Filters</span>}
                            {sidebarOpen && <span className="text">Filters</span>}
                        </div>
                    </li>
                    <li className={location.pathname === "/excel" ? "active" : ""}>
                        <div onClick={() => handleIconClick("/excel")}>
                            <img src={Transactions} alt="filter" />
                            {!sidebarOpen && <span className="label"> Upload</span>}
                            {sidebarOpen && <span className="text">Upload</span>}
                        </div>
                    </li>
                    <li className={location.pathname === "/logout" ? "active" : ""}>
                        <div onClick={() => handleIconClick("/logout")}>
                            <img src={Logout} alt="logout" className="img-specific-padding"/>
                            {!sidebarOpen && <span className="label">Logout</span>}
                            {sidebarOpen && <span className="text">Logout</span>}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
