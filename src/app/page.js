'use client'
import {  Card, Button, Carousel } from 'flowbite-react';
import {database} from './firebaseConfig.js'
import { ref, get } from "firebase/database";
import { useEffect, useState } from 'react';
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from 'next/link'; // Import Link from Next.js


export default function Home() {

  // variable that will hold all products 
  const [product, setProducts] = useState([]);

  // settings for the slider
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

  // retrieves the product table
  useEffect(() => {
    const prodRef = ref(database, "Product");
    get(prodRef).then((snapshot) => {
      if(snapshot.exists()){
        const prodArray = Object.entries(snapshot.val()).map(([id, data]) => ({
          id, 
          ...data,
        }));
        setProducts(prodArray);
      } else{
        console.log("No data found");
      }
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  return (
    <div  className='bg-dark-night'>
      {/*Insert costumised banner over here*/}
      <Carousel slide={true} className="h-56 sm:h-64 xl:h-80 2xl:h-96">
        <img src="https://flowbite.com/docs/images/carousel/carousel-1.svg" alt="..." />
        <img src="https://flowbite.com/docs/images/carousel/carousel-2.svg" alt="..." />
        <img src="https://flowbite.com/docs/images/carousel/carousel-3.svg" alt="..." />
        <img src="https://flowbite.com/docs/images/carousel/carousel-4.svg" alt="..." />
        <img src="https://flowbite.com/docs/images/carousel/carousel-5.svg" alt="..." />
      </Carousel>

      <div className='grid grid-rows-1 grid-cols-5'> 
        <h5 className="text-2xl text-white text-center ml-3 mr-0 my-3 font-bold tracking-tight text-gray-900 dark:text-white">
          Check our best sellers
        </h5>
        <hr className="h-px col-span-4 mr-1 my-8 bg-slate-500 border-0 dark:bg-gray-700"/>
      </div>

      <Slider className='my-3 mx-10' {...settings}>
          {product.sort((a, b) =>  a.sold < b.sold ? 1 : -1).slice(0, 7).map((p) => (
            <Card key={p.id} className="mx-3 my-3" renderImage={() => 
            <img className="w-full h-full object-cover rounded-lg" src={p.images[1]} alt="image 1" priority />}>
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {p.name}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                £{p.price}
              </p>
              <Link href={`/products/${p.id}`}>
                
                  <Button color="gray">View product</Button>
                
              </Link>
                <Button color="gray">
                  Add to Cart
                  <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M5 3a1 1 0 0 0 0 2h.7l2.1 10.2a3 3 0 1 0 4 1.8h2.4a3 3 0 1 0 2.8-2H9.8l-.2-1h8.2a1 1 0 0 0 1-.8l1.2-6A1 1 0 0 0 19 6h-2.3c.2.3.3.6.3 1a2 2 0 0 1-2 2 2 2 0 1 1-4 0 2 2 0 0 1-1.7-3H7.9l-.4-2.2a1 1 0 0 0-1-.8H5Z" clipRule="evenodd"/>
                    <path fillRule="evenodd" d="M14 5a1 1 0 1 0-2 0v1h-1a1 1 0 1 0 0 2h1v1a1 1 0 1 0 2 0V8h1a1 1 0 1 0 0-2h-1V5Z" clipRule="evenodd"/>
                  </svg>
                </Button>
              </Card>
            ))}
      </Slider>
    
      <div className="container my-3 py-10 px-10 mx-0 min-w-full flex flex-col items-center">
        <div className="basis-1/4"></div>
        <div className="basis-1/2">
          <Button>
            See more
          </Button>
        </div>
        <div className="basis-1/4"></div>
      </div>
      <br/>
    </div>
  );
}