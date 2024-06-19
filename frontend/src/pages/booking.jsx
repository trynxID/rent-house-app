import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbarpenyewa from "../components/navbarpenyewa";
import { Link } from "react-router-dom";

const Booking = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("/api/bookings/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Asumsi token disimpan di localStorage
          },
        });
        setBookings(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin membatalkan booking ini?")) {
      try {
        const res = await axios.delete(`/api/bookings/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.status === 200) {
          setBookings(bookings.filter((booking) => booking._id !== id));
          alert("Bookings berhasil dihapus");
        }
      } catch (err) {
        console.error(err);
        alert("Bookings gagal dihapus");
      }
    }
  };

  return (
    <div>
      <Navbarpenyewa />
      <div className="container">
        <h1>Booking Saya</h1>
        {bookings.length === 0 ? (
          <p>Tidak ada booking ditemukan</p>
        ) : (
          <div className="property-list">
            {bookings.map((booking) => (
              <div key={booking._id} className="property-item">
                {booking.property.images &&
                  booking.property.images.length > 0 && (
                    <img
                      src={booking.property.images[0]}
                      alt={booking.property.title}
                      style={{ width: "50px", height: "50px" }}
                    />
                  )}
                <h3>Properti : {booking.property.title}</h3>
                <p>Deskripsi : {booking.property.description}</p>
                <p>Harga : {booking.property.price}</p>
                <p>
                  Lokasi:{" "}
                  {`${booking.property.location.street}, ${booking.property.location.village}, ${booking.property.location.district}, ${booking.property.location.city}, ${booking.property.location.province}, ${booking.property.location.country}`}
                </p>
                <p>Occupant : {booking.property.occupant}</p>
                <p>Size : {booking.property.details.size}</p>
                <p>Kamar mandi : {booking.property.details.bathrooms}</p>
                <p>Fasilitas :</p>
                <p>
                  {booking.property.details.furnished ? "Isian" : "Kosongan"},{" "}
                  {booking.property.details.wifi ? "WiFi" : "Tidak ada WiFi"},{" "}
                  {booking.property.details.ac ? "AC" : "Tidak ada AC"},{" "}
                  {booking.property.details.kitchen
                    ? "Dapur"
                    : "Tidak ada Dapur"}
                </p>
                <p>Rating : {booking.property.rating}</p>
                <p>Stocks : {booking.property.stocks}</p>
                <br />
                <p>
                  Tanggal mulai :{" "}
                  {new Date(booking.start_date).toLocaleDateString()}
                </p>
                <p>
                  Tanggal selesai :{" "}
                  {new Date(booking.end_date).toLocaleDateString()}
                </p>
                <p>Durasi : {booking.duration_in_months} bulan</p>
                <p>Total price : {booking.total_price}</p>
                <p>Status : {booking.status}</p>
                {booking.status === "pending" && (
                  <>
                    <button onClick={() => handleDelete(booking._id)}>
                      Batalkan
                    </button>{" "}
                    <Link to={`/booking/konfirmasi/${booking._id}`}>
                      <button>Bayar</button>
                    </Link>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
