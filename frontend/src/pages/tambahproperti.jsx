import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Tambahproperti = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: {
      street: '',
      village: '',
      district: '',
      city: '',
      province: '',
      country: '',
    },
    occupant: 'Pria',
    details: {
      size: '',
      bathrooms: 'Dalam',
      furnished: false,
      wifi: false,
      ac: false,
      kitchen: false,
    },
    stocks: '',
    rating: '',
    images: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const keys = name.split('.');
      if (keys.length > 1) {
        return {
          ...prevData,
          [keys[0]]: {
            ...prevData[keys[0]],
            [keys[1]]: value
          }
        };
      }
      return {
        ...prevData,
        [name]: value
      };
    });
  };  

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      images: Array.from(e.target.files)
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const [section, key] = name.split('.');
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [key]: checked
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === 'object' && !Array.isArray(formData[key])) {
        Object.keys(formData[key]).forEach((subKey) => {
          data.append(`${key}.${subKey}`, formData[key][subKey]);
        });
      } else if (key === 'images') {
        formData.images.forEach((file) => {
          data.append('images', file);
        });
      } else {
        data.append(key, formData[key]);
      }
    });
  
    try {
      await axios.post('/api/properties/add', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Properti berhasil ditambahkan');
      navigate('/admin');
    } catch (err) {
      console.error(err);
      alert('Gagal menambahkan properti');
    }
  };  

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        placeholder="Title"
      />
      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Description"
      />
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleInputChange}
        placeholder="Price"
      />
      <input
        type="text"
        name="location.street"
        value={formData.location.street}
        onChange={handleInputChange}
        placeholder="Street"
      />
      <input
        type="text"
        name="location.village"
        value={formData.location.village}
        onChange={handleInputChange}
        placeholder="Village"
      />
      <input
        type="text"
        name="location.district"
        value={formData.location.district}
        onChange={handleInputChange}
        placeholder="District"
      />
      <input
        type="text"
        name="location.city"
        value={formData.location.city}
        onChange={handleInputChange}
        placeholder="City"
      />
      <input
        type="text"
        name="location.province"
        value={formData.location.province}
        onChange={handleInputChange}
        placeholder="Province"
      />
      <input
        type="text"
        name="location.country"
        value={formData.location.country}
        onChange={handleInputChange}
        placeholder="Country"
      />
      <select
        name="occupant"
        value={formData.occupant}
        onChange={handleInputChange}
      >
        <option value="Pria">Pria</option>
        <option value="Wanita">Wanita</option>
        <option value="Campur">Campur</option>
      </select>
      <input
        type="text"
        name="details.size"
        value={formData.details.size}
        onChange={handleInputChange}
        placeholder="Size"
      />
      <select
        name="details.bathrooms"
        value={formData.details.bathrooms}
        onChange={handleInputChange}
      >
        <option value="Dalam">Dalam</option>
        <option value="Luar">Luar</option>
      </select>
      <label>
        Furnished:
        <input
          type="checkbox"
          name="details.furnished"
          checked={formData.details.furnished}
          onChange={handleCheckboxChange}
        />
      </label>
      <label>
        Wifi:
        <input
          type="checkbox"
          name="details.wifi"
          checked={formData.details.wifi}
          onChange={handleCheckboxChange}
        />
      </label>
      <label>
        AC:
        <input
          type="checkbox"
          name="details.ac"
          checked={formData.details.ac}
          onChange={handleCheckboxChange}
        />
      </label>
      <label>
        Kitchen:
        <input
          type="checkbox"
          name="details.kitchen"
          checked={formData.details.kitchen}
          onChange={handleCheckboxChange}
        />
      </label>
      <input
        type="number"
        name="stocks"
        value={formData.stocks}
        onChange={handleInputChange}
        placeholder="Stocks"
      />
      <input
        type="number"
        name="rating"
        value={formData.rating}
        onChange={handleInputChange}
        placeholder="Rating"
      />
      <input
        type="file"
        name="images"
        multiple
        onChange={handleFileChange}
      />
      <button type="submit">Tambah Properti</button>
    </form>
  );
};

export default Tambahproperti;