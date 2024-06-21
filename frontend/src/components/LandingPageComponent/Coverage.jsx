import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import LazyLoad from "react-lazyload";

const Coverage = () => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4573/api/properties")
      .then((response) => {
        const data = response.data;

        const cityCounts = data.reduce((acc, property) => {
          const city = property.location.city;
          if (!acc[city]) {
            acc[city] = 0;
          }
          acc[city]++;
          return acc;
        }, {});

        const sortedCities = Object.keys(cityCounts).sort(
          (a, b) => cityCounts[b] - cityCounts[a]
        );

        const topCities = sortedCities.slice(0, 6).map((city) => ({
          name: city,
          cover: `${city}.jpg`.toLowerCase(),
        }));

        setCities(topCities);
      })
      .catch((error) => {
        console.error("There was an error fetching the cities!", error);
      });
  }, []);

  return (
    <>
      <section className="coverage">
        <h2 className="text-center">Area Kos Terpopuler</h2>
        <Container>
          <Row>
            {cities.map((item, index) => (
              <Col md={4} key={index} className="mb-4">
                <div className="box">
                  <LazyLoad height={200} offset={100}>
                    <img
                      src={item.cover}
                      alt={item.name}
                      className="img-fluid"
                    />
                  </LazyLoad>
                  <div className="overlay">
                    <h5>{item.name}</h5>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Coverage;
