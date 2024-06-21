import React, { useState } from "react";
import { Col, Form, Button } from "react-bootstrap";
import NavbarAndSidebar from "../components/AdminPageComponent/NavbarAndSidebar";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../layouts/addusers.css";

const AddUser = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    no_phone: "",
    role: "1",
    images: null,
  });

  const navigate = useNavigate();

  const handleCancel = () => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Apakah anda yakin untuk membatalkan user ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/admin/users");
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((prevData) => ({
        ...prevData,
        images: file,
      }));
    } else {
      Swal.fire({
        icon: "error",
        title: "File wajib gambar",
        text: "Silahkan upload tipe file gambar",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post(
        "http://localhost:4573/api/users/add",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        Swal.fire(
          "Berhasil!",
          "Pengguna berhasil ditambahkan.",
          "success"
        ).then(() => {
          navigate("/admin/users");
        });
      }
    } catch (error) {
      Swal.fire(
        "Error!",
        "Terjadi kesalahan saat menambahkan pengguna.",
        "error"
      );
      console.error(error);
    }
  };

  return (
    <div className="wrapper">
      <NavbarAndSidebar />
      <Col className="main-content">
        <div className="users-content">
          <h1>Tambah user</h1>
          <h3 className="ms-2 text-center">Semua data wajib diisi!</h3>
          <div className="user-form">
            <Form onSubmit={handleSubmit}>
              <div className="item">
                <label htmlFor="fullname">Nama lengkap</label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                />
              </div>
              <div className="item">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="item">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="item">
                <label htmlFor="no_phone">No telepon</label>
                <input
                  type="number"
                  name="no_phone"
                  value={formData.no_phone}
                  onChange={handleChange}
                />
              </div>
              <div className="item">
                <label htmlFor="role">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="1">Penyewa</option>
                  <option value="2">Admin</option>
                  <option value="3">Super Admin</option>
                </select>
              </div>
              <div className="item">
                <input
                  type="file"
                  name="images"
                  single="true"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <Button
                className="mt-3 me-3"
                variant="danger"
                onClick={handleCancel}
              >
                Batal
              </Button>
              <Button className="mt-3" type="submit">
                Kirim
              </Button>
            </Form>
          </div>
        </div>
      </Col>
    </div>
  );
};

export default AddUser;
