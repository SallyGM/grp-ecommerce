import Link from 'next/link'
import { Card, Button } from 'flowbite-react';


export default function Home() {
  return (
    <div className='p-8 display: flex justify-center gap-6 bg-dark-night'>

      
      {/*Sign in information card*/}
      <Card className="justify-center h-auto w-4/5 my-6 bg-blue-900 border-blue-900">
        
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white self-center text-white font-mono">SIGN-IN INFORMATION</h1>
        <br/>

        <form className="grid grid-rows-3 grid-cols-2 gap-6 display: flex text-white font-mono">

          <div>
            <label for="cardName">Cardholder name</label>
            <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="text" id="cardName"  name="cardName" required></input>
          </div>
          
          <div>
            <label for="cardNumber">Card number</label>
            <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="text" id="cardNumber"  name="cardNumber" required></input>
          </div>

          <div>
            <label for="expDate">Expiry date</label>
            <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="month" id="expDate" name="expDate" required></input>
          </div>

          <div>
            <label for="cvv">CVV</label>
            <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="number" min="100" max="999" id="cvv" name="cvv" required></input>
          </div>

          <div className='flex justify-evenly'>
                <Button className="inline-flex w-6/12 mt-6">
                    <Link href="/register3">SKIP</Link>
                </Button>
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