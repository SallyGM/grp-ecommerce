"use client"; 
import { Card, Button } from 'flowbite-react';
import React, { Fragment } from 'react';
import { ref , get } from "firebase/database";
import { useEffect, useState} from 'react';
import { database } from '../../firebaseConfig';
import SubNavbar from '../subNavbar'
import Modal from '@/components/modal.js';

export default function CardStored() {
    // Firebase information retrival function here
 
    const [cardDetails, setCardDetails] = useState([]);
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [showEditCard, setShowEditCard] = useState(false);
    const [showDeleteCard, setShowDeleteCard] = useState(false);

    // Function that handle confirm button click on add new card dialog
    const handleConfirmAddCardClick = () => {
        // Write to Firebase the changes here
        setShowAddCardModal(false);
    }
    // Function that handle confirm button click on edit card dialog
    const handleConfirmEditCardClick = () => {
        // Write to Firebase the changes here
        setShowEditCard(false);
    }
    // Function that handle confirm button click on delete card dialog
    const handleConfirmDeleteCardClick = () => {
        // Write to Firebase the changes here
        setShowDeleteCard(false);
    }

    useEffect(() => {
        const cardRef = ref(database, "User");
        get(cardRef).then((snapshot) => {
            if (snapshot.exists()) {
                const cardArray = Object.entries(snapshot.child('w1FJVaOVCsSlsog2b7mUIuG8Xgd2').child('card').val()).map(([id, data]) => ({
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
            <div className='grid grid-rows-1 grid-cols-4 gap-x-20 row-start-1 row-end-2 col-start-1 col-end-3 bg-dark-night'> 
                <SubNavbar />

                <Card className=" justify-self-center h-auto w-full my-6 mr-12 bg-blue-900 border-blue-900 row-start-1 row-end-1 col-start-2 col-end-5 " >
                    <h5 className="self-center text-4xl font-bold tracking-tight text-white font-mono" > MY PAYMENT METHODS</h5>

                    <div className='top_bar_basket grid grid-cols-6 flex-wrap ml-10 mr-10 p-3' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', justifyItems: 'center' }}>
                        <h3 className=' ext-4xl font-bold tracking-tight dark:text-white  text-white'>Card Type</h3>
                        <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'>Name on Card</h3>
                        <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'>Card Ending</h3>
                        <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'>Billing Address</h3>
                        <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'></h3>
                        <h3 className=' ext-4xl font-bold tracking-tight  dark:text-white text-white'></h3>
                    </div>
                    {/*This is the card that can be used as a component nested in cardStored component */}
                    <div className='grid grid-rows-3 flex-wrap m-s ml-10 mr-10'>
                    {cardDetails.map((c) => (
                        <Card key={c.id} className=" flex h-auto w-full bg-transparent border-white mt-2">
                            <div className='grid grid-cols-6 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',justifyItems: 'center' }}>    

                                <img id = "card_type" class="first-line:h-8 w-8 flex-wrap justify-self-center" src="https://www.iconbolt.com/iconsets/payment-method/american-card-express-method-payment.svg" alt="card"/>
                                <h2 id="card_name" className="flex dark:text-white text-white font-mono ">{c.fullName}</h2>
                                <h2 id="card_ending" className="flex dark:text-white text-white font-mono ">{c.cardNumber.slice(-4)}</h2>
                                <h2 id="billing_address" className="flex dark:text-white text-white font-mono ">{c.billAddress}</h2>
                                <img class="first-line:h-6 w-6 flex-wrap justify-self-end" style={{ filter: 'brightness(0) invert(1)' }} src="https://www.iconbolt.com/iconsets/darkwing-free/edit.svg" alt="edit address" onClick={()=> setShowEditCard(true)} disabled={showEditCard}/>
                                <img class="first-line:h-5 w-5 flex-wrap justify-self-center" style={{ filter: 'brightness(0) invert(1)' }} src="https://www.iconbolt.com/iconsets/flowbite-solid/trash-bin.svg" alt= "delete address" onClick={()=> setShowDeleteCard(true)} disabled={showDeleteCard}/>


                            </div>
                        </Card>
                    ))}

                    </div>  
                    <div className='flex justify-self-start mt-10 ml-10'>
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
                    
                </Card>
            </div>
        {/*Add card modal */}
        <Modal isVisible={showAddCardModal} onClose ={()=> setShowAddCardModal(false)}>
            <h3 className='text-xl flex self-center font-semibold text-white mb-5'>ADD NEW CARD</h3>
            <h3 className='flex self-center font-semibold text-white mb-5'>Add card by filling the details below</h3>
            <div className="self-center sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6 text-white font-mono" action="#" method="POST onSubmit={handleSubmit}">
                <div>
                    <label htmlFor="number" className='text-white'>Card Number</label>
                    <input className="block w-full mt-2 rounded-md border-1  py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="number" id="card_number" name="card_number" placeholder='4625 2563 2356 8514' required/> 
                    </div>

                    <div className='inline-flex justify-evenly'>
                        <div className='mr-5'>
                            <label htmlFor="number" className='text-white'>Exp.Date</label>
                            <input className="block w-52 mt-2 my-2.5 rounded-md border-0 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="date" id="exp_date" name="exp_date" placeholder='12/24' required/>
                        </div> 
                        <div className='ml-5'>
                            <label htmlFor="number" className='text-white'>CVV</label>
                            <input className="block w-full mt-2 my-2.5 rounded-md border-0 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="number" id="cvv" name="cvv" placeholder='342' required/>
                        </div>
                    </div>

                    <div>
                    <label htmlFor="text" className='text-white'>Card Holder</label>
                    <input className="block w-full mt-2 my-2.5 rounded-md border-1 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="text" id="card_holder" name="card_holder" placeholder='John Wick' required/>
                </div>
                </form>
            </div>
            <div className='flex justify-evenly mt-10'>
                <Button type="submit"className="w-52" color="gray" onClick ={()=>setShowAddCardModal(false)}> DISMISS</Button>
                <Button type="submit" className="w-52" color="gray" onClick={()=>handleConfirmAddCardClick()}>CONFIRM</Button>
            </div>
        </Modal>
        {/*Edit card modal */}
        <Modal isVisible={showEditCard} onClose ={()=> setShowEditCard(false)}>
            <h3 className='text-xl flex self-center font-semibold text-white mb-5'>EDIT YOUR CARD</h3>
            <h3 className='flex self-center font-semibold text-white mb-5'>Edit your card by filling the details below</h3>
            <div className="self-center sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6 text-white font-mono" action="#" method="POST onSubmit={handleSubmit}">
                <div>
                    <label htmlFor="number" className='text-white'>Card Number</label>
                    <input className="block w-full mt-2 rounded-md border-1  py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="number" id="card_number" name="card_number" placeholder='4625 2563 2356 8514' required/> 
                    </div>

                    <div className='inline-flex justify-evenly'>
                        <div className='mr-3'>
                            <label htmlFor="number" className='text-white'>Exp.Date</label>
                            <input className="block w-52 mt-2 my-2.5 rounded-md border-0 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="date" id="exp_date" name="exp_date" placeholder='12/24' required/>
                        </div> 
                        <div className='ml-3'>
                            <label htmlFor="number" className='text-white'>CVV</label>
                            <input className="block w-full mt-2 my-2.5 rounded-md border-0 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="number" id="cvv" name="cvv" placeholder='342' required/>
                        </div>
                    </div>

                    <div>
                    <label htmlFor="text" className='text-white'>Card Holder</label>
                    <input className="block w-full mt-2 my-2.5 rounded-md border-1 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="text" id="card_holder" name="card_holder" placeholder='John Wick' required/>
                </div>
                </form>
            </div>
            <div className='flex justify-evenly mt-10'>
                <Button type="submit"className="w-52" color="gray" onClick ={()=>setShowEditCard(false)}> DISMISS</Button>
                <Button type="submit" className="w-52" color="gray" onClick={()=>handleConfirmEditCardClick()}>CONFIRM</Button>
            </div>
        </Modal>
        {/*Delete card modal */}
        <Modal isVisible={showDeleteCard} onClose ={()=> setShowDeleteCard(false)}>
            <h3 className='text-xl flex self-center font-semibold text-white mb-5'>DELETE CARD</h3>
            <h3 className='flex self-center font-semibold text-white  mb-5'>Are you sure you want to delete this card?</h3>
            <div className='flex justify-evenly mt-10'>
                <Button type="submit"className="w-52" color="gray" onClick ={()=>showDeleteCard(false)}> DISMISS</Button>
                <Button type="submit" className="w-52" color="gray" onClick={()=>handleConfirmDeleteCardClick()}>CONFIRM</Button>
            </div>
        </Modal>
        </Fragment>
    )
}