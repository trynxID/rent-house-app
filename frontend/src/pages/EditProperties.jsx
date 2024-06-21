import React, { useState, useEffect } from "react";
import { Col, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import NavbarAndSidebar from "../components/AdminPageComponent/NavbarAndSidebar";
import "../layouts/addproperties.css";

const EditProperties = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [originalProperty, setOriginalProperty] = useState(null);
  const [property, setProperty] = useState({
    title: "",
    description: "",
    price: 0,
    location: {
      street: "",
      village: "",
      district: "",
      city: "",
      province: "",
      country: "",
    },
    occupant: "",
    details: {
      size: "",
      bathrooms: "",
      furnished: false,
      wifi: false,
      ac: false,
      kitchen: false,
    },
    stocks: 0,
    rating: 0,
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4573/api/properties/edit/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProperty(res.data);
        setOriginalProperty(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProperty();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("details.") || name.startsWith("location.")) {
      const [parent, child] = name.split(".");
      setProperty((prevState) => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setProperty({
        ...property,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const isPropertyChanged = (original, updated) => {
    return JSON.stringify(original) !== JSON.stringify(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPropertyChanged(originalProperty, property)) {
      Swal.fire({
        icon: "info",
        title: "Tidak ada perubahan",
        text: "Data tidak ada yang berubah",
      });
      return;
    }

    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan mengubah data properti ini",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ubah",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.put(
            `http://localhost:4573/api/properties/update/${id}`,
            property,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (res.status === 200) {
            Swal.fire(
              "Berhasil!",
              "Data properti berhasil diperbarui.",
              "success"
            );
            navigate("/admin/properties");
          }
        } catch (err) {
          console.error(err);
          Swal.fire(
            "Gagal!",
            "Terjadi kesalahan saat memperbarui data.",
            "error"
          );
        }
      }
    });
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Apakah Anda yakin untuk membatalkan perubahan ini?",
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
        <h1 className="ms-2">Edit Properti</h1>
        <h3 className="ms-2 text-center">Semua data wajib diisi!</h3>
        <div className="property-form">
          <Form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Judul</label>
              <input
                type="text"
                name="title"
                value={property.title}
                onChange={handleChange}
              />
            </div>
            <div className="item">
              <label htmlFor="description">Deskripsi</label>
              <textarea
                type="text"
                name="description"
                value={property.description}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="item">
              <label htmlFor="price">Harga</label>
              <input
                type="number"
                name="price"
                value={property.price}
                onChange={handleChange}
              />
            </div>
            <div className="item-row">
              <label htmlFor="street">Alamat</label>
              <input
                type="text"
                name="location.street"
                value={property.location.street}
                onChange={handleChange}
              />
              <label htmlFor="village">Desa</label>
              <input
                type="text"
                name="location.village"
                value={property.location.village}
                onChange={handleChange}
              />
              <label htmlFor="district">Kecamatan</label>
              <input
                type="text"
                name="location.district"
                value={property.location.district}
                onChange={handleChange}
              />
              <label htmlFor="city">Kota</label>
              <input
                type="text"
                name="location.city"
                value={property.location.city}
                onChange={handleChange}
              />
              <label htmlFor="province">Provinsi</label>
              <input
                type="text"
                name="location.province"
                value={property.location.province}
                onChange={handleChange}
              />
              <label htmlFor="country">Negara</label>
              <input
                type="text"
                name="location.country"
                value={property.location.country}
                onChange={handleChange}
              />
            </div>
            <div className="item">
              <label htmlFor="occupant">Tipe hunian</label>
              <select
                name="occupant"
                value={property.occupant}
                onChange={handleChange}
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
                value={property.details.size}
                onChange={handleChange}
              />
            </div>
            <div className="item">
              <label htmlFor="bathrooms">Kamar mandi</label>
              <select
                name="details.bathrooms"
                value={property.details.bathrooms}
                onChange={handleChange}
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
                checked={property.details.furnished}
                onChange={handleChange}
              />
              <label htmlFor="wifi">Wifi</label>
              <input
                type="checkbox"
                name="details.wifi"
                checked={property.details.wifi}
                onChange={handleChange}
              />
              <label htmlFor="ac">AC</label>
              <input
                type="checkbox"
                name="details.ac"
                checked={property.details.ac}
                onChange={handleChange}
              />
              <label htmlFor="kitchen">Dapur</label>
              <input
                type="checkbox"
                name="details.kitchen"
                checked={property.details.kitchen}
                onChange={handleChange}
              />
            </div>
            <div className="item">
              <label htmlFor="stocks">Stocks</label>
              <input
                type="number"
                name="stocks"
                value={property.stocks}
                onChange={handleChange}
              />
            </div>
            <div className="item">
              <label htmlFor="rating">Rating</label>
              <input
                type="number"
                name="rating"
                value={property.rating}
                onChange={handleChange}
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

export default EditProperties;
