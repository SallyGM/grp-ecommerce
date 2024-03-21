import Link from 'next/link'
import { Card, Button } from 'flowbite-react';

export default function Home() {
  return (
    <div className='grid grid-rows-1 grid-cols-2 display: flex justify-content: center gap-6 row-span-1 row-end-2 bg-blue-800 ' >


      {/*Personal information card*/}
      <Card className="justify-self-end h-auto  w-2/3 my-6 bg-blue-900 border-blue-900">

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white self-center text-white font-mono">Personal Information</h1>
        <br/><br/>

        <form>
          <label for="firstName">First Name</label>
          <input type="text" id="firstName"></input>

          <label for="lastName">Last Name</label>
          <input type="text" id="lastName"></input>
        </form>
        <br/><br/>
      </Card>


      {/*Sign in information card*/}
      <Card className="justify-self-end h-auto  w-2/3 my-6 bg-blue-900 border-blue-900">
        
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white self-center text-white font-mono">Sign in Information</h1>
        <br/><br/>

        <form>
          <label for="email">Email</label>
          <input type="email" id="email"></input>

          <label for="confirmEmail">Confirm email</label>
          <input type="email" id="confirmEmail"></input>

          <label for="password">Password</label>
          <input type="password" id="password"></input>

          <label for="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword"></input>
        </form>
      </Card>
    
      


    </div>
  )}