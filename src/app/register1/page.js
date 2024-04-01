"use client"; 
import Link from 'next/link'
import { Card, Button } from 'flowbite-react';
import { database } from '../firebaseConfig.js';
import { useAuth } from '../context/AuthContext.js'
import { ref , get, update } from "firebase/database";
import { Fragment, useEffect, useState, useRef} from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';





export default function Home() {

  const [lastNameError, setLastNameError] = useState('');             //Create last name error
  const [firstNameError, setFirstNameError] = useState('');           //Create first error
  const [emailError, setEmailError] = useState('');                   //Create email error
  const [confEmailError, setConfirmEmailError] = useState('');                   //Create email error
  const [passwordError, setPasswordError] = useState('');             //Create password error
  const [confPasswordError, setConfPasswordError] = useState('');     //Create confirm password error
  const [loading, setLoading] = useState(false);                      // keep track of the registration
  const password = useRef();
  const confirmPassword = useRef();
  const email = useRef();
  const confirmEmail = useRef();
  const fName = useRef();
  const lName = useRef();

  const { signup } = useAuth()

//Handle first name change
const handleFirstNameChange = (e) => {
  const isFirstNameValid = /^[a-z ,.'-]+$/i.test(e.target.value) && e.target.value.length <= 40;
  // Validate password pattern (at least 8 characters and must contain one special character)
  if (!isFirstNameValid) {
    setFirstNameError('First name cannot contain special characters or numbers');
  } else {
    setEmailError('');
  }
}; 

//Handle last name change
const handleLastNameChange = (e) => {
  const isLastNameValid = /^[a-z ,.'-]+$/i.test(e.target.value) && e.target.value.length <= 40;
  // Validate password pattern (at least 8 characters and must contain one special character)
  if (!isLastNameValid) {
    setLastNameError('Last name cannot contain special characters or numbers');
  } else {
    setLastNameError('');
  }
};

//Handle password change
const handlePasswordChange = (e) => {
  const isPasswordValid = /[^a-zA-Z0-9]/.test(e.target.value) && e.target.value.length >= 8;
  // Validate password pattern (at least 8 characters and must contain one special character)
  if (!isPasswordValid) {
    setPasswordError('Password must be at least 8 characters long and contain one special character');
  } else {
    setPasswordError('');
  }
};

//Handle confirm password change
const handleConfirmPasswordChange = (e) => {
  const currentPassword = document.getElementById('password').value;
  const currentConfirmPassword = document.getElementById('confirmPassword').value;
  // Validate password pattern (at least 8 characters and must contain one special character)
  const isConfPasswordValid = currentConfirmPassword === currentPassword;
  if (!isConfPasswordValid) {
    setConfPasswordError('Confirm password does not match the password');
  } else {
    setConfPasswordError('');
  }
};

// Handle email change
const handleEmailChange = (e) => {
  // Validate email pattern
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value);
  // CHECK IF EMAIL INSERTED IS ALREADY IN USED HERE
  if (!isEmailValid) {
    setEmailError('Invalid email address');
  }else {
    setEmailError('');
  }
};

//Handle confirm email change
const handleConfirmEmailChange = (e) => {
  const currentEmail = document.getElementById('email').value;
  const currentConfirmEmail = document.getElementById('confirmEmail').value;
  // Validate password pattern (at least 8 characters and must contain one special character)
  const isConfEmailValid = currentConfirmEmail === currentEmail;
  if (!isConfEmailValid) {
    setConfirmEmailError('Confirm email does not match the the email');
  } else {
    setConfirmEmailError('');
  }
};
//Handle submit function of the form
async function handleSubmit(e){
  e.preventDefault();

  // Submit form if all input fields are valid
  if (emailError == '' && confEmailError == '' && passwordError == '' && confPasswordError == '' && firstNameError == '' && lastNameError == '') {

    try{    
      setEmailError('')
      setConfirmEmailError('')
      setFirstNameError('')
      setLastNameError('')
      setPasswordError('')
      setConfPasswordError('')

      setLoading(true);       // disable login button 

        await signup(email.current.value, password.current.value);
        console.log(email.current.value,password.current.value);
        // SEND EMAIL VERIFICATION HERE
        // WRITE TO DATABASE

        setLoading(false);    // enable login button    

      // Display confirm toast message
      toast.success("Step 1 Registration Successfull!");

    }
    catch (e) {
      toast.error(e.message);
      console.log(e);
    }
      
  } else {
      setEmailError("Email is required")
      setConfirmEmailError("Confirm Email is required")
      setConfPasswordError("Confirm Password is required")
      setPasswordError("Password is required")
      setFirstNameError("First Name is required")
      setLastNameError("Last Name is required")
  }  
};


    

  return (

    <div className='grid grid-rows-1 grid-cols-1 p-8 flex justify-content-center bg-dark-night'>

      {/*Status bar */}
      <div className="justify-self-center w-full py-6">
        <div className="flex">
          <div className="w-1/4">
            <div className="relative mb-2">
              <div className="w-10 h-10 mx-auto bg-green-500 rounded-full text-lg text-white flex items-center">
                <span className="text-center text-white w-full">
                  <svg className="w-full fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="text-xs text-white font-mono text-center md:text-base">Personal Information</div>
          </div>

          <div className="w-1/4">
            <div className="relative mb-2">
              <div className="absolute flex align-center items-center align-middle content-center" style={{ width: 'calc(100% - 2.5rem - 1rem)', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                  <div className="w-0  py-1 bg-green-300 rounded" style={{ width: '50%' }}></div>{/*bg-green-300 */}
                </div>
              </div>

              <div className="w-10 h-10 mx-auto bg-white rounded-full text-lg text-white flex items-center">{/*bg-green-300 */}
                <span className="text-center text-gray-600 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>

                </span>
              </div>
            </div>

            <div className="text-xs text-white font-mono text-center md:text-base">Address Details</div>
          </div>

          <div className="w-1/4">
            <div className="relative mb-2">
              <div className="absolute flex align-center items-center align-middle content-center" style={{ width: 'calc(100% - 2.5rem - 1rem)', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                  <div className="w-0 py-1  rounded" style={{width: '33%'}}></div>{/*bg-green-300  */}
                </div>
              </div>

          <div className="w-10 h-10 mx-auto bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center">
            <span className="text-center text-gray-600 w-full">
              <svg className="w-full fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="24" height="24">
                <path className="heroicon-ui" d="M14 3a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1h12zM2 2a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H2z"/>
                <path className="heroicon-ui" d="M2 5.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-1zm0 3a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zm0 2a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zm3 0a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zm3 0a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zm3 0a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5z" />
              </svg>
            </span>
          </div>
        </div>

        <div className="text-xs text-white font-mono text-center md:text-base">Card Details</div>
      </div>
    </div>
    </div>

      
      {/*Sign in information card*/}
      <Card className="justify-self-center h-auto w-4/5 my-6 bg-blue-900 border-blue-900">
        
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white self-center text-white font-mono">PERSONAL INFORMATION</h1>
        <br/>

        <form className="grid grid-rows-3 grid-cols-2 gap-6 display: flex text-white font-mono" onSubmit={handleSubmit}>

          <div>
            <label for="firstName">First Name</label>
            <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="text" id="firstName"  name="firstName" required maxLength={40} onChange={handleFirstNameChange} ref={fName}></input>
            {firstNameError && <span style={{ color: 'red', fontSize: '14px' }}>{firstNameError}</span>}
          </div>
          
          <div>
            <label for="lastName">Last Name</label>
            <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="text" id="lastName"  name="lastName" required maxLength={40} onChange={handleFirstNameChange} ref={lName}></input>
            {lastNameError && <span style={{ color: 'red', fontSize: '14px' }}>{handleLastNameChange}</span>}
          </div>

          <div>
            <label for="email">Email</label>
            <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="email" id="email" name="email" required onChange={handleEmailChange} ref={email}></input>
            {emailError && <span style={{ color: 'red', fontSize: '14px' }}>{emailError}</span>}
          </div>

          <div>
            <label for="confirmEmail">Confirm email</label>
            <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="email" id="confirmEmail" name="confirmEmail" required onChange={handleConfirmEmailChange} ref={confirmEmail}></input>
            {confEmailError && <span style={{ color: 'red', fontSize: '14px' }}>{confEmailError}</span>}
          </div>

          <div>
            <label for="password">Password</label>
            <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="password" id="password" name="password" required onChange={handlePasswordChange} ref={password}></input>
            {passwordError && <span style={{ color: 'red', fontSize: '14px' }}>{passwordError}</span>}

          </div>          

          <div>
            <label for="confirmPassword">Confirm Password</label>
            <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="password" id="confirmPassword" name="confirmPassword" required onChange={handleConfirmPasswordChange} ref={confirmPassword}></input>            
            {confPasswordError && <span style={{ color: 'red', fontSize: '14px' }}>{confPasswordError}</span>}

          </div>

          <Button className="w-4/12 inline-flex col-span-2 justify-self-center mt-6" color='success' type="submit">
          <Link href="/register2">NEXT</Link>
          </Button>

          <Button href='/register2'>NEXT(temp)</Button>
        </form>
      </Card>

    </div>
  )}