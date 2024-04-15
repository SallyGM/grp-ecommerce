"use client"
import React, { useContext, useState, useEffect, useMemo } from "react" 
import { database } from '../firebaseConfig';
import { ref, set, get, push, update } from "firebase/database";
import { useAuth } from '../context/AuthContext.js'

const BasketContext = React.createContext();

export function BasketProvider({children}) {

   const { currentUser } = useAuth();

   const [userBasket, setUserBasket] = useState([]);
   const [guestBasket, setGuestBasket] = useState([]);
   const [basketSize, setBasketSize] = useState(0);

   useEffect(() => {
      if (currentUser) {
         // get basket value from the database
         const userBasketRef = ref(database, "Basket/" + currentUser.uid);
         get(userBasketRef).then((snapshot) => {
            if (snapshot.exists()) {
               setUserBasket(snapshot.val());

               // updates the size of the basket
               let total = 0;
               let b = snapshot.val();
               Object.keys(b).forEach((key) => {
                  total += b[key];
               });

               setBasketSize(total);
            }
         }).catch((error) => {
            console.error('Error fetching user basket:', error);
         });
      } else {
         // set the size of the guest basket
         let total = 0;
         Object.keys(guestBasket).forEach((key) => {
           total += guestBasket[key];
         });
         setBasketSize(total);
      }
   }, [currentUser]);

   useEffect(() => {
      if(currentUser){
           // set the size of the guest basket
         let total = 0;
         Object.keys(userBasket).forEach((key) => {
           total += userBasket[key];
         });
         setBasketSize(total);
      } else {
          // set the size of the guest basket
          let total = 0;
          Object.keys(guestBasket).forEach((key) => {
            total += guestBasket[key];
          });
          setBasketSize(total);
      }
   },[guestBasket, userBasket])

   // register basket of the new user
   const registerBasket = async (user) => {
     
      // authenticated user
      if (user && Object.keys(guestBasket).length > 0) {
         let basket = { ...guestBasket }

         try {
            const userBasketRef = ref(database, "Basket/" + user.uid);
          
            // push to the basket
            await set(userBasketRef, basket);
            // clear basket once it is added to the user
            setGuestBasket([])
            setUserBasket(basket);
         } catch (error) {
            console.error('Error creating basket:', error);
         }
      } 
   };

   const addToBasket = async (productID, quantity) => {

      // authenticated user
      if (currentUser && quantity > 0) {
         let basket = { ...userBasket }
         basket[productID] = quantity

         try {
            const userBasketRef = ref(database, "Basket/" + currentUser.uid + "/" + productID);
            let data = 0

            // fetch to see if there is any data already stored
            await get(userBasketRef).then((snapshot) => {
               if (snapshot.exists()) {
                  data = snapshot.val();
               }
            }).catch((error) => {
               console.error('Error fetching user basket:', error);
            });
         
            // updates the value if already exists
            if((data + quantity) <= 10){
               basket[productID] = quantity + data;
               await set(userBasketRef, quantity + data);
            // adds to the basket 10 (maximum)
            } else {
               basket[productID] = 10
               await set(userBasketRef, 10);
            }

            setUserBasket(basket);
         } catch (error) {
            console.error('Error adding to basket:', error);
         }
      // guest user part
      } else if(quantity > 0){
         // add to the basket quantity bigger than 0
         let gbasket = { ...guestBasket }; 

         if (!gbasket.hasOwnProperty(productID)) {
            gbasket[productID] = quantity;
         } else {
            if (gbasket[productID] + quantity <= 10) {
               gbasket[productID] += quantity;
            } else {
               gbasket[productID] = 10;
            }
         }

         setGuestBasket(gbasket)
      }
   };

   const removeFromBasket = async (itemKey) => {
      //  authenticated user
      if (currentUser) {
         try {
            const userBasketRef = ref(database, "Basket/" + currentUser.uid + "/" +  itemKey);
            await set(userBasketRef, null);
            let basket = { ... userBasket} 
            delete basket[itemKey];
            setUserBasket(basket);
         } catch (error) {
            console.error('Error removing from basket:', error);
         }
      // guest user
      } else {
         let basket = {...guestBasket};
         delete basket[itemKey]; 
         setGuestBasket(basket)
      }
   };

   const clearBasket = async () => {
      // authenticated user
      if (currentUser) {
         try {
            const userBasketRef = ref(database, "Basket/" + currentUser.uid + "/" );
            await set(userBasketRef, null);
            setUserBasket([]);
         } catch (error) {
            console.error('Error removing from basket:', error);
         }
      // guest user   
      } else {
         setGuestBasket([])
      }
   };
   



   // this function creates an order
   // and clear the basket
   const createOrder = async (orderDate, discount, price, userID, fullName, cardNumber, cvv, expirationDate, sortCode) => {
      if (currentUser) {

         let data = {
            "date": orderDate,
            "card": { 
               "fullName": fullName,
               "cardNumber": cardNumber,
               "cvv": cvv,
               "expirationDate": expirationDate,
               "sortCode": sortCode
            },
            "lastUpdate": orderDate,
            "items": userBasket,
            "price": price,
            "discount": discount,
            "notes":"",
            "userID": userID,
            "status": "pending"
         }

         try {
            const userBasketRef = ref(database, "Order/");
            await push(userBasketRef, data);

       
         } catch (error) {
            console.error('Error creating order:', error);
         }
      }
   }

   const contextValue = {
      userBasket,
      guestBasket,
      basketSize,
      addToBasket,
      removeFromBasket,
      clearBasket,
      registerBasket,
      createOrder
   }

   return (
      <BasketContext.Provider value={contextValue}>
         {children}
      </BasketContext.Provider>
   );
}

const useBasketContext = () => {
   const context = React.useContext(BasketContext);
   if (!context) {
     throw new Error('useBasketContext must be used within a BasketProvider');
   }
   return context;
 };

 export {useBasketContext};