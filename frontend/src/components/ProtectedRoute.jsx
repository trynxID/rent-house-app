import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ProtectedRoute = ({
  element: Component,
  allowedRoles,
  notAllowedRoles,
  ...rest
}) => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");
  const roleData = JSON.parse(localStorage.getItem("user"));
  const role = roleData?.role;

  if (!isAuthenticated && !notAllowedRoles) {
    Swal.fire({
      title: "Anda diharuskan login untuk melanjutkan!",
      text: "Apakah anda akan melakukan login?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Login",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      } else {
        navigate("/");
      }
    });
    return null;
  }

  if (notAllowedRoles && notAllowedRoles.includes(role)) {
    Swal.fire({
      title: "Akses Dicekal",
      text: `Anda tidak diizinkan mengakses halaman ini`,
      icon: "error",
      confirmButtonText: "Kembali",
    }).then(() => {
      if (role === 1) {
        navigate("/property");
      } else {
        navigate("/admin/dashboard");
      }
    });
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    Swal.fire({
      title: "Akses Dicekal",
      text: `Anda tidak diizinkan mengakses halaman ini`,
      icon: "error",
      confirmButtonText: "Kembali",
    }).then(() => {
      if (role === 1) {
        navigate("/property");
      } else {
        navigate("/admin/dashboard");
      }
    });
    return null;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
