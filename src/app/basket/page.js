import Link from 'next/link'; 


export default function Basket() {
  // TO CAHNGE 
  const basketItems = [
    { id: 1, name: 'Product 1', price: 10.00, quantity: 2 },
    { id: 2, name: 'Product 2', price: 15.00, quantity: 1 },
    //SHOWING PRODUCT 
  ];

  // Calculates the subtotal of all items in the basket
  const subtotal = basketItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Placeholder for a tax rate to apply to the subtotal
  const taxRate = 0.1;
  const taxes = subtotal * taxRate; // Calculates the taxes based on the subtotal
  const total = subtotal + taxes; // Calculates the total cost including taxes

 
  return (
    <div class="grid-container"> 
      <div class="grid-item">
        <div class="card">
          <h1 className="H1Login">Basket</h1>                
          {basketItems.length > 0 ? (                    // Checks if there are any items in the basket
            <div>
              {/* display details of each product */}
              {basketItems.map((item) => (
                <div className="basketItem" key={item.id}> {/* Each basket item container */}
                  <p>{item.name}</p> {/* Item name */}
                  <p>Quantity: {item.quantity}</p> {/* Item quantity */}
                  <p>Price: ${item.price.toFixed(2)}</p> {/* Item price, formatted to 2 decimal places */}
                  <button className="removeItemButton">Remove</button> {/* Button to remove the item */}
                </div>
              ))}
              <div className="summarySection">                          
                <p>Subtotal: ${subtotal.toFixed(2)}</p>                {/* Displays the subtotal */}
                <p>Taxes: ${taxes.toFixed(2)}</p>                     {/* Displays the calculated taxes */}
                <p>Total: ${total.toFixed(2)}</p>                       {/* Displays the total amount */}
                <button className="checkoutButton">Proceed to Checkout</button> 
              </div>
            </div>
          ) : (
            <p>Your basket is empty. <Link href="/shop"><a>Continue shopping.</a></Link></p> // Message shown when the basket is empty
          )}
        </div>
      </div>
    </div>
  );
}
