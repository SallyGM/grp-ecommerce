"use client"; 
import { Card, Button } from 'flowbite-react';
import React, { Fragment } from 'react';
import SubNavbar from '../subNavbar.js'
import { ref , get, query, orderByChild, equalTo } from "firebase/database";
import { useEffect, useState} from 'react';
import { database } from '@/app/firebaseConfig.js';
import { useAuth } from '@/app/context/AuthContext.js';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { Tooltip } from 'flowbite-react';
import {RateReview} from '@mui/icons-material'; // Import icons
import { useProductContext } from '@/app/context/ProductContext.js';



export default function MyOrders() {
    const { products } = useProductContext();
    const { currentUser } = useAuth();
    const [OrderDetails, setOrderDetails] = useState([]);

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
    
    
    return (
        <div className='grid grid-rows-1 grid-cols-4 gap-x-20 row-start-1 row-end-2 col-start-1 col-end-3 bg-dark-night justify-items-center'> 
            <SubNavbar />
            <div style={{ backgroundColor: 'transparent' }} className=" justify-items-center h-auto w-full my-6 mr-12 mt-24 bg-blue-900 border-blue-900 row-start-1 row-end-1 col-start-2 col-end-5 " >
                <h5 className="justify-self-center text-center text-4xl mb-6 font-bold tracking-tight text-white font-mono" > MY ORDER KEYS</h5>
                    {OrderDetails.map((o) => (
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
                                <div key={index} className='grid grid-cols-7 items-center flex-wrap border-b border-gray-300 ml-3 mr-3 p-3' style={{ gridTemplateColumns: ' 1fr 1fr 1fr 1fr 1fr', justifyItems: 'start' }}>    
                                    {item && item.product && (
                                        <Fragment>
                                            {console.log('item.product:', item.product)}
                                            <img className="w-16 h-16 object-cover rounded-lg" src={item.product.images[1]} alt="Product Image"/>
                                            <div className="flex dark:text-white text-white font-mono ml-3">{item.product.name}</div>
                                            <div className="flex text-center dark:text-white text-white font-mono">{'£ ' + item.product.price}</div>
                                           
                                            <Tooltip content='Review this product'>
                                                <RateReview style={{ height: '20px', width: '20px', justifySelf: 'center', filter: 'brightness(0) invert(1)' }} />
                                            </Tooltip>
                                            <Tooltip content='See your game key'>
                                                <VpnKeyIcon style={{ height: '20px', width: '20px', justifySelf: 'center', filter: 'brightness(0) invert(1)' }} />
                                            </Tooltip>
                                        </Fragment>
                                    )}
                                </div>
                            ))}
                        </Card>
                    ))}
                </div>             
            </div>
 );}