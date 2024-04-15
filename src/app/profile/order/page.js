"use client"; 
import { Card, Button } from 'flowbite-react';
import React, { Fragment } from 'react';
import SubNavbar from '../subNavbar.js'
import { ref ,push, set, get, query, orderByChild, equalTo } from "firebase/database";
import { useEffect, useState} from 'react';
import { database } from '@/app/firebaseConfig.js';
import { useAuth } from '@/app/context/AuthContext.js';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { Tooltip } from 'flowbite-react';
import {RateReview} from '@mui/icons-material';
import { useProductContext } from '@/app/context/ProductContext.js';
import Modal from '@/components/modal.js';
import {FaStar} from 'react-icons/fa'
import toast from 'react-hot-toast';

export default function MyOrders() {
    const { products } = useProductContext();
    const { currentUser } = useAuth();
    const [OrderDetails, setOrderDetails] = useState([]);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const [review, setReview] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [reviewData, setReviewData] = useState({
        rating: '',
        title: '',
        comment: '',
        userName: ''
    });

    const handleChange = (e) => {
        setReviewData({
            ...reviewData,
            [e.target.name] : e.target.value
        });
        checkAllFieldsChange();
        
    };

    useEffect(() => {
        if (currentUser && currentUser.uid) { // Ensure currentUser and currentUser.id are valid
            const userId = currentUser.uid;
            const ordersRef = ref(database, 'Order');
            const userOrdersQuery = query(ordersRef, orderByChild('userID'), equalTo(userId));
    
            get(userOrdersQuery).then((snapshot) => {
                if (snapshot.exists()) {
                    const orders = Object.entries(snapshot.val()).map(([id, data]) => ({
                        id,
                        ...data,
                    }));
    
                    console.log("Orders:", orders); // Log orders to see if data is retrieved correctly
                    setOrderDetails(orders);
                } else {
                    console.log("No orders found");
                    setOrderDetails([]);
                }
            }).catch((error) => {
                console.error("Error fetching orders:", error);
                setOrderDetails([]);
            });
        }
    }, [currentUser, products]); // Include products in the dependency array

    const getItemsForOrder = (orderId) => {
        const order = OrderDetails.find(order => order.id === orderId);
        if (order && typeof order.items === 'object') {
            return Object.keys(order.items).map(itemId => {
                const product = products.find(product => product.id === itemId);
                return {
                    product,
                    quantity: order.items[itemId] 
                };
            });
        }
        return [];
    };
    // Post review function
    const handleReviewProductButtonClick = async () => {
        setCurrentDate(new Date());
        const userId = currentUser.uid;
        console.log("user: ", currentUser);
        if (!userId) {
            console.log("No current user logged in");
            return;
        }
        // Create a new review object from the form data
        const newReview = {
            rating: rating,
            title: reviewData.title,
            comment: reviewData.comment,
            userID: currentUser.uid,
            productID: review.id,
            date: currentDate.toLocaleDateString('en-GB'),
            userName: document.getElementById('anonymousCheckbox').checked ? 'Anonymous' : currentUser.email.substring(0, 8),
        };

        // Generate a unique key for the new review
        const newReviewKey = push(ref(database, 'Reviews/')).key;

        try {
            // Set the new review object at the specified path in the database
            await set(ref(database, 'Reviews/' + newReviewKey), newReview);
            toast.success('New Review posted successfully');
            console.log('New Review posted successfully');
            setReviewData({
                rating: "",
                title: "",
                comment: "",
                userName: ""
            });
            setShowReviewModal(false);
        } catch (error) {
            toast.error('Error posting new review:', error);
            console.error('Error posting new review:', error);
        }
};


    // Function to open review product modal
    const openReviewProductModal = (product) => {
        console.log(product);
        setReview(product);
        setShowReviewModal(true);
    };
    // Function to cloe review product modal
    const closewModal = () => {
        setShowReviewModal(false);
        setReviewData({
            rating: setRating(0),
            title: "",
            comment: "",
            userName: ""
        });
    };
    //Function that checks if all fields are filled before posting the review
    const checkAllFieldsChange = () => {
        if (reviewData.comment !== '' && reviewData.title !== '' && rating !== 0) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    };
    
    return (
        <Fragment>
            <div className='grid grid-rows-1 grid-cols-4 gap-x-20 row-start-1 row-end-2 col-start-1 col-end-3 bg-dark-night justify-items-center'> 
                <SubNavbar/>
                <div style={{ backgroundColor: 'transparent', maxHeight: '80vh', paddingRight: '17px', boxSizing: 'content-box' }} className="overflow-y-auto justify-items-center h-auto w-full my-6 mr-12 mt-24 bg-blue-900 border-blue-900 row-start-1 row-end-1 col-start-2 col-end-5 " >
                    <h5 className="justify-self-center text-center text-4xl mb-6 font-bold tracking-tight text-white font-mono" > MY ORDER KEYS</h5>
                    {OrderDetails.length === 0 ? (
                        <div className="text-2xl text-white mt-32 mb-44 font-mono text-center">NO ORDERS STORED WITHIN YOUR ACCOUNT.<br/> PLEASE PURCHASE PRODUCTS!!</div>
                    ) : (
                        OrderDetails.map((o) => (
                            <Card key={o.id} style={{ backgroundColor: 'transparent' }} className="flex h-auto w-full border-2 border-white mt-3">
                                <div className=' grid grid-cols-3 flex-wrap ml-3 mr-3 p-3' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', justifyItems: 'start' }}>
                                    <h3 className='font-bold tracking-tight dark:text-white text-white'>Order Number:</h3>
                                    <h3 className='font-bold tracking-tight dark:text-white text-white'>Date Placed:</h3>
                                    <h3 className='font-bold tracking-tight dark:text-white text-white'>Total Amount:</h3>
                                    <h3 className='font-bold tracking-tight dark:text-white text-white'>Status:</h3>
                                </div>
                                <div className='rounded-1 border-b-2 border-white grid grid-cols-3 flex-wrap mb-6 ml-3 mr-3 p-3' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', justifyItems: 'start' }}>
                                    <a className='tracking-tight dark:text-white text-white'>{o.id.substring(1, 8)}</a>
                                    <a className='tracking-tight dark:text-white text-white'> 12/02/2024</a>
                                    <a className='tracking-tight dark:text-white text-white'>{"£ "+ parseFloat(o.price).toFixed(2)}</a>
                                    <a className='tracking-tight dark:text-white text-white'>{o.status}</a>
                                </div>
                                <div className='border-b border-gray-300 grid grid-cols-5 flex-wrap ml-3 mr-3 p-3' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', justifyItems: 'start' }}>
                                    <a className='tracking-tight dark:text-white text-white'>Product</a>
                                    <a className='tracking-tight dark:text-white text-white'></a>
                                    <a className='tracking-tight dark:text-white text-white'>Price</a>
                                    <a className='tracking-tight dark:text-white text-white'>Review</a>
                                    <a className='tracking-tight dark:text-white text-white'>Key</a>
                                </div>
                                
                                {/* Display item details */}
                                {getItemsForOrder(o.id).map((item, index) => (
                                    <div key={index} className='grid grid-cols-7 items-center flex-wrap border-b border-gray-300 ml-3 mr-3 p-3' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', justifyItems: 'start' }}>    
                                        {item && item.product && (
                                            <Fragment>
                                                {console.log('item.product:', item.product)}
                                                <div className='inline-flex col-span-2'>
                                                <img className="w-16 h-16 object-cover rounded-lg" src={item.product.images[0]} alt="Product Image"/>
                                                <div>
                                                <div className=" mt-3 text-start flex dark:text-white text-white font-mono ml-6">{item.product.name.substring(0, 19)}</div>
                                                </div>
                                                </div>
                                                <div className="flex text-center dark:text-white text-white font-mono">{'£ ' + item.product.price}</div>
                                            
                                                <Tooltip content='Review this product'>
                                                    <RateReview className = "cursor-pointer" style={{ height: '20px', width: '20px', justifySelf: 'center', filter: 'brightness(0) invert(1)' }} 
                                                    onClick={()=> openReviewProductModal(item.product)}
                                                    disabled={showReviewModal}></RateReview>
                                                </Tooltip>
                                                <Tooltip content='See your game key'>
                                                    <VpnKeyIcon className = "cursor-pointer" style={{ height: '20px', width: '20px', justifySelf: 'center', filter: 'brightness(0) invert(1)' }} />
                                                </Tooltip>
                                            </Fragment>
                                        )}
                                    </div>
                                ))}
                            </Card>
                        ))
                    )}
                    </div>             
                </div>
                {/*Review product modal */}          
                <Modal isVisible={showReviewModal} onClose ={()=> setShowReviewModal(false)}>
                   <h3 className='text-xl flex self-center font-semibold text-white mb-5'>WRITE A REVIEW</h3>
                   <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
                        {review && review.images && review.images[0] && (
                            <img className="self-center w-full h-28 object-cover rounded-lg" src={review.images[0]} alt="Product Image"/>
                        )}
                        <div className=" w-full mt-3 flex  dark:text-white text-white font-mono justify-center items-center">{review.name}</div>
                            <div className='inline-flex self-center'>
                                {[...Array(5)].map((star, index) =>{
                                    const currentRating = index + 1;
                                    return (
                                        <label>
                                            <input type='radio' required name='rating' value={currentRating} onClick={() => setRating(currentRating)}></input>
                                            <FaStar className= 'star ml-6 mt-3' size={50} 
                                            color={currentRating <= (hover || rating) ? "#ffc107" : "e4e5e9"}
                                            onMouseEnter={() => setHover(currentRating)}
                                            onMouseLeave={() => setHover(null)}
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                        {/*<p className='mb-2 justify-self-center' name= "rating" value={reviewData.rating} onChange={handleChange}>Selected Rating is {rating} out of 5</p>*/}
                        <div className='justify-center mt-2'>
                            <label className=' mb-2'>Title</label>
                            <textarea
                                class="self-center peer h-12 mt-2 min-h-[10px] w-96 resize-none rounded-[7px] border border-blue-gray-200  bg-white px-3 py-2.5 font-sans text-sm font-normal text-gray-900 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200"
                                placeholder=" "
                                required
                                name= "title"
                                maxLength={100}
                                value={reviewData.title} onChange={handleChange}>
                            </textarea>
                        </div>
                        <div className='justify-self-center mt-2'>
                            <label className=' mb-2'>Write your comment</label> 
                            <textarea
                                class="peer h-full min-h-[150px] w-96 mt-2 resize-none rounded-[7px] border border-blue-gray-200  bg-white px-3 py-2.5 font-sans text-sm font-normal text-gray-900 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200"
                                placeholder=" "
                                name= "comment"
                                required
                                maxLength={300}
                                value={reviewData.comment} onChange={handleChange}>
                            </textarea>
                        </div>
                        <div className='flex items-center mt-4'>
                            <input
                                type="checkbox"
                                id="anonymousCheckbox"
                                name="anonymousCheckbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="anonymousCheckbox" className="ml-2 block text-sm text-white">
                                Post anonymously
                            </label>
                        </div>
                        <div className='flex justify-evenly mt-5 mb-10'>
                            <Button  className="w-52 mr-2" color="gray" onClick ={()=>closewModal()}> DISMISS</Button>
                            <Button  className="w-52 ml-2"  style={{background: '#00052d', border : '#00052d'}} disabled={isButtonDisabled} onClick={()=>handleReviewProductButtonClick()}>POST</Button>
                        </div>
                    </div>
                </Modal>
            </Fragment>
 );}
