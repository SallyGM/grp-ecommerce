{/* Importing Link for navigation and icons */}
import Link from 'next/link';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';


export default function Header() {
    return (
        <div>
            <nav className="bg-white border-gray-200 dark:bg-gray-900">
                <div className="flex flex-wrap justify-between gap-8 columns-3 items-center mx-auto max-w-screen-xl p-4">
                    {/* Logo to be placed here :) */}
                    <a href="https://flowbite.com" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="self-center text-2xl font-semibold whitespace-nowrap text-black-500">Logo</span>
                    </a>
                    <div className="relative hidden md:block">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 dark:text-gray-400"/>                   
                            <span className="sr-only">Search icon</span>
                        </div>
                        <input type="text" id="search-navbar" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..."/>
                    </div>
                    <div className="flex items-center space-x-6 rtl:space-x-reverse">
                        <Link href="/basket" className='class="text-sm dark:text-blue-500 hover:underline"'>
                            <ShoppingCartIcon className="h-6 w-6 text-black-500" />
                        </Link>
                        <Link href="/login" className='class="text-sm text-blue-600 dark:text-blue-500 hover:underline"'>
                            Login
                        </Link>
                        <Link href="/register" className='class="text-sm text-blue-600 dark:text-blue-500 hover:underline"'>
                            Register            
                        </Link>
                        <Link href="/profile" className='class="text-sm text-blue-600 dark:text-blue-500 hover:underline"'>
                            Profile            
                        </Link>
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
                                <Link href="/products"  className='text-gray-900 dark:text-white hover:underline'>
                                    PC
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className='text-gray-900 dark:text-white hover:underline'>
                                    XBOX
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className='text-gray-900 dark:text-white hover:underline'>
                                Playstation
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
    );
  }