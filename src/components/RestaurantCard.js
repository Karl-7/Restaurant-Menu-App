import React from 'react';
import { useNavigate } from "react-router-dom";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function RestaurantCard({ name, rating, imageList, price, distance }) {


  const settings = {
    dots: true,          // 显示指示点
    infinite: true,       // 无限循环
    speed: 500,          // 切换速度
    slidesToShow: 1,     // 显示数量
    slidesToScroll: 1,   // 滑动数量
    autoplay: true,      // 自动播放
    autoplaySpeed: 3000  // 自动播放间隔
  };
  const navigate = useNavigate();

  // 生成星级评分的显示（简单实现）
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? 'gold' : 'gray' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="restaurant-card">
      <h3  onClick={() => navigate(`/restaurant/1`)}>{name}</h3>
      <div className='card-cotent'>
        <div className="rating">{renderStars(rating)}</div>
        
        {
          imageList && imageList.length > 1 ?
          <Slider {...settings} className='slides'>
            {imageList.map((item, index) => (
              <div key={index}  onClick={() => navigate(`/restaurant/1`)}>
                <img src={item}  style={{ width: '100%' }} />
              </div>
            ))}
          </Slider>
        :
        <img src={imageList[0]} alt={name} style={{ width: '200px', height: '150px' }}  onClick={() => navigate(`/restaurant/1`)}/>
        }
        <div className='bottom'>
          <p className='average'>avg: {price}</p>
          {distance && <p className='distance'>{distance}</p>}
        </div>
      </div>
    </div>
      
  );
}

export default RestaurantCard;