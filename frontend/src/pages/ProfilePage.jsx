import React, { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import NavbarUserComponent from "../components/NavbarUserComponent";
import "../layouts/profile.css";

const ProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);

  useEffect(() => {
    const valUser = JSON.parse(localStorage.getItem("userData"));
    setUserData(valUser);
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    try {
      const res = await axios.post(
        `http://localhost:4573/api/users/upload/${userData._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const newImgUrl = res.data;
      setUserData((prevState) => ({
        ...prevState,
        img_url: newImgUrl,
      }));
      localStorage.setItem(
        "userData",
        JSON.stringify({ ...userData, img_url: newImgUrl })
      );
      alert("Foto profil berhasil diunggah");
      setIsEditingImage(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Gagal mengunggah foto profil");
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put(
        `http://localhost:4573/api/users/update/${userData._id}`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      localStorage.setItem("userData", JSON.stringify(userData));
      setIsEditingProfile(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <NavbarUserComponent />
      <section className="profile-page">
        <Container>
          <div className="profile-data">
            <div className="profile-image-section">
              <div className="profile-image">
                {userData.img_url ? (
                  <img
                    src={`http://localhost:4573${userData.img_url}`}
                    alt="Profile"
                    width="300"
                  />
                ) : (
                  "Belum ada foto"
                )}
              </div>
              {isEditingImage ? (
                <>
                  <div className="profile-actions">
                    <input type="file" onChange={handleFileChange} />
                    <Button onClick={handleUpload} variant="success">
                      Upload Foto Profil
                    </Button>
                    <Button
                      onClick={() => setIsEditingImage(false)}
                      variant="danger"
                    >
                      Batal
                    </Button>
                  </div>
                </>
              ) : (
                <div className="profil-img-edit">
                  <Button
                    onClick={() => setIsEditingImage(true)}
                    variant="outline-primary"
                  >
                    Edit Foto Profil
                  </Button>
                </div>
              )}
            </div>
            <div className="profile-details">
              <Form>
                <Form.Group controlId="formFullname">
                  <Form.Label>Nama</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullname"
                    value={userData.fullname}
                    onChange={handleProfileChange}
                    disabled={!isEditingProfile}
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleProfileChange}
                    disabled={!isEditingProfile}
                  />
                </Form.Group>
                <Form.Group controlId="formPhone">
                  <Form.Label>No. HP</Form.Label>
                  <Form.Control
                    type="text"
                    name="no_phone"
                    value={userData.no_phone}
                    onChange={handleProfileChange}
                    disabled={!isEditingProfile}
                  />
                </Form.Group>
                {isEditingProfile ? (
                  <>
                    <Button
                      className="data-success"
                      onClick={handleSaveProfile}
                      variant="success"
                      c
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setIsEditingProfile(false)}
                      className="data-batal"
                      variant="danger"
                    >
                      Batal
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditingProfile(true)}
                    variant="outline-primary"
                  >
                    Edit Data Diri
                  </Button>
                )}
              </Form>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default ProfilePage;
