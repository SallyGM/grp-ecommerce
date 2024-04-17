"use client"
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"
import { useFavouriteContext } from "../context/FavouriteContext";
import { useProductContext } from "../context/ProductContext";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { Tooltip, Banner } from 'flowbite-react';

export default function Favourites() {

  const { currentUser } = useAuth();
  const router = useRouter();
  const { products } = useProductContext()
  const { favourites, addToFavourites, removeFromFavourites, removeAllFavourites } = useFavouriteContext()
  const [ favourite, setFavourite] = useState([]);
  const [ favouriteProducts, setFavouriteProducts] = useState([]);
  const [ clearingList, setClearingList ] = useState(false)

  useEffect(() => {
    setFavourite(favourites)
  
    if(favourite && products){
      setFavouriteProducts(products.filter((p) => favourites.some(item => item.id === p.id)))
      console.log(products.filter((p) => favourites.some(item => item.id === p.id))) 
    }
  }, [favourites,products]);

  function handleClickOnFavourite(productID, e){
    // add to the list if the item is not there
    if(!favourite.some(item => item.id === productID)){
      addToFavourites(productID)
    } else {
      removeFromFavourites(productID)
    }
  }

  function handleClickOpenProduct(productID, e) {
    router.push(`/products/${productID}`);
  }

  async function handleRemoveAll(){
    setClearingList(true)
    await removeAllFavourites();
    setClearingList(false)
  }

  return (
    <div className="flex flex-col bg-blue-gradient py-5 px-5">
      
        { favouriteProducts.length > 0 ? (
          <>
            <div className="p-6 mx-5 my-5 items-center rounded-lg shadow bg-dark-night">
              <h2 className="text-3xl text-center text-white font-bold">Favourites</h2>
                <div class="relative overflow-x-auto">
                  <table class="w-full text-center text-white my-5">
                    <thead class="text-lg bg-elite-blue text-white uppercase">
                      <tr>
                        <th scope="col" class="px-6 py-3">
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Product
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Console
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Price
                        </th>
                        <th scope="col" class="px-6 py-3">
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                    {favouriteProducts.map((f) => (
                      <tr key={f.id} class="border-b border-stone-50 bg-dark-night cursor-pointer hover:bg-blue-900" onClick={(e) => handleClickOpenProduct(f.id, e)}>
                          <th scope="row" class="px-0 py-0">
                            <img className='slick-slide-image rounded-md' src={(f.images ? f.images[1]: 'https://firebasestorage.googleapis.com/v0/b/buster-games-356c2.appspot.com/o/Preview%2FA%20Short%20Hike%20Preview%20Pic.png?alt=media&token=eee51ae3-1981-4fc6-ae13-7f1e52b885b4')}
                            alt='preview'/>
                          </th>
                          <td class="px-6 py-4">
                              {f.name}
                          </td>
                          <td class="px-6 py-4">
                              {f.console}
                          </td>
                          <td class="px-6 py-4">
                              £{(f.discount > 0 ? parseFloat(f.price - f.price * f.discount).toFixed(2): f.price)}
                          </td>
                          <td class="px-6 py-4">
                            <Tooltip content='Remove from favourites'>
                              <svg xmlns="http://www.w3.org/2000/svg" onClick={(e) => handleClickOnFavourite(f.id, e)} viewBox="0 0 24 24" fill="red" className="cursor-pointer my-5 mx-5 w-9 h-9 hover:scale-110">
                                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                              </svg>
                            </Tooltip>
                          </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="items-start mx-5 my-5">
              <Button onClick={handleRemoveAll} disabled={clearingList} color="failure">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mr-4 w-6 h-6 ">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Clear All
              </Button>
            </div>
        </>
      ) : (
        <div className="p-6 mx-5 my-5 bg-white items-center border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-3xl text-center font-bold">Favourites</h2>
          <p>No items added to favourites yet...</p>
        </div>
      )}
    </div>
  )
}