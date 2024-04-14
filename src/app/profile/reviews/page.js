"use client"; 
import { Card } from 'flowbite-react';
import React, { Fragment, useEffect, useState } from 'react';
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import { database } from '@/app/firebaseConfig.js';
import { useAuth } from '@/app/context/AuthContext.js';
import { useProductContext } from '@/app/context/ProductContext.js';
import SubNavbar from '../subNavbar.js'
import {FaStar} from 'react-icons/fa'


export default function MyReviews() {
    const { currentUser } = useAuth();
    const { products } = useProductContext();
    const [reviewDetails, setReviewDetails] = useState([]);
    const [hover, setHover] = useState(null);
    const [rating, setRating] = useState(null);

    useEffect(() => {
        if (currentUser && currentUser.uid) {
            const userId = currentUser.uid;
            const reviewRef = ref(database, 'Reviews');
            const userReviewsQuery = query(reviewRef, orderByChild('userID'), equalTo(userId));

            get(userReviewsQuery)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const reviews = Object.entries(snapshot.val()).map(([id, data]) => ({
                            id,
                            ...data,
                        }));

                        console.log("Reviews:", reviews);
                        setReviewDetails(reviews);
                    } else {
                        console.log("No reviews found");
                        setReviewDetails([]);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching reviews:", error);
                    setReviewDetails([]);
                });
        }
    }, [currentUser, products]);

    const getProductDetails = (productId) => {
        return products.find(product => product.id === productId) || {};
    };

    return (
        <Fragment>
            <div className='grid grid-rows-1 grid-cols-4 gap-x-20 row-start-1 row-end-2 col-start-1 col-end-3 bg-dark-night justify-items-center'>
                <SubNavbar/>
            
            <div style={{ backgroundColor: 'transparent' }} className=" justify-items-center h-auto w-full my-6 mr-12 mt-24  row-start-1 row-end-1 col-start-2 col-end-5 " >
                <h5 className="justify-self-center text-center text-4xl mb-6 font-bold tracking-tight text-white font-mono"> MY REVIEWS</h5>
                {reviewDetails.map((review) => (
                    <Card key={review.id} style={{ backgroundColor: 'transparent'}} className="flex h-auto w-full mt-3">
                        <div className='grid grid-cols-3 border-b border-gray-300 flex-wrap ml-3 mr-3 p-3' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', justifyItems: 'start' }}>
                            <h3 className='font-bold tracking-tight dark:text-white text-white'>Game</h3>
                            <h3 className='font-bold tracking-tight dark:text-white text-white'>Name</h3>
                            <h3 className='font-bold tracking-tight dark:text-white text-white'>Date Placed:</h3>
                            <h3 className='font-bold tracking-tight dark:text-white text-white'>Rating:</h3>
                        
                            
                                {getProductDetails(review.productID) && (
                                    <Fragment>
                                        {console.log('product details:', getProductDetails(review.productID))}
                                        <img className="mt-6 w-28 h-28 object-cover rounded-lg" src={getProductDetails(review.productID).images[1]} alt="Product Image" />
                                        <a className='mt-6 tracking-tight dark:text-white text-white' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getProductDetails(review.productID).name}</a>
                                        <a className='mt-6 tracking-tight dark:text-white text-white'>{review.date}</a>
                                        <div className='inline-flex self-start'>
                                            {[...Array(5)].map((star, index) => {
                                                const currentRating = review.rating;
                                                return (
                                                    <label key={index}>
                                                        <FaStar
                                                            className='star ml-1 mt-6'
                                                            size={20}
                                                            color={index + 1 <= currentRating ? "#ffc107" : "#e4e5e9"}
                                                        />
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </Fragment>
                                )}
                            
                        </div>
                        <div className='self-start'>
                            <a className='ml-3 mb-3 font-bold text-white'>{review.title}</a>
                            <p className='ml-3 text-white'>{review.comment}</p>
                        </div>
                    </Card>
                ))}
            </div>
            </div>
        </Fragment>
    );
}
