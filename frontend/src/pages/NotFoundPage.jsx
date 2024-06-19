import { Link } from "react-router-dom";
const NotFoundPage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px", height: "77vh" }}>
      <h1>404 - Not Found</h1>
      <p>Halaman tidak tersedia.</p>
      <Link to={"/"}>Kembali ke menu</Link>
    </div>
  );
};

export default NotFoundPage;
