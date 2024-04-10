import { Card, Button } from 'flowbite-react';
import { Fragment, useEffect, useState, useRef} from 'react';
import { ref , get, update, remove } from "firebase/database";
import { database } from '../firebaseConfig.js';
import React from 'react';
import SubNavbar from './subNavbar.js'
import Modal from '@/components/modal.js';
import { useAuth } from '../context/AuthContext.js'
import toast from 'react-hot-toast';
import { deleteUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';



export default function Account() {


    // Firebase information retrival function here
    const [userDetails, setUserDetails] = useState(null);
    const [user, setUser] = useState()
    const router = useRouter();
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
    const [loading, setLoading] = useState(false);
    const oldPassword = useRef();
    const newPassword = useRef();
    const newConfPassword = useRef();
    const [showOldPassword,setShowOldPassword] = useState(false);
    const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);


    const { currentUser, updatepassword, reautentication } = useAuth()
   
    async function handleSubmit(e){
        e.preventDefault();
    
        // Submit form if email and password fields are valid
        if (oldPasswordError == '' && newPasswordError == '' && newConfPasswordError == '') {
    
          try{    
            setOldPasswordError('')
            setNewPasswordError('')

            // reauthenticate 
            await reautentication(oldPassword.current.value)
            

            // changes password
            await updatepassword(newPassword.current.value)
            setShowPasswordModal(false) 
            // Display confirm toast message
            toast.success("Password Updated Successfully!")
          }
          catch (e) {
            toast.error(e)
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

   //Handle new password change
    const handleNewPasswordChange = (e) => {
        const isNewPasswordValid = /[^a-zA-Z0-9]/.test(e.target.value) && e.target.value.length >= 8;
        // Validate password pattern (at least 8 characters and must contain one special character)
        if (!isNewPasswordValid) {
            setNewPasswordError('Password must be at least 8 characters long and contain one special character');
        } else {
            setNewPasswordError('');
        }
    };

  //Handle new confirm password change
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
    };

    const handleSaveButtonClick = () => {
        setSaveButtonClicked(true);
        setEditButtonClicked(false);
        setInputFieldActive(false)
    };
      // Function that handle confirm button click on personal details changes dialog
    const handleConfirmButtonClick = ()=> {   //THERE IS AN ISSUE WITH THIS BLOCK ON CODE
        
        // Create a new details object from the form data
        const newDetails = {
            firstName: userDetails.firstName,
            lastName: userDetails.lastName
        };

        const userId = currentUser.uid;

        if (!userId) {
            toast.error("No current user logged in")
            console.log("No current user logged in");
            return;
        }

        const detailsRef = ref(database, 'User/'+ userId);

        // Use the update method to update the details
        update(detailsRef, newDetails)
            .then(() => {
                console.log("Details updated successfully");
                setShowModal(false);
                setSaveButtonClicked(true);
                setEditButtonClicked(false);
                setInputFieldActive(false)
                // Display confirm toast message
                toast.success("Details Updated Successfully!");
            })
            .catch((error) => {
                toast.error(error);
                console.error("Error updating details:", error);
            });
    }
      
    const handleDeleteAccountButtonClick = async () => {
        try {
            const userId = currentUser.uid;
            if (!userId) {
                console.log(currentUser);
                return;
            }
            setLoading(true);
            // Delete the currently authenticated user's account
            await deleteUser(currentUser);
            // Remove user data from the Realtime Database
            await remove(ref(database, `/User/` + userId));
            console.log('User account deleted successfully.');
            toast.success('Account deleted permanently');
            setShowDeleteModal(false); // Close the delete modal
            router.push('/'); // Redirect to the home page
        } catch (error) {
            console.error('Error deleting user account:', error.message);
            toast.error('Error deleting user account:', error.message);
        } finally {
            setLoading(false);
        }
    };

    // retrieves user data
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
            toast.error("No Data available",error)
            console.error("Error fetching data:", error);
        }
        };

        fetchData();
    }, []);


    return (
        <Fragment>
            <div className='grid grid-rows-1 grid-cols-4 gap-x-20 row-start-1 row-end-2 col-start-1 col-end-3 bg-dark-night justify-items-center'> 
                <SubNavbar />
                
                <div  className="self-center h-auto w-full my-6 mr-12 row-start-1 row-end-1 col-start-2 col-end-5" >
                    {userDetails && (
                    <div className='grid grid-rows-1 mr-12'>
                     <h5 className="justify-self-center  text-4xl font-bold tracking-tight mt-24 text-white font-mono" > ACCOUNT INFORMATION</h5>

                        <div style={{ backgroundColor: 'transparent' }} className="flex justify-center mt-24 h-auto w-full bg-transparent border-white border-b-2 border-teal-500">
                            <form>
                                <div className='grid grid-cols-2  mb-3 flex-wrap'style={{ gridTemplateColumns: '1fr 1fr',justifyItems: 'center'}}>    
                                    <h2 id="first_name" className="flex dark:text-white  text-white text-2xl font-mono ">FIRST NAME:</h2>
                                    <input onClick={handleEditButtonClick} disabled={!editButtonClicked || saveButtonClicked} className="block w-64 rounded-md mr-3 border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    type="first_name" id="first name" name="firstName" value={userDetails.firstName} onChange={handleChange}/>
                                </div>
                                <div className='grid grid-cols-2 mt-3 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr',justifyItems: 'center' }}>    
                                    <h2 id="last_name" className="flex dark:text-white text-white text-2xl font-mono ">LAST NAME:</h2>
                                    <input onClick={handleEditButtonClick} disabled={!editButtonClicked || saveButtonClicked} className="block w-64 rounded-md mr-3 border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    type="last_name" id="first name" name="lastName" value={userDetails.lastName} onChange={handleChange}/>
                                </div>
                                <div className='grid grid-cols-2 mt-3 mb-2 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr',justifyItems: 'center' }}>    
                                    <h2 id="email_address" className="flex dark:text-white text-white text-2xl font-mono ">EMAIL ADDRESS:</h2>
                                    <input disabled className="block w-64 rounded-md mr-3 border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    type="email" defaultValue={userDetails.email} id="first name" name="email"/>
                                </div>
                                
                                <div className='grid grid-cols-2 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr',justifyItems: 'center' }}>    
                                <h2 id="empty_content" className="flex dark:text-white text-white font-mono "></h2>

                                    <Button
                                        className="w-40 visible justify-self-end  mt-6 mb-20 mr-3 self-end" color='success'
                                        onClick={()=> openEditDetailsModal(userDetails)}
                                        disabled={!editButtonClicked || saveButtonClicked}>
                                        SAVE
                                    </Button>
                                </div>
                            </form>
                            
                        </div>
                        
                    </div>
                    )}
                    <div className='flex justify-evenly mt-10'>
                        <Button
                            className="w-52 " color='red'
                            onClick={()=> setShowPasswordModal(true)}
                            disabled={showPasswordModal}>
                            CHANGE PASSWORD
                        </Button>
                        <Button
                            className="w-52" color='success'
                            onClick={handleEditButtonClick}
                            disabled= {editButtonClicked}>
                            EDIT INFORMATION
                        </Button>
                    </div>
                </div>

                <div className='flex place-content-start h-auto row-start-2 row-end-2 col-span-1 mb-6'>
                    <div>
                        <Button
                            type="submit"
                            className="w-auto text-white"
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
                    <Button className="w-52" color="gray" onClick ={()=>setShowModal(false)}> DISMISS</Button>
                    <Button className="w-52"  style={{background: '#00052d', border : '#00052d'}} onClick={()=>handleConfirmButtonClick(details)}>CONFIRM</Button>
                </div>
            </Modal>

            {/*Change password modal */}
            <Modal isVisible={showPasswordModal} onClose ={()=> setShowPasswordModal(false)}>
                <h3 className='text-xl flex self-center font-semibold text-white mb-5'>CHANGE YOUR PASSWORD</h3>
                <h3 className='flex self-center font-semibold text-white mb-5'>Fill out the form below</h3>
                <div className="self-center sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="text-white font-mono" onSubmit={handleSubmit}>
                        <div >
                            <label htmlFor="password" className='text-white'>Old Password</label>
                            <div className="relative">
                                    <input className="block w-full mt-2 rounded-md border-1  py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    id="oldPassword" name="oldPassword" required onChange={handleOldPasswordChange} ref={oldPassword} type={showOldPassword ? "text" : "password"}/>
                                            <button
                                                type="button"
                                                aria-label={
                                                showOldPassword ? "Password Visible" : "Password Invisible."
                                                }
                                                className="text-black dark:text-white"
                                                onClick={() => {
                                                setShowOldPassword((prev) => !prev);
                                                }}
                                            >
                                                {showOldPassword ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="#00052d"
                                                    className="w-6 select-none  cursor-pointer h-6 absolute top-2 right-2"
                                                    tabindex="-1"
                                                >
                                                    <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                                    ></path>
                                                    <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    ></path>
                                                </svg>
                                                ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="#00052d"
                                                    className="w-6 select-none cursor-pointer h-6 absolute top-2 right-2"
                                                >
                                                    <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                                    ></path>
                                                </svg>
                                                )}
                                            </button>
                                            {oldPasswordError && <span style={{ color: 'red', fontSize: '12px' }}>{oldPasswordError}</span>}
                            </div> 
                        </div>

                        <div>
                            <label htmlFor="password" className='text-white'>New Password</label>
                            <div className="relative">
                                    <input className="block w-full mt-2 rounded-md border-1  py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    id="newPassword" name="newPassword" required onChange={handleNewPasswordChange} ref={newPassword} type={showPassword ? "text" : "password"}/>
                                            <button
                                                type="button"
                                                aria-label={
                                                showPassword ? "Password Visible" : "Password Invisible."
                                                }
                                                className="text-black dark:text-white"
                                                onClick={() => {
                                                setShowPassword((prev) => !prev);
                                                }}
                                            >
                                                {showPassword ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="#00052d"
                                                    className="w-6 select-none  cursor-pointer h-6 absolute top-2 right-2"
                                                    tabindex="-1"
                                                >
                                                    <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                                    ></path>
                                                    <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    ></path>
                                                </svg>
                                                ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="#00052d"
                                                    className="w-6 select-none cursor-pointer h-6 absolute top-2 right-2"
                                                >
                                                    <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                                    ></path>
                                                </svg>
                                                )}
                                            </button>
                                            {newPasswordError && <span style={{ color: 'red', fontSize: '12px' }}>{newPasswordError}</span>}
                            </div> 
                        </div>

                        <div>
                            <label htmlFor="password" className='text-white'>Confirm New Password</label>
                            <div className="relative">
                                    <input className="block w-full mt-2 rounded-md border-1  py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    id="confirmNewPassword" name="confirmNewPassword" required onChange={handleNewConfirmPasswordChange} ref={newConfPassword} type={showConfirmPassword ? "text" : "password"}/>
                                            <button
                                                type="button"
                                                aria-label={
                                                showConfirmPassword ? "Password Visible" : "Password Invisible."
                                                }
                                                className="text-black dark:text-white"
                                                onClick={() => {
                                                setShowConfirmPassword((prev) => !prev);
                                                }}
                                            >
                                                {showConfirmPassword ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="#00052d"
                                                    className="w-6 select-none  cursor-pointer h-6 absolute top-2 right-2"
                                                    tabindex="-1"
                                                >
                                                    <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                                    ></path>
                                                    <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                    ></path>
                                                </svg>
                                                ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke-width="1.5"
                                                    stroke="#00052d"
                                                    className="w-6 select-none cursor-pointer h-6 absolute top-2 right-2"
                                                >
                                                    <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                                    ></path>
                                                </svg>
                                                )}
                                            </button>
                                            {newConfPasswordError && <span style={{ color: 'red', fontSize: '14px' }}>{newConfPasswordError}</span>}
                            </div> 
                        </div>
                        <div className='flex justify-evenly my-10'>
                            <Button type="submit"className="w-52 mr-2 text-white" color='gray' onClick ={()=>setShowPasswordModal(false)}> DISMISS</Button>
                            <Button type="submit" className="w-52 ml-2" style={{background: '#00052d', border : '#00052d'}}>CONFIRM</Button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/*Delete account modal */}          
            <Modal isVisible={showDeletedModal} onClose ={()=> setShowDeleteModal(false)}>
                <h3 className='text-xl flex self-center font-semibold text-white mb-5'>DELETE ACCOUNT</h3>
                <h3 className='flex self-center font-semibold text-white  mb-5'>Are you sure you want to delete yur acount?</h3>
                <div className='flex justify-evenly mt-10 mb-10'>
                    <Button type="submit" className="w-52" color="gray" onClick ={()=>setShowDeleteModal(false)}> DISMISS</Button>
                    <Button type="submit" className="w-52"  style={{background: '#00052d', border : '#00052d'}} onClick={()=>handleDeleteAccountButtonClick()}>CONFIRM</Button>
                </div>
            </Modal>
        </Fragment>
    );
}