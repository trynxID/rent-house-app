import React from "react";
import "../App.css";
import {Link} from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">
            <p>logo</p>
            <div className="button-navbar">
            <Link to="/login"><button>Login</button></Link>
            <Link to="/register"><button>Register</button></Link>
            </div>
        </nav>
    );
};

export default Navbar;