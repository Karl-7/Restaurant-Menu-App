import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaRegStar, FaArrowLeft } from "react-icons/fa";
import "./DishDetails.css";

const DishDetails = () => {
  const { dishId } = useParams();
  const navigate = useNavigate();
  const [restaurantData, setRestaurantData] = useState(null);
  const [commentsData, setCommentsData] = useState(null);
  const [language, setLanguage] = useState("en");
  const [translatedName, setTranslatedName] = useState("");
  const [translatedDescription, setTranslatedDescription] = useState("");
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const languageCodes = { en: "en", swe: "sv", es: "es", it: "it", zh: "zh" }; // Added Italian and Chinese

  const translationCache = {
    en: {},
    swe: {},
    es: {},
    it: {}, // Added Italian
    zh: {}, // Added Chinese
  };

  const translateText = useCallback(async (text, targetLang) => {
    if (translationCache[targetLang][text]) {
      console.log(`Cache hit for "${text}" in ${targetLang}: ${translationCache[targetLang][text]}`);
      return translationCache[targetLang][text];
    }

    try {
      console.log(`Attempting to translate "${text}" to ${targetLang}`);
      // Detect the source language
      const detectResponse = await fetch("http://localhost:5000/detect", {
        method: "POST",
        body: JSON.stringify({ q: text }),
        headers: { "Content-Type": "application/json" },
      });
      const detectData = await detectResponse.json();

      if (detectData.error || !detectData[0]?.language) {
        console.error(`Language detection error for "${text}":`, detectData.error);
        translationCache[targetLang][text] = text;
        return text;
      }

      const sourceLang = detectData[0].language;
      console.log(`Detected source language for "${text}": ${sourceLang}`);

      if (sourceLang === languageCodes[targetLang]) {
        console.log(`Source (${sourceLang}) matches target (${targetLang}), skipping`);
        translationCache[targetLang][text] = text;
        return text;
      }

      const response = await fetch("http://localhost:5000/translate", {
        method: "POST",
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: languageCodes[targetLang],
          format: "text",
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      if (data.error) {
        console.error(`Translation error for "${text}":`, data.error);
        // Fallback: split and translate words individually
        const words = text.split(" ");
        if (words.length > 1) {
          const translatedWords = await Promise.all(
            words.map(word => translateText(word, targetLang))
          );
          const translatedText = translatedWords.join(" ");
          translationCache[targetLang][text] = translatedText;
          return translatedText;
        }
        translationCache[targetLang][text] = text;
        return text;
      }

      const translatedText = data.translatedText;
      console.log(`Translated "${text}" to ${targetLang}: ${translatedText}`);
      translationCache[targetLang][text] = translatedText;
      return translatedText;
    } catch (error) {
      console.error(`Network error translating "${text}":`, error);
      return text;
    }
  }, [languageCodes]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const restaurantResponse = await fetch("/restaurant_data/Giorgio's Italiano/menuData.js");
        if (!restaurantResponse.ok) {
          throw new Error(`Failed to fetch menuData.js: ${restaurantResponse.status} ${restaurantResponse.statusText}`);
        }
        const restaurantText = await restaurantResponse.text();
        eval(restaurantText);
        console.log("menuData.js loaded:", window.RestaurantData);
        setRestaurantData(window.RestaurantData);
      } catch (error) {
        console.error("Error loading menuData.js:", error);
      }

      try {
        const commentsResponse = await fetch("/restaurant_data/Giorgio's Italiano/commentsData.json");
        if (!commentsResponse.ok) {
          const responseText = await commentsResponse.text();
          throw new Error(`Failed to fetch commentsData.json: ${commentsResponse.status} ${commentsResponse.statusText} - Response: ${responseText.slice(0, 50)}`);
        }
        const commentsData = await commentsResponse.json();
        console.log("commentsData.json loaded:", commentsData);
        setCommentsData(commentsData);
      } catch (error) {
        console.error("Error loading commentsData.json:", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!restaurantData) return;
    
    const dish = restaurantData.dish_list.find((d) => d.id === dishId);
    if (!dish) return;

    const translateContent = async () => {
      const newName = await translateText(dish.name, language);
      const newDescription = await translateText(dish.description, language);
      setTranslatedName(newName);
      setTranslatedDescription(newDescription);
    };

    translateContent();
  }, [language, restaurantData, dishId, translateText]);

  if (!restaurantData || !commentsData) return <div>Loading...</div>;

  const dish = restaurantData.dish_list.find((d) => d.id === dishId);
  
  if (!dish) return <div>Dish not found!</div>;

  const dishComments = commentsData
    .filter((comment) => comment.dish === dishId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  const overallRating =
    dishComments.length > 0
      ? dishComments.reduce((sum, comment) => sum + comment.rating, 0) / dishComments.length
      : 0;

  const toggleLangMenu = () => setIsLangMenuOpen((prev) => !prev);
  const changeLanguage = (lang) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };

  const backgroundStyle = {
    position: "fixed",
    top: "-10px",
    left: "-10px",
    width: "calc(100% + 20px)",
    height: "calc(100% + 20px)",
    background: `url("/restaurant_data/Giorgio's Italiano/${restaurantData.restaurant_pic}") no-repeat center center/cover`,
    filter: "blur(30px)",
    zIndex: -1,
  };

  return (
    <div className="detail-body">
      <div className="background" style={backgroundStyle}></div>
      <div className="dish-detail-container">
        <div className="detail-back-button-container">
          <button onClick={() => navigate(-1)} className="detail-back-button">
            <FaArrowLeft />
          </button>
        </div>
        <div className="dish-detail-header">
          <img
            src={`/restaurant_data/Giorgio's Italiano/${dish.image}`}
            alt={dish.name}
            className="dish-detail-image"
            onError={(e) => console.log(`${dish.image} failed to load:`, e)}
          />
          <div className="dish-detail-info">
            <h1>{translatedName || dish.name}</h1>
            <p>{translatedDescription || dish.description}</p>
          </div>
          <div className="detail-language-switcher">
            <button onClick={toggleLangMenu}>
              {language === "swe" ? "SWE" : language === "es" ? "SPA" : language === "it" ? "ITA" : language === "zh" ? "中文" : "ENG"}
            </button>
            {isLangMenuOpen && (
              <div className="detail-language-dropdown">
                <button onClick={() => changeLanguage("en")}>ENG</button>
                <button onClick={() => changeLanguage("swe")}>SWE</button>
                <button onClick={() => changeLanguage("es")}>SPA</button>
                <button onClick={() => changeLanguage("it")}>ITA</button>
                <button onClick={() => changeLanguage("zh")}>中文</button>
              </div>
            )}
          </div>
        </div>
        <div className="dish-detail-ratings">
          <div className="rating-sorts">Average Score:</div>
          <div className="detail-rating-stars">
            {Array.from({ length: 5 }, (_, i) => (
              i < Math.round(overallRating) ? <FaStar key={i} color="gold" /> : <FaRegStar key={i} color="gold" />
            ))}
          </div>
        </div>
        <div className="dish-comments">
          {dishComments.length > 0 ? (
            dishComments.map((comment, index) => (
              <div key={`${comment.timestamp}-${index}`} className="dish-comment">
                <span className="comment-icon">{comment.avatar}</span>
                <div className="comment-text">
                  <p>{comment.text}</p>
                  <div className="comment-stars">{"⭐".repeat(comment.rating)}</div>
                </div>
              </div>
            ))
          ) : (
            <p>No comments yet for this dish.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DishDetails;