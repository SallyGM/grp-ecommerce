"use client"; 
import { Card, Button } from 'flowbite-react';
import { Fragment, useEffect, useState} from 'react';
import { ref , get } from "firebase/database";
import { database } from '../firebaseConfig.js';
import React from 'react';
import SubNavbar from './subNavbar.js'
import Modal from '@/components/modal.js';

export default function Home() {

    // Firebase information retrival function here
    const [userDetails, setUserDetails] = useState(null);
    const [editButtonClicked, setEditButtonClicked] = useState(false);
    const [saveButtonClicked, setSaveButtonClicked] = useState(false);
    const [activateInputfields, setInputFieldActive] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeletedModal, setShowDeleteModal] = useState(false);
    
    const handleEditButtonClick = () => {
        setEditButtonClicked(true);
        setSaveButtonClicked(false)
        setInputFieldActive(true)
        // Additional logic if needed
      };

    const handleSaveButtonClick = () => {
        setSaveButtonClicked(true);
        setEditButtonClicked(false);
        setInputFieldActive(false)
        // Additional logic if needed
      };
      // Function that handle confirm button click on personal details changes dialog
      const handleConfirmButtonClick = () => {
        // Write to Firebase the changes here
        setShowModal(false);
        setSaveButtonClicked(true);
        setEditButtonClicked(false);
        setInputFieldActive(false)
      }
      // Function that handle confirm button click on reset password changes dialog
      const handleConfirmPasswordButtonClick = () => {
        // Write to Firebase the changes here
        setShowPasswordModal(false);
      }
      // Function that handle confirm button click on delete account dialog
      const handleDeleteAccountButtonClick = () => {
        // Write to Firebase the changes here
        setShowDeleteModal(false);
      }

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
        <Fragment>
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
                                onClick={()=> setShowModal(true)}
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
                        className="w-52 " color='red'
                        onClick={()=> setShowPasswordModal(true)}
                        disabled={showPasswordModal}>
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
                        className="w-96 text-white"
                        onClick={()=> setShowDeleteModal(true)}
                        disabled={showDeletedModal}>
                        DELETE ACCOUNT
                    </Button>
                </div>
            </div>
        </div>   
        {/*Personal details modal */}
        <Modal isVisible={showModal} onClose ={()=> setShowModal(false)}>
            <h3 className='text-xl flex self-center font-semibold text-white mb-5'>PERSONAL DETAILS CHANGES</h3>
            <h3 className='flex self-center font-semibold text-white  mb-5'>Are you sure you want to save the changes?</h3>
            <div className='flex justify-evenly mt-10'>
                <Button type="submit"className="w-52" color="gray" onClick ={()=>setShowModal(false)}> DISMISS</Button>
                <Button type="submit" className="w-52" color="gray" onClick={()=>handleConfirmButtonClick()}>CONFIRM</Button>
            </div>
        </Modal>
        {/*Change password modal */}
        <Modal isVisible={showPasswordModal} onClose ={()=> setShowPasswordModal(false)}>
            <h3 className='text-xl flex self-center font-semibold text-white mb-5'>CHANGE YOUR PASSWORD</h3>
            <h3 className='flex self-center font-semibold text-white mb-5'>Fill out the form below</h3>
            <div className="self-center sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6 text-white font-mono" action="#" method="POST onSubmit={handleSubmit}">
                <div>
                <label htmlFor="email" className='text-white'>Old Password</label>
                <input className="block w-full mt-2 rounded-md border-1  py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="password" id="old_password" name="old_password" required/> 
                </div>

                <div>
                <label htmlFor="password" className='text-white'>New Password</label>
                <input className="block w-full mt-2 my-2.5 rounded-md border-0 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="password" id="new_password" name="new_password" required/>
                </div>

                <div>
                <label htmlFor="password" className='text-white'>Confirm New Password</label>
                <input className="block w-full mt-2 my-2.5 rounded-md border-1 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="password" id="confirm_new_password" name="confirm_new_password" required/>
                </div>
                </form>
            </div>
            <div className='flex justify-evenly mt-10'>
                <Button type="submit"className="w-52" color="gray" onClick ={()=>setShowPasswordModal(false)}> DISMISS</Button>
                <Button type="submit" className="w-52" color="gray" onClick={()=>handleConfirmPasswordButtonClick()}>CONFIRM</Button>
            </div>
        </Modal>
        {/*Delete account modal */}          
        <Modal isVisible={showDeletedModal} onClose ={()=> setShowDeleteModal(false)}>
            <h3 className='text-xl flex self-center font-semibold text-white mb-5'>DELETE ACCOUNT</h3>
            <h3 className='flex self-center font-semibold text-white  mb-5'>Are you sure you want to delete yur acount?</h3>
            <div className='flex justify-evenly mt-10'>
                <Button type="submit"className="w-52" color="gray" onClick ={()=>setShowDeleteModal(false)}> DISMISS</Button>
                <Button type="submit" className="w-52" color="gray" onClick={()=>handleDeleteAccountButtonClick()}>CONFIRM</Button>
            </div>
        </Modal>
        </Fragment>
    );
}