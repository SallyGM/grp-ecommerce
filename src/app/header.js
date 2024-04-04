"use client"; 
{/* Importing Link for navigation and icons */}
import Link from 'next/link';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useAuth } from './context/AuthContext'
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { useBasketContext } from '../app/context/BasketContext.js'
import { user } from '@nextui-org/react';

export default function Header() {

    const { currentUser, signout } = useAuth()

    const [error, setError] = useState(false);
    const [valid, setValid] = useState(false);
    const router = useRouter();
    const search = useRef();
    const { userBasket } = useBasketContext();
    const [basketSize, setBasketSize] = useState(0)

    // updates basket size
    useEffect(() => {
        let total = 0; 

        if(Object.keys(userBasket).length > 0){

            Object.keys(userBasket).map((key) => ( 
                total += userBasket[key].quantity
              ));
    
            setBasketSize(total)
        }
        
      }, [userBasket]);

    // function that logout the user
    async function signOut(e){

        try{
            await signout()    
            setError(false)
        } catch(e){
            setError(true)
            console.log(e)
        }

        if(!error){ // if signout is successful it goes back to the login page
            e.preventDefault()
            router.push('/login'); // Navigate to the main page
        }   
    }

    function handleSubmit(e){
    
        if(valid){
            router.push(`/products?search=${search.current.value.toString().toLowerCase()}&type=search`);
        }
    }

    function handleChange(e){

        //TODO ADD A REDIRECT TO THE SEARCH PAGE
        if(search.current.value.toString().length > 0){
            setValid(true);
        }
        else{
            setValid(false)
        }
    }

    return (
        <motion.div>
        <div>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="flex flex-wrap justify-between gap-8 columns-3 items-center mx-auto max-w-screen-xl p-4">
                    {/* Logo to be placed here :) */}
                    <a href="https://flowbite.com" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="self-center text-2xl font-semibold whitespace-nowrap text-black-500">Logo</span>
                    </a>
                    { valid ? (
                        <div className="relative hidden md:block">
                            <button onClick={handleSubmit} className="absolute inset-y-0 end-0 flex items-center pe-3">
                                <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 dark:text-gray-800"/>                   
                                <span className="sr-only">Search icon</span>
                            </button>
                            <input type="text" onChange={handleChange} ref={search} className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..."/>
                        </div>
                    ) : (
                        <div className="relative hidden md:block">
                            <button onClick={handleSubmit} className="absolute inset-y-0 end-0 flex items-center pe-3 cursor-not-allowed">
                                <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 dark:text-gray-800"/>                   
                                <span className="sr-only">Search icon</span>
                            </button>
                            <input type="text" onChange={handleChange} ref={search} className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..."/>                      
                        </div>
                    )}

                    <div className="flex items-center space-x-6 rtl:space-x-reverse">
                        <Link href="/basket" className="relative text-sm dark:text-blue-500 hover:underline">
                            <ShoppingCartIcon className="h-6 w-6 text-black-500" />
                            <div class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-4 -right-4 dark:border-gray-900">
                                {basketSize}
                            </div>
                        </Link>
                        { currentUser != null ? (
                            <>
                                <Link href="/profile" className="text-sm text-blue-600 dark:text-blue-500 hover:underline">
                                    Profile
                                </Link>
                                <button onClick={signOut} className="bg-transparent text-sm text-blue-600 dark:text-blue-500 hover:underline">
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm text-blue-600 dark:text-blue-500 hover:underline">
                                        Login
                                </Link>
                                <Link href="/register1" className="text-sm text-blue-600 dark:text-blue-500 hover:underline">
                                        Register
                                 </Link>
                            </>                   
                        )}
                </div>
                </div>
            </nav>
            <nav className="bg-gray-50 dark:bg-gray-700">
                <div className="max-w-screen-xl px-4 py-3 mx-auto">
                    <div className="flex justify-center items-center">
                        <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
                            <li>
                                <Link href="/" className='text-gray-900 dark:text-white hover:underline'>
                                    Home
                                </Link>                     
                            </li>
                            <li>
                                <Link href={{ pathname: '/products', query: {search: "pc", type: "console"} }} className='text-gray-900 dark:text-white hover:underline'>
                                    PC
                                </Link>
                            </li>
                            <li>
                                <Link href={{ pathname: '/products', query: {search: "xbox", type: "console"} }} className='text-gray-900 dark:text-white hover:underline'>
                                    XBOX
                                </Link>
                            </li>
                            <li>
                                <Link href={{ pathname: '/products', query: {search: "playstation", type: "console"} }} className='text-gray-900 dark:text-white hover:underline'>
                                Playstation
                                </Link>
                            </li>
                            <li>
                                <Link href={{ pathname: '/products', query: {search: "nintendo", type: "console"} }} className='text-gray-900 dark:text-white hover:underline'>
                                Nintendo
                                </Link>
                            </li>
                            <li>
                                <Link href="/products/bestsellers" className='text-gray-900 dark:text-white hover:underline'>
                                    Best Sellers
                                </Link>
                            </li>
                            <li>
                                <Link href="/products/sales" className='text-gray-900 dark:text-white hover:underline'> 
                                    SALES
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div> 
    </motion.div>
    );
  }