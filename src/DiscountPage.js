// src/DiscountPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./DiscountPage.css";

const DiscountPage = () => {
  const { rId } = useParams();
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState(null);

  // Load the script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `/restaurant_data/Giorgio's Italiano/menuData.js`;
    script.async = true;
    script.onload = () => {
      console.log("menuData.js loaded:", window.RestaurantData);
      setMenuData(window.RestaurantData);
    };
    script.onerror = () => {
      console.error("Failed to load menuData.js");
    };
    document.body.appendChild(script);

    // Cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!menuData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content">
      <div className="app-wrapper">
        <div className="detail-back-button-container">
          <button onClick={() => navigate(-1)} className="detail-back-button">
            <FaArrowLeft />
          </button>
        </div>
        <div className="app-container">
          <div className="discount-container">
            <h2 className="discount-title">Student Discount</h2>
            <img
              src={`/restaurant_data/Giorgio's Italiano/${menuData.student_discount}`}
              alt="Student Discount"
              className="discount-image"
              onError={(e) => console.log("Discount image failed:", e)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountPage;