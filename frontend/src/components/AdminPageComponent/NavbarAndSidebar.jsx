import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Container, Row, Col, Nav, Navbar, NavDropdown } from "react-bootstrap";
import {
  FaHome,
  FaBuilding,
  FaClipboardList,
  FaMoneyBill,
  FaUser,
} from "react-icons/fa";
import axios from "axios";
import "./NavbarAndSidebar.css";

const NavbarAndSidebar = () => {
  const location = useLocation();
  const [userData, setUserData] = useState({});
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

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:4573/api/users/detail/${userId}`
      );
      setUserData(response.data);
      localStorage.setItem("userData", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.put(`http://localhost:4573/api/users/logout/${userData._id}`);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userData");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar bg="var(--third-color)" expand="lg" sticky="top">
        <Container fluid>
          <Navbar.Brand>
            <img
              src="/logo-brands.png"
              alt="Brand Logo"
              className="navbar-logo"
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav>
              <NavDropdown
                title={
                  <>
                    <img
                      src={`http://localhost:4573${userData.img_url}`}
                      alt="Profile"
                      width="30"
                      height="30"
                      className="rounded-circle"
                    />{" "}
                    {userData.fullname}
                  </>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item as={Link} to="/admin/myprofile">
                  Profil
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={handleLogout}
                  className="text-danger"
                >
                  Keluar
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container fluid>
        <Row>
          <Col md={2} className="sidebar position-fixed">
            <div className="sidebar-sticky">
              <Nav
                variant="pills"
                defaultActiveKey="/admin/dashboard"
                className="flex-column"
              >
                <Nav.Link
                  id="sidebarmenu"
                  href="/admin/dashboard"
                  className="d-flex align-items-center"
                  active={location.pathname === "/admin/dashboard"}
                >
                  <FaHome className="me-2" />
                  Dasbor
                </Nav.Link>
                <Nav.Link
                  id="sidebarmenu"
                  href="/admin/properties"
                  className="d-flex align-items-center"
                  active={location.pathname.startsWith("/admin/properties")}
                >
                  <FaBuilding className="me-2" />
                  Properti
                </Nav.Link>
                <Nav.Link
                  id="sidebarmenu"
                  href="/admin/bookings"
                  className="d-flex align-items-center"
                  active={location.pathname.startsWith("/admin/bookings")}
                >
                  <FaClipboardList className="me-2" />
                  Pemesanan
                </Nav.Link>
                <Nav.Link
                  id="sidebarmenu"
                  href="/admin/transactions"
                  className="d-flex align-items-center"
                  active={location.pathname.startsWith("/admin/transactions")}
                >
                  <FaMoneyBill className="me-2" />
                  Transaksi
                </Nav.Link>
                {userData.role === 3 && (
                  <Nav.Link
                    id="sidebarmenu"
                    href="/admin/users"
                    className="d-flex align-items-center"
                    active={location.pathname.startsWith("/admin/users")}
                  >
                    <FaUser className="me-2" />
                    Pengguna
                  </Nav.Link>
                )}
              </Nav>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default NavbarAndSidebar;
