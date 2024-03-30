"use client"; 
import { Card, Button } from 'flowbite-react';
import React, { Fragment } from 'react';
import SubNavbar from '../subNavbar.js'
import { useEffect, useState} from 'react';
import { ref , get, update ,push, set, remove} from "firebase/database";
import { database } from '@/app/firebaseConfig.js';
import Modal from '@/components/modal.js';
import { useAuth } from '@/app/context/AuthContext.js';


export default function AddressBook() {

    const [addressDetails, setAddressDetails] = useState([]);
    const [showAddAddressModal, setShowAddAddressModal] = useState(false);
    const [showEditAddress, setShowEditAddress] = useState(false);
    const [showDeleteAddress, setShowDeleteAddress] = useState(false);
    const [address, setAddress] = useState('');
    const [formData, setFormData] = useState({
        street: '',
        postCode: '',
        city: '',
        country: ''
    });

    // Get the currently signed-in user
    const { currentUser } = useAuth()

    // Function to open delete address modal and set card
    const openDeleteAddressModal = (address) => {
        setAddress(address);
        setShowDeleteAddress(true);
    };

    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        });
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();

        // Create a new address object from the form data
        const newAddress = {
            street: formData.street,
            postCode: formData.postCode,
            city: formData.city,
            country: formData.country
        };
        const userId = currentUser.uid;
            if (!userId) {
                console.log("No current user logged in");
                return;
            }

        // Generate a unique key for the new address
        const newAddressKey = push(ref(database, 'User/' + userId +'/address')).key;

        // Set the new address object at the specified path in the database
        set(ref(database, 'User/' + userId +'/address/' + newAddressKey), newAddress)
            .then(() => {
                console.log('New address added successfully');
                setFormData({
                    street: '',
                    postCode: '',
                    city: '',
                    country: ''
                });
                // Update the local state with the new card
                setAddressDetails(prevAddressDetails => [...prevAddressDetails, { id: newAddressKey, ...newAddress }]);
                setShowAddAddressModal(false);
            })
            .catch((error) => {
                console.error('Error adding new address:', error);
            });
    };
    
    // Function that handle confirm button click on edit address dialog
    const handleConfirmEditAddressClick = (address) => {
        const userId = currentUser.uid;
            if (!userId) {
                console.log("No current user logged in");
                return;
            }
        const addressRef = ref(database, 'User/'+ userId + '/address/'+ address.id);
        // Use the update method to update the address
        update(addressRef, address)
            .then(() => {
                console.log("Address updated successfully");
                // Update local state with the new values
                setAddressDetails(prevAddressDetails => {
                // Find the index of the updated address in the array
                const updatedIndex = prevAddressDetails.findIndex(addr => addr.id === address.id);
                // Create a new array with the updated address
                const updatedAddressDetails = [...prevAddressDetails];
                updatedAddressDetails[updatedIndex] = {
                    ...updatedAddressDetails[updatedIndex],
                    ...address // Merge the updated fields into the address
                };
                return updatedAddressDetails;
                });
                setShowEditAddress(false);
            })
            .catch((error) => {
                console.error("Error updating address:", error);
            });
    }
    // Function that handle confirm button click on delete address dialog
    const handleConfirmDeleteAddressClick = (address) => {
        const userId = currentUser.uid;
            if (!userId) {
                console.log("No current user logged in");
                return;
            }
        const AddressRef = ref(database, 'User/'+ userId + 'address/${address.id}');
        // Use the update method to update the address
        remove(AddressRef, address)
            .then(() => {
                console.log("Address deleted successfully");
                // Update local state with the new values
                setAddressDetails(prevAddressDetails => prevAddressDetails.filter(addr  => addr .id !== address.id));
                setShowDeleteAddress(false);
            })
            .catch((error) => {
                console.error("Error deleting address:", error);
            });
    }
    // Function to open edit address modal and set address
    const openEditAddressModal = (address) => {
        setAddress(address);
        setShowEditAddress(true);
  };

    useEffect(() => {
        const userId = currentUser.uid;
            if (!userId) {
                console.log("No current user logged in");
                return;
            }
        const addressRef = ref(database, "User");
        get(addressRef).then((snapshot) => {
            if (snapshot.exists()) {
                const addressArray = Object.entries(snapshot.child(userId).child('address').val()).map(([id, data]) => ({
                    id,
                    ...data,
                }));
                setAddressDetails(addressArray);
            } else {
                console.log("No data found")
            }
        }).catch((error) => {
            console.error(error);
        });
    }, []); // Removed card from the dependency array

    console.log(addressDetails);

    return(
        <Fragment>
        <div className='grid grid-rows-1 grid-cols-4 gap-x-20 row-start-1 row-end-2 col-start-1 col-end-3 bg-dark-night'> 
            <SubNavbar />
            <Card className=" justify-self-center h-auto w-full my-6 mr-12 bg-blue-900 border-blue-900 row-start-1 row-end-1 col-start-2 col-end-5 " >
                <h5 className="self-center text-4xl font-bold tracking-tight text-white font-mono" > MY ADDRESS BOOK</h5>
                
                <div className='top_bar_basket grid grid-cols-6 flex-wrap ml-10 mr-10 p-3' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', justifyItems: 'center' }}>
                    <h3 className=' ext-4xl font-bold tracking-tight dark:text-white  text-white'>Street Address</h3>
                    <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'>City</h3>
                    <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'>Country</h3>
                    <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'>Postal Code</h3>
                    <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'></h3>
                    <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'></h3>
                </div>
                {/*This is the card that can be used as a component nested in addressBook component */}
                <div className='grid grid-rows-3 flex-wrap m-s ml-10 mr-10'>
                {addressDetails.map((a) => (
                    <Card key={a.id} className=" flex h-auto w-full mt-2 bg-transparent border-white">
                        <div className='grid grid-cols-6 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',justifyItems: 'center' }}>    
                            <h2 id="street_name" className="flex dark:text-white text-white font-mono ">{a.street}</h2>
                            <h2 id="city" className="flex dark:text-white text-white font-mono ">{a.city}</h2>
                            <h2 id="country" className="flex dark:text-white text-white font-mono ">{a.country}</h2>
                            <h2 id="postal_code" className="flex dark:text-white text-white font-mono ">{a.postCode}</h2>
                            <img className="first-line:h-6 w-6 flex-wrap justify-self-end" style={{ filter: 'brightness(0) invert(1)' }} src="https://www.iconbolt.com/iconsets/darkwing-free/edit.svg" alt="edit address" onClick={()=> openEditAddressModal(a)} disabled={showEditAddress}/>
                            <img className="first-line:h-5 w-5 flex-wrap justify-self-center" style={{ filter: 'brightness(0) invert(1)' }} src="https://www.iconbolt.com/iconsets/flowbite-solid/trash-bin.svg" alt= "delete address" onClick={()=> openDeleteAddressModal(a)} disabled={showDeleteAddress} />
                        </div>
                    </Card>
                ))}
                </div>    
                <div className='flex justify-self-start mt-10 ml-10'>
                    <Button
                        type="submit"
                        className="w-60 inline-flex text-white self-center " color='blue'
                        onClick={()=> setShowAddAddressModal(true)}
                        disabled={showAddAddressModal}> 
                        ADD NEW ADDRESS
                        <svg className="w-6 h-6 ml-3" fill='currentColor' stroke='none' aria-hidden="true" xmlns="https://reactsvgicons.com/search?q=add" viewBox="0 0 24 24">
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M18.364 17.364L12 23.728l-6.364-6.364a9 9 0 1112.728 0zM11 10H8v2h3v3h2v-3h3v-2h-3V7h-2v3z" />
                        </svg>
                    </Button>
                </div>
            </Card>
        </div>
        {/*Add address modal */}
        <Modal isVisible={showAddAddressModal} onClose ={()=> setShowAddAddressModal(false)}>
            
            <h3 className='text-xl flex self-center font-semibold text-white mb-5'>ADD NEW ADDRESS</h3>
            <h3 className='flex self-center font-semibold text-white mb-5'>Add new address by filling the details below</h3>
            <div className="self-center sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6 text-white font-mono" onSubmit={handleSubmit}>
                    <div>
                    <label htmlFor="text" className='text-white'>Street Name</label>
                    <input className="block w-full mt-2 rounded-md border-1  py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="text" id="street" name="street" required value={formData.street} onChange={handleChange}/>
                    </div>

                    <div className='inline-flex'>
                        <div className='mr-3'>
                            <label htmlFor="text" className='text-white'>Post Code</label>
                            <input className="block w-full mt-2 my-2.5 rounded-md border-0 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="text" id="postCode" name="postCode" required value={formData.postCode} onChange={handleChange}/>
                        </div> 
                        <div className='ml-3'>
                            <label htmlFor="text" className='text-white'>City</label>
                            <input className="block w-full mt-2 my-2.5 rounded-md border-0 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="text" id="city" name="city" required value={formData.city} onChange={handleChange}/>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="text" className='text-white'>Country</label>
                        <input className="block w-full mt-2 my-2.5 rounded-md border-1 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="text" id="country" name="country" required value={formData.country} onChange={handleChange}/>
                    </div>
                    <div className='flex justify-evenly mt-10'>
                        <Button className="w-52 mr-1" color="gray" onClick ={()=>setShowAddAddressModal(false)}> DISMISS</Button>
                        <Button type="submit" className="w-52 ml-1" color="gray">CONFIRM</Button>
                    </div>
                </form>
            </div>
            
        </Modal>
        {/*Edit address on list modal */}
        <Modal isVisible={showEditAddress} address = {address} onClose ={()=> setShowEditAddress(false)}>
            <h3 className='text-xl flex self-center font-semibold text-white mb-5'>EDIT YOUR ADDRESS</h3>
            <h3 className='flex self-center font-semibold text-white mb-5'>Edit your address by modifying the details below</h3>
            <div className="self-center sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6 text-white font-mono">

                <div>
                <label htmlFor="text" className='text-white'>Street Name</label>
                <input className="block w-full mt-2 rounded-md border-1  py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text" id="street_name" name="street_name" required value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })}/>
                </div>

                <div className='inline-flex'>
                    <div className='mr-3'>
                        <label htmlFor="text" className='text-white'>Post Code</label>
                        <input className="block w-full mt-2 my-2.5 rounded-md border-0 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="text" id="post_code" name="post_code" value={address.postCode} required onChange={(e) => setAddress({ ...address, postCode: e.target.value })}/>
                    </div> 
                    <div className='ml-3'>
                        <label htmlFor="text" className='text-white'>City</label>
                        <input className="block w-full mt-2 my-2.5 rounded-md border-0 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="text" id="city" name="city" required value={address.City} onChange={(e) => setAddress({ ...address, City: e.target.value })}/>
                    </div>
                </div>

                <div>
                <label htmlFor="text" className='text-white'>Country</label>
                <input className="block w-full mt-2 my-2.5 rounded-md border-1 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text" id="country" name="country" required value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })}/>
                </div>
                </form>
            </div>
            <div className='flex justify-evenly mt-10'>
                <Button type="submit"className="w-52" color="gray" onClick ={()=>setShowAddAddressModal(false)}> DISMISS</Button>
                <Button type="submit" className="w-52" color="gray" onClick={()=>handleConfirmEditAddressClick(address)}>CONFIRM</Button>
            </div>
        </Modal>
        {/*Delete address modal */}          
        <Modal isVisible={showDeleteAddress} address = {address} onClose ={()=> setShowDeleteAddress(false)}>
            <h3 className='text-xl flex self-center font-semibold text-white mb-5'>DELETE ADDRESS</h3>
            <h3 className='flex self-center font-semibold text-white  mb-5'>Are you sure you want to delete this address?</h3>
            <div className='flex justify-evenly mt-10'>
                <Button type="submit"className="w-52" color="gray" onClick ={()=>showDeleteAddress(false)}> DISMISS</Button>
                <Button type="submit" className="w-52" color="gray" onClick={()=>handleConfirmDeleteAddressClick(address)}>CONFIRM</Button>
            </div>
        </Modal>
        </Fragment>
        
    )
}