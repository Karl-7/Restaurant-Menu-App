import React, { useState } from "react";
import './main.css';
import RestaurantCard from './components/RestaurantCard';
import { useNavigate } from "react-router-dom";
import data from './restaurants/data.json';
import { IoMenu } from "react-icons/io5";
import { CgShoppingCart } from "react-icons/cg";
import { IoMdCloseCircle } from "react-icons/io";

const categories = [
  "All", "Vegetarian", "Vegan", "Gluten-Free",  "Organic", 
  "No-Seafood", "Halal", "No-Beef", "Low-Carb"
];

const MainMenu = () => {
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState(["All"]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [showSideMenu, setShowSideMenu] = useState(false);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterData(query, activeFilters);
  };

  const handleFilterClick = (category) => {
    let newFilters;
    if (category === "All") {
      newFilters = ["All"];
    } else {
      if (activeFilters.includes("All")) {
        newFilters = [category];
      } else {
        newFilters = activeFilters.includes(category)
          ? activeFilters.filter(f => f !== category)
          : [...activeFilters, category];
        if (newFilters.length === 0) newFilters = ["All"];
      }
    }
    setActiveFilters(newFilters);
    filterData(searchQuery, newFilters);
  };

  const filterData = (query, filters) => {
    let filtered = data;

    // Special case: Vegetarian + Halal + Gluten-Free
    const specificFilters = ["Vegetarian", "Halal", "Gluten-Free"];
    const hasAllSpecificFilters = specificFilters.every(f => filters.includes(f));
    const hasOnlySpecificFilters = filters.length === specificFilters.length && hasAllSpecificFilters;

    if (hasOnlySpecificFilters) {
      // Only show DalaNisse (corrected spelling) when exactly these three filters are selected
      filtered = data.filter(item => item.name === "DalaNisse");
    } else if (!filters.includes("All")) {
      // Normal filtering for other combinations, using .some() for type array
      filtered = data.filter(item => 
        filters.every(filter => 
          item.type.some(t => t.toLowerCase() === filter.toLowerCase())
        )
      );
    }

    if (query) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    setFilteredData(filtered);
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
          placeholder="Search by name"
        />
      </div>
      <div className="filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-button ${activeFilters.includes(cat) ? "active" : ""}`}
            onClick={() => handleFilterClick(cat)}
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