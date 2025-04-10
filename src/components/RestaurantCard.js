import React from 'react';
import { useNavigate } from "react-router-dom";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function RestaurantCard({ name, rating, imageList, price, distance, onDiscountClick }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 50,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  };
  const navigate = useNavigate();

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? 'gold' : 'gray' }}>
          {/* ★ */}
          ⭐
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="restaurant-card">
      <h3 onClick={() => navigate(`/restaurant/1`)}>{name}</h3>
      <div className="card-content">
        <button className="discount-button" onClick={onDiscountClick}>
          Discounts!
        </button>
        <div className="rating">{renderStars(rating)}</div>
        {imageList && imageList.length > 1 ? (
          <Slider {...settings} className="slides">
            {imageList.map((item, index) => (
              <div key={index} onClick={() => navigate(`/restaurant/1`)}>
                <img src={item} style={{ width: '100%' }} />
              </div>
            ))}
          </Slider>
        ) : (
          <img 
            src={imageList[0]} 
            alt={name} 
            style={{ width: '200px', height: '150px' }} 
            onClick={() => navigate(`/restaurant/1`)}
          />
        )}
        <div className="bottom">
          <p className="average">avg: {price}</p>
          {distance && <p className="distance">{distance}</p>}
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;