"use client"; 
import Link from 'next/link'
import { Card, Button } from 'flowbite-react';
import { database } from '../firebaseConfig.js';
import { useAuth } from '../context/AuthContext.js'
import { ref , set, push } from "firebase/database";
import { Fragment, useState, useRef} from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Modal from '@/components/modal.js';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Divider } from '@nextui-org/react';
import { sendEmailVerification } from 'firebase/auth';
import { Tooltip } from 'flowbite-react';


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
  const password = useRef();
  const confirmPassword = useRef();
  const email = useRef();
  const confirmEmail = useRef();
  const fName = useRef();
  const lName = useRef();
  const router = useRouter();
  const {signup} = useAuth()
  const [formData, setFormData] = useState({
    cardNumber: '',
    sortCode: '',
    expDate: '',
    securityCode: '',
    cardName: '',
    expDate: '',
    billAddress: ''
});

const setCardData = () =>{
  // Create a new card object from the form data
  const newCard = {
    cardNumber: formData.cardNumber,
    sortCode: formData.securityCode,
    expDate: formData.expDate,
    securityCode: formData.securityCode,
    cardName: formData.cardName,
    billAddress: formData.billAddress
  };
  setFormData(newCard)
  setShowAddCardModal(false)
}


const handleChange = (e) => {
  setFormData({
      ...formData,
      [e.target.name] : e.target.value
  });
};

//Handle first name change
const handleFirstNameChange = (e) => {
  // Validate first name with first capital letter, all capital or all lowercase
  const isFirstNameValid = /^([A-Z][a-z]*|[a-z]+)$/i.test(e.target.value) && e.target.value.length <= 40;
  
  if (!isFirstNameValid && e.target.value.length > 0) {
    setFirstNameError('First name cannot contain special characters or numbers');
  } else {
    setFirstNameError('');
  }
}; 

//Handle last name change
const handleLastNameChange = (e) => {
  // Validate last name with first capital letter, all capital or all lowercase
  const isLastNameValid = /^([A-Z][a-z]*|[a-z]+)$/i.test(e.target.value) && e.target.value.length <= 40;
  
  if (!isLastNameValid && e.target.value.length > 0) {
    setLastNameError('Last name cannot contain special characters or numbers');
  } else {
    setLastNameError('');
  }
};

//Handle password change
const handlePasswordChange = (e) => {
  // Validate password pattern (at least 8 characters and must contain one special character)
  const isPasswordValid = /[^a-zA-Z0-9]/.test(e.target.value) && e.target.value.length >= 8;
  
  if (!isPasswordValid) {
    setPasswordError('Weak password');
  } else {
    setPasswordError('');
  }
};

//Handle confirm password change
const handleConfirmPasswordChange = (e) => {
  const currentPassword = document.getElementById('password').value;
  const currentConfirmPassword = document.getElementById('confirmPassword').value;
  // Validate if confirm password and password are identical
  const isConfPasswordValid = currentConfirmPassword === currentPassword;
  if (!isConfPasswordValid) {
    setConfPasswordError('The passwords do not match');
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

// Handle submit function of the form
async function handleSubmit(e) {
  e.preventDefault();

  // Submit form if all input fields are valid
  if (
    emailError == '' &&
    confEmailError == '' &&
    passwordError == '' &&
    confPasswordError == '' &&
    firstNameError == '' &&
    lastNameError == ''
  ) {
    try {
      setEmailError('');
      setConfirmEmailError('');
      setFirstNameError('');
      setLastNameError('');
      setPasswordError('');
      setConfPasswordError('');
      setLoading(true); // disable register button

      console.log('Email:', email.current?.value);
      console.log('Password:', password.current?.value);
      const userCredential = await signup(email.current.value, password.current.value)
        .then((userCredential) => {
          const user = userCredential.user;
          // User created
          return sendEmailVerification(user).then(() => {
            console.log('Email verification sent');
            // Access the user's UID from the User object inside userCredential
            const userId = userCredential.user.uid;
            // Set the new user in the database
            return set(ref(database, 'User/' + userId), {
              email: email.current.value,
              firstName: fName.current.value,
              lastName: lName.current.value,
            })
              .then(() => {
                toast.success('New user added');
                console.log('New user added');
                if (
                  formData.cardName !== '' &&
                  formData.cardNumber !== '' &&
                  formData.sortCode !== '' &&
                  formData.securityCode !== '' &&
                  formData.expDate !== '' &&
                  formData.billAddress !== ''
                ) {
                  // Generate a unique key for the new card
                  const newCardKey = push(ref(database, 'User/' + userId + '/card')).key;

                  // Set the new card object at the specified path in the database
                  return set(ref(database, 'User/' + userId + '/card/' + newCardKey), formData)
                    .then(() => {
                      toast.success('New card added successfully');
                      console.log('New card added successfully');
                      setShowAddCardModal(false);
                    })
                    .catch((error) => {
                      toast.error('Error adding new card:', error);
                      console.error('Error adding new card:', error);
                    });
                }
              })
              .catch((error) => {
                toast.error('Error adding new user:', error);
                console.error('Error adding new user:', error);
              });
          });
        })
        .catch((error) => {
          console.log(error.message);
        });
      setLoading(false); // enable register button
      toast.success('Registration Successfull!');
      setShowCheckEmail(true)
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

      <div className='grid grid-rows-1 grid-cols-1 p-8  flex justify-content-center bg-dark-night'>

        {/*Sign in information card*/}
        <Card className="justify-self-center w-auto h-auto  my-6" style={{background: '#00052d', border : '#00052d'}} >
    
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white self-center text-white font-mono">PERSONAL INFORMATION</h1>
            <br/>
            <form className="grid grid-rows-3 grid-cols-2 gap-10 mr-10 ml-10  display: flex self-center text-white font-mono" onSubmit={handleSubmit}>

              <div >
                <label for="firstName">First Name*</label>
                <input className="block w-96 rounded-md py-1.5 px-1.5 mt-2 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text" id="firstName"  name="firstName" required maxLength={40} onChange={handleFirstNameChange} ref={fName}></input>
                {firstNameError && <span style={{ color: 'red', fontSize: '12px' }}>{firstNameError}</span>}
              </div>
              
              <div>
                <label for="lastName">Last Name*</label>
                <input className="block w-96 rounded-md py-1.5 px-1.5 mt-2 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="text" id="lastName"  name="lastName" required maxLength={40} onChange={handleLastNameChange} ref={lName}></input>
                {lastNameError && <span style={{ color: 'red', fontSize: '12px' }}>{lastNameError}</span>}
              </div>

              <div>
                <label for="email">Email*</label>
                <input className="block w-96 rounded-md py-1.5 px-1.5 mt-2 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="email" id="email" name="email" required onChange={handleEmailChange} ref={email}></input>
                {emailError && <span style={{ color: 'red', fontSize: '12px' }}>{emailError}</span>}
              </div>

              <div>
                <label for="confirmEmail">Confirm Email*</label>
                <input className="block w-96 rounded-md py-1.5 px-1.5 mt-2 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                type="email" id="confirmEmail" name="confirmEmail" required onChange={handleConfirmEmailChange} ref={confirmEmail}></input>
                {confEmailError && <span style={{ color: 'red', fontSize: '12px' }}>{confEmailError}</span>}
              </div>

              <div>
                <label className='inline-flex' for="password">Password*
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
                        className="block w-96 rounded-md py-1.5 px-1.5 mt-2 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={handlePasswordChange} required ref={password} type={showPassword ? "text" : "password"} name="password"id="password"/>
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

              <div>
                <label className='inline-flex' for="confirmPassword">Confirm Password*
                <Tooltip content="Password must match the password">
                      <svg  className = 'ml-2' width="24px" height="24px" stroke-width="1.5" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF">
                        <path d="M12 11.5V16.5" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M12 7.51L12.01 7.49889" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                      </svg>
                  </Tooltip>
                </label>
                <div className="relative">
                        <input
                        className="block w-96 rounded-md py-1.5 px-1.5 mt-2 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={handleConfirmPasswordChange} ref={confirmPassword} id="confirmPassword" name="confirmPassword" required type={showPassword ? "text" : "password"}/>
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
                                  {confPasswordError && <span style={{ color: 'red', fontSize: '12px' }}>{confPasswordError}</span>}
                </div>            
              </div>
              <div className='inline-flex items-center col-span-2 mt-6' onClick={()=> setShowAddCardModal(true)}>
                <Fab color="primary" size="small" aria-label="add" disabled={showAddCardModal}>
                  <AddIcon />
                </Fab>
                <a className=" text-sm  font-semibold text-indigo-600 ml-3 text-white">Add Card Details (Optional)</a>
              </div>
              <Button className="w-72 col-span-2 place-self-end mt-2 bold text-white" color='success' type="submit" disabled={showCheckEmail}>
                REGISTER
              </Button>
            </form>

            {/*Divider between login options*/} 
            <div className="inline-flex mt-6">
              <Divider className="self-center  w-96 m-3"></Divider>
                <a className="justify-self-center text-white m-3">OR</a>
              <Divider className="self-center w-96 m-3"></Divider>
            </div>
            
            <div className='inline-flex place-content-center'>
              {/*Facebook sign in button*/}
              <Button className="inline-flex bg-blue-600 text-white w-72 mr-4 self-center" color='blue'>
                <svg className="w-6 h-6 mr-2" fill='white' aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d ="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0014.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"/>
                </svg>
                Sign up with Facebook
              </Button>

              {/*Google sign in button*/}
              <Button className="inline-flex text-white w-72 ml-4 self-center bg-red-400" color='red'>
                <svg className="w-6 h-6 mr-3" fill='white' aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d ="M6 12a6 6 0 0011.659 2H12v-4h9.805v4H21.8c-.927 4.564-4.962 8-9.8 8-5.523 0-10-4.477-10-10S6.477 2 12 2a9.99 9.99 0 018.282 4.393l-3.278 2.295A6 6 0 006 12z"/>
                </svg>
                Sign up with Google
              </Button> 
            </div>
        </Card>
      </div>

      {/*Add card modal */}
      <Modal isVisible={showAddCardModal} onClose ={()=> setShowAddCardModal(false)}>
            <h3 className='text-xl flex self-center font-semibold text-white mb-5'>ADD NEW CARD</h3>
            <h3 className='flex self-center font-semibold text-white mb-5'>Add card by filling the details below</h3>
            <div className="self-center sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6 text-white font-mono">
                    <div>
                        <label htmlFor="number" className='text-white'>Card Number</label>
                        <input className="block w-full mt-2 rounded-md border-1  py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="tel" inputmode="numeric" id="cardNumber" name="cardNumber" maxLength={16} placeholder='4625 2563 2356 8514' required value={formData.cardNumber} onChange={handleChange}/> 
                    </div>

                    <div>
                        <label htmlFor="number" className='text-white'>Sort Code</label>
                        <input className="block w-full mt-2 rounded-md border-1  py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="tel" inputmode="numeric" id="sortCode" name="sortCode" maxLength={6} placeholder='26-02-54' required value={formData.sortCode} onChange={handleChange}/> 
                    </div>

                    <div className='inline-flex justify-evenly'>
                        <div className='mr-5'>
                            <label htmlFor="number" className='text-white'>Exp.Date</label>
                            <input className="block w-52 mt-2 my-2.5 rounded-md border-0 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="month" id="expDate" name="expDate" placeholder='12/24' required value={formData.expDate} onChange={handleChange}/>
                        </div> 
                        <div className='ml-5'>
                            <label htmlFor="number" className='inline-flex text-white'>CVV
                            <Tooltip content="Three digit code on the back of your card">
                                <svg  className = 'ml-2' width="24px" height="24px" stroke-width="1.5" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF">
                                  <path d="M12 11.5V16.5" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                  <path d="M12 7.51L12.01 7.49889" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </Tooltip>
                            </label>
                            <input className="block w-full mt-2 my-2.5 rounded-md border-0 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="text" id="securityCode" name="securityCode" maxLength={3} placeholder='342' required value={formData.securityCode} onChange={handleChange}/>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="text" className='text-white'>Card Holder</label>
                        <input className="block w-full mt-2 my-2.5 rounded-md border-1 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="text" id="cardName" name="cardName" placeholder='John Wick' required value={formData.cardName} onChange={handleChange}/>
                    </div>
                    <div>
                        <label htmlFor="text" className='text-white'>Billing Address</label>
                        <input className="block w-full mt-2 my-2.5 rounded-md border-1 border-black py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="text" id="billAddress" name="billAddress" placeholder='3 Admaston road' required value={formData.billAddress} onChange={handleChange}/>
                    </div>
                    <div className='flex justify-evenly mt-10'>
                        <Button className="w-52 mr-1 mb-2" color="gray" onClick ={()=>setShowAddCardModal(false)}> DISMISS</Button>
                        <Button type="submit" className="w-52 ml-1 mb-2" color="gray" onClick={setCardData}>CONFIRM</Button>
                    </div>
                </form>
            </div>
        </Modal>
        {/*Check Email modal */}
        <Modal isVisible={showCheckEmail} onClose ={()=> setShowCheckEmail(false)}>
            <h3 className='text-xl flex self-center font-semibold text-white mb-5'>CHECK YOUR EMAIL</h3>
            <h3 className='flex self-center font-semibold text-white  mb-5'>Verify your email before login into your account</h3>
            <div className='flex justify-end mt-10'>
                <Button type="submit" className="w-52" color="gray" onClick={()=>handleConfirmCheckEmailClick()}>OK</Button>
            </div>
        </Modal>

    </Fragment>
  )}