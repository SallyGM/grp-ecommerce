"use client"; 
import { Card, Button } from 'flowbite-react';
import React, { Fragment, useEffect, useState } from 'react';
import { ref, get, query, orderByChild, equalTo, remove } from "firebase/database";
import { database } from '@/app/firebaseConfig.js';
import { useAuth } from '@/app/context/AuthContext.js';
import { useProductContext } from '@/app/context/ProductContext.js';
import SubNavbar from '../subNavbar.js'
import {FaStar} from 'react-icons/fa'
import Modal from '@/components/modal.js';
import { Tooltip } from 'flowbite-react';
import toast from 'react-hot-toast';

export default function MyReviews() {
    const { currentUser } = useAuth();
    const { products } = useProductContext();
    const [reviewDetails, setReviewDetails] = useState([]);
    const [showDeleteReview, setShowDeleteReview] = useState(false);
    const [review, setReview] = useState('');

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

    // Function to open delete review modal
    const openDeleteReviewModal = (review) => {
        setReview(review);
        setShowDeleteReview(true);
    };
    // Function that handle confirm button click on delete card dialog
    const handleConfirmDeleteReviewClick = (review) => {
        const userId = currentUser.uid;
        if (!userId) {
            console.log("No current user logged in");
            return;
        }
        const reviewRef = ref(database, 'Reviews/' + review.id);
        remove(reviewRef, review)
            .then(() => {
                toast.success("Review deleted successfully");
                console.log("Review deleted successfully");
                // Update local state with the new values
                setReviewDetails(prevReviewDetails => prevReviewDetails.filter(rw => rw.id !== review.id));
                setShowDeleteReview(false);
            })
            .catch((error) => {
                toast.error("Error deleting card:", error);
                console.error("Error deleting card:", error);
            });
    }

    return (
        <Fragment>
            <div className='grid grid-rows-1 grid-cols-4 gap-x-20 row-start-1 row-end-2 col-start-1 col-end-3 bg-dark-night justify-items-center'>
                <SubNavbar/>
            
                <div style={{ backgroundColor: 'transparent', maxHeight: '80vh', paddingRight: '17px', boxSizing: 'content-box'}} className="overflow-y-auto justify-items-center h-auto w-full my-6 mr-12 mt-24  row-start-1 row-end-1 col-start-2 col-end-5 " >
                    <h5 className="justify-self-center text-center text-4xl mb-6 font-bold tracking-tight text-white font-mono"> MY REVIEWS</h5>
                    {reviewDetails.length === 0 ? (
                        <div className="text-2xl text-white mt-32 mb-44 font-mono text-center">NO PRODUCT REVIEW STORED WITHIN YOUR ACCOUNT.<br/> PLEASE REVIEW PRODUCTS!!</div>
                    ) : (
                        reviewDetails.map((review) => (
                            <Card key={review.id} style={{ backgroundColor: 'transparent'}} className="flex h-auto w-full mt-3">
                                <div className='grid grid-cols-3 border-b border-gray-300 flex-wrap ml-3 mr-3 p-3' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', justifyItems: 'start' }}>
                                    <h3 className='font-bold tracking-tight dark:text-white text-white'>Game</h3>
                                    <h3 className='font-bold tracking-tight dark:text-white text-white'>Name</h3>
                                    <h3 className='font-bold tracking-tight dark:text-white text-white'>Date Placed:</h3>
                                    <h3 className='font-bold tracking-tight dark:text-white text-white'>Posted as:</h3>
                                    <div className='inline-flex self-start'>
                                        <h3 className='font-bold tracking-tight dark:text-white text-white'>Rating:</h3>
                                        <Tooltip content='Delete review'>
                                            <img className=" self-end ml-48 first-line:h-5 w-5 flex-wrap self-end cursor-pointer" style={{ filter: 'brightness(0) invert(1)' }} src="https://www.iconbolt.com/iconsets/flowbite-solid/trash-bin.svg" alt= "delete card" onClick={()=> openDeleteReviewModal(review)} disabled={showDeleteReview}/>
                                        </Tooltip>
                                    </div>
                                
                                    {getProductDetails(review.productID) && (
                                        <Fragment>
                                            {console.log('product details:', getProductDetails(review.productID))}
                                            <img className="mt-6 w-28 h-28 object-cover rounded-lg" src={getProductDetails(review.productID).images[1]} alt="Product Image" />
                                            <a className='mt-6 mr-16 tracking-tight dark:text-white text-white' style={{ wordWrap: 'break-word' }}>{getProductDetails(review.productID).name}</a>
                                            <a className='mt-6 tracking-tight dark:text-white text-white'>{review.date}</a>
                                            <a className='mt-6 tracking-tight dark:text-white text-white'>{review.userName}</a>
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
                        ))
                    )}
                    
                </div>
            </div>
            {/*Delete review modal */}
            <Modal isVisible={showDeleteReview} review={review} onClose={()=> setShowDeleteReview(false)}>
                <h3 className='text-xl flex self-center font-semibold text-white mb-5'>DELETE REVIEW</h3>
                <h3 className='flex self-center font-semibold text-white  mb-5'>Are you sure you want to delete this review?</h3>
                <div className='flex justify-evenly mt-10 mb-2'>
                    <Button type="submit" className="w-52" color="gray" onClick={()=> setShowDeleteReview(false)}> DISMISS</Button>
                    <Button type="submit" className="w-52"  style={{background: '#00052d', border : '#00052d'}} onClick={()=>handleConfirmDeleteReviewClick(review)}>CONFIRM</Button>
                </div>
            </Modal>
        </Fragment>
    );
}
