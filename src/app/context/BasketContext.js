"use client"
import React, { useContext, useState, useEffect, useMemo } from "react" 
import { database } from '../firebaseConfig';
import { ref, set, get } from "firebase/database";
import { useAuth } from '../context/AuthContext.js'

const BasketContext = React.createContext();

export function BasketProvider({ children}) {

   const { currentUser } = useAuth()

   const [userBasket, setUserBasket] = useState([]);
   const [guestBasket, setGuestBasket] = useState([]);
   const [onCheckOut, setOnCheckOut] = useState(false);

   useEffect(() => {
      if (currentUser) {
         const userBasketRef = ref(database, "Basket/" + currentUser.uid);
         get(userBasketRef).then((snapshot) => {
            if (snapshot.exists()) {
               setUserBasket(snapshot.val());
            }
         }).catch((error) => {
            console.error('Error fetching user basket:', error);
         });
      }
   }, [currentUser], [userBasket]);

   const addToBasket = async (productID, quantity) => {

      if (currentUser) {
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
         
            if((data + quantity) <= 10){
               basket[productID] = quantity + data;
               await set(userBasketRef, quantity + data);
            } else {
               basket[productID] = 10
               await set(userBasketRef, 10);
            }

            setUserBasket(basket);
         } catch (error) {
            console.error('Error adding to basket:', error);
         }
      } else {
         let gbasket = guestBasket;

         // if the items is not in the basket
         if (!gbasket.includes(productID)){
            gbasket[productID] = quantity
            setGuestBasket[gbasket]
         } else {
            if(gbasket[productID] + quantity <= 10){
               gbasket[productID] = gbasket[productID] + quantity
            }
            else{
               gbasket[productID] = 10
            }
         }

         setGuestBasket[gbasket]
      }
   };

   const removeFromBasket = async (itemKey) => {
      if (currentUser) {
         try {
            const userBasketRef = ref(database, "Basket/" + currentUser.uid + "/" +  itemKey);
            await set(userBasketRef, null);
            let basket = { ...userBasket } 
            delete basket[itemKey];
            setUserBasket(basket);
         } catch (error) {
            console.error('Error removing from basket:', error);
         }
      } else {
         let basket = userBasket;
         basket.remove(itemKey)
      }
   };

   const clearBasket = async () => {
      if (currentUser) {
         try {
            const userBasketRef = ref(database, "Basket/" + currentUser.uid + "/" + itemKey);
            await set(userBasketRef, null);
            setUserBasket([]);
         } catch (error) {
            console.error('Error removing from basket:', error);
         }
      }
      else {
         setGuestBasket([])
      }
   };

   const activateCheckOut = async () => {
      let update = !onCheckOut;
      setOnCheckOut(update);
   };

   const contextValue = useMemo(() => {
      return {
         userBasket,
         addToBasket,
         removeFromBasket,
         clearBasket,
         onCheckOut,
         setOnCheckOut,
         guestBasket,
         activateCheckOut,
      };
   }, [userBasket, currentUser]);

   return (
      <BasketContext.Provider value={contextValue}>
         {children}
      </BasketContext.Provider>
   );
}

export function useBasketContext() {
   return useContext(BasketContext);
}

//export default BasketContext;