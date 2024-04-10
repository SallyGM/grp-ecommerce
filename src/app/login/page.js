"use client"; 
import Link from 'next/link'
import { Card, Button } from 'flowbite-react';
import { Divider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useState, useRef, Fragment, useEffect } from "react";
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast';
import Modal from '@/components/modal.js';
import { sendEmailVerification} from 'firebase/auth';
import { Tooltip } from 'flowbite-react';




export default function Login() {
  //Use the useState Hook to keep track of each inputs value
  const { currentUser, signin, signout, resetPassword} = useAuth()
  const router = useRouter();
  const email = useRef();
  const emailModal = useRef();
  const password = useRef();
  const [emailError, setEmailError] = useState('');             //Create email error
  const [passwordError, setPasswordError] = useState('');       //Create password error
  const [loading, setLoading] = useState(false);                // keep track of the login
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [emailModalError, setEmailModalError] = useState('');    //Create email error
  const [showCheckEmail, setShowCheckEmail] = useState(false);
  const [showAlertBanner, setShowAlertBanner] = useState(false);
  const [user, setUser] = useState(false);
  const [showPassword,setShowPassword] = useState(false)

  useEffect(() => {
    if (currentUser) router.push('/')
  }, [currentUser]);                  
  

// Function that hanle the Check email modal click
const handleConfirmCheckEmailClick = () => {
  setShowCheckEmail(false);
  router.push('/login');
};



async function handleSubmit(e) {
  e.preventDefault();

  // Submit form if email and password are valid
  if (emailError === '' && passwordError === '') {
    try {
      setEmailError('');
      setPasswordError('');
      setLoading(true); // disable login button

      // Sign in user with email and password
      const emailValue = email.current.value;
      const passwordValue = password.current.value;
      await signin(emailValue, passwordValue);
      setUser(currentUser)

      // Check if currentUser is not null
      
      if (currentUser && currentUser.user.emailVerified) {
        // Email is verified, proceed with login
        setShowAlertBanner(false);
        console.log('Login successful');
        toast.success("Login successful");
        router.push('/')
      } else {
        // Email is not verified or user does not exist
        setShowAlertBanner(true);
        console.log('Email is not verified or user does not exist');
        toast.error("Email is not verified or user does not exist. Please try again.");
        // Sign out the user since they cannot log in without verifying their email
        await signout();
      }

      setLoading(false); // enable login button
    } catch (error) {
      console.error('Error in login process:', error.message);
      toast.error("Error in login process: " + error.message);
      setLoading(false); // enable login button even if error occurs
    }
  } else {
    setEmailError("Email is required");
    setPasswordError("Password is required");
  }
}






  
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
// Handle email forgot password change
const handleForgotPasswordEmailChange = (e) => {
  
  // Validate email pattern
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value);
  if (!isEmailValid) {
    setEmailModalError('Invalid email address');
  }else {
    setEmailModalError('');
  }
};
async function handleSendResetPasswordVerification(e) {
  e.preventDefault();
  // Check if the email is valid
  if (emailModalError === '') {
    try {
      await resetPassword(emailModal.current.value);
      console.log('Password reset email sent successfully.');
      toast.success("Password reset email sent successfully.");
      setShowForgotPassword(false);
      setShowCheckEmail(true);
      
    } catch (error) {
      // Log and display error message if an error occurs
      console.error('Error:', error.message);
      toast.error("An error occurred while processing your request.");
    }
  } else {
    // Show error if email is not valid
    setEmailModalError("Invalid email address");
  }  
}
useEffect(() => {
  setShowAlertBanner(false);
}, []);


// Send email verification again function
const SendVerificationEmail = async (user) => {
  try {
    // Send email verification using the obtained ID token
    sendEmailVerification(user);

    console.log('Email verification sent again');
    toast.success("Email verification sent to your inbox");
    setShowAlertBanner(false);
  } catch (error) {
    console.error('Error sending email verification:', error.message);
    toast.error("Failed to send email verification: " + error.message);
  }
};



return (
  <Fragment>

    {/*Alert banner */}
    {showAlertBanner && (
    <div user = {user}  class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-2 py-2 shadow-md" role="alert">
      <div class="flex">
        <div class="py-1"><svg class="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
        <div>
          <p class="font-bold">Email verification</p>
          <p class="text-sm">If you didn't received the verification email please <a style={{ textDecoration: 'underline' }} onClick={()=>SendVerificationEmail(user)}>click here</a> </p>
        </div>
      </div>
    </div>
    )}


    <div className='grid grid-rows-1 grid-cols-2 gap-6 row-span-1 bg-dark-night'> 
      <Card className="justify-self-end h-auto w-2/3 my-6" style={{background: '#00052d', border : '#00052d'}}>
        <h1 className="self-center text-4xl font-bold text-white font-mono">LOGIN</h1>
        <div className="self-center sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6 text-white font-mono" onSubmit={handleSubmit}>

            <div>
              <label htmlFor="email">Email address</label>
              <input className="block w-full mt-2 rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={handleEmailChange} ref={email}/>
                {emailError && <span style={{ color: 'red', fontSize: '12px' }}>{emailError}</span>}  
            </div>

            <div>
                <label className='inline-flex'  htmlFor="password">Password
                  <Tooltip content="Password must contain more then 8 characters mixed with at least one special character">
                    <svg  className = 'ml-2' width="24px" height="24px" stroke-width="1.5" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF">
                      <path d="M12 11.5V16.5" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M12 7.51L12.01 7.49889" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                  </Tooltip>
                </label>
                <div className="relative">
                      <input
                      className="block w-full mt-2 my-2.5 rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      onChange={handlePasswordChange} ref={password} type={showPassword ? "text" : "password"} name="password"id="password"/>
                                <button
                                  type="button"
                                  aria-label={
                                    showPassword ? "Password Visible" : "Password Invisible."
                                  }
                                  className="text-black dark:text-white"
                                  onClick={() => {
                                    setShowPassword((prev) => !prev);
                                  }}
                                >
                                  {showPassword ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="#00052d"
                                      className="w-6 select-none  cursor-pointer h-6 absolute top-2 right-2"
                                      tabindex="-1"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                      ></path>
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                      ></path>
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke-width="1.5"
                                      stroke="#00052d"
                                      className="w-6 select-none cursor-pointer h-6 absolute top-2 right-2"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                      ></path>
                                    </svg>
                                  )}
                                </button>
                                {passwordError && <span style={{ color: 'red', fontSize: '12px' }}>{passwordError}</span>}
              </div>
            </div>
            <a className="text-sm font-semibold text-indigo-600  hover:text-indigo-500 text-white" onClick={()=>setShowForgotPassword(true)}>Forgot password?</a>
            <Button className="justify-self-center bold text-white w-full mt-7 bg-green-400" type='submit' color='success' >LOGIN</Button>
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

    <Card className=" justify-self-start h-auto  w-2/3 my-6" style={{background: '#00052d', border : '#00052d'}} >
      <h1 className="self-center text-4xl font-bold text-white font-mono ">REGISTER</h1>
      <p className="text-white text-center font-mono my-8  mt-12 mb-12">SIMPLY CLICK ON THE REGISTER BUTTON AND BECOME PART OF A HUGE ONLINE COMMUNITY</p>
      <div className="inline-flex mt-6 place-content-evenly">
        <svg className="text-white mr-6 bi bi-tags" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white"viewBox="0 0 16 16">
          <path d="M3 2v4.586l7 7L14.586 9l-7-7zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586z"/>
          <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1z"/>
        </svg>
        <a className="font-mono text-white">RECEIVE DISCOUNT AND BENEFITS</a>
      </div> 
      <div className="inline-flex mt-9 place-content-evenly">
        <svg className="text-white mr-6 bi bi-globe" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="white" viewBox="0 0 16 16">
          <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z"/>
        </svg>
        <a className="text-white font-mono">BE PART OF A COMMUNITY</a>
      </div>
      <Button disabled={loading}  className=" self-center w-72 mt-24 bold text-white " color='success'>
        <Link href="/register">REGISTER</Link>
      </Button>
    </Card>
  </div>
  {/*Forgot password modal */}
  <Modal isVisible={showForgotPassword}  onClose ={()=> setShowForgotPassword(false)}>
          <h3 className='text-xl flex self-center font-semibold text-white mb-5'>RESET YOUR PASSWORD</h3>
          <h3 className='flex self-center font-semibold text-white  mb-5'>Insert your email to reset your password</h3>
          <form className="space-y-6 text-white self-center font-mono" onSubmit={handleSendResetPasswordVerification}>
            <div className=' mt-2 mb-2  flex-wrap'>  
            <h2 id="email_address" className="flex dark:text-white mb-2 text-white font-mono ">EMAIL ADDRESS*</h2>  
                <input className="block w-full rounded-md mr-3 border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="email" id="first name" name="email" required onChange={handleForgotPasswordEmailChange} ref={emailModal}/>
                {emailModalError && <span style={{ color: 'red', fontSize: '12px' }}>{emailModalError}</span>}  
            </div>
            <div className='flex justify-evenly mt-10'>
                <Button className="w-52 mr-2" color="gray" onClick ={()=>setShowForgotPassword(false)}> DISMISS</Button>
                <Button type='submit' className="w-52 ml-2"  style={{background: '#00052d', border : '#00052d'}}>CONFIRM</Button>
            </div>
          </form>
      </Modal>
      {/*Check Email modal */}
      <Modal isVisible={showCheckEmail} onClose ={()=> setShowCheckEmail(false)}>
          <h3 className='text-xl flex self-center font-semibold text-white mb-5'>CHECK YOUR EMAIL</h3>
          <h3 className='flex self-center font-semibold text-white  mb-5'>We have sent you an email with the reset password link</h3>
          <div className='flex justify-end mt-10'>
              <Button type="submit" className="w-52"  style={{background: '#00052d', border : '#00052d'}} onClick={()=>handleConfirmCheckEmailClick()}>OK</Button>
          </div>
      </Modal>
</Fragment>
  );
}