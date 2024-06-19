import React, { useEffect, useState } from "react";
import axios from "axios";
import NavbarAndSidebar from "../components/AdminPageComponent/NavbarAndSidebar";
import { Col, Table, Button, Pagination, Form } from "react-bootstrap";
import "../dist/adminusers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="wrapper">
      <NavbarAndSidebar />
      <Col className="main-content">
        <div className="users-content">
          <h1>Kelola pengguna</h1>
          <Button variant="info">Tambah pengguna</Button>
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
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td>{user.no_phone}</td>
                  <td>{user.last_login_time}</td>
                  <td>
                    {user.role === 1 && "Penyewa"}
                    {user.role === 2 && "Admin"}
                    {user.role === 3 && "Super Admin"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Col>
    </div>
  );
};

export default AdminUsers;
