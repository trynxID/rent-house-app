import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbarpenyewa from "../components/navbarpenyewa";
import { Link } from "react-router-dom";

const Homepenyewa = () => {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    priceOrder: "",
    occupant: "",
    ratingOrder: "",
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get("/api/properties", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const availableProperties = response.data.filter(
        (property) => property.status === "Tersedia"
      );
      setProperties(availableProperties);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleClearFilters = () => {
    setFilter({
      priceOrder: "",
      occupant: "",
      ratingOrder: "",
    });
    setSearchTerm("");
  };

  const filteredProperties = properties
    .filter((property) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        property.title.toLowerCase().includes(lowerSearchTerm) ||
        property.location.street.toLowerCase().includes(lowerSearchTerm) ||
        property.location.village.toLowerCase().includes(lowerSearchTerm) ||
        property.location.district.toLowerCase().includes(lowerSearchTerm) ||
        property.location.city.toLowerCase().includes(lowerSearchTerm) ||
        property.location.province.toLowerCase().includes(lowerSearchTerm) ||
        (property.location.country.toLowerCase().includes(lowerSearchTerm) &&
          property.status === "Tersedia")
      );
    })
    .sort((a, b) => {
      if (filter.priceOrder === "low") {
        return a.price - b.price;
      } else if (filter.priceOrder === "high") {
        return b.price - a.price;
      } else if (filter.ratingOrder === "high") {
        return b.rating - a.rating;
      } else if (filter.ratingOrder === "low") {
        return a.rating - b.rating;
      }
      return 0;
    })
    .filter((property) => {
      if (filter.occupant) {
        return property.occupant === filter.occupant;
      }
      return true;
    });

  console.log("Filtered properties:", filteredProperties); // Log filtered properties

  return (
    <div>
      <Navbarpenyewa />
      <div className="container">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Cari berdasarkan nama kos atau lokasi"
            value={searchTerm}
            onChange={handleSearch}
          />
          <select
            name="priceOrder"
            value={filter.priceOrder}
            onChange={handleFilterChange}
          >
            <option value="">Pilih harga</option>
            <option value="low">Harga terendah</option>
            <option value="high">Harga tertinggi</option>
          </select>
          <select
            name="occupant"
            value={filter.occupant}
            onChange={handleFilterChange}
          >
            <option value="">Pilih occupant</option>
            <option value="Pria">Pria</option>
            <option value="Wanita">Wanita</option>
            <option value="Campur">Campur</option>
          </select>
          <select
            name="ratingOrder"
            value={filter.ratingOrder}
            onChange={handleFilterChange}
          >
            <option value="">Pilih rating</option>
            <option value="high">Rating tertinggi</option>
            <option value="low">Rating terendah</option>
          </select>
          <button onClick={handleClearFilters}>Clear</button>
        </div>
        <div className="property-list">
          {filteredProperties.map((property) => (
            <div key={property._id} className="property-item">
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
              <Link to={`/property/detail/${property._id}`}>
                <button>Book now</button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homepenyewa;
