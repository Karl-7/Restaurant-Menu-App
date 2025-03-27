import React, { useState } from 'react';
import './comment.css';
import { useNavigate } from "react-router-dom";
import { FaArrowLeft} from "react-icons/fa";

const OrderPage = () => {
  const navigate = useNavigate();
  // 订单数据
  const [orderItems, setOrderItems] = useState([
    { id: 1, name: 'Dish 1 Name', quantity: 1, price: 57, comment: '' },
    { id: 3, name: 'Dish 3 Name', quantity: 1, price: 37, comment: '' }
  ]);

  // 处理评论输入
  const handleCommentChange = (id, value) => {
    setOrderItems(items => 
      items.map(item => 
        item.id === id ? { ...item, comment: value } : item
      )
    );
  };

  // 处理发布操作
  const handlePublish = () => {
    const orderData = {
      items: orderItems,
      advertisement: "Comment to win coupon!"
    };
    console.log('Published order:', orderData);
    // 这里可以添加实际提交逻辑
    navigate(-1)
  };

  return (
    <div className='container'>
      <div className="detail-back-button-container">
          <button onClick={() => navigate(-1)} className="detail-back-button">
            <FaArrowLeft />
          </button>
        </div>
      <h2 className="header">Your order</h2>
      
      {/* 订单项目列表 */}
      {orderItems.map(item => (
        <div key={item.id} className="itemContainer">
          <div className="itemHeader">
            <span className="dishName">{item.name}</span>
            <span className="quantity">x{item.quantity}</span>
            <span className="order-price">{item.price}kr</span>
          </div>
          
          <div className="commentSection">
            <label>add comment:</label>
            <textarea
              className="commentInput"
              value={item.comment}
              onChange={(e) => handleCommentChange(item.id, e.target.value)}
              placeholder="Add your comment here..."
            />
          </div>
        </div>
      ))}

      {/* 分隔线 */}
      <hr className="divider" />

      {/* 发布区域 */}
      <div className="publishSection">
        <button 
          className="publishButton"
          onClick={handlePublish}
        >
          Publish
        </button>
        <p className="advertisement">"Comment to win coupon!"</p>
      </div>
    </div>
  );
};


export default OrderPage;