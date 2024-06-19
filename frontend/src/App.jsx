import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/landingpage";
import Login from "./pages/login";
import Register from "./pages/register";
import Homepenyewa from "./pages/homepenyewa";
import Myprofile from "./pages/myprofile";
import Admin from "./pages/admin";
import Tambahproperti from "./pages/tambahproperti";
import Editproperty from "./pages/editproperty";
import Propertydetail from "./pages/propertydetail";
import Booking from "./pages/booking";
import Bookingbayar from "./pages/bookingbayar";
import Transaksi from "./pages/transaksi";
import Homeadmin from "./pages/homeadmin/homeadmin";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home/>}/>          
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/home" element={<Homepenyewa/>}/>
          <Route path="/homeadmin" element={<Homeadmin/>}/>
          <Route path="/booking" element={<Booking/>}/>
          <Route path="/booking/konfirmasi/:id" element={<Bookingbayar/>}/>
          <Route path="/transaksi" element={<Transaksi/>}/>
          <Route path="/property/detail/:id" element={<Propertydetail/>}/>
          <Route path="/myprofile" element={<Myprofile/>}/>
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/admin/tambahproperti" element={<Tambahproperti/>}/>
          <Route path="/admin/edit/:id" element={<Editproperty/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;