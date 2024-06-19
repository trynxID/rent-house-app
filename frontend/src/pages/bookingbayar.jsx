import React, { useState, useEffect } from "react";
import Navbarpenyewa from "../components/navbarpenyewa";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const generateKodeBayar = () => {
  return Math.random().toString(36).substring(2, 12).toUpperCase();
};

const Bookingbayar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [kodeBayar, setKodeBayar] = useState(generateKodeBayar());

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`/api/bookings/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setBooking(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBooking();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/api/transactions/add",
        {
          booking: booking._id,
          payment_method: paymentMethod,
          kode_bayar: kodeBayar,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Pembayaran berhasil");

      // Redirect atau update UI setelah pembayaran berhasil
      navigate("/booking"); // Ganti ini ke rute yang diinginkan
    } catch (err) {
      console.error(err);
      alert("Pembayaran gagal");
    }
  };

  if (!booking) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbarpenyewa />
      <div className="container">
        {booking.property.images && booking.property.images.length > 0 && (
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
          {booking.property.details.kitchen ? "Dapur" : "Tidak ada Dapur"}
        </p>
        <p>Rating : {booking.property.rating}</p>
        <br />
        <p>
          Tanggal mulai : {new Date(booking.start_date).toLocaleDateString()}
        </p>
        <p>
          Tanggal selesai : {new Date(booking.end_date).toLocaleDateString()}
        </p>
        <p>Durasi : {booking.duration_in_months} bulan</p>
        <p>Status : {booking.status}</p>
        <p>Total price : {booking.total_price}</p>
        <br/>
        <form onSubmit={handleSubmit}>
          <p>Kode Bayar: {kodeBayar}</p>
          <label>
            Metode Pembayaran:
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="">Pilih Metode</option>
              <option value="Transfer">Transfer</option>
              <option value="ShopeePay">ShopeePay</option>
              <option value="GoPay">GoPay</option>
              <option value="DANA">DANA</option>
            </select>
          </label>
          {" "}
          <button type="submit">Bayar</button>
        </form>
      </div>
    </div>
  );
};

export default Bookingbayar;
