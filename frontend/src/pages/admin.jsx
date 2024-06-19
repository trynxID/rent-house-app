import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Admin = () => {
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

  const [properties, setProperties] = useState([]);

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

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get("/api/properties", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProperties(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        const res = await axios.delete(`/api/properties/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.status === 200) {
          setProperties(properties.filter((property) => property._id !== id));
          alert("Data berhasil dihapus");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.put(`/api/users/logout/${userData.id}`);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <nav className="navbar-penyewa">
        <h3>Selamat datang {userData.fullname}</h3>
        <div className="item-navbar">
          <Link to="/homepenyewa">
            <p>Home</p>
          </Link>
          <Link to="/properties">
            <p>Properties</p>
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
      <div className="container">
        <Link to="/admin/tambahproperti">
          <button>Tambah properti</button>
        </Link>
        <div>
          <h2>Menampilkan data dalam bentuk tabel</h2>
          <table>
            <thead>
              <tr>
                <th>Judul</th>
                <th>Deskripsi</th>
                <th>Harga</th>
                <th>Lokasi</th>
                <th>Gambar</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property._id}>
                  <td>{property.title}</td>
                  <td>{property.description}</td>
                  <td>{property.price}</td>
                  <td>
                    {property.location.street}, {property.location.city}
                  </td>
                  <td>
                    {property.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={property.title}
                        style={{ width: "50px", height: "50px" }}
                      />
                    ))}
                  </td>
                  <td>
                    <Link to={`/admin/edit/${property._id}`}>
                      <button>Edit</button>
                    </Link>
                    <button onClick={() => handleDelete(property._id)}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
