import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Nav, NavLink } from "react-bootstrap";

const Homeadmin = () => {
    return (
        <div className="container-fluid">
      <Row>
        <Col md={2} className="sidebar">
          <Nav className="flex-column">
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            <Nav.Link href="/properties">Properties</Nav.Link>
            <Nav.Link href="/booking">Booking</Nav.Link>
            <Nav.Link href="/pembayaran">Pembayaran</Nav.Link>
            <Nav.Link href="#">Selamat Datang, Admin!</Nav.Link>
          </Nav>
        </Col>
        <Col md={10} className="main-content">
          {/* Isi konten halaman di sini */}
        </Col>
      </Row>
    </div>
    );
};

export default Homeadmin;