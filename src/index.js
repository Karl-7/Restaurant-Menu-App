import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./Menu";
import DishDetails from "./DishDetails";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/dish/:dishId" element={<DishDetails />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);