"use client"; 
import Image from 'next/image'
import Link from 'next/link'
import { Card, Button } from 'flowbite-react';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import React from 'react';


export default function Home() {
  //Use the useState Hook to keep track of each inputs value
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState('');           //Create email error
  const [passwordError, setPasswordError] = useState('');     //Create password error

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form if email and password are valid
    if (emailError === '' && passwordError === '') {
      console.log('Email:', email);
      console.log('Password:', password);
      // Add your form submission logic here
    } else {
      console.log('Form submission error');
    }
    // Add validation here that checks if email is associated with a user as well as if email has been validated
  };
    
   
  // Handle password change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Validate email pattern
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value);
    if (!isEmailValid) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };
  //Handle password change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Validate password pattern (at least 8 characters and must contain one special character)
    const isPasswordValid = /[^a-zA-Z0-9]/.test(e.target.value) && e.target.value.length >= 8;
    if (!isPasswordValid) {
      setPasswordError('Password must be at least 8 characters long and contain one specal character');
    } else {
      setPasswordError('');
    }
  };

  return (
    <div className='grid grid-rows-1 grid-cols-2 display: flex  gap-6 row-span-1 row-end-2 bg-blue-800 ' > 
    <Card className="justify-self-end h-auto  w-2/3 my-6 bg-blue-900 border-blue-900"  >
    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white self-center text-white font-mono ">
            LOGIN
          </h1>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6 text-white font-mono" action="#" method="POST onSubmit={handleSubmit}" >
            <div >
              <label htmlFor="email" >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder='Mary.dickson@gmail.com'
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />{emailError && <span style={{ color: 'red', fontSize: '14px' }}>{emailError}</span>}
              </div>
            </div>

            <div>
              <div >
                <label htmlFor="password" >
                  Password
                </label>
                </div>
              </div>
              <div class="relative">
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="•••••••••"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />{passwordError && <span style={{ color: 'red', fontSize: '14px' }}>{passwordError}</span>}
              </div>
            </div>
            <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 text-white">
                    Forgot password?
                  </a>
                </div>

            <div className='flex place-content-end'>
              <Button
                type="submit"
                className="w-52 bg-green-400 "
              >
                LOGIN
              </Button>
            </div>

            <div class="grid-containerDivider">
              <div class="grid-div1"><hr></hr></div>
              <div class="grid-div2 font-mono">OR</div>
              <div class="grid-div3"><hr></hr></div> 
            </div>
            
          
            
            <div className='flex place-content-center'>
            <Button type="button" class="text-white bg-[#3B82F6] hover:bg-[#1A68DC]/90 focus:ring-4 focus:outline-none focus:ring-[#1A68DC]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#1A68DC]/55 me-2 mb-2">
                <svg class="w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                <path fill-rule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clip-rule="evenodd"/>
                </svg>
                Sign in with Facebook
                </Button>
            </div>
            <div className='flex place-content-center'>
            <Button type="button" class="text-white bg-[#C7573E] hover:bg-[#EF4444]/90 focus:ring-4 focus:outline-none focus:ring-[#EF4444]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#EF4444]/55 me-2 mb-2">
              <svg class="w-8 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
              <path fill-rule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clip-rule="evenodd"/>
              </svg>
              Sign in with Google
            </Button>
            </div>
          </form>
            </div>

    </Card> 

    <Card className=" justify-self-start h-auto  w-2/3 my-6 bg-blue-900 border-blue-900" >
    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white self-center text-white font-mono ">
            REGISTER
          </h1>

        <p className="text-white text-center font-mono my-8">SIMPLY CLICK ON THE REGISTER BUTTON AND BECOME PART OF A HUGE ONLINE COMUNITY</p>
        <div class="grid-benefit">
              <div class="text-white"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-tags" viewBox="0 0 16 16">
                    <path d="M3 2v4.586l7 7L14.586 9l-7-7zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586z"/>
                    <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1z"/>
                  </svg></div>
              <div class="text-white "><a className="font-mono">RECEIVE DISCOUNT AND BENEFIT</a></div>
              <div class="text-white"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-globe" viewBox="0 0 16 16">
                          <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/></svg></div> 
              <div class="text-white"><a className="text-white font-mono">BE PART OF A COMMUNITY</a></div>
            </div>

            <div className='flex place-content-center'>
              <Button
                type="submit"
                className=" w-72 my-28 bg-green-400"
              >
                <Link href="/register" >
                            REGISTER           
                        </Link>
              </Button>
            </div>

    </Card>

    </div>
  );
}






