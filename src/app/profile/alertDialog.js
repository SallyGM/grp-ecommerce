import React, { useState } from 'react';

function App() {
  const [showDialog, setShowDialog] = useState(false);

  const handleDeleteClick = () => {
    setShowDialog(true); // Show the confirm dialog
  };

  const handleConfirmDelete = () => {
    // Perform deletion logic here
    alert('Item deleted!');
    setShowDialog(false); // Close the confirm dialog
  };

  const handleCancelDelete = () => {
    setShowDialog(false); // Close the confirm dialog
  };

  return (
    <div>
      <button onClick={handleDeleteClick}>Delete Item</button>
      {showDialog && (
        <div className="confirm-dialog">
          <p>Are you sure you want to delete this item?</p>
          <button onClick={handleConfirmDelete}>Yes</button>
          <button onClick={handleCancelDelete}>No</button>
        </div>
      )}
    </div>
  );
}

export default App;
