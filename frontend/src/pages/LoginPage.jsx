import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../layouts/login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4573/api/login/auth",
        { email, password }
      );
      const userData = response.data;
      localStorage.setItem("user", JSON.stringify(userData.user));
      localStorage.setItem("token", userData.token);

      switch (userData.user.role) {
        case 1:
          navigate("/property");
          break;
        case 2:
          navigate("/admin/dashboard");
          break;
        case 3:
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/");
      }
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
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="login">
      <div className="login_content">
        <h2>Validasi Akun</h2>
        <form className="login_content_form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Kata Sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">MASUK</button>
        </form>
        <a href="/register">Belum memiliki akun? Daftar disini!</a>
      </div>
    </div>
  );
};

export default LoginPage;
