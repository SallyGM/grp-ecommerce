'use client'
import { Card, Button, Carousel } from 'flowbite-react';
import { useEffect, useState } from 'react';
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from 'next/navigation';
import { useBasketContext } from '../app/context/BasketContext.js'
import { useProductContext } from './context/ProductContext.js';
import toast from 'react-hot-toast';
import { useFavouriteContext } from './context/FavouriteContext.js';
import { useAuth } from './context/AuthContext.js';

export default function Home() {

  // variable that will hold all products 
  const { currentUser } = useAuth()
  const [product, setProduct] = useState([]);
  const router = useRouter();
  const { addToBasket } = useBasketContext();
  const { loading, products, getBestSellers } = useProductContext()
  const { favourites, addToFavourites, removeFromFavourites } = useFavouriteContext();
  const [ favourite, setFavourite] = useState([]);

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
    let result = getBestSellers()
    setProduct(result)
  }, [products]);

  useEffect(() => {
    //let result = getFavourites()
    setFavourite(favourites)
  }, [favourites]);

  function handleClickOnFavourite(productID, e){
    // add to the list if the item is not there
    if(!favourite.some(item => item.id === productID)){
      addToFavourites(productID)
    } else {
      removeFromFavourites(productID)
    }
  }

  function handleClickOpenProduct(productID, e) {
    router.push(`/products/${productID}`);
  }

  function handleClickAddToCart(productID, amount, e){
    addToBasket(productID, amount);
    toast.success('Product added to basket!');
  }

  function handleClickChangeQuantity(p, op){
    let prod = [...product]
    let i = prod.indexOf(p)

    if(op == "+" && prod[i].amount <= 10){
      prod[i].amount += 1
    } else {
      if(prod[i].amount != 0){
        prod[i].amount -= 1
      }
    }
    
    setProduct(prod)
  }

  return (
    <div className='back-prod'>
      {/*Insert costumised banner over here*/}
      <Carousel slide={true} className="h-56 sm:h-64 xl:h-80 2xl:h-96">
        <img src="https://firebasestorage.googleapis.com/v0/b/buster-games-356c2.appspot.com/o/Banner%2Fapex_legends_banner.jpg?alt=media&token=29b19f5f-5f95-4491-ba60-bae96c55ed2d" alt="..." />
        <img src="https://firebasestorage.googleapis.com/v0/b/buster-games-356c2.appspot.com/o/Banner%2Fskyrim_banner.png?alt=media&token=b784b4ad-ab9f-46eb-9e67-102955178540" alt="..." />
        <img src="https://firebasestorage.googleapis.com/v0/b/buster-games-356c2.appspot.com/o/Banner%2Fbalders_gate_banner.png?alt=media&token=93280034-98c5-41b6-bcdf-e3a72b3dffa0" alt="..." />
        <img src="https://firebasestorage.googleapis.com/v0/b/buster-games-356c2.appspot.com/o/Big%2FGTA%20V.png?alt=media&token=97623a2d-b4b9-448a-8753-bbe0509aaad3" alt="..." />
        <img src="https://firebasestorage.googleapis.com/v0/b/buster-games-356c2.appspot.com/o/Banner%2Fzelda_tears_of_the_kingdom.jpg?alt=media&token=42cd1386-b6ef-4e7f-9831-536b30d56190" alt="..." />
      </Carousel>

      <div className='grid grid-rows-1 grid-cols-5'>
        <h5 className="text-2xl text-white text-center ml-3 mr-0 my-3 font-bold tracking-tight text-gray-900 dark:text-white">
          Check our best sellers
        </h5>
        <hr className="h-px col-span-4 mr-1 my-8 bg-slate-500 border-0 dark:bg-gray-700" />
      </div>

      {loading ? (
        <div role="text-center status">
          <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <Slider className='my-3 mx-10' {...settings} >
          {product.slice(0, 7).map((p) => (
            <Card key={p.id}  className="mx-3 my-3" renderImage={() =>
              <img className="w-full h-full object-cover rounded-lg cursor-pointer" onClick={(e) => handleClickOpenProduct(p.id, e)} src={p.images[1]} alt="image 1" />}>
              {currentUser  ? (
                (favourite.some(item => item.id === p.id) ? (
                  <svg xmlns="http://www.w3.org/2000/svg" onClick={(e) => handleClickOnFavourite(p.id, e)} viewBox="0 0 24 24" fill="red" className="absolute cursor-pointer -ml-3 top-5 w-6 h-6">
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" onClick={(e) => handleClickOnFavourite(p.id, e)} fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute cursor-pointer -ml-3 top-5 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                ))
              ) : (
                <></>
              )}
              
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {p.name}
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                £{(p.discount > 0 ? parseFloat(p.price - p.price * p.discount).toFixed(2): p.price)}
              </p>

              <Button.Group className='items-center'>
                <Button color="gray" onClick={(e) => handleClickChangeQuantity(p,"-", e)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                  </svg>
                </Button>
                <Button color="gray" className='cursor-auto hover:bg-slate-50'>
                  {p.amount}
                </Button>
                <Button color="gray" onClick={(e) => handleClickChangeQuantity(p,"+", e)} >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </Button>
              </Button.Group>

              <Button color="gray" onClick={(e) => handleClickOpenProduct(p.id, e)}>View product</Button>
              
              <Button color="gray" onClick={(e) => handleClickAddToCart(p.id, p.amount, e)}>
                Add to Cart
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M5 3a1 1 0 0 0 0 2h.7l2.1 10.2a3 3 0 1 0 4 1.8h2.4a3 3 0 1 0 2.8-2H9.8l-.2-1h8.2a1 1 0 0 0 1-.8l1.2-6A1 1 0 0 0 19 6h-2.3c.2.3.3.6.3 1a2 2 0 0 1-2 2 2 2 0 1 1-4 0 2 2 0 0 1-1.7-3H7.9l-.4-2.2a1 1 0 0 0-1-.8H5Z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M14 5a1 1 0 1 0-2 0v1h-1a1 1 0 1 0 0 2h1v1a1 1 0 1 0 2 0V8h1a1 1 0 1 0 0-2h-1V5Z" clipRule="evenodd" />
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
      <br />
    </div>
  );
}