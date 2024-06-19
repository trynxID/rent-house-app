import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/login/auth", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { token, role } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      switch (role) {
        case 1:
          navigate("/home");
          break;
        case 2:
          navigate("/homeadmin");
          break;
        case 3:
          navigate("/homesuperadmin");
          break;        
        default:
          navigate("/");
      }
    } catch (err) {
      console.error(err.response.data);
      setErrorMessage(err.response.data.msg || "Pengguna tidak tersedia");
      setFormData({
        email: "",
        password: ""
      });
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Silahkan login</h2>
        <div className="input-form">
          <label>Email*</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="input-form">
          <label>Password*</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Login</button>
        <p>belum punya akun?<Link to="/register"><span> Register</span></Link></p>
      </form>
    </div>
  );
}

export default Login;
