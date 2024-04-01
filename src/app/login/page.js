"use client"; 
import Link from 'next/link'
import { Card, Button } from 'flowbite-react';
import { Divider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useState, useRef } from "react";
import { useAuth } from '../context/AuthContext'

export default function Home() {
  //Use the useState Hook to keep track of each inputs value
  const { signin } = useAuth()
  const router = useRouter();
  const email = useRef();
  const password = useRef();
  const [emailError, setEmailError] = useState('');           //Create email error
  const [passwordError, setPasswordError] = useState('');     //Create password error
  const [loading, setLoading] = useState(false); // keep track of the login

  async function handleSubmit(e){
    e.preventDefault();

    // Submit form if email and password are valid
    if (emailError === '' && passwordError === '') {

      try{    

        setEmailError('')
        setPasswordError('')
        setLoading(true) // disable login button 

        await signin(email.current.value, password.current.value)

        setLoading(false) // enable login button     
      }
      catch (e) {
        console.log(e)  
      }

      router.push('/');
    } else {
      setEmailError("Email is required")
      setPasswordError("Password is required")
    }  
  };
    
  // Handle email change
  const handleEmailChange = (e) => {
    
    // Validate email pattern
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value);
    if (!isEmailValid) {
      setEmailError('Invalid email address');
    }else {
      setEmailError('');
    }
  };

  //Handle password change
  const handlePasswordChange = (e) => {
    
    // Validate password pattern (at least 8 characters and must contain one special character)
    const isPasswordValid = /[^a-zA-Z0-9]/.test(e.target.value) && e.target.value.length >= 8;
    if (!isPasswordValid) {
      setPasswordError('Password must be at least 8 characters long and contain one specal character');
    } else {
      setPasswordError('');
    }
  };

  return (
      <div className='grid grid-rows-1 grid-cols-2 gap-6 row-span-1 bg-dark-night'> 
        <Card className="justify-self-end h-auto w-2/3 my-6 bg-blue-900 border-blue-900">
          <h1 className="self-center text-4xl font-bold text-white font-mono">LOGIN</h1>
          <div className="self-center sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6 text-white font-mono" onSubmit={handleSubmit}>

              <div>
                <label htmlFor="email">Email address</label>
                <input className="block w-full mt-2 rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={handleEmailChange} ref={email}/>
                  {emailError && <span style={{ color: 'red', fontSize: '14px' }}>{emailError}</span>}  
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <input className="block w-full mt-2 my-2.5 rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={handlePasswordChange} type='password' ref={password}/>
                  {passwordError && <span style={{ color: 'red', fontSize: '14px' }}>{passwordError}</span>}
              </div>

              <a href="#" className="text-sm font-semibold text-indigo-600  hover:text-indigo-500 text-white">Forgot password?</a>
              <Button className="justify-self-center w-full mt-7 bg-green-400" type='submit' color='success' >LOGIN</Button>
            </form>
            
          </div>

          {/*Divider between login options*/} 
          <div className="inline-flex mt-6">
            <Divider className="self-center  w-40 m-3"></Divider>
              <a className="justify-self-center text-white m-3">OR</a>
            <Divider className="self-center w-40 m-3"></Divider>
          </div>
          
          {/*Facebook sign in button*/}
          <Button className="inline-flex bg-blue-600 text-white w-72 self-center" color='blue'>
            <svg className="w-6 h-6 mr-2" fill='white' aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d ="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0014.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"/>
            </svg>
            Sign in with Facebook
          </Button>

          {/*Google sign in button*/}
          <Button className="inline-flex text-white w-72 self-center bg-red-400" color='red'>
            <svg className="w-6 h-6 mr-3" fill='white' aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d ="M6 12a6 6 0 0011.659 2H12v-4h9.805v4H21.8c-.927 4.564-4.962 8-9.8 8-5.523 0-10-4.477-10-10S6.477 2 12 2a9.99 9.99 0 018.282 4.393l-3.278 2.295A6 6 0 006 12z"/>
            </svg>
            Sign in with Google
          </Button>   
      </Card>

      <Card className=" justify-self-start h-auto  w-2/3 my-6 bg-blue-900 border-blue-900" >
        <h1 className="self-center text-4xl font-bold text-white font-mono">REGISTER</h1>
        <p className="text-white text-center font-mono my-8">SIMPLY CLICK ON THE REGISTER BUTTON AND BECOME PART OF A HUGE ONLINE COMMUNITY</p>
        <div className="inline-flex mt-6 place-content-evenly">
          <svg className="text-white mr-6 bi bi-tags" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white"viewBox="0 0 16 16">
            <path d="M3 2v4.586l7 7L14.586 9l-7-7zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586z"/>
            <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1z"/>
          </svg>
          <a className="font-mono text-white">RECEIVE DISCOUNT AND BENEFITs</a>
        </div> 
        <div className="inline-flex mt-9 place-content-evenly">
          <svg className="text-white mr-6 bi bi-globe" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" viewBox="0 0 16 16">
            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/>
          </svg>
          <a className="text-white font-mono">BE PART OF A COMMUNITY</a>
        </div>

        <Button disabled={loading} type="submit" className=" self-center w-72 mt-6 " color='success'>
          <Link href="/register1">REGISTER</Link>
        </Button>

      </Card>

    </div>
    
  );
}






