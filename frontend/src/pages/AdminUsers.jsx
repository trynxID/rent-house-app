import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavbarAndSidebar from "../components/AdminPageComponent/NavbarAndSidebar";
import { Col, Table, Button, Pagination, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import "../layouts/adminusers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:4573/api/users");
      setUsers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const indexOfLastUsers = currentPage * usersPerPage;
  const indexOfFirstUsers = indexOfLastUsers - usersPerPage;

  const filteredUsers = users
    .filter(
      (user) =>
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => (filterRole ? user.role === Number(filterRole) : true));

  const currentUsers = filteredUsers.slice(indexOfFirstUsers, indexOfLastUsers);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Apakah anda yakin menghapus user ini?",
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
            `http://localhost:4573/api/users/delete/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (res.status === 200) {
            setUsers(users.filter((user) => user._id !== id));
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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "UTC",
    };

    return date.toLocaleDateString("id-ID", options);
  };

  return (
    <div className="wrapper">
      <NavbarAndSidebar />
      <Col className="main-content">
        <div className="users-content">
          <h1>Kelola pengguna</h1>
          <div className="users-search">
            <Button
              className="tambah me-2"
              variant="info"
              onClick={() => navigate("/admin/users/tambahuser")}
            >
              Tambah pengguna
            </Button>
            <Form.Control
              type="search"
              placeholder="Cari nama atau email"
              className="search me-2"
              aria-label="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Form.Select
              className="role"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="1">Penyewa</option>
              <option value="2">Admin</option>
              <option value="3">Super Admin</option>
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
                <th>Nama Pengguna</th>
                <th>Email</th>
                <th>No Telepon</th>
                <th>Riwayat aktif</th>
                <th>Level</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td>{user.no_phone}</td>
                  <td>{formatDate(user.last_login_time)}</td>
                  <td>
                    {user.role === 1 && "Penyewa"}
                    {user.role === 2 && "Admin"}
                    {user.role === 3 && "Super Admin"}
                  </td>
                  <td>
                    <Button
                      className="aksi"
                      variant="danger"
                      onClick={() => handleDelete(user._id)}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="mt-3">
            {Array.from(
              {
                length: Math.ceil(filteredUsers.length / usersPerPage),
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

export default AdminUsers;
