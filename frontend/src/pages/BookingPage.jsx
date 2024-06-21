import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import NavbarUserComponent from "../components/NavbarUserComponent";
import { Container, Accordion } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import "../layouts/bookingpage.css";

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4573/api/bookings/user",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setBookings(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak akan bisa mengembalikan booking ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, batalkan!",
      cancelButtonText: "Tidak, simpan",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(
          `http://localhost:4573/api/bookings/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.status === 200) {
          setBookings(bookings.filter((booking) => booking._id !== id));
          Swal.fire("Dihapus!", "Booking berhasil dihapus.", "success");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Gagal!", "Booking gagal dihapus.", "error");
      }
    }
  };

  const handleBayar = (booking) => {
    const totalCost = booking.property.price * booking.duration_in_months;
    const message = `Halo, saya ${
      booking.user.fullname
    } ingin memesan kost detail seperti berikut:
ID Pemesan: ${booking.user._id}
ID Property: ${booking.property._id}
Nama Kost: ${booking.property.title}
Tanggal Sewa: ${new Date(booking.start_date).toLocaleDateString("id-ID")}
Lama Bulan: ${booking.duration_in_months} bulan
Dengan Biaya: Rp ${totalCost.toLocaleString("id-ID")}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=6285156142271&text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <NavbarUserComponent />
      <section className="booking-page">
        <Container>
          <h1>Riwayat Pemesanan</h1>
          {bookings.length === 0 ? (
            <div className="property-blank">
              <p>Tidak ada booking ditemukan</p>
            </div>
          ) : (
            <div className="property-list">
              {bookings.map((booking) => (
                <div key={booking._id} className="property-item">
                  <div className="booking-header">
                    <span className="booking-transaction">
                      <FontAwesomeIcon icon={faHouse} /> Sewa
                    </span>
                    <span className="booking-date">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </span>
                    <span
                      className={`booking-badge ${booking.status.toLowerCase()}`}
                    >
                      {booking.status}
                    </span>
                    <span className="booking-id">{booking._id}</span>
                  </div>
                  <hr />
                  <div className="property-item-content">
                    <div className="booking-image">
                      <img
                        src={booking.property.images[0]}
                        alt={booking.property.title}
                      />
                    </div>
                    <div className="information-property">
                      <h4>{booking.property.title}</h4>
                      <Accordion defaultActiveKey="2">
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>Deskripsi</Accordion.Header>
                          <Accordion.Body>
                            <p>
                              <strong>Deskripsi : </strong>{" "}
                              {booking.property.description}
                            </p>
                            <p>
                              <strong>Lokasi : </strong>{" "}
                              {`${booking.property.location.street}, ${booking.property.location.village}, ${booking.property.location.district}, ${booking.property.location.city}, ${booking.property.location.province}, ${booking.property.location.country}`}
                            </p>
                            <p>
                              <strong>Tipe Penghuni : </strong>{" "}
                              {booking.property.occupant}
                            </p>
                            <p>
                              <strong>Penilaian :</strong>
                              {" ★ "}
                              {booking.property.rating}
                            </p>
                          </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                          <Accordion.Header>Fasilitas</Accordion.Header>
                          <Accordion.Body>
                            <ul>
                              <li>
                                <strong>Luas :</strong>{" "}
                                {booking.property.details.size}
                              </li>
                              <li>
                                <strong>Kamar Mandi :</strong>{" "}
                                {booking.property.details.bathrooms}
                              </li>
                              <li>
                                <strong>Perabotan :</strong>{" "}
                                {booking.property.details.furnished
                                  ? "Ada"
                                  : "Tidak ada"}
                              </li>
                              <li>
                                <strong>WiFi :</strong>{" "}
                                {booking.property.details.wifi
                                  ? "Ada"
                                  : "Tidak ada"}
                              </li>
                              <li>
                                <strong>AC :</strong>{" "}
                                {booking.property.details.ac
                                  ? "Ada"
                                  : "Tidak ada"}
                              </li>
                              <li>
                                <strong>Dapur :</strong>{" "}
                                {booking.property.details.kitchen
                                  ? "Ada"
                                  : "Tidak ada"}
                              </li>
                            </ul>
                          </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                          <Accordion.Header>Detail Booking</Accordion.Header>
                          <Accordion.Body>
                            <p>
                              <strong>Tanggal mulai :</strong>{" "}
                              {new Date(
                                booking.start_date
                              ).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Tanggal selesai :</strong>{" "}
                              {new Date(booking.end_date).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Durasi :</strong>{" "}
                              {booking.duration_in_months} bulan
                            </p>
                            <hr />
                            <p>
                              <strong>Total Pembayaran :</strong> {" Rp "}
                              {booking.total_price.toLocaleString()}
                            </p>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                      {booking.status === "pending" && (
                        <>
                          <button
                            className="button-bayar"
                            onClick={() => handleBayar(booking)}
                          >
                            Pembayaran
                          </button>
                          <button
                            className="button-batal"
                            onClick={() => handleDelete(booking._id)}
                          >
                            Batalkan
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
};

export default BookingPage;
