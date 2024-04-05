"use client"; 
import React, { useState, useEffect } from 'react';
import { Card, Button } from 'flowbite-react';
import { useBasketContext } from '../context/BasketContext'
import { useAuth } from '../context/AuthContext'

export default function Home() {

  const [quantity,setQuantity] = useState(1);
  const [basket, setBasket] = useState([])
  const [isVisible, setIsVisible] =  useState(true);
  const { userBasket, guestUserBasket, removeFromBasket, activateCheckOut } = useBasketContext();
  const { currentUser } = useAuth() // to verify which basket to use

  useEffect(() => {
        
    if(currentUser){
      setBasket(userBasket)
    } else {
      setBasket(guestUserBasket)
    }
  }, [userBasket], [currentUser]);

  // handles on the page maybe on Checkout 
  // we can check the basket and see if it has been altered
  function handleClickChangeQuantity(id, op){
    let b = {...basket}
    if(op == "+" && b[id] < 10){
      b[id] += 1
    } else {
      if(b[id] != 0){
        b[id] -= 1
      }
    }
    setBasket(b)
  }

  const handleCheckOutPage = () => {
    activateCheckOut()
  }

  const handleDelete = (productID) => {
    removeFromBasket(productID)
  };

  return (
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
      {(Object.keys(basket).length > 0 ? (
        Object.entries(basket).map(([productID, quantity]) => (
          <Card key={productID} className="flex h-auto  w-full my-6 bg-transparent border-white">
            <div className='grid grid-cols-4 items-center flex-wrap'style={{ gridTemplateColumns:'1fr 1fr 1fr 1fr',justifyItems: 'center' }}>
              <img className="first-line:h-40 w-40" src="https://flowbite.com/docs/images/carousel/carousel-1.svg" alt="image description"/>
              <form className="max-w-xs">
                <div className="flex max-w-[8rem]">
                    <button type="button" id="decrement-button" onClick={(e) => handleClickChangeQuantity(productID,"-", e)} data-input-counter-decrement="quantity-input" className="input_btn dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-blue-700 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                        <svg className="w-3 h-3 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                        </svg>
                    </button>
                    <input type="text" id="quantity-input" value={quantity} data-input-counter aria-describedby="helper-text-explanation" className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-black text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="1" required />
                    <button type="button" id="increment-button" onClick={(e) => handleClickChangeQuantity(productID,"+", e)}  data-input-counter-increment="quantity-input" className=" input_btn dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-blue-700 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                        <svg className="w-3 h-3 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                        </svg>
                    </button>
                </div>
              </form>        
              <h2 id="sub_total" className="flex  text-2xl dark:text-white text-white font-mono ">{productID}</h2>
              <Button onClick={(e) => handleDelete(productID)}>
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
          <h2 id="amount_saved "className="text-right  mr-20 text-xl dark:text-white self-center text-white font-mono">££££</h2>
        </div>
        <div className='pl-10 pr-10 ml-20 mr-20'>
          <hr className="h-px my-8 bg-white border-5 dark:bg-white"/>
        </div>
        <div className='flex justify-between pl-5 pr-5'>
          <h2 id="total_saved" className="text-left ml-20 text-2xl dark:text-white self-center text-white font-mono ">ORDER TOTAL</h2>
          <h2 id="amount_saved "className="text-right  mr-20 text-2xl dark:text-white self-center text-white font-mono">££££</h2>
        </div>

        <div className='flex justify-center mt-10'>
          <Button className='basket_btn bg-green-400' onClick={handleCheckOutPage}>
            CHECKOUT
          </Button>
        </div>
      </div>
    </div>
  );
}