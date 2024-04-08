"use client"; 
import { Card, Button } from 'flowbite-react';
import React, { Fragment } from 'react';
import { ref , get, update ,push, set, remove} from "firebase/database";
import { useEffect, useState} from 'react';
import { database } from '../../firebaseConfig';
import SubNavbar from '../subNavbar'
import Modal from '@/components/modal.js';
import { useAuth } from '@/app/context/AuthContext.js';
import toast from 'react-hot-toast';
import { Tooltip } from 'flowbite-react';

export default function CardStored() {
 
    const [cardDetails, setCardDetails] = useState([]);
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [showEditCard, setShowEditCard] = useState(false);
    const [showDeleteCard, setShowDeleteCard] = useState(false);
    const [card, setCard] = useState('');
    const [formData, setFormData] = useState({
        cardNumber: '',
        sortCode: '',
        expDate: '',
        securityCode: '',
        cardName: '',
        billAddress:''
    });

    // Get the currently signed-in user
    const { currentUser } = useAuth()

    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        });
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();

        // Create a new card object from the form data
        const newCard = {
            cardNumber: formData.cardNumber,
            sortCode: formData.securityCode,
            expDate: formData.expDate,
            securityCode: formData.securityCode,
            cardName: formData.cardName,
            billAddress: formData.billAddress
        };
        const userId = currentUser.uid;
            if (!userId) {
                console.log("No current user logged in");
                return;
            }

        // Generate a unique key for the new card
        const newCardKey = push(ref(database, 'User/' + userId + '/card')).key;

        // Set the new card object at the specified path in the database
        set(ref(database, 'User/' + userId + '/card/' + newCardKey), newCard)
            .then(() => {
                toast.success('New card added successfully');
                console.log('New card added successfully');
                setCardDetails(prevCardDetails => [...prevCardDetails, { id: newCardKey, ...newCard }]);
                setFormData({
                    cardNumber: '',
                    sortCode: '',
                    expDate: '',
                    securityCode: '',
                    cardName:'',
                    billAddress:''
                });
                setShowAddCardModal(false);
            })
            .catch((error) => {
                toast.error('Error adding new card:', error);
                console.error('Error adding new card:', error);
            });
    };
    
    // Function to open edit card modal and set card
    const openEditCardModal = (card) => {
        setCard(card);
        setShowEditCard(true);
  };
    // Function to open delete card modal and set card
    const openDeleteCardModal = (card) => {
        setCard(card);
        setShowDeleteCard(true);
    };

    // Function that handle confirm button click on edit card dialog
    const handleConfirmEditCardClick = (card) => {
        const userId = currentUser.uid;
            if (!userId) {
                console.log("No current user logged in");
                return;
            }
        const cardRef = ref(database, 'User/' + userId + '/card/'+ card.id);
        // Use the update method to update the address
        update(cardRef, card)
            .then(() => {
                toast.success("Card updated successfully");
                console.log("Card updated successfully");
                // Update local state with the new values
                setCardDetails(prevCardDetails => {
                    // Find the index of the updated card in the array
                    const updatedIndex = prevCardDetails.findIndex(crd => crd.id === card.id);
                    // Create a new array with the updated address
                    const updatedCardDetails = [...prevCardDetails];
                    updatedCardDetails[updatedIndex] = {
                        ...updatedCardDetails[updatedIndex],
                        ...card // Merge the updated fields into the card
                    };
                    return updatedCardDetails;
                    });
                setShowEditCard(false);
            })
            .catch((error) => {
                toast.error("Error updating card:", error);
                console.error("Error updating card:", error);
            });
    }
    // Function that handle confirm button click on delete card dialog
    const handleConfirmDeleteCardClick = (card) => {
        const userId = currentUser.uid;
            if (!userId) {
                console.log("No current user logged in");
                return;
            }
        const cardRef = ref(database, 'User/' + userId + '/card/'+ card.id);
        // Use the update method to update the address
        remove(cardRef, card)
            .then(() => {
                toast.success("Card deleted successfully");
                console.log("Card deleted successfully");
                // Update local state with the new values
                setCardDetails(prevCardDetails => prevCardDetails.filter(crd => crd.id !== card.id));
                setShowDeleteCard(false);
            })
            .catch((error) => {
                toast.error("Error deleting card:", error);
                console.error("Error deleting card:", error);
            });
    }

    useEffect(() => {
        const userId = currentUser.uid;
            if (!userId) {
                console.log("No current user logged in");
                return;
            }
        const cardRef = ref(database, "User");
        get(cardRef).then((snapshot) => {
            if (snapshot.exists()) {
                const cardArray = Object.entries(snapshot.child(userId).child('card').val()).map(([id, data]) => ({
                    id,
                    ...data,
                }));
                setCardDetails(cardArray);
            } else {
                console.log("No data found")
            }
        }).catch((error) => {
            console.error(error);
        });
    }, []); // Removed card from the dependency array

    console.log(cardDetails);

    return(
        <Fragment>
            <div className='grid grid-rows-1 grid-cols-4 gap-x-20 row-start-1 row-end-2 col-start-1 col-end-3 bg-dark-night justify-items-center'> 
                <SubNavbar />

                <div style={{ backgroundColor: 'transparent' }} className=" content-center h-auto w-full my-6 mr-12 mt-24 bg-blue-900 border-blue-900 row-start-1 row-end-1 col-start-2 col-end-5 " >
                    <h5 className="justify-self-center text-center mb-6 text-4xl font-bold tracking-tight text-white font-mono" > MY STORED CARDS</h5>

                    <div className='rounded-none border-0 border-b-2 border-white grid grid-cols-6 flex-wrap ml-10 mr-10 p-3' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', justifyItems: 'center' }}>
                        <h3 className='  font-bold tracking-tight dark:text-white  text-white'>Card Type</h3>
                        <h3 className='  font-bold tracking-tight  dark:text-white text-white'>Name on Card</h3>
                        <h3 className='  font-bold tracking-tight  dark:text-white text-white'>Card Ending</h3>
                        <h3 className='  font-bold tracking-tight  dark:text-white text-white'>Billing Address</h3>
                        <h3 className='  font-bold tracking-tight  dark:text-white text-white'></h3>
                        <h3 className='  font-bold tracking-tight  dark:text-white text-white'></h3>
                    </div>
                    {/*This is the card that can be used as a component nested in cardStored component */}
                    <div className='grid grid-rows-3 flex-wrap m-s ml-10 mr-10'>
                    {cardDetails.map((c) => (
                        <Card style={{ backgroundColor: 'transparent' }} key={c.id} className=" flex h-auto w-full rounded-none border-0 border-b-2 border-white mt-6">
                            <div className='grid grid-cols-6 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',justifyItems: 'center' }}>    

                                <img id = "card_type" class="first-line:h-8 w-8 flex-wrap justify-self-center" src="https://www.iconbolt.com/iconsets/payment-method/american-card-express-method-payment.svg" alt="card"/>
                                <h2 id="card_name" className="flex dark:text-white text-white font-mono ">{c.cardName}</h2>
                                <h2 id="card_ending" className="flex dark:text-white text-white font-mono ">{c.cardNumber.slice(-4)}</h2>
                                <h2 id="billing_address" className="flex dark:text-white text-white font-mono ">{c.billAddress}</h2>
                                <Tooltip content='Edit your card'>
                                <img class="first-line:h-6 w-6 flex-wrap justify-self-end" style={{ filter: 'brightness(0) invert(1)' }} src="https://www.iconbolt.com/iconsets/darkwing-free/edit.svg" alt="edit card" onClick={()=> openEditCardModal(c)} disabled={showEditCard}/>
                                </Tooltip>
                                <Tooltip content='Delete your card'>
                                <img class="first-line:h-5 w-5 flex-wrap justify-self-center" style={{ filter: 'brightness(0) invert(1)' }} src="https://www.iconbolt.com/iconsets/flowbite-solid/trash-bin.svg" alt= "delete card" onClick={()=> openDeleteCardModal(c)} disabled={showDeleteCard}/>
                                </Tooltip>

                            </div>
                        </Card>
                    ))}

                    </div>  
                    <div className='flex justify-self-start mt-10 ml-10 '>
                        <Button
                            type="submit"
                            className="w-60 inline-flex text-white self-center " color='blue'
                            onClick={()=> setShowAddCardModal(true)}
                            disabled={showAddCardModal}> 
                            ADD NEW CARD
                            <svg className="w-6 h-6 ml-3" fill='currentColor' stroke='white' aria-hidden="true" xmlns="https://reactsvgicons.com/search?q=add" viewBox="0 0 512 512">
                                <path fill="none" stroke="currentColor" strokeMiterlimit={10} strokeWidth={32} d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"/>
                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M256 176v160M336 256H176"/>
                            </svg>
                        </Button>
                    </div>
                    
                </div>
            </div>
        {/*Add card modal */}
        <Modal isVisible={showAddCardModal} onClose ={()=> setShowAddCardModal(false)}>
            <h3 className='text-xl flex self-center font-semibold text-white mb-5'>ADD NEW CARD</h3>
            <h3 className='flex self-center font-semibold text-white mb-5'>Add card by filling the details below</h3>
            <div className="self-center sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6 text-white font-mono" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="number" className='text-white'>Card Number</label>
                        <input className="block w-full mt-2 rounded-md border-1  py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="tel" inputmode="numeric" id="cardNumber" name="cardNumber" maxLength={16} placeholder='4625 2563 2356 8514' required value={formData.cardNumber} onChange={handleChange}/> 
                    </div>

                    <div>
                        <label htmlFor="number" className='text-white'>Sort Code</label>
                        <input className="block w-full mt-2 rounded-md border-1  py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="tel" inputmode="numeric" id="sortCode" name="sortCode" maxLength={6} placeholder='26-02-54' required value={formData.sortCode} onChange={handleChange}/> 
                    </div>

                    <div className='inline-flex justify-evenly'>
                        <div className='mr-5'>
                            <label htmlFor="number" className='text-white'>Exp.Date</label>
                            <input className="block w-52 mt-2 my-2.5 rounded-md border-0 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="month" id="expDate" name="expDate" placeholder='12/24' required value={formData.expDate} onChange={handleChange}/>
                        </div> 
                        <div className='ml-5'>
                            <label htmlFor="number" className='inline-flex text-white'>CVV
                            <Tooltip content="Three digit code on the back of your card">
                                <svg  className = 'ml-2' width="24px" height="24px" stroke-width="1.5" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF">
                                  <path d="M12 11.5V16.5" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                  <path d="M12 7.51L12.01 7.49889" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </Tooltip>
                            </label>
                            <input className="block w-full mt-2 my-2.5 rounded-md border-0 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="text" id="securityCode" name="securityCode" maxLength={3} placeholder='342' required value={formData.securityCode} onChange={handleChange}/>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="text" className='text-white'>Card Holder</label>
                        <input className="block w-full mt-2 my-2.5 rounded-md border-1 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="text" id="cardName" name="cardName" placeholder='John Wick' required value={formData.cardName} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="text" className='text-white'>Billing Address</label>
                        <input className="block w-full mt-2 my-2.5 rounded-md border-1 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="text" id="billAddress" name="billAddress" placeholder='3 Admaston road' required value={formData.billAddress} onChange={handleChange}/>
                    </div>
                    <div className='flex justify-evenly mt-10'>
                        <Button className="w-52 mr-1 mb-2" color="gray" onClick ={()=>setShowAddCardModal(false)}> DISMISS</Button>
                        <Button type="submit" className="w-52 ml-1 mb-2"  style={{background: '#00052d', border : '#00052d'}}>CONFIRM</Button>
                    </div>
                </form>
            </div>
            
        </Modal>
        {/*Edit card modal */}
        <Modal isVisible={showEditCard} card = {card} onClose ={()=> setShowEditCard(false)}>
            <h3 className='text-xl flex self-center font-semibold text-white mb-5'>EDIT YOUR CARD</h3>
            <h3 className='flex self-center font-semibold text-white mb-5'>Edit your card by filling the details below</h3>
            <div className="self-center sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6 text-white font-mono" method="POST onSubmit={handleSubmit}">
                    <div>
                    <label htmlFor="number" className='text-white'>Card Number</label>
                    <input className="block w-full mt-2 rounded-md border-1  py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="tel" inputmode="numeric" id="card_number" name="card_number" maxLength={16} placeholder='4625 2563 2356 8514' required value={card.cardNumber} onChange={(e) => setCard({ ...card, cardNumber: e.target.value })}/> 
                    </div>

                    <div>
                    <label htmlFor="number" className='text-white'>Sort Code</label>
                    <input className="block w-full mt-2 rounded-md border-1  py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="tel" inputmode="numeric" id="sort_code" name="sort_code" maxLength={6} placeholder='26-02-54' required value={card.sortCode} onChange={(e) => setCard({ ...card, sortCode: e.target.value })}/> 
                    </div>

                    <div className='inline-flex justify-evenly'>
                        <div className='mr-3'>
                            <label htmlFor="number" className='text-white'>Exp.Date</label>
                            <input className="block w-full mt-2 my-3.5 rounded-md border-0 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="month" id="exp_date" name="exp_date" placeholder='12/24' required value={card.expDate} onChange={(e) => setCard({ ...card, expDate: e.target.value })}/>
                        </div> 
                        <div className='ml-3'>
                            <label htmlFor="number" className='inline-flex text-white'>CVV
                            <Tooltip content="Three digit code on the back of your card">
                                <svg  className = 'ml-2' width="24px" height="24px" stroke-width="1.5" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF">
                                  <path d="M12 11.5V16.5" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                  <path d="M12 7.51L12.01 7.49889" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </Tooltip>
                            </label>
                            <input className="block w-full mt-2 my-3.5 rounded-md border-0 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="text" id="cvv" name="cvv" maxLength={3} placeholder='342' required value={card.securityCode} onChange={(e) => setCard({ ...card, securityCode: e.target.value })}/>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="text" className='text-white'>Card Holder</label>
                        <input className="block w-full mt-2 my-2.5 rounded-md border-1 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="text" id="card_holder" name="card_holder" placeholder='John Wick' required value={card.cardName} onChange={(e) => setCard({ ...card, fullName: e.target.value })}/>
                    </div>
                    <div>
                        <label htmlFor="text" className='text-white'>Billing Address</label>
                        <input className="block w-full mt-2 my-2.5 rounded-md border-1 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="text" id="billAddress" name="billAddress" placeholder='John Wick' required value={card.billAddress} onChange={(e) => setCard({ ...card, billAddress: e.target.value })}/>
                    </div>
                </form>
            </div>
            <div className='flex justify-evenly mt-10 mb-2'>
                <Button type="submit"className="w-52" color="gray" onClick ={()=>setShowEditCard(false)}> DISMISS</Button>
                <Button type="submit" className="w-52"  style={{background: '#00052d', border : '#00052d'}} onClick={()=>handleConfirmEditCardClick(card)}>CONFIRM</Button>
            </div>
        </Modal>
        {/*Delete card modal */}
        <Modal isVisible={showDeleteCard} card = {card} onClose ={()=> setShowDeleteCard(false)}>
            <h3 className='text-xl flex self-center font-semibold text-white mb-5'>DELETE CARD</h3>
            <h3 className='flex self-center font-semibold text-white  mb-5'>Are you sure you want to delete this card?</h3>
            <div className='flex justify-evenly mt-10 mb-2'>
                <Button type="submit"className="w-52" color="gray" onClick ={()=>showDeleteCard(false)}> DISMISS</Button>
                <Button type="submit" className="w-52"  style={{background: '#00052d', border : '#00052d'}} onClick={()=>handleConfirmDeleteCardClick(card)}>CONFIRM</Button>
            </div>
        </Modal>
        </Fragment>
    )
}

