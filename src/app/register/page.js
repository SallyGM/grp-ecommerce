"use client"; 
import Link from 'next/link'
import { Card, Button } from 'flowbite-react';
import { database } from '../firebaseConfig.js';
import { useAuth } from '../context/AuthContext.js'
import { ref , set, push, get } from "firebase/database";
import { Fragment, useState, useRef, useEffect} from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Modal from '@/components/modal.js';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Divider } from '@nextui-org/react';
import { sendEmailVerification } from 'firebase/auth';
import { Tooltip } from 'flowbite-react';
import { FormatUnderlined } from '@mui/icons-material';
import { useBasketContext } from '../context/BasketContext.js';
import { signInWithPopup, FacebookAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import InputMask from 'react-input-mask'


export default function Home() {

  const [lastNameError, setLastNameError] = useState('');             //Create last name error
  const [firstNameError, setFirstNameError] = useState('');           //Create first name error
  const [emailError, setEmailError] = useState('');                   //Create email error
  const [confEmailError, setConfirmEmailError] = useState('');        //Create confirm email error
  const [passwordError, setPasswordError] = useState('');             //Create password error
  const [confPasswordError, setConfPasswordError] = useState('');     //Create confirm password error
  const [loading, setLoading] = useState(false);                      // keep track of the registration
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showCheckEmail, setShowCheckEmail] = useState(false);
  const [showPassword,setShowPassword] = useState(false)
  const [showConfirmPassword,setShowConfirmPassword] = useState(false)
  const [checkDateError, setCheckDateError] = useState('');
  //const from basket page ------------------------------------------------------------------
  const [ showCVV, setShowCVV] = useState(false) 
  const [ fullNameError, setFullNameError] = useState(false)
  const [ cardNumberError, setCardNumberError] = useState(false)  
  const [ sortCodeError, setSortCodeError] = useState(false)  
  const [ cvvError, setCVVError] = useState(false)  
  const [ expirationDateError, setExpirationDateError] = useState(false)   
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); 
  //end const from basket page --------------------------------------------------------------
  const password = useRef();
  const confirmPassword = useRef();
  const email = useRef();
  const confirmEmail = useRef();
  const fName = useRef();
  const lName = useRef();
  const router = useRouter();
  const { guestBasket, registerBasket } = useBasketContext();
  const [registration, setRegistration] = useState(true)
  const {currentUser, signup, signin, signout} = useAuth();
  const [formData, setFormData] = useState({
    cardNumber: '',
    sortCode: '',
    expDate: '',
    securityCode: '',
    cardName: '',
    expDate: ''
  });

  // Sign in with Facebook
  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        console.log('Sign-in successful:', result);
        
        // The signed-in user info.
        const user = result.user;
        const name = user.displayName;
        const userId = user.uid;
        const data = {
            "firstName": name
        }
        console.log(data,userId);

        // Check if the user already exists in the database
        const userRef = ref(database, 'User/' + userId);
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
            // if user already exist redirect to login page
            router.push('/login');
            signout();
            return; // Exit the function if user already exists
        }

        // if user does not exist add the user to the database
        await set(userRef, data);
        toast.success('Registration suggessfull');
        //Creates the basket if there is any 
        if(Object.keys(guestBasket).length > 0){
          await registerBasket(result)
          toast.success('Basket Registered Successfull!');
        }
        // Redirect to the main page
        router.push('/');
    } catch (error) {
        signout();
        console.error('Error signing in with Facebook or writing to database:', error);
        toast.error('Error signing in or writing to database');
    }
};


// Sign in with Google
const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
      const result = await signInWithPopup(auth, provider);
      console.log('Sign-in successful:', result);
      // The signed-in user info.
      const user = result.user;
      const name = user.displayName;
      const userId = user.uid;
      const data = {
          "firstName": name
      }
      console.log(data,userId);

      // Check if the user already exists in the database
      const userRef = ref(database, 'User/' + userId);
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
          // if user already exist redirect to login page
          router.push('/login');
          signout();
          return; // Exit the function if user already exists
      }

      // if user does not exist add the user to the database
      await set(userRef, data);
      toast.success('Registration suggessfull');
      //Creates the basket if there is any 
      if(Object.keys(guestBasket).length > 0){
        await registerBasket(result)
        toast.success('Basket Registered Successfull!');
      }
      // Redirect to the main page
      router.push('/');
  } catch (error) {
      signout();
      console.error('Error signing in with Facebook or writing to database:', error);
      toast.error('Error signing in or writing to database');
  }
};


//function to redirect the user to the home page if already logged in
useEffect (() => {
  if (currentUser && !registration){
    router.push('/login')
  }  
}, [currentUser, registration]);


const setCardData = () =>{
  // Create a new card object from the form data
  const newCard = {
    cardNumber: formData.cardNumber,
    sortCode: formData.securityCode,
    expDate: formData.expDate,
    securityCode: formData.securityCode,
    cardName: formData.cardName
  };
  setFormData(newCard)
  setShowAddCardModal(false)
};


const handleChange = (e) => {
  setFormData({
      ...formData,
      [e.target.name] : e.target.value
  });
};


// HANDLE FIRST NAME CHANGE
const handleFirstNameChange = (e) => {
  // Validate first name with first capital letter, all capital or all lowercase
  const isFirstNameValid = /^([A-Z][a-z]*|[a-z]+)$/i.test(e.target.value) && e.target.value.length <= 40;
  
  if (!isFirstNameValid && e.target.value.length > 0) {
    setFirstNameError('First name cannot contain special characters or numbers');
  } else {
    setFirstNameError('');
  }
}; 


// HANDLE LAST NAME CHANGE
const handleLastNameChange = (e) => {
  // Validate last name with first capital letter, all capital or all lowercase
  const isLastNameValid = /^([A-Z][a-z]*|[a-z]+)$/i.test(e.target.value) && e.target.value.length <= 40;
  
  if (!isLastNameValid && e.target.value.length > 0) {
    setLastNameError('Last name cannot contain special characters or numbers');
  } else {
    setLastNameError('');
  }
};


// HANDLE EMAIL CHANGE
const handleEmailChange = (e) => {
  //data needed to fix the bug error remaining in confirm field (temporary)
  const currentEmail = document.getElementById('email').value;
  const currentConfirmEmail = document.getElementById('confirmEmail').value;
  // Validate email pattern
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value);
  // CHECK IF EMAIL INSERTED IS ALREADY IN USED HERE
  if (!isEmailValid && e.target.value.length > 0) {
    setEmailError('Invalid email address');
  }else {
    setEmailError('');
  }

  //temporary solution to fix bug of error not disappearing from confirm field
  const isConfEmailValid = currentConfirmEmail === currentEmail;
  // if second email has not been filled, the field should not be checked
  if (!isConfEmailValid && e.target.value.length > 0 && currentConfirmEmail.length > 0) {
    setConfirmEmailError('The emails do not match');
  } else {
    setConfirmEmailError('');
  }
};


// HANDLE CONFIRM EMAIL CHANGE
const handleConfirmEmailChange = (e) => {
  //data needed to fix the bug error remaining in confirm field (temporary)
  const currentEmail = document.getElementById('email').value;
  const currentConfirmEmail = document.getElementById('confirmEmail').value;
  // Validate password pattern (at least 8 characters and must contain one special character)
  const isConfEmailValid = currentConfirmEmail === currentEmail;
  if (!isConfEmailValid && e.target.value.length > 0) {
    setConfirmEmailError('The emails do not match');
  } else {
    setConfirmEmailError('');
  }
};


// Function that handle the Check email modal click
const handleConfirmCheckEmailClick = () => {
  setShowCheckEmail(false);
  router.push('/login');
};


// HANDLE PASSWORD CHANGE
const handlePasswordChange = (e) => {
  //data needed to fix the bug error remaining in confirm field (temporary)
  const currentPassword = document.getElementById('password').value;
  const currentConfirmPassword = document.getElementById('confirmPassword').value;
  // Validate password pattern (at least 8 characters and must contain one special character)
  const isPasswordValid = /[^a-zA-Z0-9]/.test(e.target.value) && e.target.value.length >= 8;
  
  if (!isPasswordValid && e.target.value.length > 0) {
    setPasswordError('Weak password');
  } else {
    setPasswordError('');
  }

  //temporary solution to fix bug of error not disappearing from confirm field
  const isConfPasswordValid = currentConfirmPassword === currentPassword;
  if (!isConfPasswordValid && e.target.value.length > 0 && currentConfirmPassword.length > 0) {
    setConfPasswordError('The passwords do not match');
  } else {
    setConfPasswordError('');
  }
};


// HANDLE CONFIRM PASSWORD CHANGE
const handleConfirmPasswordChange = (e) => {
  const currentPassword = document.getElementById('password').value;
  const currentConfirmPassword = document.getElementById('confirmPassword').value;
  // Validate if confirm password and password are identical
  const isConfPasswordValid = currentConfirmPassword === currentPassword;
  if (!isConfPasswordValid && e.target.value.length > 0) {
    setConfPasswordError('The passwords do not match');
  } else {
    setConfPasswordError('');
  }
};


// BEGIN CARD MODAL CHECKS----------------------------------------------------------------------------------------------

// function to enable/disable CONFIRM button
 const checkAllFieldsChange = () => {

         if (fullNameError == '' &&  formData.cardName != '' && cardNumberError == '' && formData.cardNumber != ''
         && sortCodeError == '' && formData.sortCode != '' && expirationDateError == '' && formData.expDate != '' &&
         cvvError == ''&& formData.securityCode != '') {
           setIsButtonDisabled(false);
         } else {
         setIsButtonDisabled(true);
       }   
 };


const handleFullName = (e) => {
  const isValid = /^([A-Z ][a-z ]*|[a-z ]+)$/i.test(e.target.value) && e.target.value.length <= 40 && e.target.value.length >0;
  
  if (!isValid ) {
    setFullNameError('Full name cannot contain special characters or numbers');
  } else {
    setFullNameError('');
  }

   checkAllFieldsChange();
};

// CARD NUNMBER VALIDATION
const handleCardNumber = (e) => {
  const input = e.target.value
  const isValid = /^([0-9 ]+)$/i.test(input) && input.length === 19;
   
  if (!isValid && input.length < 20 && input.length > 0 ) { 
    setCardNumberError('Card number has to be 16 digits long'); 
  } else {
    setCardNumberError('');
  }

   checkAllFieldsChange();
};


// SORT CODE VALIDATION
const handleSortCode = (e) => {
  const isValid = /^([0-9-]+)$/i.test(e.target.value) && e.target.value.length === 8;
  
  if (!isValid && e.target.value.length < 9 && e.target.value.length > 0) { 
    setSortCodeError('Sort code should be 6 digits long');
  } else { 
    setSortCodeError('');
  }

   checkAllFieldsChange();
};


// CVV VALIDATION
const handleCVV = (e) => {
  const isValid = /^([0-9 ]+)$/i.test(e.target.value) && e.target.value.length === 3;
  
  if (!isValid && e.target.value.length < 4 && e.target.value.length > 0) {
    setCVVError('3 digits long');
  } else {
    setCVVError('');
  }

   checkAllFieldsChange();
};

// EXPIRY DATE VALIDATION
const checkDate = (e) => {
  const currentDate = new Date;
  const expireDate = new Date(e.target.value);
  if (expireDate!= null && currentDate > expireDate) {
    setCheckDateError('Invalid Date')
  } else {
    setCheckDateError('')
  }

   checkAllFieldsChange();
}

//END CARD MODAL CHECKS------------------------------------------------------------------------------------------------


// FORM SUBMIT FUNCTION
async function handleSubmit(e) {
  e.preventDefault();

  // Submit form if all input fields are valid
  if (emailError == '' && confEmailError == '' &&
    passwordError == '' && confPasswordError == '' &&
    firstNameError == '' && lastNameError == '') {
    try {
      setEmailError('');
      setConfirmEmailError('');
      setFirstNameError('');
      setLastNameError('');
      setPasswordError('');
      setConfPasswordError('');
      setLoading(true); // disable register button

      // create acc
      // and send email verification
      const newUser = await signup(email.current.value, password.current.value)

      setRegistration(true)

      if (newUser && registration){

        const data = {
          "firstName": fName.current.value,
          "lastName": lName.current.value
        }
  
        const userRef = ref(database, 'User/' + newUser.uid);
  
        await set(userRef, data).then(async () => {
          toast.success('New user added');
  
          if ( formData.cardName !== '' && formData.cardNumber !== '' &&
          formData.sortCode !== '' && formData.securityCode !== '' &&
          formData.expDate !== '') {
            // Generate a unique key for the new card
            const newCardKey = push(ref(database, 'User/' + newUser.uid + '/card')).key;
  
            // Set the new card object at the specified path in the database
            try {
              await set(ref(database, 'User/' + newUser.uid + '/card/' + newCardKey), formData);
              toast.success('New card added successfully');
              console.log('New card added successfully');
              setShowAddCardModal(false);
            } catch (error) {
              toast.error('Error adding new card:', error);
              console.error('Error adding new card:', error);
            }
          }
        }).catch((error) => {
          toast.error('Error adding new user:', error);
          console.error('Error adding new user:', error);
        });
  
        //Creates the basket if there is any 
        if(Object.keys(guestBasket).length > 0){
          await registerBasket(newUser)
          toast.success('Basket Registered Successfull!');
        }

        setLoading(false); // enable register button
        toast.success('Registration Successfull!');
        setShowCheckEmail(true)
      }
      await signout();
    } catch (e) {
      toast.error(e.message);
      console.log(e);
    }
  } else {
    setEmailError('Email is required');
    setConfirmEmailError('Confirm Email is required');
    setConfPasswordError('Confirm Password is required');
    setPasswordError('Password is required');
    setFirstNameError('First Name is required');
    setLastNameError('Last Name is required');
  }
}

return (
  <Fragment>
    <div className='bg-blue-gradient grid grid-rows-1 grid-cols-1 p-8  flex justify-content-center bg-dark-night'>

      {/*Sign in information card*/}
      <Card className="justify-self-center w-auto h-auto  my-6 summary-box" >
  
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white self-center text-white font-mono">PERSONAL INFORMATION</h1>
        <br/>
        <form className="grid grid-rows-3 grid-cols-2 gap-10 mr-10 ml-10  display: flex self-center text-white font-mono" onSubmit={handleSubmit}>
          <div>
            <label>First Name*</label>
            <input className="block w-full bg-transparent rounded-md py-1.5 px-1.5 mt-2 focus:bg-transparent border-2 focus:border-fuchsia-800 shadow-sm focus:outline-none focus:border-red ring-1 ring-inset placeholder:text-gray-200 focus:ring-0 focus:placeholder:text-white focus:ring-inset"
            type="text" id="firstName"  name="firstName" required maxLength={40} onChange={handleFirstNameChange} ref={fName}></input>
            {firstNameError && <span style={{ color: 'red', fontSize: '12px' }}>{firstNameError}</span>}
          </div>
          
          <div>
            <label>Last Name*</label>
            <input className="block w-full bg-transparent rounded-md py-1.5 px-1.5 mt-2 focus:bg-transparent border-2 focus:border-fuchsia-800 shadow-sm focus:outline-none focus:border-red ring-1 ring-inset placeholder:text-gray-200 focus:ring-0 focus:placeholder:text-white focus:ring-inset "
            type="text" id="lastName"  name="lastName" required maxLength={40} onChange={handleLastNameChange} ref={lName}></input>
            {lastNameError && <span style={{ color: 'red', fontSize: '12px' }}>{lastNameError}</span>}
          </div>

          <div>
            <label>Email*</label>
            <input className="block w-full bg-transparent rounded-md py-1.5 px-1.5 mt-2 focus:bg-transparent border-2 focus:border-fuchsia-800 shadow-sm focus:outline-none focus:border-red ring-1 ring-inset placeholder:text-gray-200 focus:ring-0 focus:placeholder:text-white focus:ring-inset "
            type="email" id="email" name="email" required onChange={handleEmailChange} ref={email}></input>
            {emailError && <span style={{ color: 'red', fontSize: '12px' }}>{emailError}</span>}
          </div>

          <div>
            <label>Confirm Email*</label>
            <input className="block w-full bg-transparent rounded-md py-1.5 px-1.5 mt-2 focus:bg-transparent border-2 focus:border-fuchsia-800 shadow-sm focus:outline-none focus:border-red ring-1 ring-inset placeholder:text-gray-200 focus:ring-0 focus:placeholder:text-white focus:ring-inset "
            type="email" id="confirmEmail" name="confirmEmail" required onChange={handleConfirmEmailChange} ref={confirmEmail}  autoComplete="nope"></input>
            {confEmailError && <span style={{ color: 'red', fontSize: '12px' }}>{confEmailError}</span>}
          </div>

          <div>
            <label className='inline-flex'>Password*
              <Tooltip content="Password must contain more then 8 characters mixed with at least one special character">
                  <svg className='ml-2' width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF">
                    <path d="M12 11.5V16.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M12 7.51L12.01 7.49889" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
              </Tooltip>
            </label>
            <div className="relative">
              <input className="block w-96 bg-transparent rounded-md py-1.5 px-1.5 mt-2 focus:bg-transparent border-2 focus:border-fuchsia-800 shadow-sm focus:outline-none focus:border-red ring-1 ring-inset placeholder:text-gray-200 focus:ring-0 focus:placeholder:text-white focus:ring-inset "
              onChange={handlePasswordChange} required ref={password} type={showPassword ? "text" : "password"} name="password"id="password"/>
                <button
                  type="button"
                  aria-label={
                    showPassword ? "Password Visible" : "Password Invisible."
                  }
                  className="text-white"
                  onClick={() => {
                    setShowPassword((prev) => !prev);
                  }}>
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 select-none cursor-pointer h-6 absolute top-2 right-2"
                      tabIndex="-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 select-none cursor-pointer h-6 absolute top-2 right-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      ></path>
                    </svg>
                  )}
                </button>
                {passwordError && <span style={{ color: 'red', fontSize: '12px' }}>{passwordError}</span>}
              </div>
            </div>    
            <div>
              <label className='inline-flex'>Confirm Password*
                <Tooltip content="Password must match the password">
                  <svg  className= 'ml-2' width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF">
                    <path d="M12 11.5V16.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M12 7.51L12.01 7.49889" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </Tooltip>
              </label>
                <div className="relative">
                  <input className="block w-96 bg-transparent rounded-md py-1.5 px-1.5 mt-2 focus:bg-transparent border-2 focus:border-fuchsia-800 shadow-sm focus:outline-none focus:border-red ring-1 ring-inset placeholder:text-gray-200 focus:ring-0 focus:placeholder:text-white focus:ring-inset"
                        onChange={handleConfirmPasswordChange} ref={confirmPassword} id="confirmPassword" name="confirmPassword" required type={showConfirmPassword ? "text" : "password"}/>
                    <button
                      type="button"
                      aria-label={
                        showConfirmPassword ? "Password Visible" : "Password Invisible."
                      }
                      className="text-white"
                      onClick={() => {
                        setShowConfirmPassword((prev) => !prev);
                      }}
                    >
                      {showConfirmPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 select-none  cursor-pointer h-6 absolute top-2 right-2"
                          tabIndex="-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 select-none cursor-pointer h-6 absolute top-2 right-2"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          ></path>
                        </svg>
                      )}
                    </button>
                    {confPasswordError && <span style={{ color: 'red', fontSize: '12px' }}>{confPasswordError}</span>}
                </div>            
              </div>
              <div className='inline-flex items-center col-span-2 mt-6' onClick={()=> setShowAddCardModal(true)}>
                <Fab color="primary" size="small" aria-label="add" disabled={showAddCardModal}>
                  <AddIcon />
                </Fab>
                <a className=" text-sm  font-semibold text-indigo-600 ml-3 text-white">Add Card Details (Optional)</a>
              </div>
              <button className="w-72 col-span-2 place-self-end mt-2 bold text-white bg-green-400 focus:outline-none hover:bg-green-500 focus:ring-4 focus:ring-green-300 rounded-lg px-5 py-2.5 me-2 mb-2" type="submit" disabled={showCheckEmail}>
                REGISTER
              </button>
            </form>

            {/*Divider between login options*/} 
            <div className="inline-flex mt-6 self-center">
              <Divider className="self-center w-96 "></Divider>
                <a className="justify-self-center text-white m-3"> OR </a>
              <Divider className="self-center w-96 "></Divider>
            </div>
            
            <div className='inline-flex place-content-center'>
              {/*Facebook sign in button*/}
              <Button onClick={signInWithFacebook}  className="inline-flex bg-blue-600 text-white w-2/6 mr-4" color='blue'>
                <svg className="w-6 h-6 mr-2" fill='white' aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d ="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0014.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"/>
                </svg>
                Sign up with Facebook
              </Button>

              {/*Google sign in button*/}
              <Button onClick={signInWithGoogle} className="inline-flex bg-red-400 text-white w-2/6 ml-4" color='red'>
                <svg className="w-6 h-6 mr-3" fill='white' aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d ="M6 12a6 6 0 0011.659 2H12v-4h9.805v4H21.8c-.927 4.564-4.962 8-9.8 8-5.523 0-10-4.477-10-10S6.477 2 12 2a9.99 9.99 0 018.282 4.393l-3.278 2.295A6 6 0 006 12z"/>
                </svg>
                Sign up with Google
              </Button> 
            </div>
        </Card>
      </div>

      {/* =============================================================================================================== */}
      {/*MODAL FOR ADD CARD */}
      <Modal isVisible={showAddCardModal} onClose ={()=> setShowAddCardModal(false)}>
        <h3 className='text-xl flex self-center font-semibold text-white mb-5'>ADD NEW CARD</h3>
        <h3 className='flex self-center font-semibold text-white mb-6'>Add card by filling the details below</h3>
        <div className="self-center sm:mx-auto sm:w-full sm:max-w-sm">
          
          <form className="space-y-6 text-white font-mono">
            <div>
              <label className='text-white'>Cardholder Name</label>
              <input className="block w-full bg-transparent rounded-md py-1.5 px-1.5 mt-2 focus:bg-transparent border-2 focus:border-fuchsia-800 shadow-sm focus:outline-none focus:border-red ring-1 ring-inset placeholder:text-text-gray-6000 focus:ring-0 focus:placeholder:text-gray-600 focus:ring-inset"
              type="text" id="cardName" name="cardName" placeholder='John Wick' required value={formData.cardName} 
              onInput={handleFullName} onChange={handleChange}/>
              {fullNameError && <span style={{ color: 'red', fontSize: '12px' }}>{fullNameError}</span>}
            </div>

            <div className="noIncrementer"> {/*noIncrementer is a CSS class*/}
              <label className='text-white'>Card Number</label>
              <InputMask className="block w-full bg-transparent rounded-md py-1.5 px-1.5 mt-2 focus:bg-transparent border-2 focus:border-fuchsia-800 shadow-sm focus:outline-none focus:border-red ring-1 ring-inset placeholder:text-gray-600 focus:ring-0 focus:placeholder:text-gray-600 focus:ring-inset"
              id="cardNumber" name="cardNumber" placeholder='4625 2563 2356 8514' mask="9999 9999 9999 9999" maskChar='' required value={formData.cardNumber} 
              onInput={handleCardNumber} onChange={handleChange}/>
              {cardNumberError && <span style={{ color: 'red', fontSize: '12px' }}>{cardNumberError}</span>}
            </div>

            <div className="noIncrementer">
              <label className='text-white'>Sort Code</label>
              <InputMask className="block w-full bg-transparent rounded-md py-1.5 px-1.5 mt-2 focus:bg-transparent border-2 focus:border-fuchsia-800 shadow-sm focus:outline-none focus:border-red ring-1 ring-inset placeholder:text-gray-600 focus:ring-0 focus:placeholder:text-gray-600 focus:ring-inset"
                id="sortCode" name="sortCode" mask="99-99-99" maskChar="" placeholder='26-02-54' required value={formData.sortCode} 
                onInput={handleSortCode} onChange={handleChange}/>
                <span className={sortCodeError.length > 1 ? '' : "text-opacity-0"} style={{ color: 'red', fontSize: '12px' }}>{sortCodeError}</span>
            </div>

            <div className='inline-flex justify-evenly'>
              <div className='mr-5'>
                  <label className='text-white'>Exp.Date</label>
                  <input className="block w-44 bg-transparent rounded-md py-1.5 px-1.5 mt-2 focus:bg-transparent border-2 focus:border-fuchsia-800 shadow-sm focus:outline-none focus:border-red ring-1 ring-inset placeholder:text-gray-600 focus:ring-0 focus:placeholder:text-gray-600 focus:ring-inset"
                  type="month" id="expDate" name="expDate" placeholder='12/24' required value={formData.expDate} 
                  onInput={checkDate} onChange={handleChange}/>
                  {checkDateError && <span style={{ color: 'red', fontSize: '12px' }}>{checkDateError}</span>}
              </div> 
              <div className="ml-5 noIncrementer relative">
                <label className='inline-flex text-white'>CVV
                  <Tooltip content="Three digit code on the back of your card">
                    <svg  className = 'ml-2' width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF">
                      <path d="M12 11.5V16.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                      <path d="M12 7.51L12.01 7.49889" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </Tooltip>
                </label>
                <InputMask type={showCVV ? "text" : "password"} className="block w-full bg-transparent rounded-md py-1.5 px-1.5 mt-2 focus:bg-transparent border-2 focus:border-fuchsia-800 shadow-sm focus:outline-none focus:border-red ring-1 ring-inset placeholder:text-gray-600 focus:ring-0 focus:placeholder:text-gray-600 focus:ring-inset"
                inputmode="numeric" id="securityCode" name="securityCode" mask="999" maskChar='' placeholder='342' required value={formData.securityCode}
                onInput={handleCVV} onChange={handleChange}/>
                {cvvError && <span style={{ color: 'red', fontSize: '14px', fontWeight:"bold" }}>{cvvError}</span>}
                  {/* Eye toggle to hide/show CVV */} 
                  <button
                  type="button"
                  aria-label={
                    showCVV ? "Password Visible" : "Password Invisible."
                  }
                  className="text-white"
                  onClick={() => {
                    setShowCVV((prev) => !prev);
                  }}>
                  {showCVV ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="#currentColor"
                      className="w-6 select-none cursor-pointer h-6 absolute top-10 right-4"
                      tabindex="-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLineJoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLineJoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 select-none cursor-pointer h-6 absolute top-10 right-4">
                      <path
                        strokeLinecap="round"
                        strokeLineJoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      ></path>
                    </svg>
                  )}  
                </button>
              </div>
            </div>

            <div className='flex justify-evenly'>
              <button className="dismiss-btn text-white rounded-lg text-m px-5 py-2.5 text-center roboto-light" onClick ={()=>setShowAddCardModal(false)}>DISMISS</button>
              <button type="submit" className="confirm-btn text-white rounded-lg text-m px-5 py-2.5 text-center roboto-light" disabled={isButtonDisabled} onClick={setCardData}>CONFIRM</button>
            </div>
          </form>
        </div>
      </Modal>
        
      {/*Check Email modal */}
      <Modal isVisible={showCheckEmail} onClose ={()=> setShowCheckEmail(false)}>
        <h3 className='text-xl flex self-center font-semibold text-white mb-5'>CHECK YOUR EMAIL</h3>
        <h3 className='flex self-center font-semibold text-white  mb-5'>Verify your email before login into your account</h3>
        <div className='flex justify-end mt-10'>
          <button type="submit" className="confirm-btn text-white rounded-lg text-m px-5 py-2.5 text-center roboto-light" onClick={()=>handleConfirmCheckEmailClick()}>OK</button>
        </div>
      </Modal>
    </Fragment>
  )
}