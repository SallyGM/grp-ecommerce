import React from 'react';

const orderPlacedModal = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-opacity ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      <div className="bg-white rounded-lg p-8 max-w-md mx-auto z-50">
        <h2 className="text-2xl font-bold mb-4">Order Placed Successfully!</h2>
        <p>Your order has been successfully placed. Thank you for shopping with us!</p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-6 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default orderPlacedModal;