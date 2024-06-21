import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Col, Button, Table, Pagination, Form } from "react-bootstrap";
import NavbarAndSidebar from "../components/AdminPageComponent/NavbarAndSidebar";
import Swal from "sweetalert2";
import "../layouts/adminbooking.css";

const AdminBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:4573/api/bookings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBookings(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filterBookings = () => {
    const filtered = bookings.filter((booking) => {
      const searchMatch =
        booking.user.fullname
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.property.title.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch =
        statusFilter === "all" || booking.status === statusFilter;

      return searchMatch && statusMatch;
    });

    setFilteredBookings(filtered);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCancelBooking = async (bookingId) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan membatalkan booking ini",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, batalkan!",
      cancelButtonText: "Tidak",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(
            `http://localhost:4573/api/bookings/cancel/${bookingId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          fetchBookings();
          Swal.fire("Berhasil!", "Booking berhasil dibatalkan.", "success");
        } catch (err) {
          console.error(err);
          Swal.fire(
            "Gagal!",
            "Terjadi kesalahan saat membatalkan booking.",
            "error"
          );
        }
      }
    });
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      const response = await axios.post(
        `http://localhost:4573/api/transactions/accept/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        fetchBookings();
        Swal.fire("Berhasil!", "Booking berhasil diterima.", "success");
      } else {
        Swal.fire(
          "Gagal!",
          "Terjadi kesalahan saat menerima booking.",
          "error"
        );
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menerima booking.", "error");
    }
  };

  const currentBookings = filteredBookings.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(filteredBookings.length / 10);

  return (
    <div className="wrapper">
      <NavbarAndSidebar />
      <Col className="main-content">
        <div className="booking-content">
          <h1 className="ms-2">Kelola Pemesanan</h1>
          <Form className="d-flex my-3">
            <Form.Control
              type="search"
              placeholder="Cari nama atau judul properti"
              className="me-2"
              aria-label="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Form.Select
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter status"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="success">Sukses</option>
              <option value="failed">Gagal</option>
            </Form.Select>
          </Form>
          <Table
            striped
            bordered
            hover
            variant="dark"
            className="mt-3 text-center"
          >
            <thead>
              <tr>
                <th>Nama Pemesan</th>
                <th>Nama Kost</th>
                <th>Durasi Kost</th>
                <th>Total Harga</th>
                <th>Status Pemesanan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.user.fullname}</td>
                  <td>{booking.property.title}</td>
                  <td>{booking.duration_in_months}</td>
                  <td>{formatPrice(booking.total_price)}</td>
                  <td>{booking.status}</td>
                  <td>
                    {booking.status === "pending" && (
                      <>
                        <Button
                          variant="danger"
                          className="me-2 text-white"
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          Batal
                        </Button>
                        <Button
                          variant="success"
                          onClick={() => handleAcceptBooking(booking._id)}
                        >
                          Terima
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="mt-3">
            <Pagination.First onClick={() => handlePageChange(1)} />
            <Pagination.Prev
              onClick={() =>
                handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
              }
            />
            {[...Array(totalPages).keys()].map((number) => (
              <Pagination.Item
                key={number + 1}
                active={number + 1 === currentPage}
                onClick={() => handlePageChange(number + 1)}
              >
                {number + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() =>
                handlePageChange(
                  currentPage < totalPages ? currentPage + 1 : totalPages
                )
              }
            />
            <Pagination.Last onClick={() => handlePageChange(totalPages)} />
          </Pagination>
        </div>
      </Col>
    </div>
  );
};

export default AdminBooking;
