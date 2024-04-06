"use client"; 
import React, { useState, useEffect } from 'react';
import { Card, Button, Image } from 'flowbite-react';
import { useBasketContext } from '../context/BasketContext'
import { useAuth } from '../context/AuthContext'
import { useProductContext } from '../context/ProductContext';
import InputMask from 'react-input-mask'

export default function Home() {

  const [ allProducts, setAllProducts] = useState([]);
  const [ basketSize, setBasketSize] = useState(0);
  const [ basketPrice, setBasketPrice] = useState(0);
  const [ basketDiscount, setBasketDiscount] = useState(0);
  const [ checkOut, setCheckOut ] = useState(false)
  const [ basket, setBasket] = useState([]);
  const { userBasket, onCheckOut, guestUserBasket, removeFromBasket, activateCheckOut } = useBasketContext();
  const { currentUser } = useAuth() // to verify which basket to use
  const { products } = useProductContext();

  useEffect(() => {
    if(products.length > 0){
      setAllProducts(products)
    }
  },[products])

  useEffect(() => {
    if(currentUser && allProducts.length > 0){
      const newBasket = Object.entries(userBasket).map(([id, quantity]) => {
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
    } else {
      setBasket(guestUserBasket)
    }
  }, [userBasket, currentUser]);

  useEffect(() => {
    if(basket){
      if(Object.keys(basket).length > 0){

        setBasketSize(Object.keys(basket).length)
  
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
      } else {
        setBasketSize(0)
      } 
    }
  }, [basket])

  useEffect(() => {
    console.log(onCheckOut)
  },[onCheckOut])

  // handles on the page maybe on Checkout 
  // we can check the basket and see if it has been altered
  function handleClickChangeQuantity(object, op){
    let b = basket
    let index = basket.indexOf(object)
    if(op == "+" && b[index].quantity < 10){
      b[index].quantity += 1
    } else {
      if(b[index].quantity !== 0){
        b[index].quantity -= 1
      }
    }
    setBasket(b)
  }

  const handleCheckOutPage = () => {
    activateCheckOut();
    setCheckOut(true)
  }

  const handleDelete = (productID) => {
    removeFromBasket(productID)
  };

  return (
    (checkOut === true ? (
      <div className='pt-5 bg-blue-800 pb-20'>
        <div>
          <h1 className="text-center my-5 mx-5 mb-5 text-3xl text-center dark:text-white self-center text-white font-mono">CheckOut</h1>
        </div>
        <div className='flex flex-row'>
          <Card className='w-1/2 m-5 p-2'>
            <h2 className='text-center font-bold'>Summary</h2>
            <table className="table-auto">
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
          </Card>
          <Card className='w-1/2 m-5 p-2'>
          <h2 className='text-center font-bold'>Card details</h2>
            <form class="max-w-md mx-auto">
              <div class="relative z-0 w-full mb-5 group">
                  <input class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                  <label class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name on the card</label>
              </div>
              <div class="relative z-0 w-full mb-5 group">
                  <input class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                  <label class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Card Number</label>
              </div>
              <div class="grid md:grid-cols-2 md:gap-6">
                <div class="relative z-0 w-full mb-5 group">
                    <InputMask class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" mask="99/9999" maskChar="" placeholder='12/2024' required/>
                    <label class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Expiration Date</label>
                </div>
                <div class="relative z-0 w-full mb-5 group">
                    <InputMask class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" mask="999" maskChar="" placeholder='123' required/>
                    <label class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">CVV</label>
                </div>
              </div>
              <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Pay</button>
            </form>
          </Card>
        </div>
      </div>
    ) : (
      <div className='pt-5 bg-blue-800 pb-20'>
        <div>
          <h1 className="text-center mb-5 text-3xl dark:text-white self-center text-white font-mono">MY CART</h1>
        </div>
        <div className='top_bar_basket grid grid-cols-4 flex-wrap ml-20 mr-20 p-5' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', justifyItems: 'center' }}>
          <h3 className='text-4xl font-bold tracking-tight dark:text-white text-white'>Product</h3>
          <h3 className='text-4xl font-bold tracking-tight dark:text-white  text-white'>Quantity</h3>
          <h3 className='text-4xl font-bold tracking-tight  dark:text-white text-white'>Subtotal</h3>
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
                  <h2 id="sub_total" className="flex  text-2xl dark:text-white text-white font-mono ">£{(b.discount > 0 ? parseFloat(b.price - b.price * b.discount).toFixed(2): b.price)}</h2>
                  <Button onClick={(e) => handleDelete(b.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div>
              No items in basket
            </div>
          ))}
        </div>
        <div className=' total_box grid grid-rows-4 flex-wrap ml-20 mr-20 mt-20 pb-20'>
          <div className='flex justify-between p-5'>
            <h2 id="total_saved" className="text-left ml-20 text-xl dark:text-white self-center text-white font-mono ">TOTAL SAVED</h2>
            <h2 id="amount_saved "className="text-right  mr-20 text-xl dark:text-white self-center text-white font-mono">£{parseFloat(basketDiscount).toFixed(2)}</h2>
          </div>
          <div className='pl-10 pr-10 ml-20 mr-20'>
            <hr className="h-px my-8 bg-white border-5 dark:bg-white"/>
          </div>
          <div className='flex justify-between pl-5 pr-5'>
            <h2 id="total_saved" className="text-left ml-20 text-2xl dark:text-white self-center text-white font-mono ">ORDER TOTAL</h2>
            <h2 id="amount_saved "className="text-right  mr-20 text-2xl dark:text-white self-center text-white font-mono">£{basketPrice}</h2>
          </div>

          <div className='flex justify-center mt-10'>
            <Button className='basket_btn bg-green-400' onClick={handleCheckOutPage}>
              CHECKOUT
            </Button>
          </div>
        </div>
      </div>
    ))
  );
}