import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchHotels } from '../services/hotelService'; 
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa'; 
import "../styles/Recomendations.css"

const Recommendations = () => {
  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels()
      .then(data => {
        const shuffled = data.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10); // 10 hoteles únicos aleatorios
        setHotels(selected);
      })
      .catch((error) => console.error('Error consultando los hoteles', error));
  }, []);

  const handleViewDetails = (hotelId) => {
    navigate(`/hotel/${hotelId}`);
  };

  return (
    <div className="recommendations">
      <h2>Hoteles destacados</h2>
      <div className="recommendation-grid">
        {hotels.length > 0 ? (
          hotels.map((hotel) => (
            <div key={hotel.id} className="recommendation-card">
              <img
                src={hotel.images?.[0]?.url || 'https://placehold.co/300x200?text=Sin+imagen'}
                alt={hotel.name}
                className="hotel-image"
              />
              <div className="hotel-name-rating">
                <h3>{hotel.name}</h3>
                <div className="hotel-rating">
                  <FaStar style={{ color: 'rgb(234, 179, 8)', marginRight: '5px' }} /> {hotel.rating}
                </div>
              </div>
              <div className="hotel-location">
                <FaMapMarkerAlt className="icon-location" />
                {hotel.city}, {hotel.country}
              </div>
              <p className="description">{hotel.description}</p>
              <p className="price">${hotel.pricePerNight}<span className='precio-noche'>/noche</span></p>
              <button onClick={() => handleViewDetails(hotel.id)}>Ver detalles</button>
            </div>
          ))
        ) : (
          <p>No hay recomendaciones disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
