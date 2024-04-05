'use client'
import { Select } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Card, Button } from 'flowbite-react';
import { FaceFrownIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useProductContext } from '../../context/ProductContext';

export default function BestSellers() {

  const [product, setProduct] = useState([]);
  const [ogProduct, setOgProduct] = useState([]);
  const [size, setSize] = useState(0);
  const [pSelected, setPSelected] = useState(0)
  const [sSelected, setSSelected] = useState(0)
  const router = useRouter();
  const { products, getBestSellers } = useProductContext()

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
    let result = getBestSellers()
    setProduct(result.slice(0,10))
    setOgProduct(result.slice(0,10))
  }, [products]);

  // verify when the products have been added, and setSize 
  // to determine if the search found results 
  useEffect(() => {
    if(product.length > 0){
      setSize(product.length)
    }
  }, [product]);
  
  // handles platform options changing
  function changePlatformOptionOnclick(event){
    const value = platform[event.target.value];
    setPSelected(value.value);
    if(value.value != 0){
      const temp = [...product].filter((item) => item.console.toLowerCase().includes(value.data.toString().toLowerCase()))
      if(value.data === "Any"){
        setProduct(ogProduct)
      } else {
        setProduct(temp)
      }
    }
  }

  // handles sort options changing
  function changeSortOptionOnclick(event){
    const value = sort[event.target.value];
    setSSelected(value.value);
    if(value.value != 0){
      if(value.data === "Newest"){
        const currentValue = [...product].sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
        setProduct(currentValue)
      } else if(value.data === "Oldest") {
        const currentValue = [...product].sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime())
        setProduct(currentValue)
      }  else if(value.data === "Lowest Price"){
        const currentValue = [...product].sort((a, b) => {
          return a.price - b.price;
        })
        setProduct(currentValue)
      } else {
        const currentValue = [...product].sort((a, b) => {
          return b.price - a.price
        })
        setProduct(currentValue)
      }
    }
  }

  function handleClickOpenProduct(productID, e){
    router.push(`/products/${productID}`);
  }
  
  return (
    <div className='mb-20'>
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
          <div className='flex flex-rpw flex-wrap sm:flex-col md:flex-col lg:flex-row xl:flex-row mx-3 mt-3 mb-5 text-sm justify-center'>
            {product.map((p) => (
              <Card key={p.id} className="max-w-sm mx-3 my-3 w-72" renderImage={() => 
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