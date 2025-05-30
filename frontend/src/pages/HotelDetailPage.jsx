import "../styles/HotelDetailPage.css";
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchById } from '../services/hotelService';
import { fetchFeatures } from '../services/featureService';
import { FaHeart, FaRegHeart, FaShareAlt, FaWhatsapp } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addFavorite, removeFavorite, isHotelFavorite } from "../services/favoriteService";
import ShareModal from '../components/modals/ShareModal';
import Policies from "../components/Policies";
import HotelRatings from "./HotelRatings";
import StarRating from "../components/StarRating";
import RatingForm from "../components/modals/RatingForm";
import swal from 'sweetalert';


const HotelDetailPage = () => {

  const carouselRef = useRef();
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const userId = localStorage.getItem("id");
  const [showRatingForm, setShowRatingForm] = useState(false);
  const currentUrl = window.location.href;


  const [showModal, setShowModal] = useState(false);


  const navigate = useNavigate();

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -600, behavior: 'smooth' });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 600, behavior: 'smooth' });
  };

  useEffect(() => {

    const getHotelDetails = async () => {
      const hotelData = await fetchById(id);
      setHotel(hotelData);
    }

    getHotelDetails();
  }, [id]);

  //BUSCO LOS DIAS RESERVADOS PARA EL HOTEL
  const getReservedDates = (reservations) => {
    const dates = [];
    reservations.forEach(res => {
      const start = new Date(res.checkIn);
      const end = new Date(res.checkOut);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
      }
    });
    return dates;
  };

  useEffect(() => {
    if (userId && hotel) {
      isHotelFavorite(userId, hotel.id).then(setIsFavorite);
    }
  }, [userId, hotel]);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(userId, id);
    } else {
      addFavorite(userId, id);
    }
    setIsFavorite(!isFavorite);
  };


  const reservedDates = hotel ? getReservedDates(hotel.reservations) : [];

  const isReserved = (date) => {
    return reservedDates.some(
      d => d.toDateString() === date.toDateString()
    );
  };

  const dayClassName = (date) => {
    return isReserved(date) ? 'reserved-day' : 'available-day';
  };



  const handleBackToHome = () => {
    navigate('/');
  };

  const handleOpenGallery = () => setIsModalOpen(true);
  const handleCloseGallery = () => setIsModalOpen(false);

  if (!hotel) {
    return <p>Cargando detalles...</p>;
  }

  const imagesToShow = hotel.images.slice(0, 5);
  const extraCount = hotel.images.length - 5;

  const handleReserve = () => {
    if (!checkIn || !checkOut || checkIn >= checkOut) {
      swal("Fechas inválidas", "Debes ingresar fechas válidas de Llegada y Salida.", "warning");
      return;
    }

    if (localStorage.getItem("id") != null) {
      const formattedCheckIn = checkIn.toISOString().split('T')[0];
      const formattedCheckOut = checkOut.toISOString().split('T')[0];

      navigate('/reservar', {
        state: {
          hotel: hotel,
          checkIn: formattedCheckIn,
          checkOut: formattedCheckOut,
        }
      });
    } else {
      swal("Error", "Debes estar logueado para poder reservar!", "error");
      navigate('/login');
    }
  };



  return (
    <div className="hotel-detail">
      <button onClick={handleBackToHome} className="back-button">
        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
        <span>Regresar</span></button>

      <div className="title-fav">
        <h1 >{hotel.name}</h1>
        <div className="actions">
          <button
            className={`fav-icon ${isFavorite ? 'favorited' : ''}`}
            onClick={handleToggleFavorite}
          >
            {isFavorite ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="btn-share"
          >
            <FaShareAlt />
          </button>
        </div>

        {/* Modal de compartir */}
        {showModal && (
          <ShareModal
            hotel={hotel}
            onClose={() => setShowModal(false)}
          />
        )}


      </div>

      <div className="hotel-images-grid">
        {imagesToShow.map((img, index) => (
          <div
            key={img.id}
            className={`grid-item ${index === 0 ? 'large' : index === 1 ? 'medium' : 'small'}`}
            onClick={handleOpenGallery}
          >
            <img src={img.url} alt={img.title} />
            {index === 4 && extraCount > 0 && (
              <div className="image-overlay" onClick={handleOpenGallery}>
                +{extraCount}
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-gallery" onClick={handleCloseGallery}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseGallery}>✕</button>
            <button className="carousel-button left" onClick={scrollLeft}>‹</button>

            <div className="modal-images" ref={carouselRef}>
              {hotel.images.map((img) => (
                <img key={img.id} src={img.url} alt={img.title} />
              ))}
            </div>

            <button className="carousel-button right" onClick={scrollRight}>›</button>
          </div>
        </div>
      )}


      <div className="container-info">

        <div className="hotel-extra-info">
          <span className="avg-rating"><p>Valoracion media del hotel</p>  <StarRating value={hotel.rating} /></span>
          <h3 className="hotel-description">{hotel.description}</h3>
          <p className="capacity">Capacidad: Hasta {hotel.capacity} personas</p>
          <h4>Lo que ofrece este lugar</h4>
          <div className="hotel-features">
            {hotel.features.map((feature) => (
              <ul key={feature.id} className="feature-list">
                <li>
                  <img src={feature.icon} alt={feature.name} className="feature-icon" />
                  {feature.name}
                </li>
              </ul>
            ))}
          </div>
        </div>
        <div className="booking-card">
          <div className="price">${hotel.pricePerNight}<span>/ noche</span></div>

          <div className="date-section">
            <label>Llegada</label>
            <DatePicker
              selected={checkIn}
              onChange={(date) => setCheckIn(date)}
              dayClassName={dayClassName}
              placeholderText="Selecciona fecha de llegada"
              className="custom-datepicker"
              dateFormat="yyyy-MM-dd"
            />

            <label>Salida</label>
            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              dayClassName={dayClassName}
              placeholderText="Selecciona fecha de salida"
              className="custom-datepicker"
              dateFormat="yyyy-MM-dd"
            />

          </div>

          <button className="reserve-btn" onClick={handleReserve}>Reservar</button>
        </div>
      </div>
      <Policies />
      <HotelRatings hotelId={hotel.id} />

      <button
        className="rate-btn"
        onClick={() => setShowRatingForm(true)}
      >
        Dejar una valoración
      </button>

      {showRatingForm && (
        <div className="rating-form-container">
          <RatingForm
            hotelId={hotel.id}
            onClose={() => setShowRatingForm(false)}
          />
        </div>
      )}

      {hotel.contact && (
        <a
          href={`https://wa.me/${hotel.contact.replace(/\D/g, '')}?text=${encodeURIComponent(
            `Hola, estoy interesado en el hotel ${hotel.name}. Podés ver los detalles acá: ${window.location.href}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-whatsapp"
        >
          <FaWhatsapp size={28} />
        </a>
      )}


    </div>
  );
};

export default HotelDetailPage;
