import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  const handleSearchClick = () => {
    navigate("/property");
  };
  return (
    <section className="banner">
      <Container>
        <h1>Cari Hunian Impian Anda</h1>
        <p>Temukan hunian untuk bersinggah di sekitar anda</p>
        <div className="get-started" onClick={handleSearchClick}>
          Cari Sekarang!
        </div>
      </Container>
    </section>
  );
};
export default Banner;
