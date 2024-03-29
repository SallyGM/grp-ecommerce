'use client'
import { Select } from 'flowbite-react';
import { database } from '../firebaseConfig.js'
import { ref, get } from "firebase/database";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, Button} from 'flowbite-react';
import { FaceFrownIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

export default function Product() {

  const searchParams = useSearchParams();
  const search = searchParams.get('search');
  const type = searchParams.get('type');
  const [product, setProducts] = useState([]);
  const [showProduct, setShowProducts] = useState([]);
  const [error, setError] = useState(false);
  const [size, setSize] = useState(0);
  const [pSelected, setPSelected] = useState(0)
  const [sSelected, setSSelected] = useState(0)
  const router = useRouter();

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
    const prodRef = ref(database, "Product");
    get(prodRef).then((snapshot) => {
      if(snapshot.exists()){
        const prodArray = Object.entries(snapshot.val()).map(([id, data]) => ({
          id, 
          ...data,
        }));

        setError(false);
        setProducts(prodArray);

        //TODO: not the best way to approach
        if(type === "search"){
          setShowProducts(prodArray.filter((item) => item.name.toLowerCase().includes(search.toString())))
          setPSelected(0)   
            
        }
        else{
          setShowProducts(prodArray.filter((item) => item.console.toLowerCase().includes(search)))
          setPSelected(platform.find((item) => item.data.toLowerCase() === search.toLowerCase() ? item.value : 0))
        }
        setSSelected(0)
      } else{
        setError(true)
      }
    }).catch((error) => {
      setError(true)
    });
  }, [search, type]); 

  // verify when the products have been added, and setSize 
  // to determine if the search found results 
  useEffect(() => {
    if(showProduct.length > 0){
      setSize(showProduct.length)
    }
    
  }, [showProduct]);
  
  // handles platform options changing
  function changePlatformOptionOnclick(event){
    const value = platform[event.target.value];
    setPSelected(value.value);
    if(value.value != 0){
      if(value.data === "Any"){
        setShowProducts(product)
      } else {
        setShowProducts(product.filter((item) => item.console.toLowerCase().includes(value.data.toString().toLowerCase())))
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
    console.log(productID)
    router.push(`/products/${productID}`);
  }
  
  return (
    <div className=''>
      <div className='grid grid-cols-4 mx-3 mt-3 mb-5 gap-4 text-sm'>
        <div className='mt-2 text-right'>
          Platform:
        </div>
        <div>
          <Select value={pSelected} variant="outlined" label="Select Version" id="category" onChange={changePlatformOptionOnclick}>
            {platform.map(p => 
              <option value={p.value}>{p.data}</option>
            )}
          </Select>
        </div>
        <div className='mt-2 text-right'>
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
              No results found...  <span class="inline-block"><FaceFrownIcon className="h-6 w-6 text-black-500" />
            </span>
            <br/><br/><br/><br/><br/><br/><br/>
          </div>
        ) : (
          <div className='grid grid-cols-5 mx-3 mt-3 mb-5 gap-4 text-sm'>
            {showProduct.map((p) => (
              <Card key={p.id} className="max-w-sm mx-3" renderImage={() => 
    
                <img className="w-full h-full object-cover rounded-lg" src={p.images[1]} alt="image 1" />}>             
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {p.name}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  £{p.price}
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {p.console}
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {p.releaseDate}
                </p>
                <Button color="gray" onClick={(e) => handleClickOpenProduct(p.id, e)}>View product</Button>
                
                <Button color="gray">
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