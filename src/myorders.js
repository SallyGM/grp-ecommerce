"use client"; 
import Image from 'next/image'
import Link from 'next/link'
import { Card, Button } from 'flowbite-react';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import React from 'react';


export default function MyOrders() {

    // Firebase information retrival function here




    return(
        <Card className=" justify-self-center h-auto w-full my-6 mr-12 bg-blue-900 border-blue-900 row-start-1 row-end-1 col-start-2 col-end-5 " >
                <h5 className="self-center text-4xl font-bold tracking-tight text-white font-mono" > MY ORDER HISTORY</h5>

                <div className='top_bar_basket grid grid-cols-5 flex-wrap ml-10 mr-10 p-3' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', justifyItems: 'center' }}>
                    <h3 className=' ext-4xl font-bold tracking-tight dark:text-white  text-white'>Order ID</h3>
                    <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'>Order Date</h3>
                    <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'>Order Amount</h3>
                    <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'>Status</h3>
                    <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'></h3>
                </div>
                {/*This is the card that can be used as a component nested in addressBook component */}
                <div className='grid grid-rows-3 flex-wrap m-s ml-10 mr-10'>
                    <Card className=" flex h-auto w-full bg-transparent border-white">
                        <div className='grid grid-cols-5 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',justifyItems: 'center' }}>    
                            <h2 id="order_ID" className="flex dark:text-white text-white font-mono ">28354</h2>
                            <h2 id="order_date" className="flex dark:text-white text-white font-mono ">25/02/2024</h2>
                            <h2 id="order_amount" className="flex dark:text-white text-white font-mono ">£ 25.86</h2>
                            <h2 id="order_status" className="flex dark:text-white text-white font-mono ">PENDING</h2>
                            <img class="first-line:h-6 w-6 flex-wrap" style={{ filter: 'brightness(0) invert(1)' }} src="https://www.iconbolt.com/iconsets/atlas-icons/navigation-move-movement-arrow-direction-pointer-control-next-right.svg" alt="edit address"/>
                        </div>
                    </Card>

                    <Card className=" flex h-auto w-full mt-2 bg-transparent border-white">
                        <div className='grid grid-cols-5 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',justifyItems: 'center' }}>    
                            <h2 id="order_ID" className="flex dark:text-white text-white font-mono ">98354</h2>
                            <h2 id="order_date" className="flex dark:text-white text-white font-mono ">19/03/2024</h2>
                            <h2 id="order_amount" className="flex dark:text-white text-white font-mono ">£ 75.46</h2>
                            <h2 id="order_status" className="flex dark:text-white text-white font-mono ">IN TRANSIT</h2>
                            <img class="first-line:h-6 w-6 flex-wrap" style={{ filter: 'brightness(0) invert(1)' }} src="https://www.iconbolt.com/iconsets/atlas-icons/navigation-move-movement-arrow-direction-pointer-control-next-right.svg" alt="edit address"/>
                        </div>
                    </Card>

                    <Card className=" flex h-auto w-full mt-2 bg-transparent border-white">
                        <div className='grid grid-cols-5 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',justifyItems: 'center' }}>    
                            <h2 id="order_ID" className="flex dark:text-white text-white font-mono ">25654</h2>
                            <h2 id="order_date" className="flex dark:text-white text-white font-mono ">01/02/2024</h2>
                            <h2 id="order_amount" className="flex dark:text-white text-white font-mono ">£ 58.86</h2>
                            <h2 id="order_status" className="flex dark:text-white text-white font-mono ">DELIVERED</h2>
                            <img class="first-line:h-6 w-6 flex-wrap" style={{ filter: 'brightness(0) invert(1)' }} src="https://www.iconbolt.com/iconsets/atlas-icons/navigation-move-movement-arrow-direction-pointer-control-next-right.svg" alt="edit address"/>
                        </div>
                    </Card>

                </div>  
                
        </Card>
    )
}