import React, { useState } from "react";
import './main.css';
import RestaurantCard from './components/RestaurantCard';
import { useNavigate } from "react-router-dom";
import data from './restaurants/data.json';
import { IoMenu } from "react-icons/io5";
import { CgShoppingCart } from "react-icons/cg";
import { IoMdCloseCircle } from "react-icons/io";

const categories = ["All", "vegetarian", "Halal", "Gluten-Free"];
const MainMenu = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("name");
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [showSideMenu, setShowSideMenu] = useState(false);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query) {
      const filtered = data.filter(item => {
        switch (activeFilter) {
          case 'name':
            return item.name.toLowerCase().includes(query.toLowerCase());
          case 'vegetarian':
            return item.type.toString().includes(query);
          default:
            return true;
        }
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  const handleDiscountClick = (restaurantName) => {
    navigate(`/restaurant/${restaurantName}/discount`);
  };

  return (
    <div className="mainmenu">
      <div className="search-bar">
        <IoMenu className="personal-center" onClick={() => setShowSideMenu(true)}/>
        <input 
          type="text" 
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={activeFilter === 'name' ? "Search by name" : "Search by vegetarian"}
        />
      </div>
      <div className="filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-button ${activeFilter === cat ? "active" : ""}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="recommendations">
        {filteredData.map((item) => (
          <div className="restaurant-card-wrapper" key={item.name}>
            <RestaurantCard 
              name={item.name}
              rating={item.rating} 
              imageList={item.imageList}
              price={item.price} 
              distance={item.distance} 
              onDiscountClick={() => handleDiscountClick(item.name)}
            />
          </div>
        ))}
      </div>
      {showSideMenu && (
        <div className="side-menu-mask">
          <div className="side-menu">
            <div className="account">
              <img src="/avatar.webp" className="avarta"/>
              <div className="info">
                <p>Foodie 1</p>
                <p className="des">My account</p>
              </div>
            </div>
            <div className="menu">
              <div onClick={() => navigate(`/order/1`)}>
                <CgShoppingCart className="cart"/> My orders
              </div>
            </div>
          </div>
          <IoMdCloseCircle className="close" onClick={() => setShowSideMenu(false)}/>
        </div>
      )}
    </div>
  );
}

export default MainMenu;