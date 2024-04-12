"use client"; 
import { Card, Button } from 'flowbite-react';
import ReactDOM from 'react-dom';
import React from 'react';
import { ref , get } from "firebase/database";
import { useEffect, useState } from 'react';
import { database } from './app/firebaseConfig';


export default function CardStored() {
    // Firebase information retrival function here
 
    const [card, setCard] = useState([]);

    useEffect(() => {
      const cardRef = ref(database, "User");
      const userId = 'w1FJVaOVCsSlsog2b7mUIuG8Xgd2'; // or wherever the user id is obtained from
      const userCardRef = cardRef.child(userId).child('card');
  
      get(userCardRef).then((snapshot) => {
          if(snapshot.exists()){
              const cardArray = Object.entries(snapshot.val()).map(([id, data]) => ({
                  id, 
                  ...data,
              }));
              setCard(cardArray);
          } else {
              console.log("No data found");
              setCard([]);
          }
      }).catch((error) => {
          console.error(error);
      });
  }, []);



    return(
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
                {card.map((c) => (
                    <Card key={c.id} className=" flex h-auto w-full bg-transparent border-white">
                        <div className='grid grid-cols-6 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',justifyItems: 'center' }}>    
                            <img id = "card_type" class="first-line:h-8 w-8 flex-wrap justify-self-center" src="https://www.iconbolt.com/iconsets/payment-method/american-card-express-method-payment.svg" alt="card"/>
                            <h2 id="card_name" className="flex dark:text-white text-white font-mono ">{c.fullName}</h2>
                            <h2 id="card_ending" className="flex dark:text-white text-white font-mono ">{c.cardNumber}</h2>
                            <h2 id="billing_address" className="flex dark:text-white text-white font-mono ">{c.billAddress}</h2>
                            <img class="first-line:h-6 w-6 flex-wrap justify-self-end" style={{ filter: 'brightness(0) invert(1)' }} src="https://www.iconbolt.com/iconsets/darkwing-free/edit.svg" alt="edit address"/>
                            <img class="first-line:h-5 w-5 flex-wrap justify-self-center" style={{ filter: 'brightness(0) invert(1)' }} src="https://www.iconbolt.com/iconsets/flowbite-solid/trash-bin.svg" alt= "delete address"/>
                        </div>
                    </Card>
                ))}

                </div>  
                <div className='flex justify-self-start mt-10 ml-10'>
                    <Button
                        type="submit"
                        className="w-60 inline-flex text-white self-center " color='blue'> 
                        ADD NEW CARD
                        <svg className="w-6 h-6 ml-3" fill='currentColor' stroke='white' aria-hidden="true" xmlns="https://reactsvgicons.com/search?q=add" viewBox="0 0 512 512">
                        <path fill="none" stroke="currentColor" strokeMiterlimit={10} strokeWidth={32} d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"/>
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M256 176v160M336 256H176"/>
                        </svg>
                    </Button>
                </div>
                
        </Card>
    )
}