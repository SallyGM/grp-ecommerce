'use client'
import { Card, Button, Carousel, Tooltip } from 'flowbite-react';
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
import { ArrowRightCircleIcon } from '@heroicons/react/24/solid';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/solid';

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style, display: "block"}} onClick={onClick}>
      <ArrowRightCircleIcon className="h-9 w-9 text-slate-200 hover:text-slate-50"/>
    </div>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style, display: "block"}} onClick={onClick}>
      <ArrowLeftCircleIcon className="h-9 w-9 text-slate-200 hover:text-slate-50"/>
    </div>
  );
}

export default function Home() {

  // variable that will hold all products 
  const { currentUser } = useAuth()
  const [bestsellers, setBestSellers] = useState([]);
  const [onSale, setOnSale] = useState([]);
  const router = useRouter();
  const { addToBasket } = useBasketContext();
  const { loading, products, getBestSellers, getProductsOnSale } = useProductContext()
  const { favourites, addToFavourites, removeFromFavourites } = useFavouriteContext();
  const [ favourite, setFavourite] = useState([]);

  // settings for the slider
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1008,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      }, {
        breakpoint: 330,
        settings: 'unslick'
      },
    ],
  };

  // retrieves the product table
  useEffect(() => {
    let bs = getBestSellers()
    let s = getProductsOnSale();
    setBestSellers(bs);
    setOnSale(s);

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

  function handleSeeMoreBS(e) {
    router.push(`/product?search=&type=bestsellers`);
  }

  function handleSeeMoreS(e) {
    router.push(`/product?search=&type=sale`);
  }
  

  function handleClickAddToCart(productID, amount, e){
    if(amount > 0){
      addToBasket(productID, amount);
      toast.success('Product added to basket!');
    }
  }

  function handleClickChangeQuantity(p, op){
    let prod = [...bestsellers]
    let i = prod.indexOf(p)

    if(op == "+" && prod[i].amount <= 10){
      prod[i].amount += 1
    } else {
      if(prod[i].amount != 0){
        prod[i].amount -= 1
      }
    }
    
    setBestSellers(prod)
  }

  function handleClickChangeQuantityOnSales(p, op){
    let prod = [...onSale]
    let i = prod.indexOf(p)

    if(op == "+" && prod[i].amount <= 10){
      prod[i].amount += 1
    } else {
      if(prod[i].amount != 0){
        prod[i].amount -= 1
      }
    }
    
    setOnSale(prod)
  }


  return (
    <div className='bg-blue-gradient'>
      {/*Insert costumised banner over here*/}
      <Carousel slide={true} className="overflow-hidden rounded-none" style={{height: "31rem"}}>
        <img className='h-auto max-w-full rounded-none' src="https://firebasestorage.googleapis.com/v0/b/buster-games-356c2.appspot.com/o/Banner%2Fcyberpunk_2077_banner.png?alt=media&token=59d5478f-1c47-499c-aab0-6043d7251acc" alt="..." />
        <img className='h-auto max-w-full rounded-none' src="https://firebasestorage.googleapis.com/v0/b/buster-games-356c2.appspot.com/o/Banner%2Fspider_man2_banner.png?alt=media&token=2d7de8eb-0cc4-4148-9dc7-9097a31e5504" alt="..." />
        <img className='h-auto max-w-full rounded-none' src="https://firebasestorage.googleapis.com/v0/b/buster-games-356c2.appspot.com/o/Banner%2Fzelda_breath_of_the_wild_banner.png?alt=media&token=034daaf1-e967-4c85-815f-50f7641248dc" alt="..." />
        <img className='h-auto max-w-full rounded-none' src="https://firebasestorage.googleapis.com/v0/b/buster-games-356c2.appspot.com/o/Banner%2Fbattlefield_2042_banner.png?alt=media&token=8211c0ca-2330-4c31-bbbc-8fe45c4ecc00" alt="..." />
        <img className='h-auto max-w-full rounded-none' src="https://firebasestorage.googleapis.com/v0/b/buster-games-356c2.appspot.com/o/Banner%2Fvalorant_banner3.png?alt=media&token=c516e255-f7fd-4ff8-a91e-245393a1bac5" alt="..." />
        <img className='h-auto max-w-full rounded-none' src="https://firebasestorage.googleapis.com/v0/b/buster-games-356c2.appspot.com/o/Banner%2Fapex_legends_banner.png?alt=media&token=3fe53db3-e4f0-4fe5-972d-43f0f4ab0ef2" alt="..." />
      </Carousel>

      {onSale ? (
        <>
        <div className='grid grid-rows-1 grid-cols-5 mt-5'>
          <h5 className="text-2xl text-white text-center ml-3 mr-0 my-3 font-bold tracking-tight">
            SALES
          </h5>
          <hr className="h-px col-span-4 mr-1 my-8 border-0 bg-gray-700" />
        </div>

        {loading ? (
          <div role="text-center status">
            <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <div className=''>
            <Slider className='ml-10 mr-10 my-10 self-center' {...settings} >
            {onSale.slice(0, 7).map((p) => (
              <Card key={p.id} className="relative max-w-sm mx-3 mb-3 mt-7 w-72 bg-dark-night border-2 border-dark-night hover:shadow-card text-white transition hover:scale-110" renderImage={() =>
                <img className="w-full h-40 object-cover rounded-lg cursor-pointer" onClick={(e) => handleClickOpenProduct(p.id, e)} src={p.images[1]} alt="image 1" />}>
                {currentUser  ? (
                  (favourite.some(item => item.id === p.id) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={(e) => handleClickOnFavourite(p.id, e)} viewBox="0 0 24 24" fill="red" className="absolute cursor-pointer -ml-3 top-4 w-7 h-7 hover:scale-125">
                      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={(e) => handleClickOnFavourite(p.id, e)} fill="#f7f7f7" viewBox="0 0 24 24" className="absolute cursor-pointer -ml-3 top-4 w-7 h-7 hover:scale-125">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  ))
                ) : (
                  <></>
                )}
              
                <Tooltip content={p.name}>
                  <h5 className="text-2xl font-semibold h-20 tracking-tight line-clamp-2 text-white">
                    {p.name}
                  </h5>
                </Tooltip>

                <p className="font-normal text-white">
                  £{(p.price - (p.price * p.discount)).toFixed(2)}
                  {p.discount > 0 ? (
                    <span className='ml-2 text-red-500 line-through'>£{p.price.toFixed(2)}</span>
                  ) :  (
                    <></>
                  )}
                </p>

                {/* QUANTITY PRODUCT BUTTONS */}
                <div className='flex grid grid-rows-1 grid-cols-3 justify-content-center'>
                  <button className='h-12 w-12 mx-auto my-auto bg-elite-blue rounded-full text-white text-2xl hover:shadow-card hover:scale-110 hover:text-light-purple' 
                  onClick={(e) => handleClickChangeQuantityOnSales(p, "-", e)}>
                    -
                  </button>
                  <button className='h-12 w-12 mx-auto my-auto bg-transparent text-light-purple text-2xl hover:scale-110 hover:text-purple'>
                    {p.amount}
                  </button>
                  <button className='h-12 w-12 mx-auto my-auto bg-elite-blue rounded-full text-white text-2xl hover:shadow-card hover:scale-110 hover:text-light-purple'
                  onClick={(e) => handleClickChangeQuantityOnSales(p,"+", e)}>
                    +
                  </button>
                </div>

                <button className="p-3 rounded-lg bg-elite-blue text-white hover:text-light-purple hover:shadow-card" onClick={(e) => handleClickOpenProduct(p.id, e)}>View product</button>
                
                {p.quantity == 0 ? (
                  <button disabled className="flex w-full bg-slate-600 rounded-lg text-white p-3 m-2 rounded-lg text-center justify-center self-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"className="w-6 h-6 me-3 text-white" >
                      <path fillRule="evenodd" d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM6 8c.552 0 1-.672 1-1.5S6.552 5 6 5s-1 .672-1 1.5S5.448 8 6 8Zm5-1.5c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5Zm-6.005 5.805a.75.75 0 0 0 1.06 0 2.75 2.75 0 0 1 3.89 0 .75.75 0 0 0 1.06-1.06 4.25 4.25 0 0 0-6.01 0 .75.75 0 0 0 0 1.06Z" clipRule="evenodd" />
                    </svg>
                    Out of stock
                    </button>
                  ): (
                  <button onClick={(e) => handleClickAddToCart(p.id, p.amount, e)} className="flex w-full bg-elite-blue rounded-lg text-white p-3 m-2 rounded-lg text-center justify-center self-center hover:text-light-purple hover:shadow-card">
                    <svg className="w-6 h-6 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M5 3a1 1 0 0 0 0 2h.7l2.1 10.2a3 3 0 1 0 4 1.8h2.4a3 3 0 1 0 2.8-2H9.8l-.2-1h8.2a1 1 0 0 0 1-.8l1.2-6A1 1 0 0 0 19 6h-2.3c.2.3.3.6.3 1a2 2 0 0 1-2 2 2 2 0 1 1-4 0 2 2 0 0 1-1.7-3H7.9l-.4-2.2a1 1 0 0 0-1-.8H5Z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M14 5a1 1 0 1 0-2 0v1h-1a1 1 0 1 0 0 2h1v1a1 1 0 1 0 2 0V8h1a1 1 0 1 0 0-2h-1V5Z" clipRule="evenodd" />
                    </svg>
                    Add to Cart
                  </button>
                )}

              </Card>
            ))}
            </Slider>
          </div>
        )}
      </>
      ) : (
        <></>
      )}

      <div className="container mt-3 py-10 px-10 mx-0 min-w-full flex flex-col items-center">
        <div className="basis-1/4"></div>
        <div className="basis-1/2">
          <button className='prod_btn p-5 my-3 mx-3 rounded-lg' onClick={(e) => handleSeeMoreS(e)}>
            See more
          </button>
        </div>
        <div className="basis-1/4"></div>
      </div>

      {/* BEST SALES */}
      <div className='grid grid-rows-1 grid-cols-5 mt-1'>
        <h5 className="text-2xl text-white text-center ml-3 mr-0 my-3 font-bold tracking-tight">
          BEST SELLERS
        </h5>
        <hr className="h-px col-span-4 mr-1 my-8 border-0 bg-gray-700" />
      </div>

      {loading ? (
        <div role="text-center status">
          <svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <div className='px-5'>
          <Slider className='my-5 pl-3 ml-10 mr-10 self-center' {...settings} >
          {bestsellers.slice(0, 7).map((p) => (
            <Card key={p.id} className="relative max-w-sm mx-3 mb-3 mt-7 w-72 bg-dark-night border-2 border-dark-night hover:shadow-card text-white transition hover:scale-110" renderImage={() =>
              <img className="w-full h-40 object-cover rounded-lg cursor-pointer" onClick={(e) => handleClickOpenProduct(p.id, e)} src={p.images[1]} alt="image 1" />}>
              {currentUser  ? (
                (favourite.some(item => item.id === p.id) ? (
                  <svg xmlns="http://www.w3.org/2000/svg" onClick={(e) => handleClickOnFavourite(p.id, e)} viewBox="0 0 24 24" fill="red" className="absolute cursor-pointer -ml-3 top-4 w-7 h-7 hover:scale-125">
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" onClick={(e) => handleClickOnFavourite(p.id, e)} fill="#f7f7f7" viewBox="0 0 24 24" className="absolute cursor-pointer -ml-3 top-4 w-7 h-7 hover:scale-125">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                ))
              ) : (
                <></>
              )}
             
              <Tooltip content={p.name}>
                <h5 className="text-2xl font-semibold tracking-tight line-clamp-2 text-white">
                  {p.name}
                </h5>
              </Tooltip>
            
              <p className="font-normal text-white">
                £{(p.price - (p.price * p.discount)).toFixed(2)}
                {p.discount > 0 ? (
                  <span className='ml-2 text-red-500 line-through'>£{p.price.toFixed(2)}</span>
                ) :  (
                  <></>
                )}
              </p>

              {/* QUANTITY PRODUCT BUTTONS */}
              <div className='flex grid grid-rows-1 grid-cols-3 justify-content-center'>
                  <button className='h-12 w-12 mx-auto my-auto bg-elite-blue rounded-full text-white text-2xl hover:shadow-card hover:scale-110 hover:text-light-purple' 
                  onClick={(e) => handleClickChangeQuantity(p, "-", e)}>
                    -
                  </button>
                  <button className='h-12 w-12 mx-auto my-auto bg-transparent text-light-purple text-2xl hover:scale-110 hover:text-purple'>
                    {p.amount}
                  </button>
                  <button className='h-12 w-12 mx-auto my-auto bg-elite-blue rounded-full text-white text-2xl hover:shadow-card hover:scale-110 hover:text-light-purple'
                  onClick={(e) => handleClickChangeQuantity(p,"+", e)}>
                    +
                  </button>
                </div>

               <button className="p-3 rounded-lg bg-elite-blue text-white hover:text-light-purple hover:shadow-card" onClick={(e) => handleClickOpenProduct(p.id, e)}>View product</button>
                
                {p.quantity == 0 ? (
                  <button disabled className="flex w-full bg-slate-600 rounded-lg text-white p-3 m-2 rounded-lg text-center justify-center self-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"className="w-6 h-6 me-3 text-white" >
                      <path fillRule="evenodd" d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM6 8c.552 0 1-.672 1-1.5S6.552 5 6 5s-1 .672-1 1.5S5.448 8 6 8Zm5-1.5c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5Zm-6.005 5.805a.75.75 0 0 0 1.06 0 2.75 2.75 0 0 1 3.89 0 .75.75 0 0 0 1.06-1.06 4.25 4.25 0 0 0-6.01 0 .75.75 0 0 0 0 1.06Z" clipRule="evenodd" />
                    </svg>
                    Out of stock
                    </button>
                  ): (
                  <button onClick={(e) => handleClickAddToCart(p.id, p.amount, e)} className="flex w-full bg-elite-blue rounded-lg text-white p-3 m-2 rounded-lg text-center justify-center self-center hover:text-light-purple hover:shadow-card">
                    <svg className="w-6 h-6 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M5 3a1 1 0 0 0 0 2h.7l2.1 10.2a3 3 0 1 0 4 1.8h2.4a3 3 0 1 0 2.8-2H9.8l-.2-1h8.2a1 1 0 0 0 1-.8l1.2-6A1 1 0 0 0 19 6h-2.3c.2.3.3.6.3 1a2 2 0 0 1-2 2 2 2 0 1 1-4 0 2 2 0 0 1-1.7-3H7.9l-.4-2.2a1 1 0 0 0-1-.8H5Z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M14 5a1 1 0 1 0-2 0v1h-1a1 1 0 1 0 0 2h1v1a1 1 0 1 0 2 0V8h1a1 1 0 1 0 0-2h-1V5Z" clipRule="evenodd" />
                    </svg>
                    Add to Cart
                  </button>
                )}
            </Card>
          ))}
          </Slider>
        </div>
      )}

      <div className="container my-3 py-10 px-10 mx-0 min-w-full flex flex-col items-center">
        <div className="basis-1/4"></div>
        <div className="basis-1/2">
          <button className='prod_btn p-5 my-3 mx-3 rounded-lg' onClick={(e) => handleSeeMoreBS(e)}>
            See more
          </button>
        </div>
        <div className="basis-1/4"></div>
      </div>

      <br />
    </div>
  );
}