import React, { useState, useEffect } from "react";
import { FaPlus, FaShoppingCart, FaArrowDown } from "react-icons/fa";
import "./index.css";

const menuData = {
  dish_list: [
    { id: "pasta1", name: "Giorgio's No.1 Pasta", price: "57kr", rating: 5, image: "pasta 1.jpg", category: "Pasta" },
    { id: "burger1", name: "Giorgio's burger (bought from MAX)", price: "77kr", rating: 4, image: "burger 1.jpg", category: "Others" },
    { id: "lasagna1", name: "Giorgio's Lasagna (takes 20 hrs)", price: "37kr", rating: 3, image: "lasagna 1.jpg", category: "Others" },
  ],
  categories: ["All", "Pasta", "Drink", "Others"],
};

const languageCodes = { en: "en", swe: "sv", es: "es" };

// Local cache for translations
const translationCache = {
  en: {},
  swe: {},
  es: {},
};

const translateText = async (text, targetLang) => {
  if (translationCache[targetLang][text]) {
    return translationCache[targetLang][text]; // Return cached translation
  }

  if (targetLang === "en") {
    translationCache.en[text] = text;
    return text;
  }

  try {
    const response = await fetch("https://libretranslate.com/translate", {
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
    const translatedText = data.translatedText;
    translationCache[targetLang][text] = translatedText; // Cache the result
    return translatedText;
  } catch (error) {
    console.error("LibreTranslate error:", error);
    return text; // Fallback to English on error
  }
};

const App = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartItems, setCartItems] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [language, setLanguage] = useState("swe");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [translatedDishes, setTranslatedDishes] = useState(menuData.dish_list);

  useEffect(() => {
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
  }, [language]);

  const filteredDishes = activeCategory === "All"
    ? translatedDishes
    : translatedDishes.filter((dish) => dish.category === activeCategory);

  const addToCart = (dish) => {
    setCartItems((prevItems) => [...prevItems, { name: dish.name, price: dish.price }]);
    setIsCartVisible(true);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const priceNum = parseFloat(item.price.replace("kr", ""));
      return total + priceNum;
    }, 0).toFixed(2) + "kr";
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

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <div className="restaurant-header">
          <img
            src="restaurant.jpg"
            alt="Restaurant"
            className="restaurant-image"
            onError={(e) => console.log("Restaurant image failed:", e)}
          />
          <h2 className="restaurant-title">Restaurant Name</h2>
          <div className="language-switcher" style={{ position: "absolute", top: 10, right: 10 }}>
            <button onClick={toggleLangMenu} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              {language === "swe" ? "🇸🇪 SWE" : language === "es" ? "🇪🇸 ES" : "🇬🇧 ENG"}
            </button>
            {isLangMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "5px",
                }}
              >
                <button
                  onClick={() => changeLanguage("en")}
                  style={{ display: "flex", alignItems: "center", gap: "5px", width: "100%" }}
                >
                  🇬🇧 ENG
                </button>
                <button
                  onClick={() => changeLanguage("swe")}
                  style={{ display: "flex", alignItems: "center", gap: "5px", width: "100%" }}
                >
                  🇸🇪 SWE
                </button>
                <button
                  onClick={() => changeLanguage("es")}
                  style={{ display: "flex", alignItems: "center", gap: "5px", width: "100%" }}
                >
                  🇪🇸 ES
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="category-filter">
          {menuData.categories.map((cat) => (
            <button
              key={cat}
              className={`category-button ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat} {/* Categories untranslated; can extend translateText if needed */}
            </button>
          ))}
        </div>
        <div className="dish-list">
          {filteredDishes.length > 0 ? (
            filteredDishes.map((dish) => (
              <div key={dish.id} className="dish-card">
                <h3 className="dish-title">{dish.name}</h3>
                <div className="dish-container">
                  <img
                    src={`/${dish.image}`}
                    alt={dish.name}
                    className="dish-image"
                    onError={(e) => console.log(`${dish.image} failed to load:`, e)}
                  />
                  <div className="stars">{"⭐".repeat(dish.rating)}</div>
                  <div className="price">{dish.price}</div>
                  <div className="plus-icon" onClick={() => addToCart(dish)}>
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
          <button className="hide-cart-button" onClick={() => setIsCartVisible(false)}>
            <FaArrowDown />
          </button>
          <h3 className="cart-title">Customer's Cart</h3>
        </div>
        {cartItems.length > 0 && isCartVisible ? (
          <>
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                {item.name} - {item.price}
              </div>
            ))}
            <div className="cart-total">Total: {calculateTotal()}</div>
          </>
        ) : null}
      </div>
      <button className="cart-toggle-button" onClick={toggleCart}>
        <FaShoppingCart />
      </button>
    </div>
  );
};

export default App;