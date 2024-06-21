import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const NavbarUserComponent = () => {
  const [userData, setUserData] = useState({});

  const [profileImage, setProfileImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let valUser = 0;
    if (localStorage.getItem("user")) {
      valUser = JSON.parse(localStorage.getItem("user"));
    }
    const userId = valUser.id;
    if (userId) {
      fetchUserData(userId);
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:4573/api/users/detail/${userId}`
      );
      const user = response.data;
      localStorage.setItem("userData", JSON.stringify(user));
      setUserData(user);
      setProfileImage(user.img_url);
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
    <Navbar expand="lg" sticky="top" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src="/logo-brands.png" alt="logo" width="80%" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto px-auto">
            <Nav.Link as={Link} to="/property">
              Beranda
            </Nav.Link>
            {userData._id ? (
              <>
                <Nav.Link as={Link} to="/booking">
                  Transaksi
                </Nav.Link>
                <NavDropdown
                  title={
                    <>
                      <img
                        src={`http://localhost:4573${profileImage}`}
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
                  <NavDropdown.Item as={Link} to="/myprofile">
                    Profil
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Keluar
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="ms-4 border-login">
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarUserComponent;
