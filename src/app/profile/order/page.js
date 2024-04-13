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



export default function MyOrders() {

    // Firebase information retrival function here

    const [OrderDetails, setOrderDetails] = useState([]);


    // Get the currently signed-in user
    const { currentUser } = useAuth()

    useEffect(() => {
        const userId = currentUser.uid;
        if (!userId) {
            console.log("No current user logged in");
            return;
        }
    
        const orderDetailsRef = ref(database, "Order");
        const orderQuery = query(orderDetailsRef, orderByChild('userID'), equalTo(userId));
    
        get(orderQuery).then(async (snapshot) => {
            if (snapshot.exists()) {
                const orderDetailsArray = [];
                const orders = snapshot.val();
    
                for (const orderId in orders) {
                    const order = orders[orderId];
                    const items = order.items; // Assuming 'items' contains item IDs and quantities
                    const itemsArray = [];
    
                    for (const itemId in items) {
                        // Fetch product details for each item from the 'Product' table
                        const productRef = ref(database, `Product/${itemId}`);
                        const productSnapshot = await get(productRef);
                    
                        console.log("Product Snapshot for item ID", itemId, ":", productSnapshot.val()); // Log product data); // Log product data
                    
                        if (productSnapshot.exists()) {
                            const productData = productSnapshot.val();
                            const item = {
                                id: itemId,
                                quantity: items[itemId],
                               // price: productData.name,
                               // name: productData.name,
                                ...productData // Include product details
                            };
                            itemsArray.push(item);
                        }
                    }
                    console.log("Items Array:", itemsArray); // Log items array
    
                    orderDetailsArray.push({
                        id: orderId,
                        items: itemsArray,
                        ...order // Include other order details
                    });
                    console.log(orderDetailsArray);
                }
    
                setOrderDetails(orderDetailsArray);
                console.log(OrderDetails);
            } else {
                console.log("No orders found for the current user");
            }
        }).catch((error) => {
            console.error(error);
        });
    }, [currentUser]);
    

    return (
        <div className='grid grid-rows-1 grid-cols-4 gap-x-20 row-start-1 row-end-2 col-start-1 col-end-3 bg-dark-night justify-items-center'> 
            <SubNavbar />
            <div style={{ backgroundColor: 'transparent' }} className="justify-items-center h-auto w-full my-6 mr-12 mt-24 row-start-1 row-end-1 col-start-2 col-end-5">
                <h5 className="justify-self-center text-center text-4xl mb-6 font-bold tracking-tight text-white font-mono"> MY ORDERED KEYS</h5>
                <div className='grid grid-rows-3 flex-wrap m-s ml-10 mr-10'>
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
                            <div className='border-b-2 border-white grid grid-cols-5 flex-wrap ml-3 mr-3 p-3' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', justifyItems: 'start' }}>
                                <a className='tracking-tight dark:text-white text-white'>Product</a>
                                <a className='tracking-tight dark:text-white text-white'>Price</a>
                                <a className='tracking-tight dark:text-white text-white'>Review</a>
                                <a className='tracking-tight dark:text-white text-white'>Key</a>
                            </div>
                            {/* Display item details */}
                            {o.items && Object.entries(o.items).map(([itemId, item]) => (
                                <div key={itemId} className='grid grid-cols-7 items-center flex-wrap border-b-2 border-white ml-3 mr-3 p-3' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', justifyItems: 'start' }}>    
                                    {item && (
                                        <Fragment>
                                            {console.log('item: ',item)}
                                            <div className="flex dark:text-white text-white font-mono">{item.name}</div>
                                            {item.price !== undefined && (
                                                <div className="flex text-center dark:text-white text-white font-mono">{'£ ' + item.price}</div>
                                            )}
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
        </div>
    );}