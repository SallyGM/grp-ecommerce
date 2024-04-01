import Link from 'next/link'
import { Card, Button } from 'flowbite-react';


export default function Home() {
  return (

    <div className='p-8 display: flex justify-center gap-6 bg-dark-night'>

      
      {/*Delivery address card*/}
      <Card className="justify-center h-auto w-4/5 my-6 bg-blue-900 border-blue-900">
        
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white self-center text-white font-mono">SIGN-IN INFORMATION</h1>
        <br/>

        <form className="grid grid-rows-3 grid-cols-2 gap-6 display: flex text-white font-mono">

            <div>
                <label for="streetName">Street name</label>
                <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text" id="streetName"  name="streetName" required></input>
            </div>
            
            <div>
                <label for="postalCode">Zip/Postal code</label>
                <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text" id="postalCode"  name="postalCode" required></input>
            </div>

            <div>
                <label for="city">City</label>
                <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text" id="city" name="city" required></input>
            </div>

            <div>
                <label for="country">Country</label>
                <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text" id="country" name="country" required></input>
            </div>

            <div className='flex justify-evenly'>
                <Button className="inline-flex w-6/12 mt-6" href='/register3'>SKIP</Button>
            </div>

            <div className='flex justify-evenly'>
                <Button className="inline-flex w-6/12 mt-6" color='success' type="submit">
                    <Link href="/register3">NEXT</Link>
                </Button>          
            </div>


        </form>
      </Card>
      
    </div>
  )}