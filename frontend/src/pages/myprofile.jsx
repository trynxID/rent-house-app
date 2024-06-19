import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Navbarpenyewa from "../components/navbarpenyewa";

const Myprofile = () => {
  const [userData, setUserData] = useState({
    id: "",
    fullname: "",
    email: "",
    no_phone: "",
    role: "",
    img_url: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    fullname: "",
    email: "",
    no_phone: "",
  });  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserData({
        id: decoded.id,
        fullname: decoded.user,
        email: decoded.email,
        no_phone: decoded.no_phone,
        role: decoded.role,
        img_url: decoded.img_url,
      });
      setProfileImage(decoded.img_url);
    }
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    try {
      const res = await axios.post(
        `/api/users/upload/${userData.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const newImgUrl = res.data.img_url + `?t=${new Date().getTime()}`;
      setProfileImage(newImgUrl);
      alert("Foto profil berhasil diunggah");
      window.location.reload();
      setUserData((prevState) => ({
        ...prevState,
        img_url: newImgUrl,
      }));
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah foto profil");
    }
  };

  const handleShowUpdateForm = () => {
    setUpdatedData({
      fullname: userData.fullname,
      email: userData.email,
      no_phone: userData.no_phone,
    });
    setShowUpdateForm(!showUpdateForm);
  };

  const handleInputChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (
      userData.fullname === updatedData.fullname &&
      userData.email === updatedData.email &&
      userData.no_phone === updatedData.no_phone
    ) {
      alert("Tidak ada perubahan data untuk diperbarui");
      return;
    }

    try {
      const res = await axios.put(
        `/api/users/update/${userData.id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { token } = res.data;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setUserData({
        id: decoded.id,
        fullname: decoded.user,
        email: decoded.email,
        no_phone: decoded.no_phone,
        role: decoded.role,
        img_url: decoded.img_url,
      });
      setProfileImage(decoded.img_url);
      alert("Data berhasil diupdate");
      setShowUpdateForm(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.errors) {
        alert("Gagal mengupdate data : " + err.response.data.errors[0].msg);
      } else {
        alert("Gagal mengupdate data");
      }
      setShowUpdateForm(false);
    }
  };

  return (
    <div>
      <Navbarpenyewa />
      <div className="container-profile">
        <div className="data-profile">
          <p>
            {profileImage ? (
              <img src={profileImage} alt="Profil" width="100" />
            ) : (
              "Belum ada foto"
            )}
          </p>
          <p>Update foto profile</p>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload Foto Profil</button>
          <p>Fullname : {userData.fullname}</p>
          <p>Email : {userData.email}</p>
          <p>No Phone : {userData.no_phone}</p>
          <p>Role : {userData.role === 1 ? "Penyewa" : "Pemilik"}</p>
          <button onClick={handleShowUpdateForm}>
            {showUpdateForm ? "Tutup Formulir Pembaruan" : "Perbarui Data"}
          </button>
          {showUpdateForm && (
            <div className="update-form">
              <h3>Update Data</h3>
              <form onSubmit={handleUpdate}>
                <div className="input-update">
                  <label>
                    Fullname <span>:</span>{" "}
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    value={updatedData.fullname}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-update">
                  <label>
                    Email <span>:</span>{" "}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={updatedData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-update">
                  <label>
                    No Phone <span>:</span>
                  </label>
                  <input
                    type="text"
                    name="no_phone"
                    value={updatedData.no_phone}
                    onChange={handleInputChange}
                  />
                </div>
                <button type="submit">Update</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Myprofile;
