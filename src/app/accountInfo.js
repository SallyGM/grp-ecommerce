"use client"; 
import Image from 'next/image'
import Link from 'next/link'
import { Card, Button } from 'flowbite-react';
//import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import React from 'react';
//import {database} from './firebaseConfig.js';
//import { ref , get } from "firebase/database";
import { User } from '@nextui-org/react';


export default function Account() {

    // Firebase information retrival function here

    //Use the useState Hook to manage user info
    //const [userInfo, setUserInfo] = useState([]);

    //Use the useEffect Hook to perform side effect when the component mounts
    /*
    useEffect(() => {
        const userRef = ref(database, "User/w1FJVaOVCsSlsog2b7mUIuG8Xgd2/details");
        get(userRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    setUserInfo(snapshot.val()); // Set userInfo state with fetched data
                } else {
                    console.log("No data found");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    */




    return(
        <Card className=" justify-self-center h-auto w-full my-6 mr-12 bg-blue-900 border-blue-900 row-start-1 row-end-1 col-start-2 col-end-5 " >
                <h5 className="self-center text-4xl font-bold tracking-tight text-white font-mono" > ACCOUNT INFORMATION</h5>
                <div className='grid grid-rows-1 flex-wrap m-s ml-10 mr-10'>
                    {/*{userInfo &&(*/}
                    <Card className=" flex h-auto w-full bg-transparent border-white">
                        <div className='grid grid-cols-2 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr',justifyItems: 'center'}}>    
                            <h2 id="first_name" className="flex dark:text-white text-white font-mono ">FIRST NAME:</h2>
                            <input disabled className="block w-64 rounded-md mr-3 border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="first_name" id="first name" name="fname">{/*{userInfo.firstName}*/}</input>
                        </div>
                        <div className='grid grid-cols-2 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr',justifyItems: 'center' }}>    
                            <h2 id="last_name" className="flex dark:text-white text-white font-mono ">LAST NAME:</h2>
                            <input disabled className="block w-64 rounded-md mr-3 border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="last_name" id="first name" name="fname">{/*{userInfo.lastName}*/}</input>
                        </div>
                        <div className='grid grid-cols-2 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr',justifyItems: 'center' }}>    
                            <h2 id="email_address" className="flex dark:text-white text-white font-mono ">EMAIL ADDRESS:</h2>
                            <input disabled className="block w-64 rounded-md mr-3 border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="email" id="first name" name="fname">{/*{userInfo.email}*/}</input>
                        </div>
                        
                        <div className='grid grid-cols-2 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr',justifyItems: 'center' }}>    
                        <h2 id="empty_content" className="flex dark:text-white text-white font-mono "></h2>

                            <Button
                                disabled
                                type="submit"
                                className="w-40 visible justify-self-end mr-24" color='success'>
                                SAVE
                            </Button>
                        </div>
                        
                    </Card>
                    {/*})}*/}
                </div>
                <div className='flex justify-evenly mt-10'>
                    <Button
                        type="submit"
                        className="w-52" color='red'> 
                        CHANGE PASSWORD
                    </Button>
                    <Button
                        type="submit"
                        className="w-52" color='success'>
                        EDIT INFORMATION
                    </Button>
                </div>
        </Card>
    )
}