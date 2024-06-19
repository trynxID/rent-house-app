import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Navbarpenyewa = () => {
  const [userData, setUserData] = useState({
    id: "",
    fullname: "",
    email: "",
    no_phone: "",
    role: "",
    img_url: "",
  });

  const [profileImage, setProfileImage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserData({
        id: decoded.id,
        fullname: decoded.user,
        email: decoded.email,
        no_phone: decoded.no_phone,
        role: decoded.role,
        img_url: decoded.img_url,
      });
      setProfileImage(decoded.img_url);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.put(`/api/users/logout/${userData.id}`);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <nav className="navbar-penyewa">
      <h3>Selamat datang {userData.fullname}</h3>
      <div className="item-navbar">
        <Link to="/home">
          <p>Home</p>
        </Link>        
        <Link to="/booking">
          <p>Booking</p>
        </Link>
        <Link to="/transaksi">
          <p>Transaksi</p>
        </Link>
        <Link to="/myprofile">
          <p>My profile</p>
        </Link>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
        <img className="fotoprofil" src={profileImage} alt="Profil" />
      </div>
    </nav>
  );
};

export default Navbarpenyewa;
