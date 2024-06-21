import React, { useEffect, useState } from "react";
import { Col, Card } from "react-bootstrap";
import {
  FaBuilding,
  FaClipboardList,
  FaMoneyBill,
  FaUserCheck,
} from "react-icons/fa";
import { FaHandHoldingDollar } from "react-icons/fa6";
import axios from "axios";
import NavbarAndSidebar from "../components/AdminPageComponent/NavbarAndSidebar";
import "../layouts/dashboardadmin.css";

const DashboardAdmin = () => {
  const [userData, setUserData] = useState({});

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

  const [count, setCount] = useState({
    usersCount: 0,
    propertiesCount: 0,
    bookingsCount: 0,
    transactionsCount: 0,
    totalProfit: 0,
  });

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4573/api/dashboard/total",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCount(response.data);
      } catch (error) {
        console.error("Error fetching count:", error);
      }
    };

    fetchCount();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="wrapper">
      <NavbarAndSidebar />
      <Col className="main-content">
        <div className="d-flex justify-content-center">
          <Card>
            <Card.Header
              as="h3"
              className="text-center"
              style={{ background: "#1d2636", color: "white" }}
            >
              Properti
            </Card.Header>
            <Card.Body className="d-flex align-items-center justify-content-center">
              <FaBuilding size={50} className="me-3" />
              <span style={{ fontSize: "50px" }}>{count.propertiesCount}</span>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header
              as="h3"
              className="text-center"
              style={{ background: "#1d2636", color: "white" }}
            >
              Pemesanan
            </Card.Header>
            <Card.Body className="d-flex align-items-center justify-content-center">
              <FaClipboardList size={50} className="me-3" />
              <span style={{ fontSize: "50px" }}>{count.bookingsCount}</span>
            </Card.Body>
          </Card>
          <Card>
            <Card.Header
              as="h3"
              className="text-center"
              style={{ background: "#1d2636", color: "white" }}
            >
              Transaksi
            </Card.Header>
            <Card.Body className="d-flex align-items-center justify-content-center">
              <FaMoneyBill size={50} className="me-3" />
              <span style={{ fontSize: "50px" }}>
                {count.transactionsCount}
              </span>
            </Card.Body>
          </Card>
          {userData.role === 3 && (
            <Card>
              <Card.Header
                as="h3"
                className="text-center"
                style={{ background: "#1d2636", color: "white" }}
              >
                Pengguna
              </Card.Header>
              <Card.Body className="d-flex align-items-center justify-content-center">
                <FaUserCheck size={50} className="me-3" />
                <span style={{ fontSize: "50px" }}>{count.usersCount}</span>
              </Card.Body>
            </Card>
          )}
        </div>
        <div className="card-profit">
          <Card style={{ width: "50rem" }}>
            <Card.Header
              as="h3"
              className="text-center"
              style={{ background: "#1d2636", color: "white" }}
            >
              Pendapatan
            </Card.Header>
            <Card.Body className="d-flex align-items-center justify-content-center">
              <FaHandHoldingDollar size={50} className="me-3" />
              <span style={{ fontSize: "20px" }}>
                {formatPrice(count.totalProfit)}
              </span>
            </Card.Body>
          </Card>
        </div>
      </Col>
    </div>
  );
};

export default DashboardAdmin;
