"use client"; 
import { Card, Button } from 'flowbite-react';
import React from 'react';
import SubNavbar from '../subNavbar.js'
import { ref , get } from "firebase/database";
import { useEffect, useState} from 'react';
import { database } from '@/app/firebaseConfig.js';
import { useAuth } from '@/app/context/AuthContext.js';
import VpnKeyIcon from '@mui/icons-material/VpnKey';


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
        const OrderDetailsRef = ref(database, "User");
        get(OrderDetailsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const OrderDetailsArray = Object.entries(snapshot.child(userId).child('orders').val()).map(([id, data]) => ({
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
        <div className='grid grid-rows-1 grid-cols-4 gap-x-20 row-start-1 row-end-2 col-start-1 col-end-3 bg-dark-night justify-items-center'> 
            <SubNavbar />
            <div style={{ backgroundColor: 'transparent' }} className=" justify-items-center h-auto w-full my-6 mr-12 bg-blue-900 border-blue-900 row-start-1 row-end-1 col-start-2 col-end-5 " >
                <h5 className="justify-self-center text-center text-4xl mb-6 font-bold tracking-tight text-white font-mono" > MY ORDER KEYS</h5>

                <div className='rounded-none border-0 border-b-2 border-white grid grid-cols-5 flex-wrap ml-10 mr-10 p-3' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', justifyItems: 'center' }}>
                    <h3 className=' ext-4xl font-bold tracking-tight dark:text-white  text-white'>Game</h3>
                    <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'>Price</h3>
                    <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'>Date</h3>
                    <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'>Status</h3>
                    <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'>Key</h3>
                </div>
                {/*This is the card that can be used as a component nested in addressBook component */}
                <div className='grid grid-rows-3 flex-wrap m-s ml-10 mr-10'>
                {OrderDetails.map((o) => (
                    <Card style={{ backgroundColor: 'transparent' }} key={o.id} className=" flex h-auto w-full rounded-none border-0 border-b-2 border-white mt-6">
                        <div className='grid grid-cols-5 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',justifyItems: 'center' }}>    
                            <h2 id="order_date" className="flex dark:text-white text-white font-mono ">{o.game}</h2>
                            <h2 id="order_address" className="flex text-center dark:text-white text-white font-mono ">{'£ '+ o.price}</h2>
                            <h2 id="order_amount" className="flex dark:text-white text-white font-mono ">{o.date}</h2>
                            <h2 id="order_status" className="flex dark:text-white text-white font-mono ">{o.status}</h2>
                            <VpnKeyIcon class="first-line:h-7 w-7 flex-wrap justify-self-center" style={{ filter: 'brightness(0) invert(1)' }}></VpnKeyIcon>
                        </div>
                    </Card>
                ))}
                </div>             
            </div>
        </div>   
    )
}