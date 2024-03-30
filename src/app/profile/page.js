"use client"; 
import { Card, Button } from 'flowbite-react';
import { Fragment, useEffect, useState, useRef} from 'react';
import { ref , get, update } from "firebase/database";
import { database } from '../firebaseConfig.js';
import React from 'react';
import SubNavbar from './subNavbar.js'
import Modal from '@/components/modal.js';
import { useAuth } from '../context/AuthContext.js'


export default function Home() {


    // Firebase information retrival function here
    const [userDetails, setUserDetails] = useState(null);
    const [editButtonClicked, setEditButtonClicked] = useState(false);
    const [saveButtonClicked, setSaveButtonClicked] = useState(false);
    const [activateInputfields, setInputFieldActive] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeletedModal, setShowDeleteModal] = useState(false);
    const [details, setDetails] = useState('');
    const [oldPasswordError, setOldPasswordError] = useState('');     //Create old password error
    const [newPasswordError, setNewPasswordError] = useState('');     //Create new password error
    const [newConfPasswordError, setNewConfPasswordError] = useState('');     //Create new confirm password error
    const oldPassword = useRef();
    const newPassword = useRef();
    const newConfPassword = useRef();
    const { updatePassword } = useAuth()
    // Get the currently signed-in user
    const { currentUser } = useAuth();
   
    async function handleSubmit(e){
        e.preventDefault();

    //Use the useState Hook to manage side bar clicks
    const [tab, setTab] = useState(Account);
    

    //Function that retrive card information base on the menu tab selected
    const handleMenuClick= (compName) => (e) => {
        if(compName == 'MY ACCOUNT'){
            setTab(Account);
        }
        if(compName == 'MY ADDRESS BOOK'){
            setTab(AddressBook);
        }
        if(compName == 'STORED PAYMENT CARDS'){
            setTab(CardStored);
        }
        if(compName == 'MY ORDERS'){
            setTab(MyOrders);
        }
        if(compName == 'MY REVIEWS'){
            setTab(MyReviews);
        }
    };
    
        // Submit form if email and password fields are valid
        if (oldPasswordError == '' && newPasswordError == '' && newConfPasswordError == '') {
    
          try{    
            setOldPasswordError('')
            setNewPasswordError('')
            const currentNewConfirmPassword = document.getElementById('confirmNewPassword').value;
            await updatePassword(currentNewConfirmPassword)
            setShowPasswordModal(false) 
             
          }
          catch (e) {
            console.log(e)  
          }
            
        } else {
            setOldPasswordError("Old Password required")
            setNewPasswordError("New Password is required")
            setNewConfPasswordError("Confirm New Password is required")
        }  
      };

    //Handle  old password change
  const handleOldPasswordChange = async(e) => {
    const isOldPasswordValid = /[^a-zA-Z0-9]/.test(e.target.value) && e.target.value.length >= 8;
    if (!isOldPasswordValid) {
        setOldPasswordError('wrong password');
    } else {
        setOldPasswordError('');
    }
  };

   //Handle  new password change
   const handleNewPasswordChange = (e) => {
    const isNewPasswordValid = /[^a-zA-Z0-9]/.test(e.target.value) && e.target.value.length >= 8;
    // Validate password pattern (at least 8 characters and must contain one special character)
    if (!isNewPasswordValid) {
        setNewPasswordError('Password must be at least 8 characters long and contain one specal character');
    } else {
        setNewPasswordError('');
    }
  };

  //Handle  new confirm password change
  const handleNewConfirmPasswordChange = (e) => {
    const currentNewPassword = document.getElementById('newPassword').value;
    const currentNewConfirmPassword = document.getElementById('confirmNewPassword').value;
    // Validate password pattern (at least 8 characters and must contain one special character)
    const isNewConfPasswordValid = currentNewConfirmPassword === currentNewPassword;
    if (!isNewConfPasswordValid) {
        setNewConfPasswordError('Confirm password does not match the new password');
    } else {
        setNewConfPasswordError('');
    }
  };


    const handleChange = (e) => {
        setUserDetails({
            ...userDetails,
            [e.target.name] : e.target.value
        });
    };

    const openEditDetailsModal = (details) => {
        setDetails(details);
        setShowModal(true);
  };
    
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
      const handleConfirmButtonClick = ()=> {   //THERE IS AN ISSUE WITH THIS BLOCK ON CODE
            // Create a new details object from the form data
            const newDetails = {
                firstName: userDetails.firstName,
                lastName: userDetails.lastName
            };
            const userId = currentUser.id;
            if (!userId) {
                console.log("No current user logged in");
                return;
            }
            const detailsRef = ref(database, 'User/'+ userDetails);
            // Use the update method to update the details
            update(detailsRef, newDetails)
                .then(() => {
                    console.log("Details updated successfully");
                    setShowModal(false);
                    setSaveButtonClicked(true);
                    setEditButtonClicked(false);
                    setInputFieldActive(false)
                })
                .catch((error) => {
                    console.error("Error updating details:", error);
                });
        
      }
      
      // Function that handle confirm button click on delete account dialog
      const handleDeleteAccountButtonClick = () => {
        // Write to Firebase the changes here
        setShowDeleteModal(false);
      }

    useEffect(() => {
        const fetchData = async () => {
            const userId = currentUser.uid;
            if (!userId) {
                console.log(currentUser);
                return;
            }
        
        const userRef = ref(database, 'User/' + userId);
        
        
        try {
            const snapshot = ((await get(userRef)));
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
            <div className='grid grid-rows-1 grid-cols-4 gap-x-5 row-start-1 row-end-2 col-start-1 col-end-3 bg-dark-night'> 
                <SubNavbar />
                
                <Card className=" justify-self-center mx-auto h-auto w-full my-5 mr-20 bg-blue-900 border-blue-900 row-start-1 row-end-1 col-start-2 col-end-5 " >
                    <h5 className="self-center text-4xl font-bold tracking-tight text-white font-mono" > ACCOUNT INFORMATION</h5>
                    {userDetails && (
                    <div className='grid grid-rows-1 flex-wrap m-s ml-10 mr-10'>
                        <Card className=" flex h-auto w-full bg-transparent border-white">
                            <form >
                                <div className='grid grid-cols-2 items-center mb-2 flex-wrap'style={{ gridTemplateColumns: '1fr 1fr',justifyItems: 'center'}}>    
                                    <h2 id="first_name" className="flex dark:text-white text-white font-mono ">FIRST NAME:</h2>
                                    <input onClick={handleEditButtonClick} disabled={!editButtonClicked || saveButtonClicked} className="block w-64 rounded-md mr-3 border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    type="first_name" id="first name" name="firstName" value={userDetails.firstName} onChange={handleChange}/>
                                </div>
                                <div className='grid grid-cols-2 mt-2 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr',justifyItems: 'center' }}>    
                                    <h2 id="last_name" className="flex dark:text-white text-white font-mono ">LAST NAME:</h2>
                                    <input onClick={handleEditButtonClick} disabled={!editButtonClicked || saveButtonClicked} className="block w-64 rounded-md mr-3 border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    type="last_name" id="first name" name="lastName" value={userDetails.lastName} onChange={handleChange}/>
                                </div>
                                <div className='grid grid-cols-2 mt-2 mb-2 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr',justifyItems: 'center' }}>    
                                    <h2 id="email_address" className="flex dark:text-white text-white font-mono ">EMAIL ADDRESS:</h2>
                                    <input disabled className="block w-64 rounded-md mr-3 border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    type="email" defaultValue={userDetails.email} id="first name" name="email"/>
                                </div>
                                
                                <div className='grid grid-cols-2 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr',justifyItems: 'center' }}>    
                                <h2 id="empty_content" className="flex dark:text-white text-white font-mono "></h2>

                                    <Button
                                        type="submit"
                                        className="w-40 visible justify-self-end mr-24" color='success'
                                        onClick={()=> openEditDetailsModal(userDetails)}
                                        disabled={!editButtonClicked || saveButtonClicked}>
                                        SAVE
                                    </Button>
                                </div>
                            </form>
                            
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
            <Modal isVisible={showModal} details = {details} onClose ={()=> setShowModal(false)}>
                <h3 className='text-xl flex self-center font-semibold text-white mb-5'>PERSONAL DETAILS CHANGES</h3>
                <h3 className='flex self-center font-semibold text-white  mb-5'>Are you sure you want to save the changes?</h3>
                <div className='flex justify-evenly mt-10'>
                    <Button type="submit"className="w-52" color="gray" onClick ={()=>setShowModal(false)}> DISMISS</Button>
                    <Button type="submit" className="w-52" color="gray" onClick={()=>handleConfirmButtonClick(details)}>CONFIRM</Button>
                </div>
            </Modal>
            {/*Change password modal */}
            <Modal isVisible={showPasswordModal} onClose ={()=> setShowPasswordModal(false)}>
                <h3 className='text-xl flex self-center font-semibold text-white mb-5'>CHANGE YOUR PASSWORD</h3>
                <h3 className='flex self-center font-semibold text-white mb-5'>Fill out the form below</h3>
                <div className="self-center sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6 text-white font-mono" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="password" className='text-white'>Old Password</label>
                            <input className="block w-full mt-2 rounded-md border-1  py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="password" id="oldPassword" name="oldPassword" required onChange={handleOldPasswordChange} ref={oldPassword}/> 
                            {oldPasswordError && <span style={{ color: 'red', fontSize: '14px' }}>{oldPasswordError}</span>}
                        </div>

                        <div>
                            <label htmlFor="password" className='text-white'>New Password</label>
                            <input className="block w-full mt-2 my-2.5 rounded-md border-0 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="password" id="newPassword" name="newPassword" required onChange={handleNewPasswordChange} ref={newPassword}/>
                            {newPasswordError && <span style={{ color: 'red', fontSize: '14px' }}>{newPasswordError}</span>}
                        </div>

                        <div>
                            <label htmlFor="password" className='text-white'>Confirm New Password</label>
                            <input className="block w-full mt-2 my-2.5 rounded-md border-1 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="password" id="confirmNewPassword" name="confirmNewPassword" required onChange={handleNewConfirmPasswordChange} ref={newConfPassword}/>
                            {newConfPasswordError && <span style={{ color: 'red', fontSize: '14px' }}>{newConfPasswordError}</span>}
                        </div>
                        <div className='flex justify-evenly mt-10'>
                            <Button type="submit"className="w-52 mr-2" color="gray" onClick ={()=>setShowPasswordModal(false)}> DISMISS</Button>
                            <Button type="submit" className="w-52 ml-2" color="gray">CONFIRM</Button>
                        </div>
                    </form>
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