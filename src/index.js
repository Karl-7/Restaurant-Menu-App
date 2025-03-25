import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./Menu";
import Main from "./main";
import OrderPage from "./comment";
import DishDetails from "./DishDetails";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

// Inline styles for dynamic background
const backgroundStyle = {
  position: "fixed",
  top: "-10px",
  left: "-10px",
  width: "calc(100% + 20px)",
  height: "calc(100% + 20px)",
  background: `url("/restaurant_data/Giorgio's Italiano/restaurant.jpg") no-repeat center center/cover`,
  filter: "blur(30px)",
  zIndex: -1,
};

root.render(
  <div className="index">
    <div className="background" style={backgroundStyle}></div>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/order/:orderId" element={<OrderPage />} />
          <Route path="/restaurant/:rId" element={<Menu />} />
          <Route path="/dish/:dishId" element={<DishDetails />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </div>
);