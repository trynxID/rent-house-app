import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    no_phone: "",    
  });

  const [errorMessage, setErrorMessage] = useState("");

  const { fullname, email, password, no_phone } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/register/save", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(res.data);

      navigate("/login");
      alert("Registrasi berhasil");
    } catch (err) {
      console.error(err.response.data);
      setErrorMessage(err.response.data.errors ? err.response.data.errors.map(e => e.msg).join(', ') : err.response.data.msg);
      setFormData({
        fullname: "",
        email: "",
        password: "",
        no_phone: "",        
      });
    }
  };

  return (
    <div className="registrasi-container">
      <form onSubmit={handleSubmit}>
        <h2>Silahkan registrasi</h2>
        <div className="input-form">
          <label>Nama lengkap*</label>
          <input
            type="text"
            name="fullname"
            value={fullname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-form">
          <label>Nomor telepon*</label>
          <input
            type="text"
            name="no_phone"
            value={no_phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-form">
          <label>Email*</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-form">
          <label>Password*</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>        
          {errorMessage && <p className="error-message">{errorMessage}</p>}        
        <button type="submit">Register</button>
        <div className="button-kembali">
          <Link to="/login">
            <span>Kembali ke Login</span>
          </Link>
        </div>
      </form>      
    </div>
  );
};

export default Register;
