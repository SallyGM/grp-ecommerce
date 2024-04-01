'use client'
import {  Card, Button, Carousel } from 'flowbite-react';
import { database } from './firebaseConfig.js'
import { ref, get } from "firebase/database";
import { useEffect, useState } from 'react';
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from 'next/link'; // Import Link from Next.js
import { useRouter } from 'next/navigation';

export default function Home() {

  // variable that will hold all products 
  const [product, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();



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
        setLoading(false);
      } else{
        console.log("No data found");
      }
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  function handleClickOpenProduct(productID, e){
    router.push(`/products/${productID}`);
  }

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

      {loading ? (
          <div role="text-center status">
            <svg aria-hidden="true" class="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
      ) : (
        <Slider className='my-3 mx-10' {...settings}>
          {product.sort((a, b) => a.sold < b.sold ? 1 : -1).slice(0, 7).map((p) => (
            <Card key={p.id} className="mx-3 my-3" renderImage={() => 
            <img className="w-full h-full object-cover rounded-lg" src={p.images[1]} alt="image 1" />}>
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {p.name}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                £{p.price}
              </p>

              <Button color="gray" onClick={(e) => handleClickOpenProduct(p.id, e)}>View product</Button>
              
              <Button color="gray" >
                Add to Cart
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M5 3a1 1 0 0 0 0 2h.7l2.1 10.2a3 3 0 1 0 4 1.8h2.4a3 3 0 1 0 2.8-2H9.8l-.2-1h8.2a1 1 0 0 0 1-.8l1.2-6A1 1 0 0 0 19 6h-2.3c.2.3.3.6.3 1a2 2 0 0 1-2 2 2 2 0 1 1-4 0 2 2 0 0 1-1.7-3H7.9l-.4-2.2a1 1 0 0 0-1-.8H5Z" clipRule="evenodd"/>
                  <path fillRule="evenodd" d="M14 5a1 1 0 1 0-2 0v1h-1a1 1 0 1 0 0 2h1v1a1 1 0 1 0 2 0V8h1a1 1 0 1 0 0-2h-1V5Z" clipRule="evenodd"/>
                </svg>
              </Button>
            </Card>
          ))}
        </Slider>
      )}
    
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