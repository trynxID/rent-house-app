import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import { Container } from "react-bootstrap";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Recommendation = () => {
  const [list, setList] = useState([]);
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4573/api/properties")
      .then((response) => {
        setList(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the properties!", error);
      });

    axios
      .get("http://localhost:4573/api/properties/cities")
      .then((response) => {
        const cities = response.data;
        if (cities.length > 0) {
          const randomCity = cities[Math.floor(Math.random() * cities.length)];
          setCity(randomCity);
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the cities!", error);
      });

    const handleResize = () => {
      const slidesToShow = getSlidesToShow();
      setSettings((prevSettings) => ({
        ...prevSettings,
        slidesToShow,
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const filteredList = list.filter((val) => {
    return val.location.city.toLowerCase() === city.toLowerCase();
  });

  const formatDetails = (details) => {
    const detailsArray = [];

    if (details.bathrooms === "Dalam") {
      detailsArray.push("KM Dalam");
    } else if (details.bathrooms === "Luar") {
      detailsArray.push("KM Luar");
    }

    if (details.wifi) detailsArray.push("WiFi");
    if (details.ac) detailsArray.push("AC");
    if (details.furnished) detailsArray.push("Isian");
    if (details.kitchen) detailsArray.push("Dapur");

    return detailsArray.join(" • ");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCardClick = () => {
    navigate("/login");
  };

  const PrevArrow = (props) => {
    const { className, onClick } = props;
    return (
      <button className={`slider-button ${className}`} onClick={onClick}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/271/271220.png"
          alt="Previous"
        />
      </button>
    );
  };

  const NextArrow = (props) => {
    const { className, onClick } = props;
    return (
      <button className={`slider-button ${className} `} onClick={onClick}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/271/271228.png"
          alt="Next"
        />
      </button>
    );
  };

  const getSlidesToShow = () => {
    const width = window.innerWidth;
    if (width <= 480) return 1;
    if (width <= 768) return 2;
    if (width <= 850) return 3;
    return 4;
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: getSlidesToShow(),
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <>
      <section className="recommendation" id="recommendation">
        <Container>
          <h2 className="mb-3 text-center">
            Rekomendasi Kost Disekitar {city}
          </h2>
          <Slider {...settings}>
            {filteredList.map((val, index) => {
              const {
                title,
                location,
                price,
                images,
                occupant,
                rating,
                details,
                stocks,
              } = val;
              const facilities = formatDetails(details);
              const price_id = formatPrice(price);
              return (
                <div key={index} className="card" onClick={handleCardClick}>
                  <div className="card-img">
                    <img
                      src={`http://localhost:4573${images[0]}`}
                      alt={title}
                    />
                    <div className="rating">★ {rating}</div>
                  </div>
                  <div className="card-body">
                    <div className="card-category">
                      <span className="badge">{occupant}</span>
                      <span className="card-stocks">Sisa {stocks} kamar</span>
                    </div>
                    <h5 className="card-title">{title}</h5>
                    <p className="card-location">{location.district}</p>
                    <p className="card-details">{facilities}</p>
                    <p className="card-price">{price_id}/bulan</p>
                  </div>
                </div>
              );
            })}
          </Slider>
        </Container>
      </section>
    </>
  );
};

export default Recommendation;
