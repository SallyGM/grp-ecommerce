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
   }, [currentUser]);

   const addToBasket = async (productID, quantity, price, discount) => {
      if (currentUser) {
         try {
            const userBasketRef = ref(database, "Basket/" + currentUser.uid);
            const newItemRef = push(userBasketRef);
            await set(newItemRef, {
               productID,
               quantity,
               price,
               discount
            });
            setUserBasket([...userBasket, newItemRef.key]);
         } catch (error) {
            console.error('Error adding to basket:', error);
         }
      }
   };

   const removeFromBasket = async (itemKey) => {
      if (currentUser) {
         try {
            const userBasketRef = ref(database, "Basket/" + currentUser.uid + "/" +  itemKey);
            await set(userBasketRef, null);
            setUserBasket(userBasket.filter(key => key !== itemKey));
         } catch (error) {
            console.error('Error removing from basket:', error);
         }
      }
   };

   const clearBasket = async () => {
      if (currentUser) {
         try {
            const userBasketRef = ref(database, "Basket/" + currentUser.uid + "/" + itemKey);
            await set(userBasketRef, null);
            setUserBasket(userBasket.filter(key => key !== itemKey));
         } catch (error) {
            console.error('Error removing from basket:', error);
         }
      }
   };

   const contextValue = useMemo(() => {
      return {
         userBasket,
         addToBasket,
         removeFromBasket,
         clearBasket,
         onCheckOut
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