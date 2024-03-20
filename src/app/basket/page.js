"use client"; 
import React, { useState } from 'react';


export default function Home() {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };


  return (
    <div>
      <div className='grid grid-cols-3 flex-wrap m-s ml-20 mr-20 mt-5 bg-sky-950 p-3'>
        <h3 className='ml-20 ext-4xl font-bold tracking-tight text-gray-900 dark:text-white self-center text-white'>Product</h3>
        <h3 className='ml-40 ext-4xl font-bold tracking-tight text-gray-900 dark:text-white self-center text-white'>Quantity</h3>
        <h3 className='ml-20 ext-4xl font-bold tracking-tight text-gray-900 dark:text-white self-center text-white'>Subtotal</h3>
      </div>
      <div className='grid grid-rows-3 flex-wrap m-s ml-20 mr-20 mt-5 bg-sky-950 p-3'>
        
      </div>
       
       

    </div>
  );
}