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
        <Card className="justify-self-center w-auto h-auto my-6 bg-blue-900 border-blue-900">
          
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white self-center text-white font-mono">PERSONAL INFORMATION</h1>
          <br/>

          <form className="grid grid-rows-3 grid-cols-2 gap-10 mr-10 ml-10  display: flex self-center text-white font-mono" onSubmit={handleSubmit}>

            <div>
              <label for="firstName">First Name</label>
              <input className="block w-96 rounded-md py-1.5 px-1.5 mt-2 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              type="text" id="firstName"  name="firstName" required maxLength={40} onChange={handleFirstNameChange} ref={fName}></input>
              {firstNameError && <span style={{ color: 'red', fontSize: '14px' }}>{firstNameError}</span>}
            </div>
            
            <div>
              <label for="lastName">Last Name</label>
              <input className="block w-96 rounded-md py-1.5 px-1.5 mt-2 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              type="text" id="lastName"  name="lastName" required maxLength={40} onChange={handleLastNameChange} ref={lName}></input>
              {lastNameError && <span style={{ color: 'red', fontSize: '14px' }}>{lastNameError}</span>}
            </div>

            <div>
              <label for="email">Email</label>
              <input className="block w-96 rounded-md py-1.5 px-1.5 mt-2 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              type="email" id="email" name="email" required onChange={handleEmailChange} ref={email}></input>
              {emailError && <span style={{ color: 'red', fontSize: '14px' }}>{emailError}</span>}
            </div>

            <div>
              <label for="confirmEmail">Confirm Email</label>
              <input className="block w-96 rounded-md py-1.5 px-1.5 mt-2 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              type="email" id="confirmEmail" name="confirmEmail" required onChange={handleConfirmEmailChange} ref={confirmEmail}></input>
              {confEmailError && <span style={{ color: 'red', fontSize: '14px' }}>{confEmailError}</span>}
            </div>

            <div>
              <label for="password">Password</label>
              <input className="block w-96 rounded-md py-1.5 px-1.5 mt-2 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              type="password" id="password" name="password" required onChange={handlePasswordChange} ref={password}></input>
              {passwordError && <span style={{ color: 'red', fontSize: '14px' }}>{passwordError}</span>}

            </div>          

            <div>
              <label for="confirmPassword">Confirm Password</label>
              <input className="block w-96 rounded-md py-1.5 px-1.5 mt-2 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              type="password" id="confirmPassword" name="confirmPassword" required onChange={handleConfirmPasswordChange} ref={confirmPassword}></input>            
              {confPasswordError && <span style={{ color: 'red', fontSize: '14px' }}>{confPasswordError}</span>}

            </div>
            <div className='inline-flex items-center col-span-2 mt-6' onClick={()=> setShowAddCardModal(true)}>
              <Fab color="primary" size="small" aria-label="add" disabled={showAddCardModal}>
                <AddIcon />
              </Fab>
              <a className=" text-sm  font-semibold text-indigo-600 ml-3 text-white">Add Card Details (Optional)</a>
            </div>
            <Button className="w-72 col-span-2 place-self-end mt-2" color='success' type="submit" disabled={showCheckEmail}>
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
                            <label htmlFor="number" className='text-white'>CVV</label>
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
                        <Button className="w-52 mr-1" color="gray" onClick ={()=>setShowAddCardModal(false)}> DISMISS</Button>
                        <Button type="submit" className="w-52 ml-1" color="gray" onClick={setCardData}>CONFIRM</Button>
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