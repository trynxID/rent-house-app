import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Accordion } from "react-bootstrap";
import NavbarUserComponent from "../components/NavbarUserComponent";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import "../layouts/detailproperty.css";

const DetailPropertyPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [months, setMonths] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4573/api/properties/detail/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProperty(response.data);
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };

    fetchProperty();
  }, [id]);

  if (!property) {
    return <div>Loading...</div>;
  }

  let displayedImages = [];
  if (property.images.length < 3) {
    displayedImages = [property.images[0]];
  } else {
    displayedImages = property.images.slice(0, 3);
  }

  const handleRent = async () => {
    let user = JSON.parse(localStorage.getItem("user"));
    const userId = user.id;
    try {
      const response = await axios.post(
        `http://localhost:4573/api/bookings/add`,
        {
          propertyId: id,
          start_date: startDate,
          duration_in_months: months,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      Swal.fire({
        title: "Pemesanan Berhasil",
        icon: "success",
      })
        .then(() => {
          const totalCost = property.price * months;
          const message = `Halo, saya ${
            user.user
          } ingin memesan kost detail seperti berikut \nID Pemesan : ${userId}\nID Property : ${id}\nNama Kost : ${
            property.title
          }\nTanggal sewa : ${startDate.toLocaleDateString(
            "id-ID"
          )}\nLama Bulan : ${months} bulan\nDengan Biaya : Rp ${totalCost.toLocaleString()}`;
          const whatsappUrl = `https://api.whatsapp.com/send?phone=6285156142271&text=${encodeURIComponent(
            message
          )}`;
          window.open(whatsappUrl, "_blank");
        })
        .then(() => {
          navigate("/booking");
        });
    } catch (error) {
      Swal.fire({
        title: "Pemesanan Gagal",
        text: error,
        icon: "error",
      });
    }
  };

  return (
    <>
      <NavbarUserComponent />
      <section className="detail-property">
        <Container>
          <div className="property-content">
            <div
              className={`property-images ${
                displayedImages.length === 1
                  ? "single-image"
                  : "multiple-images"
              }`}
            >
              <img
                src={`${displayedImages[0]}`}
                alt={`${property.title} image 1`}
                className="image-1"
              />
              {displayedImages.length > 1 && (
                <div className="small-images">
                  <img
                    src={`${displayedImages[1]}`}
                    alt={`${property.title} image 2`}
                    className="image-2"
                  />
                  <img
                    src={`${displayedImages[2]}`}
                    alt={`${property.title} image 3`}
                    className="image-3"
                  />
                </div>
              )}
            </div>
            <div className="property-details">
              <div className="property-titles">
                <span className="property-title">{property.title}</span>
                <span className="property-rating">
                  <span className="fa-star">★</span> {property.rating}
                </span>
              </div>
              <div className="property-information">
                <span className="property-badge">{property.occupant}</span>
                <span className="property-location">
                  <FontAwesomeIcon icon={faLocationDot} size="lg" />
                  {property.location.village}, {property.location.district},{" "}
                  {property.location.city}, {property.location.province}
                </span>
                <span className="property-stocks">
                  Sisa {property.stocks} kamar
                </span>
              </div>
              <div className="property-price">
                Rp {property.price.toLocaleString()} / Bulan
              </div>
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Deskripsi</Accordion.Header>
                  <Accordion.Body>
                    <p>{property.description}</p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Fasilitas</Accordion.Header>
                  <Accordion.Body>
                    <ul>
                      <li>Luas: {property.details.size}</li>
                      <li>Kamar Mandi: {property.details.bathrooms}</li>
                      <li>
                        Perabotan:{" "}
                        {property.details.furnished ? "Ada" : "Tidak ada"}
                      </li>
                      <li>
                        WiFi: {property.details.wifi ? "Ada" : "Tidak ada"}
                      </li>
                      <li>AC: {property.details.ac ? "Ada" : "Tidak ada"}</li>
                      <li>
                        Dapur: {property.details.kitchen ? "Ada" : "Tidak ada"}
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
          <div className="floating-form">
            <div className="form-content">
              <h4>Sewa Kost</h4>
              <div>
                <label>Tanggal Mulai:</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  locale={id}
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <div>
                <label>Jumlah Bulan:</label>
                <input
                  type="number"
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                  min="1"
                  className="month-input"
                />
              </div>
              <button className="rent-button" onClick={handleRent}>
                Ajukan Sewa
              </button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default DetailPropertyPage;
