// PropertyDetail.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams
import { jwtDecode } from "jwt-decode"; // Import jwtDecode
import Navbarpenyewa from "../components/navbarpenyewa";

const PropertyDetail = () => {
  // Remove `match` from props
  const { id } = useParams(); // Use useParams hook
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [bookingData, setBookingData] = useState({
    start_date: "",
    duration_in_months: 1,
    total_price: 0,
    user: "", // Add user field
  });

  useEffect(() => {
    const getProperty = async () => {
      try {
        const response = await axios.get(
          `/api/properties/detail/${id}`, // Use id from useParams
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProperty(response.data);

        // Decode JWT token to get user data
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          setBookingData({
            ...bookingData,
            user: decoded.id, // Set user ID from decoded token
            total_price: response.data.price * bookingData.duration_in_months,
          });
        }
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };

    getProperty();
  }, [id]); // Include id in dependency array

  useEffect(() => {
    // Calculate total price whenever duration_in_months or property price changes
    const calculateTotalPrice = () => {
      if (property && bookingData.duration_in_months) {
        const totalPrice = property.price * bookingData.duration_in_months;
        setBookingData((prevData) => ({
          ...prevData,
          total_price: totalPrice,
        }));
      }
    };

    calculateTotalPrice();
  }, [property, bookingData.duration_in_months]);

  const handleBookingFormChange = (e) => {
    const { name, value } = e.target;
    let totalPrice = bookingData.total_price; // Preserve the current total_price
    if (name === "start_date") {
      // Calculate total price only if start_date changes
      totalPrice = property.price * bookingData.duration_in_months;
    }
    setBookingData({ ...bookingData, [name]: value, total_price: totalPrice });
  };

  const handleBookingFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `/api/bookings/add/${id}`, // Use id from useParams
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Booking success:", response.data);
      alert("Booking berhasil");
      // Redirect to /home using navigate
      navigate("/home");
      // Handle success message or redirection
    } catch (error) {
      console.error("Error making booking:", error);
      alert("Booking gagal");
    }
  };

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbarpenyewa />
      <div className="container">
        {property.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={property.title}
            style={{ width: "50px", height: "50px" }}
          />
        ))}
        <h3>{property.title}</h3>
        <p>
          Lokasi:{" "}
          {`${property.location.street}, ${property.location.village}, ${property.location.district}, ${property.location.city}, ${property.location.province}, ${property.location.country}`}
        </p>
        <p>Harga: {property.price}</p>
        <p>Occupant: {property.occupant}</p>
        <p>Rating: {property.rating}</p>
        <p>Stock: {property.stocks}</p>
        <p>Size: {property.details.size}</p>
        <p>
          Kamar mandi: {property.details.bathrooms} <br />
        </p>
        <p>Fasilitas :</p>
        <p>
          {property.details.furnished ? "Isian" : "Kosongan"},{" "}
          {property.details.wifi ? "WiFi" : "Tidak ada WiFi"},{" "}
          {property.details.ac ? "AC" : "Tidak ada AC"},{" "}
          {property.details.kitchen ? "Dapur" : "Tidak ada Dapur"}
        </p>

        {/* Booking Form */}
        <form onSubmit={handleBookingFormSubmit}>
          <label>
            Tanggal Mulai:
            <input
              type="date"
              name="start_date"
              value={bookingData.start_date}
              onChange={handleBookingFormChange}
              required
            />
          </label>
          <label>
            Durasi (bulan):
            <select
              name="duration_in_months"
              value={bookingData.duration_in_months}
              onChange={handleBookingFormChange}
              required
            >
              <option value="1">1 bulan</option>
              <option value="3">3 bulan</option>
              <option value="6">6 bulan</option>
              <option value="12">12 bulan</option>
            </select>
          </label>
          <p>Total Harga: {bookingData.total_price}</p>
          <button type="submit">Book Now</button>
        </form>
      </div>
    </div>
  );
};

export default PropertyDetail;
