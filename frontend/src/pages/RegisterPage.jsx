import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../layouts/register.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    no_phone: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4573/api/register/save",
        formData
      );
      Swal.fire({
        title: "Pendaftaran Berhasil",
        icon: "success",
      });
      navigate("/login");
    } catch (err) {
      const valErrors = err.response.data.errors;
      let errorMsg = "";
      if (valErrors.length > 0) {
        errorMsg = valErrors.reduce((acc, error) => {
          return acc + `${error.msg} & `;
        }, "");
        errorMsg = errorMsg.slice(0, -2);
      }
      Swal.fire("Login Gagal", errorMsg, "error");
    }
  };

  return (
    <div className="register">
      <div className="register_content">
        <h2>Pendaftaran</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form className="register_content_form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullname"
            placeholder="Nama Lengkap"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="no_phone"
            placeholder="No. HP"
            value={formData.no_phone}
            onChange={handleChange}
            required
          />
          <button type="submit">Daftar</button>
        </form>
        <a href="/login">Sudah memiliki akun? Masuk disini</a>
      </div>
    </div>
  );
};

export default RegisterPage;
