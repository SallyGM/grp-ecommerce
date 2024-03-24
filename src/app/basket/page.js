"use client"; 
import React, { useState } from 'react';
import { Card, Button } from 'flowbite-react';

export default function Home() {

  const [quantity,setQuantity] = useState(1);
  const[isVisible, setIsVisible] =  useState(true);
 
  const handleDecrement = () => {
    if(quantity >1){
      setQuantity(quantity -1);
    };
  }
  const handleIncrement = () =>{
    setQuantity(quantity + 1);
  };

  const handleDelete = () => {
    setIsVisible(false);
  };
  

  return (
    <div className='pt-5 bg-blue-800 pb-20'>
      <div>
      <h1 className="text-center mb-5 text-3xl dark:text-white self-center text-white font-mono">MY CART</h1>
      </div>
      <div className='top_bar_basket grid grid-cols-4 flex-wrap ml-20 mr-20 p-5' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', justifyItems: 'center' }}>
        <h3 className=' ext-4xl  font-bold tracking-tight dark:text-white text-white'>Product</h3>
        <h3 className=' ext-4xl font-bold tracking-tight dark:text-white  text-white'>Quantity</h3>
        <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'>Subtotal</h3>
      </div>
     
      <div className='grid grid-rows-3 flex-wrap m-s ml-20 mr-20 mt-5'>
      {isVisible &&(
        <Card className=" flex h-auto  w-full my-6 bg-transparent border-white" >
          <div className='grid grid-cols-4 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr',justifyItems: 'center' }}>
            <img class="first-line:h-40   w-40 " src="https://flowbite.com/docs/images/carousel/carousel-1.svg" alt="image description"/>
            <form class="max-w-xs ">
              <div class="flex max-w-[8rem]">
                  <button type="button" id="decrement-button" data-input-counter-decrement="quantity-input" class="input_btn dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-blue-700 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none" onClick={handleDecrement}>
                      <svg class="w-3 h-3 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                      </svg>
                  </button>
                  <input type="text" id="quantity-input" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} data-input-counter aria-describedby="helper-text-explanation" class="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-black text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="1" required />
                  <button type="button" id="increment-button" onClick={handleIncrement} data-input-counter-increment="quantity-input" class=" input_btn dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-blue-700 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                      <svg class="w-3 h-3 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                      </svg>
                  </button>
              </div>
            </form>        
            <h2 id="sub_total" className="flex  text-2xl dark:text-white text-white font-mono ">££££</h2>
            <img class="first-line:h-10  w-10 flex-wrap" src="https://www.iconbolt.com/iconsets/flowbite-solid/trash-bin.svg" alt="image description" onClick={handleDelete}/>

          </div>

        </Card> )}
      <Card className=" justify-self-start h-auto  w-full my-6 bg-transparent border-white" >
      </Card>
      <Card className=" justify-self-start h-auto  w-full my-6 bg-transparent border-white" >
      </Card>
      </div>

      <div className=' total_box grid grid-rows-4 flex-wrap ml-20 mr-20 mt-20 pb-20'>
        <div className='flex justify-between p-5'>
        <h2 id="total_saved" className="text-left ml-20 text-xl dark:text-white self-center text-white font-mono ">TOTAL SAVED</h2>
        < h2 id="amount_saved "className="text-right  mr-20 text-xl dark:text-white self-center text-white font-mono">££££</h2>
        </div>
        <div className='pl-10 pr-10 ml-20 mr-20'>
        <hr className="h-px my-8 bg-white border-5 dark:bg-white"/>
        </div>
        <div className='flex justify-between pl-5 pr-5'>
        <h2 id="total_saved" className="text-left ml-20 text-2xl dark:text-white self-center text-white font-mono ">ORDER TOTAL</h2>
        < h2 id="amount_saved "className="text-right  mr-20 text-2xl dark:text-white self-center text-white font-mono">££££</h2>
        </div>

        <div className='flex justify-center mt-10'>
          <Button className='basket_btn  bg-green-400 '>
                    CHECKOUT
          </Button>
        </div>
     
      </div>
       


    </div>
  );
}