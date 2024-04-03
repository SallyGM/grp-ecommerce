import { createContext, useContext, useMemo } from "react";
import { database } from '../firebaseConfig';
import { ref, set, remove } from "firebase/database";

//Attempt at creating the Basket Context
//Not sure I am accessing the database correctly tho

const BasketContext = createContext();
export function BasketWrapper({ children, userID }) {
   const [userBasket, setUserBasket] = useState([]);

   useEffect(() => {
      if (userID) {
         const userBasketRef = ref(database, `Basket/${userID}`);
         get(userBasketRef).then((snapshot) => {
            if (snapshot.exists()) {
               setUserBasket(snapshot.val());
            }
         }).catch((error) => {
            console.error('Error fetching user basket:', error);
         });
      }
   }, [userID]);

   const addToBasket = async (productID, quantity, price, discount) => {
      if (userID) {
         try {
            const userBasketRef = ref(database, `Basket/${userID}`);
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
      if (userID) {
         try {
            const userBasketRef = ref(database, `Basket/${userID}/${itemKey}`);
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
      };
   }, [userBasket, userID]);

   return (
      <BasketContext.Provider value={contextValue}>
         {children}
      </BasketContext.Provider>
   );
}

export function useBasketContext() {
   return useContext(BasketContext);
}