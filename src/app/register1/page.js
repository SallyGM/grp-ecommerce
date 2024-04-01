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
            <label for="firstName">First Name</label>
            <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="text" id="firstName"  name="firstName" required></input>
          </div>
          
          <div>
            <label for="lastName">Last Name</label>
            <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="text" id="lastName"  name="lastName" required></input>
          </div>

          <div>
            <label for="email">Email</label>
            <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="email" id="email" name="email" required></input>
          </div>

          <div>
            <label for="confirmEmail">Confirm email</label>
            <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="email" id="confirmEmail" name="confirmEmail" required></input>
          </div>

          <div>
            <label for="password">Password</label>
            <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="password" id="password" name="password" required></input>
          </div>          

          <div>
            <label for="confirmPassword">Confirm Password</label>
            <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="password" id="confirmPassword" name="confirmPassword" required></input>            
          </div>

          <Button className="w-4/12 inline-flex col-span-2 justify-self-center mt-6" color='success' type="submit">
          <Link href="/register2">NEXT</Link>
          </Button>

          <Button href='/register2'>NEXT(temp)</Button>
        </form>
      </Card>

    </div>
  )}