import { BrowserRouter, Routes, Route } from "react-router-dom";

// Component
import ProtectedRoute from "./components/ProtectedRoute";
import FooterComponent from "./components/FooterComponent";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
// User
import PropertyPage from "./pages/PropertyPage";
import DetailPropertyPage from "./pages/DetailPropertyPage";
import BookingPage from "./pages/BookingPage";
import ProfilePage from "./pages/ProfilePage";
// Admin
import DashboardAdmin from "./pages/DashboardAdmin";
import AdminProperties from "./pages/AdminProperties";
import AddProperties from "./pages/AddProperties";
import EditProperties from "./pages/EditProperties";
import AdminBooking from "./pages/AdminBooking";
import AdminTransaction from "./pages/AdminTransaction";
import AdminUsers from "./pages/AdminUsers";
import AddUser from "./pages/AddUser";
import AdminProfile from "./pages/AdminProfile";
import "../src/layouts/App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute element={LandingPage} notAllowedRoles={[1, 2, 3]} />
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute element={LoginPage} notAllowedRoles={[1, 2, 3]} />
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute
              element={RegisterPage}
              notAllowedRoles={[1, 2, 3]}
            />
          }
        />
        <Route
          path="/property"
          element={
            <ProtectedRoute element={PropertyPage} notAllowedRoles={[2, 3]} />
          }
        />
        <Route
          path="/property/detail/:id"
          element={
            <ProtectedRoute element={DetailPropertyPage} allowedRoles={[1]} />
          }
        />
        <Route
          path="/booking"
          element={<ProtectedRoute element={BookingPage} allowedRoles={[1]} />}
        />
        <Route
          path="/myprofile"
          element={
            <ProtectedRoute element={ProfilePage} allowedRoles={[1, 2, 3]} />
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute element={DashboardAdmin} allowedRoles={[2, 3]} />
          }
        />
        <Route
          path="/admin/properties"
          element={
            <ProtectedRoute element={AdminProperties} allowedRoles={[2, 3]} />
          }
        />
        <Route
          path="/admin/properties/tambahproperti"
          element={
            <ProtectedRoute element={AddProperties} allowedRoles={[2, 3]} />
          }
        />
        <Route
          path="/admin/properties/editproperti/:id"
          element={
            <ProtectedRoute element={EditProperties} allowedRoles={[2, 3]} />
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute element={AdminBooking} allowedRoles={[2, 3]} />
          }
        />
        <Route
          path="/admin/transactions"
          element={
            <ProtectedRoute element={AdminTransaction} allowedRoles={[2, 3]} />
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute element={AdminUsers} allowedRoles={[2, 3]} />
          }
        />
        <Route
          path="/admin/users/tambahuser"
          element={<ProtectedRoute element={AddUser} allowedRoles={[2, 3]} />}
        />
        <Route
          path="/admin/myprofile"
          element={
            <ProtectedRoute element={AdminProfile} allowedRoles={[2, 3]} />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {<FooterComponent />}
    </BrowserRouter>
  );
}

export default App;
