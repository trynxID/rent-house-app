import React, { useEffect, useState } from "react";
import axios from "axios";
import { Col, Table } from "react-bootstrap";
import NavbarAndSidebar from "../components/AdminPageComponent/NavbarAndSidebar";
import "../layouts/admintransaction.css";

const AdminBooking = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4573/api/transactions",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTransactions(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    const hours = dateString.slice(8, 10);
    const minutes = dateString.slice(10, 12);
    const seconds = dateString.slice(12, 14);

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="wrapper">
      <NavbarAndSidebar />
      <Col className="main-content">
        <div className="transaction-content">
          <h1 className="ms-2">History Transaksi</h1>
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
                <th>Nama Kost</th>
                <th>Tanggal Transaksi</th>
                <th>Pendapatan</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction.booking.user.fullname}</td>
                  <td>{transaction.booking.property.title}</td>
                  <td>{formatDate(transaction.transaction_date)}</td>
                  <td>{formatPrice(transaction.profit)}</td>
                  <td>{transaction.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Col>
    </div>
  );
};

export default AdminBooking;
