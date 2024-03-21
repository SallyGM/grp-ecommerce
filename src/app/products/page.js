'use client'
import { Select } from 'flowbite-react';
import { database } from '../firebaseConfig.js'
import { ref, get } from "firebase/database";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, Button} from 'flowbite-react';
import Image from 'next/image';
import amexIcon from '../images/amexIcon.png';

export default function Product() {

  const searchParams = useSearchParams();
  const data = searchParams.get('search');

  const [product, setProducts] = useState([]);

  useEffect(() => {
    const prodRef = ref(database, "Product");
    get(prodRef).then((snapshot) => {
      if(snapshot.exists()){
        const prodArray = Object.entries(snapshot.val()).map(([id, data]) => ({
          id, 
          ...data,
        }));
        setProducts(prodArray);
        console.log(prodArray);
      } else{
        console.log("No data found")
      }
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  return (
    <div className=''>
      <div className='grid grid-cols-4 mx-3 mt-3 mb-5 gap-4 text-sm'>
        <div className='mt-2 text-right'>
          Platform:
        </div>
        <div>
          <Select id="category" required>
            <option>PC</option>
            <option>XBOX</option>
            <option>PlayStation</option>
            <option>Nintendo</option>
          </Select>
        </div>
        <div className='mt-2 text-right'>
          Filter:
        </div>
        <div>
          <Select id="sort" required>
            <option>Newest</option>
            <option>Oldest</option>
            <option>Lowest Price</option>
            <option>Highest Price</option>
          </Select>
        </div>
        {product.filter((item) => item.console.toLowerCase().includes(data)).map((p) => (
          <Card key={p.id} className="max-w-sm mx-3" renderImage={() => 
            <Image className="mx-auto" width={50} height={50} src={amexIcon} alt="image 1"  />}>
            
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {p.name}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              £{p.price}
            </p>
            <Button.Group>
              <Button color="gray">View product</Button>
              <Button color="gray">
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M5 3a1 1 0 0 0 0 2h.7l2.1 10.2a3 3 0 1 0 4 1.8h2.4a3 3 0 1 0 2.8-2H9.8l-.2-1h8.2a1 1 0 0 0 1-.8l1.2-6A1 1 0 0 0 19 6h-2.3c.2.3.3.6.3 1a2 2 0 0 1-2 2 2 2 0 1 1-4 0 2 2 0 0 1-1.7-3H7.9l-.4-2.2a1 1 0 0 0-1-.8H5Z" clipRule="evenodd"/>
                  <path fillRule="evenodd" d="M14 5a1 1 0 1 0-2 0v1h-1a1 1 0 1 0 0 2h1v1a1 1 0 1 0 2 0V8h1a1 1 0 1 0 0-2h-1V5Z" clipRule="evenodd"/>
                </svg>
              </Button>
            </Button.Group>
          </Card>
        ))}
      </div>
    </div>  
  );
}