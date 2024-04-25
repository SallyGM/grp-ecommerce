"use client"; 
{/* Importing Link for navigation and icons */}
import Link from 'next/link';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useAuth } from './context/AuthContext'
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useBasketContext } from '../app/context/BasketContext.js'
import logo from '../../public/logo_white_magenta.png';
import Modal from '@/components/modal.js';

export default function Header() {

    const { currentUser, signout } = useAuth()

    const [error, setError] = useState(false);
    const [valid, setValid] = useState(false);
    const router = useRouter();
    const search = useRef();
    const { basketSize } = useBasketContext();
    const [sizeOfBasket, setSizeOfBasket] = useState(0)
    const [showLogoutModal, setShowLogoutModal] = useState(false); // modal to confirm logout

    // updates basket size
    useEffect(() => {
        setSizeOfBasket(basketSize)
    }, [basketSize]);

    useEffect(() => {
        // color selected navbar
        /*const currentLocation = window.location.href;
        const home = document.getElementById("home");
        const pc = document.getElementById("pc");
        const playstation = document.getElementById("playstation");
        const xbox = document.getElementById("xbox");
        const nintendo = document.getElementById("nintendo");
        const bestsellers = document.getElementById("bestsellers");
        const onSales = document.getElementById("sales");

        const allFields = [ home, pc, playstation, xbox, nintendo, bestsellers, onSales];
        const locations = ["pc", "playstation", "xbox", "nintendo", "bestsellers", "sales"]
        const excludedLocations = ["pc", "playstation", "xbox", "nintendo", "bestsellers", "sales","register", "login", "basket", "favourites", "profile"];

        if(allFields.length > 0) {
            allFields.forEach((e) => {
                const el = document.getElementById(e.id);
                if (el) {
                    if(locations.some(loc => currentLocation.includes(loc) && loc.includes(e.id)) ||
                    (!excludedLocations.some(loc => currentLocation.includes(loc)) && e.id === "home")) {
                        el.classList.add("font-extrabold", "text-light-purple", "border-light-purple");
                    } else {
                        el.classList.remove("font-extrabold", "text-light-purple", "border-light-purple");
                        if (!el.classList.contains("text-white")) {
                            el.classList.add("text-white");
                        }
                    }
                }
            })
        }*/

        

    }, [window.location.href, window.location]);

    // function that logout the user
    async function signOut(e){
        e.preventDefault()

        try{
            await signout()
            setShowLogoutModal(false);   
            router.push('/login'); 
            setError(false)
            
        } catch(e){
            setError(true)
            console.log(e)
        }
    }

    // opens the Logout Modal
    function openLogoutModal () {
        setShowLogoutModal(true)
    }

    function handleSubmit(e){
        if(valid){
            router.push(`/product?search=${search.current.value.toString().toLowerCase()}&type=search`);
        }
    }

    function handleChange(e){
        if(search.current.value.toString().length > 0){
            setValid(true);
        }
        else{
            setValid(false)
        }
    }

    return (
        <header className='sticky top-0 z-50'>
        <div>
            <nav className="border-gray-200 bg-dark-night">
                <div className="flex flex-wrap justify-between gap-8 columns-3 items-center mx-auto max-w-screen-xl p-4">
                    {/* Logo to be placed here :) */}
                    <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse transition ease-in-out hover:animate-pulse hover:scale-110">
                        <img className='w-16 h-14 self-center' src={logo.src}/> 
                        <span className='text-white bebas-neue-medium md:bebas-neue-regular'>GAME</span>
                        <span className='text-purple font-semibold bebas-neue-medium md:bebas-neue-regular'>BUSTERS</span>
                    </Link>
                    
                    { valid ? (
                        <div className="relative hidden md:block">
                            <button onClick={handleSubmit} className="absolute inset-y-0 end-0 flex items-center pe-3">
                                <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 hover:scale-110"/>                   
                                <span className="sr-only">Search icon</span>
                            </button>
                            <input type="text" onChange={handleChange} ref={search} className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search..."/>
                        </div>
                    ) : (
                        <div className="relative hidden md:block">
                            <button onClick={handleSubmit} className="absolute inset-y-0 end-0 flex items-center pe-3 cursor-not-allowed">
                                <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 hover:scale-110"/>                   
                                <span className="sr-only">Search icon</span>
                            </button>
                            <input type="text" onChange={handleChange} ref={search} className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search..."/>                      
                        </div>
                    )}

                    <div className="flex items-center space-x-6 rtl:space-x-reverse">
                        <Link href="/basket" className="relative text-sm hover:underline">
                            <ShoppingCartIcon className="w-6 h-6 text-white hover:scale-110 hover:text-slate-200" />
                            <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-1 border-white rounded-full -top-4 -right-4 dark:border-gray-900">
                                {sizeOfBasket}
                            </div>
                        </Link>
                        { currentUser != null ? (
                            <>
                                <Link href="/favourites" className="hover:underline cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white hover:scale-110 hover:text-slate-200">
                                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                    </svg>
                                </Link>
                                <Link href="/profile" className="hover:underline cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white hover:scale-110 hover:text-slate-200">
                                        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                                    </svg>
                                </Link>
                                <svg onClick={openLogoutModal} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white cursor-pointer rotate-180 hover:scale-110 hover:text-slate-200">
                                    <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm text-white hover:underline">
                                    Login
                                </Link>
                                <Link href="/register" className="text-sm text-white hover:underline">
                                    Register
                                </Link>
                            </>                   
                        )}
                </div>
                </div>
            </nav>
            <nav className="bg-elite-blue">
                <div className="max-w-screen-xl mx-auto">
                    <div className="flex justify-center items-center">
                        <ul className="flex flex-row space-x-8 rtl:space-x-reverse text-sm overflow-x-scroll no-scrollbar" >
                            <li id="home" className='py-3 px-4 text-base text-white transition border-b-4 border-elite-blue border-b-4 border-elite-blue hover:border-light-purple hover:font-extrabold hover:text-light-purple'>
                                <Link href="/">
                                    HOME
                                </Link>                     
                            </li>
                            <li id="pc" className='py-3 px-4 text-base text-white transition border-b-4 border-elite-blue hover:border-light-purple hover:font-extrabold hover:text-light-purple'>
                                <Link href={{ pathname: '/product', query: {search: "pc", type: "console"} }}>
                                    PC
                                </Link>
                            </li>
                            <li id="xbox" className='py-3 px-4 text-base text-white transition border-b-4 border-elite-blue hover:border-light-purple hover:font-extrabold hover:text-light-purple'>
                                <Link href={{ pathname: '/product', query: {search: "xbox", type: "console"} }}>
                                    XBOX
                                </Link>
                            </li>
                            <li id="playstation" className='py-3 px-4 text-base text-white transition border-b-4 border-elite-blue hover:border-light-purple hover:font-extrabold hover:text-light-purple'>
                                <Link href={{ pathname: '/product', query: {search: "playstation", type: "console"} }}>
                                PLAYSTATION
                                </Link>
                            </li>
                            <li id="nintendo" className='py-3 px-4 text-base text-white transition border-b-4 border-elite-blue hover:border-light-purple hover:font-extrabold hover:text-light-purple'>
                                <Link href={{ pathname: '/product', query: {search: "nintendo", type: "console"} }}>
                                NINTENDO
                                </Link>
                            </li>
                            <li id="bestsellers" className='py-3 px-4 text-base text-white transition border-b-4 border-elite-blue hover:border-light-purple hover:font-extrabold hover:text-light-purple'>
                                <Link href={{ pathname: '/product', query: {search: "", type: "bestsellers"} }}>
                                    BEST SELLERS
                                </Link>
                            </li>
                            <li id="sales" className='py-3 px-4 text-base text-white transition border-b-4 border-elite-blue hover:border-light-purple hover:font-extrabold hover:text-light-purple'>
                                <Link href={{ pathname: '/product', query: {search: "", type: "sales"} }}> 
                                    SALES
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div> 

        {/*logout modal */}          
        <Modal isVisible={showLogoutModal} onClose ={()=> setShowLogoutModal(false)}>
            <h3 className='text-xl flex self-center font-semibold text-white mb-5'>LOG OUT</h3>
            <h3 className='flex self-center font-semibold text-white  mb-5'>Are you sure you want to logout?</h3>
            <div className='flex justify-evenly mt-10 mb-10'>
                <button type="submit" className="dismiss-btn text-white rounded-lg text-m px-5 py-2.5 text-center roboto-light" onClick ={()=>setShowLogoutModal(false)}>NO</button>
                <button type="submit" className="confirm-btn text-white rounded-lg text-m px-5 py-2.5 text-center roboto-light" onClick={signOut}>YES</button>
            </div>
        </Modal>
    </header>
    );
    }