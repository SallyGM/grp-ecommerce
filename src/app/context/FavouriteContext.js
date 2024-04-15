"use client"
import React, { useContext, useState, useEffect, useMemo } from "react" 
import { database } from '../firebaseConfig';
import { ref, set, get,  } from "firebase/database";
import { useAuth } from '../context/AuthContext.js'

const FavouriteContext = React.createContext();

export function FavouriteProvider({ children }) {

  const { currentUser } = useAuth();
  const [ favourites, setFavourites] = useState([]);
  const [ error, setError ] = useState(false);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {

    if(currentUser){
      const favRef = ref(database, "Favourite/" + currentUser.uid);
      get(favRef).then((snapshot) => {
        if(snapshot.exists()){
          let favouritesArray = Object.entries(snapshot.val()).map(([id, data]) => ({
            id, 
            ...data,
          }));

          setError(false);

          if(favouritesArray.length != 0){
            setFavourites(favouritesArray)         
          } else {
            setFavourites([]) 
          }
        } else{
          setError(true)
        }
      }).catch((error) => {
        setError(true)
      });
    }
  }, [currentUser])

  const getFavourites = async() => {

    if(currentUser){
      const favRef = ref(database, "Favourite/" + currentUser.uid);

      get(favRef).then((snapshot) => {
        if(snapshot.exists()){
          let favouritesArray = Object.entries(snapshot.val()).map(([id, data]) => ({
            id, 
            ...data,
          }));

          setError(false);

          if(favouritesArray.length != 0){
            setFavourites(favouritesArray)  
            return favouritesArray;       
          } else {
            setFavourites([]) 
            return []
          }
        } else{
          setError(true)
        }
      }).catch((error) => {
        setError(true)
      });
    }

    return []
  };

  const addToFavourites = async (productID) => {

    // authenticated user
    if (currentUser) {
      try {
      const favouritesRef = ref(database, "Favourite/" + currentUser.uid + "/" + productID);
      let data = 0
      await set(favouritesRef, data)

      const fav = favourites
      fav.push = { id: productID};
      setFavourites(Object.values(fav));

      } catch (error) {
        console.error('Error adding to basket:', error);
      }
    }
 };

  const removeFromFavourites = async (productID) => {

    // authenticated user
    if (currentUser) {

      try {
        const favouritesRef = ref(database, "Favourite/" + currentUser.uid + "/" + productID);
    
        await set(favouritesRef, null)
        setFavourites(favourites.filter(item => item.id !== productID))

      } catch (error) {
          console.error('Error removing from basket:', error);
      }
    }
  };

  const removeAllFavourites = async () => {

    // authenticated user
    if (currentUser) {

      try {
        const favouritesRef = ref(database, "Favourite/" + currentUser.uid);
    
        await set(favouritesRef, null)
        setFavourites([])

      } catch (error) {
          console.error('Error removing from basket:', error);
      }
    }
  };

  const contextValue = {
      favourites,
      error, 
      loading,
      getFavourites,
      removeAllFavourites,
      addToFavourites,
      removeFromFavourites
 };

   return (
    <FavouriteContext.Provider value={contextValue}>
      {children}
    </FavouriteContext.Provider>
   );
}

export function useFavouriteContext() {
   return useContext(FavouriteContext);
}