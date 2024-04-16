"use client"; 
import { Card} from "flowbite-react";
import {database} from '../../firebaseConfig';
import { ref, get, query } from "firebase/database";
import { useEffect, useState } from 'react';
import { useBasketContext } from "../../context/BasketContext";
import toast from 'react-hot-toast';
import StarRating from '../../starRating.js';




/*Product Page*/

export default function Page({ params }) {
    const [activeTab, setActiveTab] = useState('tab-1');

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    }

    const [product, setProduct] = useState(false);

    const prodRef = ref(database, "Product");

    const { addToBasket } = useBasketContext();
    const [review, setReview] = useState(false);

    const [numReviews, setNumReviews] = useState(0);


    useEffect(() => {    
        get(prodRef).then((snapshot) => {
            if (snapshot.exists()) {
                let productArray = snapshot.child(params.productID).val();
                productArray.id = params.productID;
                setProduct(productArray);
            } else {
                console.log("No data found");
                setProduct(false);
            }
        }).catch((error) => {
            console.error(error);
            setProduct(false);
        });
    }, []);


    //Retrieves reviews from database
    useEffect(() => {
        const prodRef = ref(database, "Reviews");
       
        get(prodRef).then((snapshot) => {
            if (snapshot.exists()) {
                const reviews = [];
                snapshot.forEach((childSnapshot) => {
                    const reviewData = childSnapshot.val();
                    if (reviewData.productID === params.productID) {
                        const review = { ...reviewData, id: childSnapshot.key };
                        reviews.push(review);
                    }
                    
                });
                setReview(reviews);
                setNumReviews(reviews.length);
            } else {
                console.log("No reviews found.");
                setReview([]);
            }
        }).catch((error) => {
            console.error(error);
            setReview([]);
        });
    }, []);


    function handleClickAddToCart(productID, e){
        addToBasket(productID, 1);
        toast.success('Product added to basket!');
      }
      
   
    
    return (
        <div>
            {product ? (
            <div>
                <div className="back-prod">   
                    <div className="grid grid-cols-2 gap-20 pt-20 mr-20 ml-20" >
                        <div>
                            <div className="card grid grid-rows-2 flex-wrap mt-16" style={{ gridTemplateRows: '1fr 3fr'}} >
                                    <div className="banner-game pt-5 pb-5">
                                    <p className="text-center text-lg dark:text-white self-center text-white roboto-light m-auto" >{product.console} VERSION</p>
                                    </div>
                                    <div className="prod-img ">
                                        <img src={product.images[0]} alt="Image" className=" object-contain rounded-lg" />
                                    </div>
                            </div>
                        </div>
                        <div className="flex-1" style={{ flex: 'wrap', alignItems:"right"}}>
                            <h1 className="text-center  bebas-neue-regular ">{product.name}</h1>
                            <div className="flex flex-row justify-between">
                                <h2 className="text-left roboto-lightLarge  dark:text-white self-center text-white " > £{product.price} </h2>
                                <h2 className="text-white">Score</h2>
                                <h2 className="text-right justify-end roboto-lightLarge text-white">Reviews:{numReviews}</h2>

                            </div>    

                            
                            <div className="relative mt-5 overflow-x-auto">
                                <table className="game-table dark:text-white self-center text-white" >
                                    <tbody>
                                        <tr>
                                            <th scope="row" className="px-6 py-3 ">
                                                Release Date
                                            </th>
                                            <td className="px-6 py-3 ">
                                                {product.releaseDate}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="px-6 py-3 ">
                                                Developer
                                            </th>
                                            <td className="px-6 py-3">
                                                {product.developer}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="px-6 py-3 ">
                                                Publisher
                                            </th>
                                            <td className="px-6 py-3">
                                                {product.publisher}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="px-6 py-3 ">
                                                Delivery
                                            </th>
                                            <td className="px-6 py-3">
                                                {product.delivery}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="px-6 py-3 ">
                                                Platform
                                            </th>
                                            <td className="px-6 py-3">
                                                {product.platform}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="px-6 py-3 ">
                                                Console
                                            </th>
                                            <td className="px-6 py-3">
                                                {product.console}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="px-6 py-3 f">
                                                Language
                                            </th>
                                            <td className="px-6 py-3">
                                                {product.language}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="px-6 py-3 ">
                                                PG
                                            </th>
                                            <td className="px-6 py-3">
                                                {product.ageRestriction}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="px-6 py-3 ">
                                                Genre
                                            </th>
                                            <td className="px-6 py-3">
                                                {product.genre}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button className='prod_btn w-52 rounded-lg roboto-light' hoverClassName='c50edd' onClick={(e) => handleClickAddToCart(product.id, product.amount, e)}>
                                ADD TO CART
                                </button>
                            </div>
                        </div>   
                    </div>
                    <div className="flex pl-20 pr-20 pb-20 my-20 gap-2 " >
                        <div className="p-5 ">
        
                            <div className="tabs ">
                                <input className="input" name="tabs" type="radio" id="tab-1" checked={activeTab ==='tab-1'} onChange={() => handleTabChange('tab-1')} />
                                <label className="label rounded-md text-center text-xl dark:text-white self-center text-white " for="tab-1">ABOUT THE GAME</label>
                                <div className="panel text-lg dark:text-white text-white " style={{ height: '300px', width:'900px', overflowY: 'auto' }} >
                                    <p>{product.description}</p>
                                </div>
                                <input className="input" name="tabs" type="radio" id="tab-2" checked={activeTab ==='tab-2'} onChange={() => handleTabChange('tab-2')}/>
                                <label className="label text-center text-xl dark:text-white self-center text-white " for="tab-2">SPECIFICATIONS</label>
                                <div className="panel text-lg dark:text-white text-white " style={{ height: '300px',width:'900px', overflowY: 'auto' }}>
                                    <p>{product.specifications}</p>
                                </div>
                                <input className="input" name="tabs" type="radio" id="tab-3"checked={activeTab ==='tab-3'} onChange={() => handleTabChange('tab-3')}/>
                                <label className="label text-center text-xl dark:text-white self-center text-white " for="tab-3" >REVIEWS</label>
                                <div className="panel text-lg overflow-y-auto -webkit-scrollbar dark:text-white text-white " style={{ height: '300px',width:'900px', overflowY: 'auto' }}>
                                
                                {/* Map reviews to card, each review it's placed in one card */}
                                 {/* Change Card into div, put card external and review.map inside card (increase the divs per prod.) */}

                                {review.map((review) => (
                                    <Card className="review-card bg-transparent mb-10  " style={{borderRadius: '8px'}} key={review.id}>
                                        <StarRating rating={review.rating}></StarRating>
                                        <div className="grid grid-cols-2 flex-wrap roboto-light">
                                            <p className=" flex justify-start">Reviewed by {review.userName}</p>
                                            <p className=" flex justify-end">{review.date}</p>
                                        </div>
                                        <hr className="border-t border-white w-full my-auto" />
                                        <div className="grid grid-rows-2 flex-wrap">
                                            <p className="flex-wrap roboto-bold ">{review.title}</p>
                                            <p className="mb-0 roboto-light">"{review.comment}"</p>
                                        </div>
                                    </Card>
                                ))}
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ) : (
            <div>
                <p>Product not found</p>
            </div>
            )}
        </div>
    );
}