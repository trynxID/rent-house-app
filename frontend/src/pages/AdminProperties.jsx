import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Col, Button, Table, Pagination, Form } from "react-bootstrap";
import NavbarAndSidebar from "../components/AdminPageComponent/NavbarAndSidebar";
import Swal from "sweetalert2";
import "../layouts/adminproperties.css";

const AdminProperties = () => {
  const [userData, setUserData] = useState({});
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserData(user);
    }
  }, []);

  useEffect(() => {
    if (userData.id) {
      fetchUserData(userData.id);
    }
  }, [userData.id]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get("http://localhost:4573/api/properties", {
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

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:4573/api/users/detail/${userId}`
      );
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Apakah anda yakin menghapus data ini?",
      text: "Anda tidak akan dapat mengembalikan ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(
            `http://localhost:4573/api/properties/delete/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (res.status === 200) {
            setProperties(properties.filter((property) => property._id !== id));
            setCurrentPage(1);
            Swal.fire("Berhasil!", "Data berhasil dihapus.", "success");
          }
        } catch (err) {
          Swal.fire(
            "Error!",
            "Terjadi kesalahan saat menghapus data.",
            "error"
          );
          console.error(err);
        }
      }
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;

  const filteredProperties = properties
    .filter((property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((property) =>
      filterStatus ? property.status === filterStatus : true
    );

  const currentProperties = filteredProperties.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  return (
    <div className="wrapper">
      <NavbarAndSidebar />
      <Col className="main-content">
        <div className="property-title">
          <h1>Kelola Properti</h1>
          <div className="item d-flex align-items-center">
            <Button
              variant="info"
              onClick={() => navigate("/admin/properties/tambahproperti")}
            >
              Tambah properti
            </Button>
            <input
              type="text"
              placeholder="Cari properti"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Form.Select
              className="status ms-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="Tersedia">Tersedia</option>
              <option value="Habis">Habis</option>
            </Form.Select>
          </div>
          <Table
            striped
            bordered
            hover
            variant="dark"
            className="mt-3 text-center"
          >
            <thead>
              <tr>
                <th>Judul</th>
                <th>Harga</th>
                <th>Stocks</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentProperties.map((property) => (
                <tr key={property._id}>
                  <td>{property.title}</td>
                  <td>{formatPrice(property.price)}</td>
                  <td>{property.stocks}</td>
                  <td>{property.rating}</td>
                  <td>{property.status}</td>
                  <td>
                    <Button
                      variant="primary"
                      className="me-2 text-white"
                      onClick={() =>
                        navigate(
                          `/admin/properties/editproperti/${property._id}`
                        )
                      }
                    >
                      Edit
                    </Button>
                    {userData.role === 3 && (
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(property._id)}
                      >
                        Hapus
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="mt-3">
            {Array.from(
              {
                length: Math.ceil(
                  filteredProperties.length / propertiesPerPage
                ),
              },
              (_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              )
            )}
          </Pagination>
        </div>
      </Col>
    </div>
  );
};

export default AdminProperties;
