"use client"; 
import React, { useState, useEffect, useRef } from 'react';
import { Card, Datepicker } from 'flowbite-react';
import { useBasketContext } from '../context/BasketContext'
import { useAuth } from '../context/AuthContext'
import { useProductContext } from '../context/ProductContext';
import InputMask from 'react-input-mask'
import { useRouter } from 'next/navigation';
import { database } from '../firebaseConfig';
import { get, ref, update } from 'firebase/database';
import { Tooltip } from 'flowbite-react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export default function Home() {

  const [ allProducts, setAllProducts] = useState([]);
  const [ basketPrice, setBasketPrice] = useState(0);
  const [ cards, setCards] = useState([]);
  const [ basketDiscount, setBasketDiscount] = useState(0);
  const [ checkOut, setCheckOut ] = useState(false)
  const [ basket, setBasket] = useState([]);
  const { userBasket, basketSize, guestBasket, removeFromBasket, createOrder, clearBasket } = useBasketContext();
  const { currentUser } = useAuth() // to verify which basket to use
  const { products } = useProductContext();
  const [ showCVV, setShowCVV] = useState(false) 
  const [ fullNameError, setFullNameError] = useState(false)
  const [ cardNumberError, setCardNumberError] = useState(false)  
  const [ sortCodeError, setSortCodeError] = useState(false)  
  const [ cvvError, setCVVError] = useState(false)  
  const [ expirationDateError, setExpirationDateError] = useState(false)    
  const [ defaultPayment, setDefaultPayment] = useState(true); 
  const [ paymentOption, setPaymentOption] = useState(0);            
  const fullName = useRef();
  const cardNumber = useRef();
  const cvv = useRef();
  const sortCode = useRef();
  const expirationDate = useRef();
  const router = useRouter();

  const [currentDate, setCurrentDate] = useState(new Date());


  function handleClickOpenProduct(productID, e) {
    // Prevent the default action of the anchor tag
    e.preventDefault();
    
    // Redirect to the specific product page using the product ID
    router.push(`/products/${productID}`);
  }

  const handleGoBackToBasket = () => {
    setCheckOut(false);
  };

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
            discount: prod[i].discount 
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
    console.log(checkOut)
  },[checkOut])

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
    
    if (!isValid && e.target.value.length != 0) {
      setCardNumberError('Card number has to be 16 digits long');
    } else {
      setCardNumberError('');
    }
  };

  const handleCVV = (e) => {
    const isValid = /^([0-9 ]+)$/i.test(e.target.value) && e.target.value.length === 3;
    
    if (!isValid && e.target.value.length != 0) {
      setCVVError('CVV should be 3 digits long');
    } else {
      setCVVError('');
    }
  };

  const handleSortCode = (e) => {
    const isValid = /^([0-9-]+)$/i.test(e.target.value) && e.target.value.length === 8;
    
    if (!isValid && e.target.value.length != 0) {
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

  const handleCheckOutPage = async() => {
    if(currentUser){
      setCheckOut(true)
      const userCardRef = ref(database, 'User/' + currentUser.uid + '/card');

      await get(userCardRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data =  Object.entries(snapshot.val()).map(([id, data]) => ({
            id, 
            ...data,
          }));

          setDefaultPayment(false)
          setCards(data)
        }
      })
      .catch((error) => {
          console.error('Error retrieving card details:', error);
      });
    } else {
      router.push(`/login`);
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
    if((cardNumberError === "" && fullNameError === "" && expirationDateError === "" && cvvError === "") || !defaultPayment){
      try{
        //calling update stock function when order is placed
        await updateProductStock(userBasket);
        setCurrentDate(new Date());
        const gameKey = uuidv4();

        if(defaultPayment){
          await createOrder(currentDate.toLocaleDateString('en-GB'), gameKey, basketDiscount, basketPrice, currentUser.uid, fullName.current.value,
        cardNumber.current.value, cvv.current.value, expirationDate.current.value, sortCode.current.value);
        } else {
          await createOrder(currentDate.toLocaleDateString('en-GB'), gameKey, basketDiscount, basketPrice, currentUser.uid, cards[paymentOption].cardName,
        cards[paymentOption].cardNumber, cards[paymentOption].securityCode, cards[paymentOption].expDate, cards[paymentOption].sortCode);
        }

        await clearBasket();
        toast.success('Ordered placed!');
        router.push(`/`);
      } catch (error) {
        console.log("error");
        toast.success('Error placing the order.');
      }
    }
  }

  const handleDelete = (productID) => {
    removeFromBasket(productID)
  };

  const handlePaymentOptionChange = (e) => {
    if(e.target.value === "default"){
      setDefaultPayment(true)
    } else {
      setDefaultPayment(false)
      setPaymentOption(e.target.value)
    }
  }

  return (
    (checkOut === true ? (
      <div className='pt-5 bg-blue-gradient pb-20'>
        <div>
          <h1 className="my-5 mx-5 mb-5 text-3xl text-center dark:text-white self-center text-white bebas-neue-regularLarge">CheckOut</h1>
        </div>
        <div className='flex flex-col md:flex-row'>
          <div className='flex flex-col shadowed-div summary-box rounded-lg gap-4 p-6 w-full md:w-1/2 md:m-5'>
            <h2 className='text-center text-xl roboto-bold'>Summary</h2>
            <hr class="h-px mt-8  bg-slate-600 border-0 dark:bg-gray-700"></hr>
            <table className="text-lg  roboto-light">
              <thead >
                <tr >
                  <th className="px-6 py-3 ">Game</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody >
                <div></div>
              {(basketSize > 0 ? (
              Object.entries(basket).map(([key, b]) => (
                <tr key={key}>
                  <td className="px-6 py-3 game-title" style={{ maxWidth: '150px', overflowWrap: 'break-word' }}>{b.name}</td>
                  <td className='text-center'>{b.quantity}</td>
                  
                  {b.discount > 0 ? (
                    <td className='text-center px-6 py-3'> {/*If price has a discount, it will be showed barred */}
                      <span style={{ textDecoration: "line-through", marginRight: "0.5rem" }}>
                        £{parseFloat(b.price * b.quantity).toFixed(2)}
                      </span>
                      £{parseFloat((b.price - (b.price * b.discount)) * b.quantity).toFixed(2)}
                    </td>
                  ) : (
                    <td className='text-center'>
                    £{parseFloat(b.price * b.quantity).toFixed(2)}</td>
                  )}
                </tr>
              ))) : (
                <tr>
                  <td colSpan={3}>No products found</td>
                </tr>
              ))}
              </tbody>
            </table>
            <hr class="h-px mt-8  bg-slate-600 border-0 dark:bg-gray-700"></hr>
            <div className='text-right mr-14'>
              <p className=' text-lg roboto-light'>Saved: £{(basketDiscount > 0 ? basketDiscount : 0.00).toFixed(2)}</p>
              <p className=' text-lg roboto-bold'>Total: £{basketPrice.toFixed(2)}</p>
            </div>
          </div>
          <div className='p-6 w-full md:w-1/2 md:m-5 card-box rounded-lg shadowed-div'>
          <h2 className='text-center text-xl roboto-bold'>Payment options</h2>
            <form className="max-w-md mx-auto mt-12 roboto-light" onSubmit={handleCheckOutSubmission}>
              {cards.length > 0 ? (
                <>
                  <fieldset onChange={handlePaymentOptionChange}>
                    {cards.map((key, index) => (
                      <div className="flex items-center mb-4">
                        <input id={index} type="radio" name="option" value={index} className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"/>
                        <label for={index} className="ms-2 text-sm font-medium text-white dark:text-gray-300">XXXX-XXXX-XXXX-{key.cardNumber.slice(-4)}</label>
                      </div>
                    ))}

                    <div className="flex items-center mb-4">
                      <input id="default" type="radio" name="option" value="default" className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"/>
                      <label for="default" className="ms-2 text-sm font-medium text-white dark:text-gray-300">Other payment method</label>
                    </div>
                  </fieldset>
                </>
              ) : (
                <></>
              )}

              {defaultPayment ? (
                <>
                <hr className='h-px mx-3 my-5 bg-slate-600 border-0 dark:bg-gray-700'/>
                <div className="relative z-0 w-full mb-5 group">
                  <label>Cardholder full name:</label>
                  <input ref={fullName} onChange={handleFullName} className="block w-full bg-transparent rounded-md py-1.5 px-1.5 mt-2 focus:bg-transparent border-2 focus:border-fuchsia-800 shadow-sm focus:outline-none focus:border-red ring-1 ring-inset placeholder:text-gray-200 focus:ring-0 focus:placeholder:text-white focus:ring-inset sm:text-sm sm:leading-6" placeholder="Full Name..." required />     
                  {fullNameError && <span style={{ color: 'red', fontSize: '14px', fontWeight:"bold" }}>{fullNameError}</span>}
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <label>Card Number</label>
                  <InputMask ref={cardNumber} onChange={handleCardNumber} className="block w-full bg-transparent rounded-md py-1.5 px-1.5 mt-2 focus:bg-transparent border-2 focus:border-fuchsia-800 shadow-sm focus:outline-none focus:border-red ring-1 ring-inset placeholder:text-gray-200 focus:ring-0 focus:placeholder:text-white focus:ring-inset sm:text-sm sm:leading-6" mask="9999 9999 9999 9999" maskChar="" placeholder='Card Number...' required/>  
                  {cardNumberError && <span style={{ color: 'red', fontSize: '14px', fontWeight:"bold" }}>{cardNumberError}</span>}
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <label>Sort Code</label>
                  <InputMask ref={sortCode} onChange={handleSortCode} className="block w-full bg-transparent rounded-md py-1.5 px-1.5 mt-2 focus:bg-transparent border-2 focus:border-fuchsia-800 shadow-sm focus:outline-none focus:border-red ring-1 ring-inset placeholder:text-gray-200 focus:ring-0 focus:placeholder:text-white focus:ring-inset sm:text-sm sm:leading-6" mask="99-99-99" maskChar="" placeholder='Sort Code...' required/>  
                  {sortCodeError && <span style={{ color: 'red', fontSize: '14px', fontWeight:"bold" }}>{sortCodeError}</span>}
                </div>
                <div className="grid md:grid-cols-2 md:gap-6">
                  <div className="relative z-0 w-full mb-5 group">
                    <label>Expiration Date</label>
                    <InputMask ref={expirationDate} onChange={handleExpirationDate} className="block w-full bg-transparent rounded-md py-1.5 px-1.5 mt-2 focus:bg-transparent border-2 focus:border-fuchsia-800 shadow-sm focus:outline-none focus:border-red ring-1 ring-inset placeholder:text-gray-200 focus:ring-0 focus:placeholder:text-white focus:ring-inset sm:text-sm sm:leading-6" mask="99/9999" maskChar="" placeholder='12/2024' required/>
                    {expirationDateError && <span style={{ color: 'red', fontSize: '14px', fontWeight:"bold" }}>{expirationDateError}</span>}
                  </div>
                  <div className="relative z-0 w-full mb-5 group">
                    <div className='flex flex-row'>
                      <label>CVV</label>
                      <Tooltip content="Three digit code on the back of your card">
                        <svg  className = 'ml-2' width="24px" height="24px" stroke-width="1.5" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF">
                          <path d="M12 11.5V16.5" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                          <path d="M12 7.51L12.01 7.49889" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        </Tooltip>
                    </div>
                    
                    <InputMask ref={cvv} type={showCVV ? "text" : "password"} onChange={handleCVV} className="block w-full bg-transparent rounded-md py-1.5 px-1.5 mt-2 focus:bg-transparent border-2 focus:border-fuchsia-800 text-black shadow-sm focus:outline-none focus:border-red ring-1 ring-inset placeholder:text-gray-200 focus:ring-0 focus:placeholder:text-white focus:ring-inset sm:text-sm sm:leading-6" mask="999" maskChar="" placeholder='CVV' required/>
                    {cvvError && <span style={{ color: 'red', fontSize: '14px', fontWeight:"bold" }}>{cvvError}</span>}
                    <button
                      type="button"
                      aria-label={
                        showCVV ? "Password Visible" : "Password Invisible."
                      }
                      className="text-white"
                      onClick={() => {
                        setShowCVV((prev) => !prev);
                      }}>
                      {showCVV ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 select-none cursor-pointer h-6 absolute top-10 right-2"
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
                          stroke="currentColor"
                          className="w-6 select-none cursor-pointer h-6 absolute top-10 right-2">
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
                </>
              ): (
                <></>
              )}

              <div className='flex flex-row gap-20'>
                <button type="submit" className="pay-btn text-white rounded-lg text-m w-full sm:w-auto px-5 py-2.5 text-center roboto-light" >Pay</button>

                {/*Button to go back to basket*/}
                <button type="button" className="pay-btn text-white rounded-lg text-m w-full sm:w-auto px-5 py-2.5 text-center roboto-light" onClick={handleGoBackToBasket} >Cancel</button>
              </div>      
            </form>
          </div>
        </div>
      </div>
    ) : (
      <div className='pt-5 bg-blue-gradient pb-20'>
        <div>
          <h1 className="text-center mb-5 self-center text-white bebas-neue-regularLarge">MY CART</h1>
        </div>
        
        <div className='flex flex-col m-s ml-20 mr-20 mb-5'>
        <Card className='bg-transparent basket_card overflow-x-scroll'>
          <table class="w-full text-center text-white my-5">
            <thead class="text-lg bg-elite-blue text-white uppercase">
              <tr>
                <th scope="col" class="px-6 py-3">
                  Product
                </th>
                <th scope="col" class="px-6 py-3">
                  Quantity
                </th>
                <th scope="col" class="px-6 py-3">
                  Subtotal
                </th>
                <th scope="col" class="px-6 py-3">
                  Total
                </th>
                <th scope="col" class="px-6 py-3">
                </th>
              </tr>
            </thead>
            <tbody>
            {(basketSize > 0 ? (
              Object.entries(basket).map(([key, b]) => (
                <tr key={key} className="border-b border-stone-50 bg-dark-night hover:bg-blue-900">
                  <th scope="row" className="px-0 py-0">
                    <img
                      className='slick-slide-image rounded-lg cursor-pointer w-96' onClick={(e) => handleClickOpenProduct(b.id, e)}
                      src={(b.images ? b.images[2] : 'https://firebasestorage.googleapis.com/v0/b/buster-games-356c2.appspot.com/o/Preview%2FA%20Short%20Hike%20Preview%20Pic.png?alt=media&token=eee51ae3-1981-4fc6-ae13-7f1e52b885b4')}
                      alt='preview'
                      />
                  </th>
                  <td className="px-6 py-4">
                    <form className="w-1/5">
                      <div className="flex max-w-[8rem]">
                          <button type="button" id="decrement-button" onClick={(e) => handleClickChangeQuantity(b,"-", e)} data-input-counter-decrement="quantity-input" className="input_btn dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-blue-700 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                            <svg className="w-3 h-3 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                            </svg>
                          </button>
                          <input type="text" id="quantity-input" value={b.quantity} data-input-counter aria-describedby="helper-text-explanation" className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-black text-sm focus:ring-blue-500 focus:border-blue-500 block w-8 py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="1" required />
                          <button type="button" id="increment-button" onClick={(e) => handleClickChangeQuantity(b,"+", e)}  data-input-counter-increment="quantity-input" className="input_btn dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-blue-700 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                            <svg className="w-3 h-3 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                            </svg>
                          </button>
                      </div>
                    </form>   
                  </td>
                  <td className="px-6 py-4">
                  <h2 id="sub_total" className="flex w-1/5 text-xl dark:text-white text-white roboto-light ">£{(b.discount > 0 ? parseFloat(b.price - b.price * b.discount).toFixed(2): parseFloat(b.price).toFixed(2))}</h2>
                  </td>
                  <td className="px-6 py-4">
                  <h2 id="sub_total" className="flex w-1/5 text-xl dark:text-white text-white roboto-light ">£{(b.discount > 0 ? parseFloat(b.price - b.price * b.discount).toFixed(2): parseFloat(b.price * b.quantity).toFixed(2))}</h2>
                  </td>
                  <td className="px-6 py-4">
                    <Tooltip content='Remove Product'>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="cursor-pointer my-5 mx-5 w-9 h-9 hover:scale-110" onClick={(e) => handleDelete(b.id)}>
                        <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clipRule="evenodd" />
                      </svg>
                    </Tooltip>
                  </td>
                </tr>
              ))
            ) : (
              <div className='text-2xl roboto-light text-white flex justify-center items-center h-full mt-10'>
                Your Cart is empty
              </div>
            ))}
            </tbody>
          </table>
          </Card>
        </div>
        {(basketSize > 0 ? ( 
          <div className='total_box grid grid-rows-4 flex-wrap ml-20 mr-20 pb-10'>
            <div className='flex justify-between p-5'>
              <h2 id="total_saved" className="text-left ml-20 text-xl dark:text-white self-center text-white roboto-light ">SAVED</h2>
              <h2 id="amount_saved "className="text-right  mr-20 text-xl dark:text-white self-center text-white roboto-light">£{parseFloat(basketDiscount).toFixed(2)}</h2>
            </div>
            <div className='pl-10 pr-10 ml-20 mr-20'>
              <hr className="h-px my-8 bg-white border-5 dark:bg-white"/>
            </div>
            <div className='flex justify-between pl-5 pr-5'>
              <h2 id="total_saved" className="text-left ml-20 text-xl dark:text-white self-center text-white roboto-bold ">ORDER TOTAL</h2>
              <h2 id="amount_saved "className="text-right  mr-20 text-xl dark:text-white self-center text-white roboto-bold">£{basketPrice.toFixed(2)}</h2>
            </div>

            <div className='flex justify-center mt-5'>
              {/*hoverClassName='c50edd'*/}
              <button className='basket_btn bold text-white mt-7 w-full focus:outline-none focus:ring-4 rounded-lg px-5 py-2.5 me-2 mb-2 md:w-80 self-center' onClick={handleCheckOutPage}>
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