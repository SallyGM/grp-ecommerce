"use client"
import React, { useContext, useState, useEffect, useMemo } from "react" 
import { database } from '../firebaseConfig';
import { ref, set, get, push, remove } from "firebase/database";
import { useAuth } from '../context/AuthContext.js'

//Attempt at creating the Basket Context
//Not sure I am accessing the database correctly tho

const BasketContext = React.createContext();

export function BasketProvider({ children}) {

   const { currentUser } = useAuth()

   const [userBasket, setUserBasket] = useState([]);
   const [guestBasket, setGuestBasket] = useState([]);
   const [loading, setLoading] = useState(true);
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

      const data = {[productID]: quantity}
      let basket = { ...userBasket }
      basket[productID] = quantity

      if (currentUser) {
         try {

            const userBasketRef = ref(database, "Basket/" + currentUser.uid + "/" + productID);
            await set(userBasketRef, quantity);

            setUserBasket(basket);
         } catch (error) {
            console.error('Error adding to basket:', error);
         }
      } else {
         let basket = guestBasket;

         // if the items is not in the basket
         if (!basket.includes(productID)){
            basket[productID] = quantity
            setGuestBasket[basket]
         } else {
            basket[productID] = basket[productID] + quantity
         }

         setGuestBasket[basket]
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

   const contextValue = useMemo(() => {
      return {
         userBasket,
         addToBasket,
         removeFromBasket,
         clearBasket,
         onCheckOut,
         guestBasket
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