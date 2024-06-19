import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [property, setProperty] = useState({
        title: '',
        description: '',
        price: 0,
        location: {
            street: '',
            village: '',
            district: '',
            city: '',
            province: '',
            country: ''
        },
        occupant: '',
        details: {
            size: '',
            bathrooms: '',
            furnished: false,
            wifi: false,
            ac: false,
            kitchen: false
        },
        stocks: 0,
        rating: 0
    });

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await axios.get(`/api/properties/edit/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setProperty(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchProperty();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
    
        // Jika properti yang diubah adalah properti yang berupa objek
        if (name.startsWith("details.") || name.startsWith("location.")) {
            const [parent, child] = name.split('.');
            setProperty(prevState => ({
                ...prevState,
                [parent]: {
                    ...prevState[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            // Jika properti yang diubah bukan properti yang berupa objek
            setProperty({ ...property, [name]: type === 'checkbox' ? checked : value });
        }
    };    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`/api/properties/update/${id}`, property, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.status === 200) {
                // Data berhasil diupdate, tampilkan pesan atau navigasi ke halaman lain
                alert('Data properti berhasil diperbarui');
                navigate('/admin');
            }
        } catch (err) {
            console.error(err);
            // Tampilkan pesan kesalahan jika diperlukan
        }
    };

    return (
        <div>
            <h2>Edit Property</h2>
            <form onSubmit={handleSubmit}>
                <label>Title:</label>
                <input type="text" name="title" value={property.title} onChange={handleChange} />
                <label>Description:</label>
                <input type="text" name="description" value={property.description} onChange={handleChange} />
                <label>Price:</label>
                <input type="number" name="price" value={property.price} onChange={handleChange} />
                <label>Street:</label>
                <input type="text" name="location.street" value={property.location.street} onChange={handleChange} />
                <label>village:</label>
                <input type="text" name="location.village" value={property.location.village} onChange={handleChange} />
                <label>District:</label>
                <input type="text" name="location.district" value={property.location.district} onChange={handleChange} />
                <label>City:</label>
                <input type="text" name="location.city" value={property.location.city} onChange={handleChange} />
                <label>Province:</label>
                <input type="text" name="location.province" value={property.location.province} onChange={handleChange} />
                <label>Country:</label>
                <input type="text" name="location.country" value={property.location.country} onChange={handleChange} />
                <label>Occupant:</label>
                <select name="occupant" value={property.occupant} onChange={handleChange}>
                    <option value="Pria">Pria</option>
                    <option value="Wanita">Wanita</option>
                    <option value="Campur">Campur</option>
                </select>
                <label>Size:</label>
                <input type="text" name="details.size" value={property.details.size} onChange={handleChange} />
                <label>Bathrooms:</label>
                <select name="details.bathrooms" value={property.details.bathrooms} onChange={handleChange}>
                    <option value="Dalam">Dalam</option>
                    <option value="Luar">Luar</option>
                </select>
                <label>
                    Furnished:
                    <input type="checkbox" name="details.furnished" checked={property.details.furnished} onChange={handleChange} />
                </label>
                <label>
                    Wifi:
                    <input type="checkbox" name="details.wifi" checked={property.details.wifi} onChange={handleChange} />
                </label>
                <label>
                    AC:
                    <input type="checkbox" name="details.ac" checked={property.details.ac} onChange={handleChange} />
                </label>
                <label>
                    Kitchen:
                    <input type="checkbox" name="details.kitchen" checked={property.details.kitchen} onChange={handleChange} />
                </label>
                <label>Stocks:</label>
                <input type="number" name="stocks" value={property.stocks} onChange={handleChange} />
                <label>Rating:</label>
                <input type="number" name="rating" value={property.rating} onChange={handleChange} />
                <button type="submit">Simpan Perubahan</button>
            </form>
        </div>
    );
};

export default EditProperty;
