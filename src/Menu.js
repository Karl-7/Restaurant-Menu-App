// src/Menu.js
import React, { useState, useEffect } from "react";
import { FaPlus, FaShoppingCart, FaArrowDown, FaMinus, FaInfoCircle,FaMapMarkerAlt } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaRegStar, FaArrowLeft } from "react-icons/fa";
import "./Menu.css";
const languageCodes = { en: "en", swe: "sv", es: "es" };

// Local cache for translations
const translationCache = {
  en: {},
  swe: {},
  es: {},
};

// Simulated translateText function (assuming your API is working)
const translateText = async (text, targetLang) => {
  if (translationCache[targetLang][text]) {
    return translationCache[targetLang][text]; // Return cached translation
  }

  if (targetLang === "en") {
    translationCache.en[text] = text;
    return text;
  }

  try {
    const response = await fetch("http://localhost:5000/translate", {
      method: "POST",
      body: JSON.stringify({
        q: text,
        source: "en",
        target: languageCodes[targetLang],
        format: "text",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data.error) {
      console.error("LibreTranslate error:", data.error);
      return text; // Fallback to English on error
    }
    const translatedText = data.translatedText;
    translationCache[targetLang][text] = translatedText; // Cache the result
    return translatedText;
  } catch (error) {
    console.error("LibreTranslate error:", error);
    return text; // Fallback to English on error
  }
};

const Menu = () => {
  const { rId } = useParams();
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartItems, setCartItems] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [menuData, setMenuData] = useState(null);
  const [translatedDishes, setTranslatedDishes] = useState([]);
  const navigate = useNavigate();

  // Load the script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/restaurant_data/Giorgio's Italiano/menuData.js";
    script.async = true;
    script.onload = () => {
      console.log("menuData.js loaded:", window.RestaurantData); // Debug log
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

  // Translate dishes when menuData or language changes
  useEffect(() => {
    if (!menuData) return;
    const translateDishes = async () => {
      const translated = await Promise.all(
        menuData.dish_list.map(async (dish) => ({
          ...dish,
          name: await translateText(dish.name, language),
        }))
      );
      setTranslatedDishes(translated);
    };
    translateDishes();
  }, [menuData, language]);

  if (!menuData) {
    return <div>Loading...</div>;
  }

  const filteredDishes = translatedDishes.filter((dish) => {
    // Check if a dietary filter is active
    const isDietaryFilterActive = ["Vegetarian", "Vegan", "Halal", "Gluten-Free"].includes(activeCategory);

    // Handle category filtering
    const isCategoryMatch =
      isDietaryFilterActive || activeCategory === "All" || dish.category === activeCategory;

    // Handle dietary filtering
    const isDietaryMatch =
      !isDietaryFilterActive || (dish.dietary && dish.dietary.includes(activeCategory));

    return isCategoryMatch && isDietaryMatch;
  });

  const addToCart = (dish) => {
    setCartItems((prevItems) => [...prevItems, { name: dish.name, price: dish.price }]);
    setIsCartVisible(true);
  };

  const removeFromCart = (indexToRemove) => {
    setCartItems((prevItems) => prevItems.filter((_, index) => index !== indexToRemove));
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        const priceNum = parseFloat(item.price.replace("kr", ""));
        return total + priceNum;
      }, 0)
      .toFixed(2) + "kr";
  };

  const toggleCart = () => {
    setIsCartVisible((prev) => !prev);
  };

  const toggleLangMenu = () => {
    setIsLangMenuOpen((prev) => !prev);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <>
      <div className="content">
        <div className="app-wrapper">
          <div className="detail-back-button-container">
            <button onClick={() => navigate(-1)} className="detail-back-button">
              <FaArrowLeft />
            </button>
          </div>
          <div className="app-container">
            <div className="restaurant-header">
              <div className="restaurant-image-container">
                <img
                  src={`/restaurant_data/Giorgio's Italiano/${menuData.restaurant_pic}`}
                  alt={menuData.restaurant_name}
                  className="restaurant-image"
                  onError={(e) => console.log("Restaurant image failed:", e)}
                />
                <div
                  className="discount-banner"
                  onClick={() => navigate(`/restaurant/${rId}/discount`)}
                >
                  <span className="arrow left-arrow">➜</span>
                  <span className="discount-text">Check ur Student Discounts!</span>
                  <span className="arrow right-arrow">➜</span>
                </div>
              </div>
              <h2 className="restaurant-title">{menuData.restaurant_name}</h2>
              <div className="header-buttons">
                <button
                  className="info-button"
                  onClick={() => navigate(`/restaurant-info/${rId}`)}
                >
                  <FaInfoCircle /> Info
                </button>
                <button 
                  className="maps-button"
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(menuData.restaurant_name)}`, '_blank')}
                >
                  <FaMapMarkerAlt /> Map
                </button>
              </div>
              <div className="language-switcher">
                <button onClick={toggleLangMenu} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  {language === "swe" ? "SWE" : language === "es" ? "SPA" : "ENG"}
                </button>
                {isLangMenuOpen && (
                  <div className="language-dropdown">
                    <button
                      onClick={() => changeLanguage("en")}
                      style={{ display: "flex", alignItems: "center", gap: "2px", width: "100%" }}
                    >
                      ENG
                    </button>
                    <button
                      onClick={() => changeLanguage("swe")}
                      style={{ display: "flex", alignItems: "center", gap: "2px", width: "100%" }}
                    >
                      SWE
                    </button>
                    <button
                      onClick={() => changeLanguage("es")}
                      style={{ display: "flex", alignItems: "center", gap: "2px", width: "100%" }}
                    >
                      SPA
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Dietary filter */}
            <div className="dietary-filter">
              {["All", "Vegetarian", "Vegan", "Halal", "Gluten-Free"].map((diet) => (
                <button
                  key={diet}
                  className={`dietary-button ${activeCategory === diet ? "active" : ""}`}
                  onClick={() => setActiveCategory(diet)}
                >
                  {diet}
                </button>
              ))}
            </div>
            <div className="category-filter">
              {menuData.categories
                .filter((cat) => !["Vegetarian", "Vegan", "Halal", "Gluten-Free"].includes(cat))
                .map((cat) => (
                  <button
                    key={cat}
                    className={`category-button ${activeCategory === cat ? "active" : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
            </div>
            <div className="dish-list">
              {filteredDishes.length > 0 ? (
                filteredDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="dish-card"
                    onClick={() => navigate(`/dish/${dish.id}`)} // Navigate to DishDetails
                  >
                    <h3 className="dish-title">{dish.name}</h3>
                    <div className="dish-container">
                      <img
                        src={`/restaurant_data/Giorgio's Italiano/${dish.image}`}
                        alt={dish.name}
                        className="dish-image"
                        onError={(e) => console.log(`${dish.image} failed to load:`, e)}
                      />
                      <div className="stars">{"⭐".repeat(dish.rating)}</div>
                      <div className="price">{dish.price}</div>
                      <div className="plus-icon" onClick={(e) => { e.stopPropagation(); addToCart(dish); }}>
                        <FaPlus />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-dishes-message">No dishes available in this category.</p>
              )}
            </div>
          </div>
          <div className={`customer-cart ${isCartVisible ? "visible" : ""}`}>
            <div className="cart-header">
              <h3 className="cart-title">Customer's Cart</h3>
              <button className="hide-cart-button" onClick={() => setIsCartVisible(false)}>
                <FaArrowDown />
              </button>
            </div>
            {cartItems.length > 0 && isCartVisible ? (
              <>
                {cartItems.map((item, index) => (
                  <div key={index} className="cart-item">
                    {item.name} - {item.price}
                    <button className="remove-item-button" onClick={() => removeFromCart(index)}>
                      <FaMinus />
                    </button>
                  </div>
                ))}
                <div className="cart-footer">
                  <div className="cart-total">Total: {calculateTotal()}</div>
                  <button className="checkout-button" onClick={handleCheckout}>
                    Checkout
                  </button>
                </div>
              </>
            ) : null}
          </div>
          <button className="cart-toggle-button" onClick={toggleCart}>
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </>
  );
};

export default Menu;