"use client"; 
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button } from 'flowbite-react';
import { useBasketContext } from '../context/BasketContext'
import { useAuth } from '../context/AuthContext'
import { useProductContext } from '../context/ProductContext';
import InputMask from 'react-input-mask'
import { useRouter } from 'next/navigation';
import { database } from '../firebaseConfig';
import { get, ref, update } from 'firebase/database';
import { Tooltip } from 'flowbite-react';

export default function Home() {

  const [ allProducts, setAllProducts] = useState([]);
  //const [ basketSize, setBasketSize] = useState(0);
  const [ basketPrice, setBasketPrice] = useState(0);
  const [ basketDiscount, setBasketDiscount] = useState(0);
  const [ checkOut, setCheckOut ] = useState(false)
  const [ basket, setBasket] = useState([]);
  const { userBasket, basketSize, onCheckOut, guestBasket, removeFromBasket, createOrder, clearBasket } = useBasketContext();
  const { currentUser } = useAuth() // to verify which basket to use
  const { products } = useProductContext();
  const [ showCVV, setShowCVV] = useState(false) 
  const [ fullNameError, setFullNameError] = useState(false)
  const [ cardNumberError, setCardNumberError] = useState(false)  
  const [ sortCodeError, setSortCodeError] = useState(false)  
  const [ cvvError, setCVVError] = useState(false)  
  const [ expirationDateError, setExpirationDateError] = useState(false)               
  const fullName = useRef();
  const cardNumber = useRef();
  const cvv = useRef();
  const sortCode = useRef();
  const expirationDate = useRef();
  const router = useRouter();




  





  useEffect(() => {
    if(products.length > 0){
      setAllProducts(products)
    }
  },[products])

  useEffect(() => {
    const b = (currentUser ? userBasket : guestBasket)
    if(allProducts.length > 0){
      const newBasket = Object.entries(b).map(([id, quantity]) => {
        let prod = products;
        let i = prod.findIndex(p => p.id === id);
        if(i !== -1 ){
          return { 
            id,
            quantity,
            price: prod[i].price,
            name: prod[i].name,
            images: prod[i].images, // Example of adding an extra field with a customized value
            discount: prod[i].discount // Example of customizing the value based on its length
          };
        } else {
          return { id, quantity }
        }
      });
      setBasket(newBasket)
    } 
  }, [basketSize, userBasket, allProducts, currentUser]);

  useEffect(() => {
    if(basket){
      if(Object.keys(basket).length > 0){

        // Get the price
        let total = 0;
        let discount = 0;
        basket.forEach(b => {
          const price = b.price; 
          const quantity = b.quantity; 
  
          if(b.discount > 0){
            total += parseFloat(b.price - b.price * b.discount).toFixed(2) * quantity;
            discount += b.price * b.discount
          } else {
            total += price * quantity;
          }
        })
  
        setBasketDiscount(discount)
        setBasketPrice(total)
      }
    }
  }, [basket])

  useEffect(() => {
    console.log(onCheckOut)
  },[onCheckOut])

  const handleFullName = (e) => {
    const isValid = /^([A-Z ][a-z ]*|[a-z ]+)$/i.test(e.target.value) && e.target.value.length <= 40;
    
    if (!isValid && e.target.value.length > 0) {
      setFullNameError('Full name cannot contain special characters or numbers');
    } else {
      setFullNameError('');
    }
  };

  const handleCardNumber = (e) => {
    const isValid = /^([0-9 ]+)$/i.test(e.target.value) && e.target.value.length === 19;
    
    if (!isValid) {
      setCardNumberError('Card number has to be 16 digits long');
    } else {
      setCardNumberError('');
    }
  };

  const handleCVV = (e) => {
    const isValid = /^([0-9 ]+)$/i.test(e.target.value) && e.target.value.length === 3;
    
    if (!isValid) {
      setCVVError('CVV should be 3 digits long');
    } else {
      setCVVError('');
    }
  };

  const handleSortCode = (e) => {
    const isValid = /^([0-9 ]+)$/i.test(e.target.value) && e.target.value.length === 8;
    
    if (!isValid) {
      setSortCodeError('Sort code should be 6 digits long');
    } else { 
      setSortCodeError('');
    }
  };

  const handleExpirationDate = (e) => {
    const isValid = /^([0-9/]+)$/i.test(e.target.value) && e.target.value.length === 7;
    
    if (!isValid) {
      setExpirationDateError('Expiration Date is invalid');
    } else {
      let string = String(e.target.value)
      let d = string.split("/")
      let exp = new Date(d[1] + "/" + d[0]).getTime()
      let today = new Date().getTime()
      if(exp-today > 0){
        setExpirationDateError('');
      } else {
        setExpirationDateError('Expiration Date has passed');
      }
    }
  };

  // handles on the page maybe on Checkout 
  // we can check the basket and see if it has been altered
  function handleClickChangeQuantity(object, op){
    let b = {...basket}
    let index = basket.indexOf(object)
    if(op == "+" && b[index].quantity < 10){
      b[index].quantity += 1
    } else {
      if(b[index].quantity !== 0){
        b[index].quantity -= 1
      }
    }
    setBasket(Object.values(b))
  };

  const handleCheckOutPage = () => {
    if(currentUser){
      setCheckOut(true)
    } else {
      router.push(`/register`);
    }
  };

  //Function for product stock update
  const updateProductStock = async (userBasket) => {
    try {
      // Iterate through each product ID in the userBasket
      for (const productId in userBasket) {
        // Get the current quantity from the userBasket
        const quantity = userBasket[productId];
  
        // Retrieve the product node from the database
        const productRef = ref(database, `Product/${productId}`);
        const snapshot = await get(productRef);
  
        // Check if the product exists
        if (snapshot.exists()) {
          const productData = snapshot.val();
          const currentStock = productData.quantity;
          const currentSold = productData.sold;
  
          const newStock = currentStock - quantity;
          const newSold = currentSold + quantity;
  
          // Update the stock quantity of the product in the database
          await update(ref(database, `Product/${productId}`), {
            quantity: newStock,
            sold: newSold,
          });
  
          console.log(`Updated stock quantity for product ${productId}`);
        } else {
          console.log(`Product ${productId} not found in the database`);
        }
      }
    } catch (error) {
      console.error('Error updating product stock:', error);
    }
  };

  

  async function handleCheckOutSubmission(e){
    e.preventDefault();
    if(cardNumberError === "" && fullNameError === "" && expirationDateError === "" && cvvError === ""){
      try{
        //calling update stock function when order is placed
        await updateProductStock(userBasket);
        
        await createOrder(new Date(), basketDiscount, basketPrice, currentUser.uid, fullName.current.value,
        cardNumber.current.value, cvv.current.value, expirationDate.current.value, sortCode.current.value);

        await clearBasket();
        router.push(`/`);
      } catch (error) {
        console.log("error")
      }
    }
  }

  const handleDelete = (productID) => {
    removeFromBasket(productID)
  };



  return (
    (checkOut === true ? (
      <div className='pt-5 back-prod  pb-20'>
        <div>
          <h1 className=" my-5 mx-5 mb-5 text-3xl text-center dark:text-white self-center text-white bebas-neue-regularLarge">CheckOut</h1>
        </div>
        <div className='flex flex-row'>
          <div className='flex flex-col summary-box rounded-md gap-4 p-6 w-1/2 m-5'>
            <h2 className='text-center roboto-bold'>Summary</h2>
            <table className="table-auto roboto-light">
              <thead>
                <tr>
                  <th>Game</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
              {(basketSize > 0 ? (
              Object.entries(basket).map(([key, b]) => (
                <tr key={key}>
                  <td>{b.name}</td>
                  <td className='text-center'>{b.quantity}</td>
                  <td className='text-center'>{parseFloat(b.price * b.quantity).toFixed(2)}</td>
                </tr>
              ))) : (
                <tr>
                  <td colSpan={3}>No products found</td>
                </tr>
              ))}
              </tbody>
            </table>
            <hr/>
            <p className='text-right'>£{(basketDiscount > 0 ? basketDiscount : 0.00)}</p>
            <p className='text-right'>£{basketPrice}</p>
          </div>
          <Card className='w-1/2 m-5 p-2 card-box '>
          <h2 className='text-center roboto-bold'>Card details</h2>
            <form className="max-w-md mx-auto roboto-light" onSubmit={handleCheckOutSubmission}>
              <div className="relative z-0 w-full mb-5 group">
                <label>Full Name</label>
                <input ref={fullName} onChange={handleFullName} className="block w-full rounded-md py-1.5 px-1.5 mt-2 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Full Name..." required />     
                {fullNameError && <span style={{ color: 'red', fontSize: '12px' }}>{fullNameError}</span>}
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <label>Card Number</label>
                <InputMask ref={cardNumber} onChange={handleCardNumber} className="block w-full rounded-md py-1.5 px-1.5 mt-2 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" mask="9999 9999 9999 9999" maskChar="" placeholder='Card Number...' required/>  
                {cardNumberError && <span style={{ color: 'red', fontSize: '12px' }}>{cardNumberError}</span>}
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <label>Sort Code</label>
                <InputMask ref={sortCode} onChange={handleSortCode} className="block w-full rounded-md py-1.5 px-1.5 mt-2 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" mask="99 99 99" maskChar="" placeholder='Sort Code...' required/>  
                {sortCodeError && <span style={{ color: 'red', fontSize: '12px' }}>{sortCodeError}</span>}
              </div>
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <label>Expiration Date</label>
                  <InputMask ref={expirationDate} onChange={handleExpirationDate} className="block rounded-md py-1.5 px-1.5 mt-2 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" mask="99/9999" maskChar="" placeholder='12/2024' required/>
                  {expirationDateError && <span style={{ color: 'red', fontSize: '12px' }}>{expirationDateError}</span>}
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <label>CVV</label>
                  <InputMask ref={cvv} type={showCVV ? "text" : "password"} onChange={handleCVV} className="block rounded-md py-1.5 px-1.5 mt-2 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" mask="999" maskChar="" placeholder='CVV' required/>
                  {cvvError && <span style={{ color: 'red', fontSize: '12px' }}>{cvvError}</span>}
                  <button
                    type="button"
                    aria-label={
                      showCVV ? "Password Visible" : "Password Invisible."
                    }
                    className="text-black dark:text-white"
                    onClick={() => {
                      setShowCVV((prev) => !prev);
                    }}>
                    {showCVV ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#00052d"
                        className="w-6 select-none cursor-pointer h-6 absolute top-9 right-2"
                        tabindex="-1"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLineJoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLineJoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#00052d"
                        className="w-6 select-none cursor-pointer h-6 absolute top-9 right-2">
                        <path
                          strokeLinecap="round"
                          strokeLineJoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        ></path>
                      </svg>
                    )}  
                  </button>
                </div>
              </div>
              <button type="submit" className="pay-btn text-white  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center roboto-light" >Pay</button>
            </form>
          </Card>
        </div>
      </div>
    ) : (
      <div className='pt-5 back-prod pb-20'>
        <div>
          <h1 className="text-center mb-5  dark:text-white self-center text-white bebas-neue-regularLarge">MY CART</h1>
        </div>
        <div className='top_bar_basket text-2xl roboto-bold grid grid-cols-4 flex-wrap ml-20 mr-20 p-5' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', justifyItems: 'center' }}>
          <h3 className=' tracking-tight dark:text-white text-white'>Product</h3>
          <h3 className='tracking-tight dark:text-white  text-white'>Quantity</h3>
          <h3 className='tracking-tight  dark:text-white text-white'>Subtotal</h3>
        </div>
      
        <div className='grid grid-rows-3 flex-wrap m-s ml-20 mr-20 mt-5'>
          {(basketSize > 0 ? (
            Object.entries(basket).map(([key, b]) => (
              <Card key={key} className="flex h-auto  w-full my-6 bg-transparent border-white">
                <div className='grid grid-cols-4 items-center flex-wrap'style={{ gridTemplateColumns:'1fr 1fr 1fr 1fr',justifyItems: 'center' }} >  

                  <img className='slick-slide-image'
                      src={(b.images ? b.images[2]: 'https://firebasestorage.googleapis.com/v0/b/buster-games-356c2.appspot.com/o/Preview%2FA%20Short%20Hike%20Preview%20Pic.png?alt=media&token=eee51ae3-1981-4fc6-ae13-7f1e52b885b4')}
                      alt='preview'/>
                  <form className="max-w-xs">
                    <div className="flex max-w-[8rem]">
                        <button type="button" id="decrement-button" onClick={(e) => handleClickChangeQuantity(b,"-", e)} data-input-counter-decrement="quantity-input" className="input_btn dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-blue-700 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                            <svg className="w-3 h-3 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                            </svg>
                        </button>
                        <input type="text" id="quantity-input" value={b.quantity} data-input-counter aria-describedby="helper-text-explanation" className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-black text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="1" required />
                        <button type="button" id="increment-button" onClick={(e) => handleClickChangeQuantity(b,"+", e)}  data-input-counter-increment="quantity-input" className="input_btn dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-blue-700 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                            <svg className="w-3 h-3 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                            </svg>
                        </button>
                    </div>
                  </form>        
                  <h2 id="sub_total" className="flex  text-2xl dark:text-white text-white font-mono ">£{(b.discount > 0 ? parseFloat(b.price - b.price * b.discount).toFixed(2): parseFloat(b.price).toFixed(2))}</h2>
                  <Tooltip content='Delete Product from Basket'>
                    <Button onClick={(e) => handleDelete(b.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </Button>
                  </Tooltip>
                </div>
              </Card>
            ))
          ) : (
            <div  className='text-2xl roboto-light text-white flex justify-center items-center h-full mt-10'>
              Your Cart is empty
            </div>
          ))}
        </div>
        {(basketSize > 0 ? ( 
          <div className=' total_box grid grid-rows-4 flex-wrap ml-20 mr-20 pb-20'>
            <div className='flex justify-between p-5'>
              <h2 id="total_saved" className="text-left ml-20 text-xl dark:text-white self-center text-white roboto-light ">SAVED</h2>
              <h2 id="amount_saved "className="text-right  mr-20 text-xl dark:text-white self-center text-white roboto-light">£{parseFloat(basketDiscount).toFixed(2)}</h2>
            </div>
            <div className='pl-10 pr-10 ml-20 mr-20'>
              <hr className="h-px my-8 bg-white border-5 dark:bg-white"/>
            </div>
            <div className='flex justify-between pl-5 pr-5'>
              <h2 id="total_saved" className="text-left ml-20 text-2xl dark:text-white self-center text-white roboto-bold ">ORDER TOTAL</h2>
              <h2 id="amount_saved "className="text-right  mr-20 text-2xl dark:text-white self-center text-white roboto-bold">£{basketPrice}</h2>
            </div>

            <div className='flex justify-center mt-10'>
              <button className='basket_btn rounded-lg roboto-light' hoverClassName='c50edd' onClick={handleCheckOutPage}>
                CHECKOUT
              </button>
            </div>
          </div>
          ) : (
            <></>
          ))}
        
      </div>
    ))
  );
}