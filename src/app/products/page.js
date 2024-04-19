'use client'
import { Select } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, Button} from 'flowbite-react';
import { FaceFrownIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useProductContext } from '../context/ProductContext';
import { useBasketContext } from '../context/BasketContext';
import toast from 'react-hot-toast';
import { useFavouriteContext } from '../context/FavouriteContext';
import { useAuth } from '../context/AuthContext';


export default function Product() {

  const searchParams = useSearchParams();
  const search = searchParams.get('search').toLowerCase();
  const type = searchParams.get('type').toLowerCase();
  const [allProducts, setAllProducts] = useState([]);
  const [customisedResults, setCustomisedResults] = useState([]); // for bestsellers and sales only
  const [showProduct, setShowProducts] = useState([]);
  const [favourite, setFavourite] = useState([]);
  const [size, setSize] = useState(0);
  const [pSelected, setPSelected] = useState(0)
  const [sSelected, setSSelected] = useState(0)
  const router = useRouter();
  const { currentUser } = useAuth();
  const { favourites, addToFavourites, removeFromFavourites } = useFavouriteContext()
  const { loading, products, getProductsOnSale, getBestSellers } = useProductContext()
  const { addToBasket } = useBasketContext();

  var platform = [
    {value: 0, data: "--"},
    {value: 1, data: "Any"},
    {value: 2, data: "PC"},
    {value: 3, data: "XBOX"},
    {value: 4, data: "PlayStation"},
    {value: 5, data: "Nintendo"},
  ];

  var sort = [
    {value: 0, data: "--"},
    {value: 1, data: "Newest"},
    {value: 2, data: "Oldest"},
    {value: 3, data: "Lowest Price"},
    {value: 4, data: "Highest Price"}
  ];

  // load products 
  useEffect(() => {
    
    setAllProducts(products);

    //TODO: not the best way to approach
    if(products.length > 0){
      if(type === "search"){
        setShowProducts(products.filter((item) => item.name.toLowerCase().includes(search.toString())))  
      } else if (type === "bestsellers") {
        let result = getBestSellers()
        setCustomisedResults(result.slice(0,10))
        setShowProducts(result.slice(0,10))
      } else if (type === "sales") {
        let result = getProductsOnSale()
        setCustomisedResults(result)
        setShowProducts(result)
      } else {
        setShowProducts(products.filter((item) => item.console.toLowerCase().includes(search)))
        setPSelected(platform.find((item) => item.data.toLowerCase() === search.toLowerCase() ? item.value : 0))
      }
      setSSelected(0)
    }
  }, [search, type, products]); 

  // verify when the products have been added, and setSize 
  // to determine if the search found results 
  useEffect(() => {
    if(showProduct.length > 0){
      setSize(showProduct.length)
    }
  }, [showProduct]);
  
  useEffect(() => {
    setFavourite(favourites)
  }, [favourites]);

  function handleClickOnFavourite(productID, e){
    // add to the list if the item is not there
    if(!favourite.some(item => item.id === productID)){
      addToFavourites(productID)
    } else {
      removeFromFavourites(productID)
    }
  }

  // handles platform options changing
  function changePlatformOptionOnclick(event){
    const value = platform[event.target.value];
    setPSelected(value.value);
    if(value.value != 0){
      if(value.data === "Any"){
        if(type === "bestsellers" || type === "sales"){
          setShowProducts(customisedResults)
        } else {
          setShowProducts(allProducts)
        }
      } else {
        if(type === "bestsellers" || type === "sales"){
          setShowProducts(customisedResults.filter((item) => item.console.toLowerCase().includes(value.data.toString().toLowerCase())))
        } else {
          setShowProducts(allProducts.filter((item) => item.console.toLowerCase().includes(value.data.toString().toLowerCase())))
        }
      }
    }
  }

  // handles sort options changing
  function changeSortOptionOnclick(event){
    const value = sort[event.target.value];
    setSSelected(value.value);
    if(value.value != 0){
      if(value.data === "Newest"){
        const currentValue = [...showProduct].sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
        setShowProducts(currentValue)
      } else if(value.data === "Oldest") {
        const currentValue = [...showProduct].sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime())
        setShowProducts(currentValue)
      }  else if(value.data === "Lowest Price"){
        const currentValue = [...showProduct].sort((a, b) => {
          return a.price - b.price;
        })
        setShowProducts(currentValue)
      } else {
        const currentValue = [...showProduct].sort((a, b) => {
          return b.price - a.price
        })
        setShowProducts(currentValue)
      }
    }
  }

  function handleClickOpenProduct(productID, e){
    router.push(`/products/${productID}`);
  }

  function handleClickAddToCart(productID, amount, e){
    addToBasket(productID, amount);
    toast.success("Product added to basket!");
    
  }
  
  function handleClickChangeQuantity(p, op){
    let prod = [...allProducts]
    let i = prod.indexOf(p)

    if(i !== -1){

      if(op == "+" && prod[i].amount < 10){
        prod[i].amount += 1
      } else {
        if(prod[i].amount != 0){
          prod[i].amount -= 1
        }
      }

      setAllProducts(prod)
    }
  }

  return (
    <div className='bg-blue-gradient pb-20'>
      <div className='grid grid-cols-4 mx-3 pt-5 mb-5 gap-4 text-sm'>
        <div className='mt-2 text-right text-white'>
          Platform:
        </div>
        <div>
          <Select value={pSelected} variant="outlined" label="Select Version" id="category" onChange={changePlatformOptionOnclick}>
            {platform.map(p => 
              <option value={p.value}>{p.data}</option>
            )}
          </Select>
        </div>
        <div className='mt-2 text-right text-white'>
          Filter:
        </div>
        <div>
          <Select value={sSelected} id="sort" variant="outlined" label="Select Version" onChange={changeSortOptionOnclick}>
            {sort.map(p => 
              <option value={p.value}>{p.data}</option>
            )}
          </Select>
        </div>
      </div>
      { size === 0 ? (
          <div className='mt-5 mb-7 content-center py-5 items-center text-center w-full'>
              No results found...  <span className="inline-block"><FaceFrownIcon className="h-6 w-6 text-black-500" />
            </span>
            <br/><br/><br/><br/><br/><br/><br/>
          </div>
        ) : (
          <div className='flex flex-row flex-wrap sm:flex-col md:flex-col lg:flex-row xl:flex-row mx-3 mt-3 mb-5 text-sm justify-center'>
            {showProduct.map((p, i) => (
              <Card key={i} className="relative max-w-sm mx-3 my-3 w-72" renderImage={() => 
                <img className="w-full h-60 object-fill cursor-pointer rounded-lg" src={p.images[2]} alt="image 1" onClick={(e) => handleClickOpenProduct(p.id, e)} />}>             
                {currentUser  ? (
                  (favourite.some(item => item.id === p.id) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={(e) => handleClickOnFavourite(p.id, e)} viewBox="0 0 24 24" fill="red" className="absolute cursor-pointer left-1 top-1 w-7 h-7">
                      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={(e) => handleClickOnFavourite(p.id, e)} fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="absolute cursor-pointer left-1 top-1 w-7 h-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  ))
                ) : (
                  <></>
                )}
                
                <h5 key={i} className="text-2xl font-bold tracking-tight h-20 text-gray-900 dark:text-white">
                  {p.name}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  £ {(p.discount > 0 ? parseFloat(p.price - p.price * p.discount).toFixed(2): p.price)}
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {p.console}
                </p>

                <Button.Group className='items-center'>
                  <Button color="gray" onClick={(e) => handleClickChangeQuantity(p,"-", e)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                    </svg>
                  </Button>
                  <Button color="gray" className='cursor-auto hover:bg-slate-50'>
                    {p.amount}
                  </Button>
                  <Button color="gray" onClick={(e) => handleClickChangeQuantity(p,"+", e)} >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </Button>
                </Button.Group>

                <Button color="gray" onClick={(e) => handleClickOpenProduct(p.id, e)}>View product</Button>
                
                <Button color="gray" onClick={(e) => handleClickAddToCart(p.id, p.amount, e)}>
                  Add to Cart
                  <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M5 3a1 1 0 0 0 0 2h.7l2.1 10.2a3 3 0 1 0 4 1.8h2.4a3 3 0 1 0 2.8-2H9.8l-.2-1h8.2a1 1 0 0 0 1-.8l1.2-6A1 1 0 0 0 19 6h-2.3c.2.3.3.6.3 1a2 2 0 0 1-2 2 2 2 0 1 1-4 0 2 2 0 0 1-1.7-3H7.9l-.4-2.2a1 1 0 0 0-1-.8H5Z" clipRule="evenodd"/>
                    <path fillRule="evenodd" d="M14 5a1 1 0 1 0-2 0v1h-1a1 1 0 1 0 0 2h1v1a1 1 0 1 0 2 0V8h1a1 1 0 1 0 0-2h-1V5Z" clipRule="evenodd"/>
                  </svg>
                </Button>
              </Card>
            ))}
          </div>
        )}
    </div>  
  );
}