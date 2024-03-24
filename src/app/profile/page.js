"use client"; 
import Image from 'next/image'
import Link from 'next/link'
import { Card, Button } from 'flowbite-react';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import React from 'react';
import Account from '../accountInfo';
import AddressBook from '@/addressBook';
import CardStored from '@/cardStored';
import MyOrders from '@/myorders';
import MyReviews from '@/myReviews';

export default function Home() {
    //Use the useState Hook to manage side bar clicks
    const [card, setCard] = useState(Account);
    

    //Function that retrive card information base on the menu tab selected
    const handleMenuClick= (compName) => (e) => {
        if(compName == 'MY ACCOUNT'){
            setCard(Account);
        }
        if(compName == 'MY ADDRESS BOOK'){
            setCard(AddressBook);
        }
        if(compName == 'STORED PAYMENT CARDS'){
            setCard(CardStored);
        }
        if(compName == 'MY ORDERS'){
            setCard(MyOrders);
        }
        if(compName == 'MY REVIEWS'){
            setCard(MyReviews);
        }
    };
    

    return (
        <div className='grid grid-rows-1 grid-cols-4 gap-x-20 row-start-1 row-end-2 col-start-1 col-end-3 bg-dark-night'> 
            <Card className="justify-self-end h-auto w-auto my-6 bg-blue-900 border-blue-900 row-span-1 col-start-1 col-end-2"  >
                <div class="py-10 overflow-y-auto ">
                    <ul class="space-y-10 font-medium">
                        <li onClick={handleMenuClick('MY ACCOUNT')}>
                            <a href="#"  class="flex items-center p-2 text-gray-900 rounded hover:bg-gray-100 dark:hover:bg-gray-700 group ">
                                <svg class="w-6 h-6 text-white transition duration-75 text-white group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 100-6 3 3 0 000 6z"/>
                                </svg>
                                <span class="ms-3 text-white group-hover:text-white">MY ACCOUNT</span>
                            </a>
                        </li>
                        <li onClick={handleMenuClick('MY ADDRESS BOOK')}>
                            <button type="button" className= "flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                <svg class="w-6 h-6 text-white transition duration-75  dark:text-white group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 1000 1000">
                                    <path d="M426 50c13.333 0 20 6.667 20 20v860c0 13.333-6.667 20-20 20h-46c-13.333 0-20-6.667-20-20V490H184c-10.667 0-20-2-28-6-8-1.333-16.667-5.333-26-12L10 390c-6.667-4-10-9.333-10-16s3.333-12 10-16l120-82c9.333-6.667 18-10.667 26-12 5.333-2.667 14.667-4 28-4h176V70c0-13.333 6.667-20 20-20h46m564 208c6.667 4 10 9.333 10 16s-3.333 12-10 16l-118 82c-14.667 8-23.333 12-26 12-9.333 4-18.667 6-28 6H516l-40-230h342c12 0 21.333 1.333 28 4 6.667 2.667 15.333 6.667 26 12l118 82"/>
                                </svg>
                                <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">MY ADDRESS BOOK</span>
                            </button>
                        </li>
                        <li onClick={handleMenuClick('STORED PAYMENT CARDS')}>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg class="flex-shrink-0 w-5 h-5 text-white transition duration-75 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 1024 1024">
                                    <path d="M928 160H96c-17.7 0-32 14.3-32 32v160h896V192c0-17.7-14.3-32-32-32zM64 832c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V440H64v392zm579-184c0-4.4 3.6-8 8-8h165c4.4 0 8 3.6 8 8v72c0 4.4-3.6 8-8 8H651c-4.4 0-8-3.6-8-8v-72z"/>
                                </svg>
                                <span class="flex-1 ms-3 whitespace-nowrap">STORED PAYMENT CARDS</span>
                            </a>
                        </li>
                        <li onClick={handleMenuClick('MY ORDERS')}>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <svg class="flex-shrink-0 w-5 h-5 text-white transition duration-75 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z"/>
                            </svg>
                            <span class="flex-1 ms-3 whitespace-nowrap">MY ORDERS</span>
                            </a>
                        </li>
                        <li onClick={handleMenuClick('MY REVIEWS')}>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <svg class="flex-shrink-0 w-5 h-5 text-white transition duration-75 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z"/>
                                <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z"/>
                                <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z"/>
                            </svg>
                            <span className="flex-1 ms-3 whitespace-nowrap">MY REVIEWS</span>
                            </a>
                        </li>
                                    
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                            <svg class="flex-shrink-0 w-5 h-5 text-white transition duration-75 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"/>
                            </svg>
                            <span className="flex-1 ms-3 whitespace-nowrap">LOGOUT</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </Card>
            {card}
       
        <div className='flex place-content-center h-auto row-start-2 row-end-2 col-span-4 mb-6'>
            <div>
                <Button
                    type="submit"
                    className="w-96 text-white">
                    DELETE ACCOUNT
                </Button>
            </div>
        </div>
    </div>
    
    );
}