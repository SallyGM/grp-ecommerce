"use client"; 
import { Card } from 'flowbite-react';
import React from 'react';
import SubNavbar from '../subNavbar.js'

export default function MyReviews() {

    // Firebase information retrival function here
    return(
        <div className='grid grid-rows-1 grid-cols-4 gap-x-20 row-start-1 row-end-2 col-start-1 col-end-3 bg-dark-night'> 
            <SubNavbar />
            <Card className=" justify-self-center h-auto w-full my-6 mr-12 bg-blue-900 border-blue-900 row-start-1 row-end-1 col-start-2 col-end-5 " >
                <h5 className="self-center text-4xl font-bold tracking-tight text-white font-mono" > MY REVIEWS HISTORY</h5>                
            </Card>
        </div>
    )
}