"use client"; 
import Image from 'next/image'
import Link from 'next/link'
import { Card, Button } from 'flowbite-react';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import React from 'react';


export default function AddressBook() {

    // Firebase information retrival function here

    return(
        <Card className=" justify-self-center h-auto w-full my-6 mr-12 bg-blue-900 border-blue-900 row-start-1 row-end-1 col-start-2 col-end-5 " >
                <h5 className="self-center text-4xl font-bold tracking-tight text-white font-mono" > MY ADDRESS BOOK</h5>
                
                <div className='top_bar_basket grid grid-cols-6 flex-wrap ml-10 mr-10 p-3' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', justifyItems: 'center' }}>
                    <h3 className=' ext-4xl font-bold tracking-tight dark:text-white  text-white'>Street Address</h3>
                    <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'>City</h3>
                    <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'>Country</h3>
                    <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'>Postal Code</h3>
                    <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'></h3>
                    <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'></h3>
                </div>
                {/*This is the card that can be used as a component nested in addressBook component */}
                <div className='grid grid-rows-3 flex-wrap m-s ml-10 mr-10'>
                    <Card className=" flex h-auto w-full bg-transparent border-white">
                        <div className='grid grid-cols-6 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',justifyItems: 'center' }}>    
                            <h2 id="street_name" className="flex dark:text-white text-white font-mono ">Gabriel street</h2>
                            <h2 id="city" className="flex dark:text-white text-white font-mono ">London</h2>
                            <h2 id="country" className="flex dark:text-white text-white font-mono ">United Kingdom</h2>
                            <h2 id="postal_code" className="flex dark:text-white text-white font-mono ">SE18 2KU</h2>
                            <img class="first-line:h-6 w-6 flex-wrap justify-self-end" style={{ filter: 'brightness(0) invert(1)' }} src="https://www.iconbolt.com/iconsets/darkwing-free/edit.svg" alt="edit address"/>
                            <img class="first-line:h-5 w-5 flex-wrap justify-self-center" style={{ filter: 'brightness(0) invert(1)' }} src="https://www.iconbolt.com/iconsets/flowbite-solid/trash-bin.svg" alt= "delete address"/>
                        </div>
                    </Card>

                    <Card className=" flex h-auto w-full mt-2 bg-transparent border-white">
                        <div className='grid grid-cols-6 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',justifyItems: 'center' }}>    
                            <h2 id="street_name" className="flex dark:text-white text-white font-mono ">Gabriel street</h2>
                            <h2 id="city" className="flex dark:text-white text-white font-mono ">London</h2>
                            <h2 id="country" className="flex dark:text-white text-white font-mono ">United Kingdom</h2>
                            <h2 id="postal_code" className="flex dark:text-white text-white font-mono ">SE18 2KU</h2>
                            <img class="first-line:h-6 w-6 flex-wrap justify-self-end" style={{ filter: 'brightness(0) invert(1)' }} src="https://www.iconbolt.com/iconsets/darkwing-free/edit.svg" alt="edit address"/>
                            <img class="first-line:h-5 w-5 flex-wrap justify-self-center" style={{ filter: 'brightness(0) invert(1)' }} src="https://www.iconbolt.com/iconsets/flowbite-solid/trash-bin.svg" alt= "delete address"/>
                        </div>
                    </Card>

                    <Card className=" flex h-auto w-full mt-2 bg-transparent border-white">
                        <div className='grid grid-cols-6 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',justifyItems: 'center' }}>    
                            <h2 id="street_name" className="flex dark:text-white text-white font-mono ">Gabriel street</h2>
                            <h2 id="city" className="flex dark:text-white text-white font-mono ">London</h2>
                            <h2 id="country" className="flex dark:text-white text-white font-mono ">United Kingdom</h2>
                            <h2 id="postal_code" className="flex dark:text-white text-white font-mono ">SE18 2KU</h2>
                            <img class="first-line:h-6 w-6 flex-wrap justify-self-end" style={{ filter: 'brightness(0) invert(1)' }} src="https://www.iconbolt.com/iconsets/darkwing-free/edit.svg" alt="edit address"/>
                            <img class="first-line:h-5 w-5 flex-wrap justify-self-center" style={{ filter: 'brightness(0) invert(1)' }} src="https://www.iconbolt.com/iconsets/flowbite-solid/trash-bin.svg" alt= "delete address"/>
                        </div>
                    </Card>

                </div>    
                <div className='flex justify-self-start mt-10 ml-10'>
                    <Button
                        type="submit"
                        className="w-60 inline-flex text-white self-center " color='blue'> 
                        ADD NEW ADDRESS
                        <svg className="w-6 h-6 ml-3" fill='currentColor' stroke='none' aria-hidden="true" xmlns="https://reactsvgicons.com/search?q=add" viewBox="0 0 24 24">
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path d="M18.364 17.364L12 23.728l-6.364-6.364a9 9 0 1112.728 0zM11 10H8v2h3v3h2v-3h3v-2h-3V7h-2v3z" />
                        </svg>
                    </Button>
                </div>
        </Card>
    )
}