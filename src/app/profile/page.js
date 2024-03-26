"use client"; 
import { Card, Button } from 'flowbite-react';
import { useEffect, useState} from 'react';
import { ref , get } from "firebase/database";
import { database } from '../firebaseConfig.js';
import React from 'react';
import SubNavbar from './subNavbar.js'


export default function Home() {

    // Firebase information retrival function here
 
    const [userDetails, setUserDetails] = useState(null);

    const [editButtonClicked, setEditButtonClicked] = useState(false);
    const [saveButtonClicked, setSaveButtonClicked] = useState(false);
    const [activateInputfields, setInputFieldActive] = useState(false);

    const handleEditButtonClick = () => {
        setEditButtonClicked(true);
        setSaveButtonClicked(false)
        setInputFieldActive(true)
        // Additional logic if needed
      };

    const handleSaveButtonClick = () => {
        setSaveButtonClicked(true);
        setEditButtonClicked(false);
        //set input field disable only when the user confirm the edit changes(logic to be created)
          
        setInputFieldActive(false)
        // Additional logic if needed
      };

        

    useEffect(() => {
        const fetchData = async () => {
        
        const userRef = ref(database, 'User');
        
        try {
            const snapshot = (await get(userRef)).child('w1FJVaOVCsSlsog2b7mUIuG8Xgd2');
            if (snapshot.exists()) {
            const userDetails = snapshot.val();
            // Extract required fields (first name, last name, email)
            const { firstName, lastName, email } = userDetails;
            setUserDetails({ firstName, lastName, email });
            } else {
            console.log("No data available");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        };

        fetchData();
    }, []);


    return (
        
        <div className='grid grid-rows-1 grid-cols-4 gap-x-20 row-start-1 row-end-2 col-start-1 col-end-3 bg-dark-night'> 
            <SubNavbar />
       
            <Card className=" justify-self-center h-auto w-full my-6 mr-12 bg-blue-900 border-blue-900 row-start-1 row-end-1 col-start-2 col-end-5 " >
                <h5 className="self-center text-4xl font-bold tracking-tight text-white font-mono" > ACCOUNT INFORMATION</h5>
                {userDetails && (
                <div className='grid grid-rows-1 flex-wrap m-s ml-10 mr-10'>
                    <Card className=" flex h-auto w-full bg-transparent border-white">
                        <div className='grid grid-cols-2 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr',justifyItems: 'center'}}>    
                            <h2 id="first_name" className="flex dark:text-white text-white font-mono ">FIRST NAME:</h2>
                            <input onClick={handleEditButtonClick} disabled={!editButtonClicked || saveButtonClicked} className="block w-64 rounded-md mr-3 border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="first_name" defaultValue={userDetails.firstName} id="first name" name="fname"></input>
                        </div>
                        <div className='grid grid-cols-2 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr',justifyItems: 'center' }}>    
                            <h2 id="last_name" className="flex dark:text-white text-white font-mono ">LAST NAME:</h2>
                            <input onClick={handleEditButtonClick} disabled={!editButtonClicked || saveButtonClicked} className="block w-64 rounded-md mr-3 border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="last_name" defaultValue={userDetails.lastName} id="first name" name="fname"></input>
                        </div>
                        <div className='grid grid-cols-2 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr',justifyItems: 'center' }}>    
                            <h2 id="email_address" className="flex dark:text-white text-white font-mono ">EMAIL ADDRESS:</h2>
                            <input disabled className="block w-64 rounded-md mr-3 border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="email" defaultValue={userDetails.email} id="first name" name="fname"></input>
                        </div>
                        
                        <div className='grid grid-cols-2 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr',justifyItems: 'center' }}>    
                        <h2 id="empty_content" className="flex dark:text-white text-white font-mono "></h2>

                            <Button
                                type="submit"
                                className="w-40 visible justify-self-end mr-24" color='success'
                                onClick={handleSaveButtonClick} 
                                disabled={!editButtonClicked || saveButtonClicked}>
                                SAVE
                            </Button>
                        </div>
                        
                    </Card>
                    
                </div>
                )}
                <div className='flex justify-evenly mt-10'>
                    <Button
                        type="submit"
                        className="w-52" color='red'> 
                        CHANGE PASSWORD
                    </Button>
                    <Button
                        type="submit"
                        className="w-52" color='success'
                        onClick={handleEditButtonClick}
                        disabled= {editButtonClicked}>
                        EDIT INFORMATION
                    </Button>
                </div>
            </Card>

            <div className='flex place-content-center h-auto row-start-2 row-end-2 col-span-4 mb-6'>
                <div>
                    <Button
                        type="submit"
                        className="w-96 text-white">
                        DELETE ACCOUNT
                    </Button>
                </div>
            </div>
        </div>   
    );
}