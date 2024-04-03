"use client"; 
import { Card, Button } from 'flowbite-react';
import React from 'react';
import SubNavbar from '../subNavbar.js'
import { ref , get } from "firebase/database";
import { useEffect, useState} from 'react';
import { database } from '@/app/firebaseConfig.js';

export default function MyOrders() {

    // Firebase information retrival function here

    const [OrderDetails, setOrderDetails] = useState([]);

    useEffect(() => {
        const OrderDetailsRef = ref(database, "User");
        get(OrderDetailsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const OrderDetailsArray = Object.entries(snapshot.child('w1FJVaOVCsSlsog2b7mUIuG8Xgd2').child('orders').val()).map(([id, data]) => ({
                    id,
                    ...data,
                }));
                setOrderDetails(OrderDetailsArray);
            } else {
                console.log("No data found")
            }
        }).catch((error) => {
            console.error(error);
        });
    }, []); // Removed card from the dependency array

    console.log(OrderDetails);

    return(
        <div className='grid grid-rows-1 grid-cols-4 gap-x-20 row-start-1 row-end-2 col-start-1 col-end-3 bg-dark-night'> 
            <SubNavbar />
            <Card className=" justify-self-center h-auto w-full my-6 mr-12 bg-blue-900 border-blue-900 row-start-1 row-end-1 col-start-2 col-end-5 " >
                <h5 className="self-center text-4xl font-bold tracking-tight text-white font-mono" > MY ORDER KEYS</h5>

                <div className='top_bar_basket grid grid-cols-5 flex-wrap ml-10 mr-10 p-3' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', justifyItems: 'center' }}>
                    <h3 className=' ext-4xl font-bold tracking-tight dark:text-white  text-white'>Game Name</h3>
                    <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'>Price</h3>
                    <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'>Date</h3>
                    <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'>Status</h3>
                    <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'>Key</h3>
                </div>
                {/*This is the card that can be used as a component nested in addressBook component */}
                <div className='grid grid-rows-3 flex-wrap m-s ml-10 mr-10'>
                {OrderDetails.map((o) => (
                    <Card key={o.id} className=" flex h-auto w-full mt-2 bg-transparent border-white">
                        <div className='grid grid-cols-5 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',justifyItems: 'center' }}>    
                            <h2 id="order_date" className="flex dark:text-white text-white font-mono ">{o.date}</h2>
                            <h2 id="order_address" className="flex text-center dark:text-white text-white font-mono ">{o.address}</h2>
                            <h2 id="order_amount" className="flex dark:text-white text-white font-mono ">{"£ " + o.price}</h2>
                            <h2 id="order_status" className="flex dark:text-white text-white font-mono ">{o.status}</h2>
                            <img className="first-line:h-6 w-6 flex-wrap" style={{ filter: 'brightness(0) invert(1)' }} src="https://www.iconbolt.com/iconsets/atlas-icons/navigation-move-movement-arrow-direction-pointer-control-next-right.svg" alt="edit address"/>
                        </div>
                    </Card>
                ))}
                </div>             
            </Card>
        </div>   
    )
}