"use client"; 
import Image from 'next/image'
import Link from 'next/link'
import { Card, Button } from 'flowbite-react';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import React from 'react';


export default function MyReviews() {

    // Firebase information retrival function here



    return(
        <Card className=" justify-self-center h-auto w-full my-6 mr-12 bg-blue-900 border-blue-900 row-start-1 row-end-1 col-start-2 col-end-5 " >
                <h5 className="self-center text-4xl font-bold tracking-tight text-white font-mono" > MY REVIEWS HISTORY</h5>
                
        </Card>
    )
}