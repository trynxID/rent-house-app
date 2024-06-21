import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NavbarGeneral = () => {
  const [userData, setUserData] = useState({});
  const [profileImage, setProfileImage] = useState("");
  useEffect(() => {
    const valUser = JSON.parse(localStorage.getItem("userData"));
    let userDataLocal;

    if (valUser) {
      userDataLocal = valUser;
      setUserData(userDataLocal);
      setProfileImage(userDataLocal.img_url);
    } else {
      userDataLocal = null;
      setUserData({});
      setProfileImage("");
    }
  }, []);
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
    <Navbar expand="lg" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand href="/">
          <img src="/logo-brands.png" alt="logo" width="80%" />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          style={{ borderColor: "#fff" }}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto px-auto ">
            <Nav.Link href="/">Beranda</Nav.Link>
            <Nav.Link href="/property">Cari Kost</Nav.Link>
            {userData._id ? (
              <>
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
                  <NavDropdown.Item onClick={handleLogout}>
                    Keluar
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link href="/login" className="border-login">
                  Masuk
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarGeneral;
