import React, { useState } from "react";
import { Col, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import NavbarAndSidebar from "../components/AdminPageComponent/NavbarAndSidebar";
import "../layouts/addproperties.css";

const AddProperties = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: {
      street: "",
      village: "",
      district: "",
      city: "",
      province: "",
      country: "",
    },
    occupant: "Pria",
    details: {
      size: "",
      bathrooms: "Dalam",
      furnished: false,
      wifi: false,
      ac: false,
      kitchen: false,
    },
    stocks: "",
    rating: "",
    images: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const keys = name.split(".");
      if (keys.length > 1) {
        return {
          ...prevData,
          [keys[0]]: {
            ...prevData[keys[0]],
            [keys[1]]: value,
          },
        };
      }
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length !== files.length) {
      Swal.fire({
        icon: "error",
        title: "File wajib gambar",
        text: "Silahkan upload tipe file gambar",
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        images: validFiles,
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const [section, key] = name.split(".");
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [key]: checked,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Apakah anda yakin untuk menambahkan properti ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Tambahkan",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
          if (
            typeof formData[key] === "object" &&
            !Array.isArray(formData[key])
          ) {
            Object.keys(formData[key]).forEach((subKey) => {
              data.append(`${key}.${subKey}`, formData[key][subKey]);
            });
          } else if (key === "images") {
            formData.images.forEach((file) => {
              data.append("images", file);
            });
          } else {
            data.append(key, formData[key]);
          }
        });

        try {
          await axios.post("http://localhost:4573/api/properties/add", data, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          Swal.fire("Berhasil!", "Property berhasil ditambahkan", "success");
          navigate("/admin/properties");
        } catch (err) {
          console.error(err);
          Swal.fire("Gagal!", "Property gagal ditambahkan", "error");
        }
      }
    });
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Apakah anda yakin?",
      text: "Apakah anda yakin untuk membatalkan properti ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/admin/properties");
      }
    });
  };

  return (
    <div className="wrapper">
      <NavbarAndSidebar />
      <Col className="main-content">
        <h1 className="ms-2">Tambahkan properti</h1>
        <h3 className="ms-2 text-center">Semua data wajib diisi!</h3>
        <div className="property-form">
          <Form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Judul</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="item">
              <label htmlFor="description">Deskripsi</label>
              <textarea
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="item">
              <label htmlFor="price">Harga</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
            <div className="item-row">
              <label htmlFor="street">Alamat</label>
              <input
                type="text"
                name="location.street"
                value={formData.location.street}
                onChange={handleInputChange}
              />
              <label htmlFor="village">Desa</label>
              <input
                type="text"
                name="location.village"
                value={formData.location.village}
                onChange={handleInputChange}
              />
              <label htmlFor="district">Kecamatan</label>
              <input
                type="text"
                name="location.district"
                value={formData.location.district}
                onChange={handleInputChange}
              />
              <label htmlFor="city">Kota</label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleInputChange}
              />
              <label htmlFor="province">Provinsi</label>
              <input
                type="text"
                name="location.province"
                value={formData.location.province}
                onChange={handleInputChange}
              />
              <label htmlFor="country">Negara</label>
              <input
                type="text"
                name="location.country"
                value={formData.location.country}
                onChange={handleInputChange}
              />
            </div>
            <div className="item">
              <label htmlFor="occupant">Tipe hunian</label>
              <select
                name="occupant"
                value={formData.occupant}
                onChange={handleInputChange}
              >
                <option value="Pria">Pria</option>
                <option value="Wanita">Wanita</option>
                <option value="Campur">Campur</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="size">Ukuran kamar</label>
              <input
                type="text"
                name="details.size"
                value={formData.details.size}
                onChange={handleInputChange}
              />
            </div>
            <div className="item">
              <label htmlFor="bathrooms">Kamar mandi</label>
              <select
                name="details.bathrooms"
                value={formData.details.bathrooms}
                onChange={handleInputChange}
              >
                <option value="Dalam">Dalam</option>
                <option value="Luar">Luar</option>
              </select>
            </div>
            <label htmlFor="details">Fasilitas : </label>
            <div className="item-check">
              <label htmlFor="furnished">Isian</label>
              <input
                type="checkbox"
                name="details.furnished"
                checked={formData.details.furnished}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="wifi">Wifi</label>
              <input
                type="checkbox"
                name="details.wifi"
                checked={formData.details.wifi}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="ac">AC</label>
              <input
                type="checkbox"
                name="details.ac"
                checked={formData.details.ac}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="kitchen">Dapur</label>
              <input
                type="checkbox"
                name="details.kitchen"
                checked={formData.details.kitchen}
                onChange={handleCheckboxChange}
              />
            </div>
            <div className="item">
              <label htmlFor="stocks">Stocks</label>
              <input
                type="number"
                name="stocks"
                value={formData.stocks}
                onChange={handleInputChange}
              />
            </div>
            <div className="item">
              <label htmlFor="rating">Rating</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
              />
            </div>
            <div className="item">
              <input
                type="file"
                name="images"
                multiple
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
      </Col>
    </div>
  );
};

export default AddProperties;
