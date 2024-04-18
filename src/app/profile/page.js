"use client"; 
import { Card, Button } from 'flowbite-react';
import { Fragment, useEffect, useState, useRef} from 'react';
import { ref , push, set, get, update, query, orderByChild, equalTo, remove } from "firebase/database";
import { database } from '../firebaseConfig.js';
import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@/components/modal.js';
import { useTheme } from '@mui/material/styles';
import { AccountCircle, Payment, VpnKey, SaveIcon, DoneIcon, RateReview, ExitToApp } from '@mui/icons-material'; // Import icons
import { useAuth } from '../context/AuthContext.js'
import toast from 'react-hot-toast';
import { deleteUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useProductContext } from '../context/ProductContext.js';
import InputMask from 'react-input-mask';
import { Tooltip } from 'flowbite-react';
import {FaStar} from 'react-icons/fa';
import amexIcon from '../images/amexIcon.png';
import masterCardIcon from '../images/mastercardIcon.png';
import visaIcon from '../images/visaIcon.png';



function TabPanel(props) {
    const { children, value, index, ...other } = props;
    
    return (
      
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  
TabPanel.propTypes = {
children: PropTypes.node,
index: PropTypes.number.isRequired,
value: PropTypes.number.isRequired,
};

function a11yProps(index) {
return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
};
}

export default function Account() {

    // Firebase information retrival function here
    const router = useRouter();
    const { currentUser, updatepassword, reautentication } = useAuth()
    const theme = useTheme();

    //#region PROFILE
    const [userDetails, setUserDetails] = useState(null);
    const [user, setUser] = useState()
    const [editButtonClicked, setEditButtonClicked] = useState(false);
    const [saveButtonClicked, setSaveButtonClicked] = useState(false);
    const [activateInputfields, setInputFieldActive] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showDeletedModal, setShowDeleteModal] = useState(false);
    const [details, setDetails] = useState('');
    const [oldPasswordError, setOldPasswordError] = useState('');     //Create old password error
    const [newPasswordError, setNewPasswordError] = useState('');     //Create new password error
    const [newConfPasswordError, setNewConfPasswordError] = useState('');     //Create new confirm password error
    const [loading, setLoading] = useState(false);
    const oldPassword = useRef();
    const newPassword = useRef();
    const newConfPassword = useRef();
    const [showOldPassword,setShowOldPassword] = useState(false);
    const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);
    const [value, setValue] = useState(0);
    const { signout } = useAuth();
    const [error, setError] = useState(false);
    
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    //#endregion 
    
    //#region CARD DETAILS VARIABLES
    const [cardDetails, setCardDetails] = useState([]);
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [showEditCard, setShowEditCard] = useState(false);
    const [showDeleteCard, setShowDeleteCard] = useState(false);
    const [card, setCard] = useState('');
    const [checkDateError, setCheckDateError] = useState('');
    const [formData, setFormData] = useState({
        cardNumber: '',
        sortCode: '',
        expDate: '',
        securityCode: '',
        cardName: ''
    });
    //#endregion
   
    //#region ORDER VARIABLES
    const { products } = useProductContext();
    const [OrderDetails, setOrderDetails] = useState([]);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);
    const [review, setReview] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
   

    const [reviewData, setReviewData] = useState({
        rating: '',
        title: '',
        comment: '',
        userName: ''
    });
    //#endregion

    //#region REVIEW VARIABLES
    const [reviewDetails, setReviewDetails] = useState([]);
    const [showDeleteReview, setShowDeleteReview] = useState(false);
    const [reviews, setReviews] = useState('');
    //#endregion
    
    //#region PROFILE
    async function handleSubmit(e){
        e.preventDefault();
    
        // Submit form if email and password fields are valid
        if (oldPasswordError == '' && newPasswordError == '' && newConfPasswordError == '') {
    
          try{    
            setOldPasswordError('')
            setNewPasswordError('')

            // reauthenticate 
            await reautentication(oldPassword.current.value)
            
            // changes password
            await updatepassword(newPassword.current.value)
            setShowPasswordModal(false) 
            // Display confirm toast message
            toast.success("Password Updated Successfully!")
          }
          catch (e) {
            toast.error(e)
            console.log(e)  
          }
        } else {
            setOldPasswordError("Old Password required")
            setNewPasswordError("New Password is required")
            setNewConfPasswordError("Confirm New Password is required")
        }  
    };

    //Handle  old password change
    const handleOldPasswordChange = async(e) => {
        const isOldPasswordValid = /[^a-zA-Z0-9]/.test(e.target.value) && e.target.value.length >= 8;
        if (!isOldPasswordValid) {
            setOldPasswordError('wrong password');
        } else {
            setOldPasswordError('');
        }
    };

   //Handle new password change
    const handleNewPasswordChange = (e) => {
        const isNewPasswordValid = /[^a-zA-Z0-9]/.test(e.target.value) && e.target.value.length >= 8;
        // Validate password pattern (at least 8 characters and must contain one special character)
        if (!isNewPasswordValid) {
            setNewPasswordError('Password must be at least 8 characters long and contain one special character');
        } else {
            setNewPasswordError('');
        }
    };

   //Handle new confirm password change
    const handleNewConfirmPasswordChange = (e) => {
        const currentNewPassword = document.getElementById('newPassword').value;
        const currentNewConfirmPassword = document.getElementById('confirmNewPassword').value;
        // Validate password pattern (at least 8 characters and must contain one special character)
        const isNewConfPasswordValid = currentNewConfirmPassword === currentNewPassword;
        if (!isNewConfPasswordValid) {
            setNewConfPasswordError('Confirm password does not match the new password');
        } else {
            setNewConfPasswordError('');
        }
    };

    const handleChange = (e) => {
        setUserDetails({
            ...userDetails,
            [e.target.name] : e.target.value
        });
    };

    const openEditDetailsModal = (userDetails) => {
        if (userDetails) {
            setDetails(userDetails);
            setShowModal(true);
        } else {
            // Handle the case where userDetails is null or undefined
            console.error("User details are null or undefined");
        }
    };
    
    const handleEditButtonClick = () => {
        setEditButtonClicked(true);
        setSaveButtonClicked(false)
        setInputFieldActive(true)
    };

    const handleSaveButtonClick = (e) => {
        e.preventDefault();
        setSaveButtonClicked(true);
        setEditButtonClicked(false);
        setInputFieldActive(false)
    };
      // Function that handle confirm button click on personal details changes dialog
    const handleConfirmButtonClick = ()=> {
        
        // Create a new details object from the form data
        const newDetails = {
            firstName: userDetails.firstName,
            lastName: userDetails.lastName
        };

        const userId = currentUser.uid;

        if (!userId) {
            toast.error("No current user logged in")
            console.log("No current user logged in");
            return;
        }

        const detailsRef = ref(database, 'User/'+ userId);

        // Use the update method to update the details
        update(detailsRef, newDetails)
            .then(() => {
                console.log("Details updated successfully");
                setShowModal(false);
                setSaveButtonClicked(true);
                setEditButtonClicked(false);
                setInputFieldActive(false)
                // Display confirm toast message
                toast.success("Details Updated Successfully!");
            })
            .catch((error) => {
                toast.error(error);
                console.error("Error updating details:", error);
            });
    }
      
    const handleDeleteAccountButtonClick = async () => {
        try {
            const userId = currentUser.uid;
            if (!userId) {
                console.log(currentUser);
                return;
            }
            setLoading(true);
            // Delete the currently authenticated user's account
            await deleteUser(currentUser);
            // Remove user data from the Realtime Database
            await remove(ref(database, `/User/` + userId));
            console.log('User account deleted successfully.');
            toast.success('Account deleted permanently');
            setShowDeleteModal(false); // Close the delete modal
            router.push('/'); // Redirect to the home page
        } catch (error) {
            console.error('Error deleting user account:', error.message);
            toast.error('Error deleting user account:', error.message);
        } finally {
            setLoading(false);
        }
    };

    //#endregion 

    // retrieves user data
    useEffect(() => {
        const fetchData = async () => {
            const userId = currentUser.uid;
            if (!userId) {
                console.log(currentUser);
                return;
            }
        
        const userRef = ref(database, 'User/' + userId);
        
        
        try {
            const snapshot = ((await get(userRef)));
            if (snapshot.exists()) {
                const userDetails = snapshot.val();
                // Extract required fields (first name, last name, email)
                const { firstName, lastName } = userDetails;
                setUserDetails({ firstName, lastName });
            } else {
                console.log("No data available");
            }
        } catch (error) {
            toast.error("No Data available",error)
            console.error("Error fetching data:", error);
        }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
        .MuiTab-root {
            color: white !important;
            borderRight: 4px  solid #6c0979;
            margin-bottom: 20px;
            font-size: 16px
        }
        .MuiTabs-vertical .MuiTab-root:hover {
            color: #6497ff !important;
            borderRight: 4px  solid #6c0979;
          }
          .MuiTabs-vertical .MuiTab-root {
            display: inline;
            align-items: start;
          }
          .MuiTabs-vertical .MuiTab-labelIcon {
            min-height: auto;
          }
          .MuiTabs-vertical .MuiTab-label {
            display: inline;
            align-items: start;
          }
          .MuiTabs-vertical .MuiTab-labelIcon .MuiSvgIcon-root {
            margin-right: 12px; /* Adjust the spacing between icon and text */
          }
        `;
        document.head.appendChild(style);
    
        return () => {
          document.head.removeChild(style);
        };
    }, [theme]);
    
    
    const handleTabChange = (index) => {
        switch (index) {
            case 0:
            //router.push('/profile');
                setValue(0);
                console.log(index);
                break;
            case 1:
                //router.push('/profile/card');
                setValue(1);
                console.log(index);
                break;
            case 2:
                //router.push('/profile/order');
                console.log(index);
                setValue(2);
                break;
            case 3:
                setValue(3);
                //router.push('/profile/reviews');
                console.log(index);
                break;
            case 4:
                setValue(3);
                setShowLogoutModal(true); 
                console.log(index);
                break;
            default:
                break;
    }
    };
    
    // Function to handle user logout
    const signOut = async () => {
        try {
            await signout();
            setError(false);
            setShowLogoutModal(false);
            router.push('/login'); // Navigate to login page after logout
        } catch (e) {
            setError(true);
            console.error(e);
        }
    };

    //#region CARD
    const handleChangeCardDetails = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        });
    };
    // Function check card type
    const getCardType = (cardNumber) => {
        const firstDigit = cardNumber.charAt(0);
        
        if (firstDigit === '4') {
            return 'visa';
        } else if (firstDigit === '5') {
            return 'mastercard';
        } else if (firstDigit === '3') {
            return 'amex';
        } else {
            return 'unknown';
        }
    };
    

    // Function that handles the submit on add new card modal
    const handleSubmitAddNewCard = (e) => {
        e.preventDefault();

        // Create a new card object from the form data
        const newCard = {
            cardNumber: formData.cardNumber,
            sortCode: formData.sortCode,
            expDate: formData.expDate,
            securityCode: formData.securityCode,
            cardName: formData.cardName
        };
        const userId = currentUser.uid;
            if (!userId) {
                console.log("No current user logged in");
                return;
            }

        // Generate a unique key for the new card
        const newCardKey = push(ref(database, 'User/' + userId + '/card')).key;

        // Set the new card object at the specified path in the database
        set(ref(database, 'User/' + userId + '/card/' + newCardKey), newCard)
            .then(() => {
                toast.success('New card added successfully');
                console.log('New card added successfully');
                setCardDetails(prevCardDetails => [...prevCardDetails, { id: newCardKey, ...newCard }]);
                setFormData({
                    cardNumber: '',
                    sortCode: '',
                    expDate: '',
                    securityCode: '',
                    cardName:''
                });
                setShowAddCardModal(false);
            })
            .catch((error) => {
                toast.error('Error adding new card:', error);
                console.error('Error adding new card:', error);
            });
    };
    
    // Function to open edit card modal and set card
    const openEditCardModal = (card) => {
        setCard(card);
        setShowEditCard(true);
  };
    // Function to open delete card modal and set card
    const openDeleteCardModal = (card) => {
        setCard(card);
        setShowDeleteCard(true);
    };

    // HANDLE MAX LENGTH IN CARD NUMBER, SORT CODE AND CVV
    //partial ref: https://www.youtube.com/watch?v=DDUdZNCuwtU
    const checkLengthCardNumber = (maxLength) => {
        return function (e) {
            if (e.target.value.length > maxLength)
                e.target.value = e.target.value.slice(0, maxLength);
        }
    }

    // CHECKS IF EXPIRY DATE IS VALID ADD CARD MODAL
    const checkAddModalDate = (e) => {
        const currentDate = new Date;
        const expireDate = new Date(e.target.value);
        if (currentDate > expireDate) {
          setCheckDateError('Invalid Date')
        } else {
          setCheckDateError('')
        }
    }
    // CHECKS IF EXPIRY DATE IS VALID EDIT CARD MODAL
    const checkEditModalDate = (e) => {
        const currentDate = new Date;
        const expireDate = new Date(e.target.value);
        if (currentDate > expireDate) {
          setCheckDateError('Invalid Date')
        } else {
          setCheckDateError('')
        }
    }

    // Function that handle confirm button click on edit card dialog
    const handleConfirmEditCardClick = (card) => {
        const userId = currentUser.uid;
            if (!userId) {
                console.log("No current user logged in");
                return;
            }
        const cardRef = ref(database, 'User/' + userId + '/card/'+ card.id);
        // Use the update method to update the card
        update(cardRef, card)
            .then(() => {
                toast.success("Card updated successfully");
                console.log("Card updated successfully");
                // Update local state with the new values
                setCardDetails(prevCardDetails => {
                    // Find the index of the updated card in the array
                    const updatedIndex = prevCardDetails.findIndex(crd => crd.id === card.id);
                    // Create a new array with the updated address
                    const updatedCardDetails = [...prevCardDetails];
                    updatedCardDetails[updatedIndex] = {
                        ...updatedCardDetails[updatedIndex],
                        ...card // Merge the updated fields into the card
                    };
                    return updatedCardDetails;
                    });
                setShowEditCard(false);
            })
            .catch((error) => {
                toast.error("Error updating card:", error);
                console.error("Error updating card:", error);
            });
    }

    // Function that handle confirm button click on delete card dialog
    const handleConfirmDeleteCardClick = (card) => {
        const userId = currentUser.uid;
            if (!userId) {
                console.log("No current user logged in");
                return;
            }
        const cardRef = ref(database, 'User/' + userId + '/card/'+ card.id);
        // Use the update method to update the address
        remove(cardRef, card)
            .then(() => {
                toast.success("Card deleted successfully");
                console.log("Card deleted successfully");
                // Update local state with the new values
                setCardDetails(prevCardDetails => prevCardDetails.filter(crd => crd.id !== card.id));
                setShowDeleteCard(false);
            })
            .catch((error) => {
                toast.error("Error deleting card:", error);
                console.error("Error deleting card:", error);
            });
    }

    useEffect(() => {
        if (value === 1) {
            const userId = currentUser.uid;
            if (!userId) {
                console.log("No current user logged in");
                return;
            }
    
            const cardRef = ref(database, `User/${userId}/card`);
    
            get(cardRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const cardData = snapshot.val();
                        const cardArray = Object.entries(cardData).map(([id, data]) => ({
                            id,
                            ...data,
                        }));
                        setCardDetails(cardArray);
                    } else {
                        console.log("No card data found for the current user");
                        setCardDetails([]); // Set an empty array if no card data is found
                    }
                })
                .catch((error) => {
                    console.error("Error fetching card data:", error);
                });
        } else if (value === 2){
            if (currentUser && currentUser.uid) { // Ensure currentUser and currentUser.id are valid
                const userId = currentUser.uid;
                const ordersRef = ref(database, 'Order');
                const userOrdersQuery = query(ordersRef, orderByChild('userID'), equalTo(userId));
        
                get(userOrdersQuery).then((snapshot) => {
                    if (snapshot.exists()) {
                        const orders = Object.entries(snapshot.val()).map(([id, data]) => ({
                            id,
                            ...data,
                        }));
        
                        console.log("Orders:", orders); // Log orders to see if data is retrieved correctly
                        setOrderDetails(orders);
                    } else {
                        console.log("No orders found");
                        setOrderDetails([]);
                    }
                }).catch((error) => {
                    console.error("Error fetching orders:", error);
                    setOrderDetails([]);
                });
            }
        } else if (value === 3){
            if (currentUser && currentUser.uid) {
                const userId = currentUser.uid;
                const reviewRef = ref(database, 'Reviews');
                const userReviewsQuery = query(reviewRef, orderByChild('userID'), equalTo(userId));
    
                get(userReviewsQuery)
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            const reviews = Object.entries(snapshot.val()).map(([id, data]) => ({
                                id,
                                ...data,
                            }));
    
                            console.log("Reviews:", reviews);
                            setReviewDetails(reviews);
                        } else {
                            console.log("No reviews found");
                            setReviewDetails([]);
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching reviews:", error);
                        setReviewDetails([]);
                    });
            }
        }
        
    }, [value, currentUser]);
    //#endregion

    //#region ORDER
    const handleOrderDetailsChange = (e) => {
        setReviewData({
            ...reviewData,
            [e.target.name] : e.target.value
        });
        checkAllFieldsChange();
        
    };

    {/*useEffect(() => {
        if (currentUser && currentUser.uid) { // Ensure currentUser and currentUser.id are valid
            const userId = currentUser.uid;
            const ordersRef = ref(database, 'Order');
            const userOrdersQuery = query(ordersRef, orderByChild('userID'), equalTo(userId));
    
            get(userOrdersQuery).then((snapshot) => {
                if (snapshot.exists()) {
                    const orders = Object.entries(snapshot.val()).map(([id, data]) => ({
                        id,
                        ...data,
                    }));
    
                    console.log("Orders:", orders); 
                    setOrderDetails(orders);
                } else {
                    console.log("No orders found");
                    setOrderDetails([]);
                }
            }).catch((error) => {
                console.error("Error fetching orders:", error);
                setOrderDetails([]);
            });
        }
    }, [currentUser, products]); // Include products in the dependency array*/}
    
    
    const getItemsForOrder = (orderId) => {
        const order = OrderDetails.find(order => order.id === orderId);
        if (order && typeof order.items === 'object') {
            return Object.keys(order.items).map(itemId => {
                const product = products.find(product => product.id === itemId);
                return {
                    product,
                    quantity: order.items[itemId] 
                };
            });
        }
        return [];
    };

    // Post review function
    const handleReviewProductButtonClick = async () => {
        setCurrentDate(new Date());
        const userId = currentUser.uid;
        console.log("user: ", currentUser);
        if (!userId) {
            console.log("No current user logged in");
            return;
        }
        // Create a new review object from the form data
        const newReview = {
            rating: rating,
            title: reviewData.title,
            comment: reviewData.comment,
            userID: currentUser.uid,
            productID: review.id,
            date: currentDate.toLocaleDateString('en-GB'),
            userName: document.getElementById('anonymousCheckbox').checked ? 'Anonymous' : currentUser.email.substring(0, 8),
        };

        // Generate a unique key for the new review
        const newReviewKey = push(ref(database, 'Reviews/')).key;

        try {
            // Set the new review object at the specified path in the database
            await set(ref(database, 'Reviews/' + newReviewKey), newReview);
            toast.success('New Review posted successfully');
            console.log('New Review posted successfully');
            setReviewData({
                rating: "",
                title: "",
                comment: "",
                userName: ""
            });
            setShowReviewModal(false);
            setReviewDetails(prevReviewDetails => [...prevReviewDetails, newReview]);
        } catch (error) {
            toast.error('Error posting new review:', error);
            console.error('Error posting new review:', error);
        }
    };

    // Function to open review product modal
    const openReviewProductModal = (product) => {
        setReview(product);
        setShowReviewModal(true);
    };

    // Function to close review product modal
    const closewModal = () => {
        setShowReviewModal(false);
        setReviewData({
            rating: setRating(0),
            title: "",
            comment: "",
            userName: ""
        });
    };
   

    //Function that checks if all fields are filled before posting the review
    const checkAllFieldsChange = () => {
        if (reviewData.comment !== '' && reviewData.title !== '' && rating !== 0) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    };
    //#endregion
    
    //#region REVIEWS
    useEffect(() => {
        if (currentUser && currentUser.uid) {
            const userId = currentUser.uid;
            const reviewRef = ref(database, 'Reviews');
            const userReviewsQuery = query(reviewRef, orderByChild('userID'), equalTo(userId));

            get(userReviewsQuery)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const reviews = Object.entries(snapshot.val()).map(([id, data]) => ({
                            id,
                            ...data,
                        }));

                        console.log("Reviews:", reviews);
                        setReviewDetails(reviews);
                    } else {
                        console.log("No reviews found");
                        setReviewDetails([]);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching reviews:", error);
                    setReviewDetails([]);
                });
        }
    }, [currentUser, products]);

    const getProductDetails = (productId) => {
        return products.find(product => product.id === productId) || {};
    };

    

    // Function to open delete review modal
    const openDeleteReviewModal = (review) => {
        setReviews(review);
        setShowDeleteReview(true);
    };
    // Function that handle confirm button click on delete card dialog
    const handleConfirmDeleteReviewClick = (review) => {
        const userId = currentUser.uid;
        if (!userId) {
            console.log("No current user logged in");
            return;
        }
        const reviewRef = ref(database, 'Reviews/' + review.id);
        remove(reviewRef, review)
            .then(() => {
                toast.success("Review deleted successfully");
                console.log("Review deleted successfully");
                // Update local state with the new values
                setReviewDetails(prevReviewDetails => prevReviewDetails.filter(rw => rw.id !== review.id));
                setShowDeleteReview(false);
            })
            .catch((error) => {
                toast.error("Error deleting card:", error);
                console.error("Error deleting card:", error);
            });
    }
    //#endregion
    // function that handle the game key copy and changes of the button state
    const [copiedStates, setCopiedStates] = useState(OrderDetails.map(() => false));
        const copyToClipboard = async (index, key) => {
            try {
                await navigator.clipboard.writeText(key);
                const updatedCopiedStates = [...copiedStates];
                updatedCopiedStates[index] = true;
                setCopiedStates(updatedCopiedStates);
                setTimeout(() => {
                    updatedCopiedStates[index] = false;
                    setCopiedStates(updatedCopiedStates);
                }, 1000);
            } catch (error) {
                console.error('Failed to copy text to clipboard:', error);
            }
        };
   
    
    return (
        <Fragment>
            <div className='bg-blue-gradient grid grid-rows-1 grid-cols-4 gap-x-20 row-start-1 row-end-2 col-start-1 col-end-3 bg-dark-night justify-items-center'> 
                <div className="justify-self-end h-auto w-auto my-6 row-span-1 col-start-1 col-end-2"style={{ backgroundColor: 'transparent'}} >
                    <Box sx={{  display: 'flex', lineHeight: 300, height: 500, width: 200, marginTop: 10 ,marginRight:5, justifyContent: 'center', flexGrow:1}}>
                    <Tabs
                        orientation="vertical"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs menu"
                        sx={{
                            borderRight: '2px solid purple',
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#c50edd', // Set the color of the indicator to the desired color
                            },
                        }}
                        >
                        <Tab className='tab' icon={<AccountCircle />} label={<span className="tab-label">ACCOUNT</span>} {...a11yProps(0)} onClick={() => handleTabChange(0)} />
                        <Tab className='tab' icon={<Payment />} label={<span className="tab-label">STORED CARDS</span>} {...a11yProps(1)} onClick={() => handleTabChange(1)} />
                        <Tab className='tab' icon={<VpnKey />} label={<span className="tab-label">ORDERED KEYS</span>} {...a11yProps(2)} onClick={() => handleTabChange(2)} />
                        <Tab className='tab' icon={<RateReview />} label={<span className="tab-label">MY REVIEWS</span>} {...a11yProps(3)} onClick={() => handleTabChange(3)} />
                        <Tab className='tab' icon={<ExitToApp />} label={<span className="tab-label">LOGOUT</span>} {...a11yProps(4)} onClick={() => handleTabChange(4)} />
                    </Tabs>
                    </Box>
                </div>
                {/* ACCOUNT */}
                {value ===  0 ? (
                    <>
                    <div  className="self-center h-auto w-full my-6 mr-12 row-start-1 row-end-1 col-start-2 col-end-5" >
                        {userDetails && (
                        <div className='grid grid-rows-1 mr-12'>
                        <h5 className="justify-self-center  text-4xl font-bold tracking-tight mt-24 text-white font-mono" > ACCOUNT INFORMATION</h5>

                            <div style={{ backgroundColor: 'transparent' }} className="flex justify-center mt-24 h-auto w-full bg-transparent border-white border-b-2 border-teal-500">
                                <form>
                                    <div className='grid grid-cols-2  mb-3 flex-wrap'style={{ gridTemplateColumns: '1fr 1fr',justifyItems: 'center'}}>    
                                        <h2 id="first_name" className="flex dark:text-white  text-white text-2xl font-mono ">FIRST NAME:</h2>
                                        <input onClick={handleEditButtonClick} disabled={!editButtonClicked || saveButtonClicked} className="block w-64 rounded-md mr-3 border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        type="first_name" id="first name" name="firstName" value={userDetails.firstName} onChange={handleChange}/>
                                    </div>
                                    <div className='grid grid-cols-2 mt-3 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr',justifyItems: 'center' }}>    
                                        <h2 id="last_name" className="flex dark:text-white text-white text-2xl font-mono ">LAST NAME:</h2>
                                        <input onClick={handleEditButtonClick} disabled={!editButtonClicked || saveButtonClicked} className="block w-64 rounded-md mr-3 border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        type="last_name" id="first name" name="lastName" value={userDetails.lastName} onChange={handleChange}/>
                                    </div>
                                    <div className='grid grid-cols-2 mt-3 mb-2 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr',justifyItems: 'center' }}>    
                                        <h2 id="email_address" className="flex dark:text-white text-white text-2xl font-mono ">EMAIL ADDRESS:</h2>
                                        <input disabled className="block w-64 rounded-md mr-3 border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        type="email" defaultValue={(currentUser ? currentUser.email : "")} id="first name" name="email"/>
                                    </div>
                                    
                                    <div className='grid grid-cols-2 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr',justifyItems: 'center' }}>    
                                    <h2 id="empty_content" className="flex dark:text-white text-white font-mono "></h2>

                                        <button
                                            className={`w-40 visible justify-self-end mt-6 mb-20 mr-3 self-end text-white bold focus:outline-none focus:ring-4 focus:ring-green-300 rounded-lg px-5 py-2.5 ${editButtonClicked && !saveButtonClicked ? 'bg-green-400 hover:bg-green-500' : 'bg-gray-400'}`}
                                                onClick={(e) => {
                                                e.preventDefault(); // Prevent default form submission behavior
                                                openEditDetailsModal(userDetails);
                                            }}
                                            disabled={!editButtonClicked || saveButtonClicked}>
                                            SAVE
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        )}
                        <div className='flex justify-evenly mt-10'>
                            <button className="w-52 pay-btn text-white rounded-lg text-m w-full sm:w-auto px-5 py-2.5 text-center roboto-light" onClick={()=> setShowPasswordModal(true)} disabled={showPasswordModal}>
                                CHANGE PASSWORD
                            </button>
                            <button className="w-52 text-white bold focus:outline-none focus:ring-4 focus:ring-green-300 rounded-lg px-5 py-2.5 bg-green-400 hover:bg-green-500" onClick={handleEditButtonClick} disabled={editButtonClicked}>
                                EDIT INFORMATION
                            </button>
                        </div>
                    </div>

                    <div className='flex place-content-start h-auto row-start-2 row-end-2 col-span-1 mb-6'>
                        <div>
                            <button type="submit" className="w-auto text-white bold rounded-lg px-5 py-2.5 addCard-btn" onClick={()=> setShowDeleteModal(true)}  disabled={showDeletedModal}>
                                DELETE ACCOUNT
                            </button>
                        </div>
                    </div>
                </>
                ) : (
                    <></>
                )}

                {/* STORED CARDS */}
                { value ===  1 ? (
                    <>
                    <div style={{ backgroundColor: 'transparent'}} className="overflow-y-auto content-center h-auto w-full my-6 mr-12 mt-24 bg-blue-900 border-blue-900 row-start-1 row-end-2 col-start-2 col-end-5 " >

                    <h5 style={{ position: 'sticky', top: 0, zIndex: 1 }} className="justify-self-center text-center mb-3 text-4xl font-bold tracking-tight text-white font-mono" > MY STORED CARDS</h5>
                        {cardDetails.length === 0 ? (
                            <div className="text-2xl text-white mt-3 mb-44 font-mono text-center">NO CARD STORED WITHIN YOUR ACCOUNT.<br/> PLEASE ADD ONE!</div>
                        ) : (
                                <div className='rounded-noneborder-b-2 border-white grid grid-cols-6 flex-wrap  mt-3 mb-3 ml-10 mr-10 p-3' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', justifyItems: 'center',position: 'sticky', top: 0, zIndex: 1  }}>
                                    <h3 className='  font-bold tracking-tight dark:text-white  text-white'>Card Type</h3>
                                    <h3 className='  font-bold tracking-tight  dark:text-white text-white'>Name on Card</h3>
                                    <h3 className='  font-bold tracking-tight  dark:text-white text-white'>Card Ending</h3>
                                    <h3 className='  font-bold tracking-tight  dark:text-white text-white'></h3>
                                    <h3 className='  font-bold tracking-tight  dark:text-white text-white'></h3>
                                </div>
                        )}

                    <div style={{ backgroundColor: 'transparent', maxHeight: '45vh', paddingRight: '17px', boxSizing: 'content-box'}} className="overflow-y-auto content-center h-auto w-full my-6 mr-12 mt-3 mb-3 bg-blue-900 border-blue-900 row-start-1 row-end-2 col-start-2 col-end-5 " >
                        
                        {/*This is the card that can be used as a component nested in cardStored component */}
                        <div className='grid grid-rows-3 flex-wrap m-s ml-10 mr-10'>
                            {cardDetails.map((c) => (
                                <Card key={c.id} className=" flex h-auto w-full summary-box mt-6">
                                    <div className='grid grid-cols-6 items-center flex-wrap'style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',justifyItems: 'center' }}>    

                                        <img
                                            src={
                                                getCardType(c.cardNumber) === 'visa'
                                                    ? 'https://img.icons8.com/fluency/48/visa.png'
                                                    : getCardType(c.cardNumber) === 'mastercard'
                                                        ? 'https://img.icons8.com/fluency/48/mastercard.png'
                                                        : getCardType(c.cardNumber) === 'amex'
                                                            ? 'https://example.com/amex-icon.svg'
                                                            : 'https://img.icons8.com/fluency/48/credit-card-front.png'
                                            }
                                            alt="Card Image"
                                        />
                                        <h2 id="card_name" className="flex dark:text-white text-white font-mono ">{c.cardName}</h2>
                                        <h2 id="card_ending" className="flex dark:text-white text-white font-mono ">{c.cardNumber.slice(-4)}</h2>
                                        <Tooltip content='Edit your card'>
                                            <img class="first-line:h-6 w-6 flex-wrap justify-self-end cursor-pointer hover:scale-110 hover:text-slate-200" style={{ filter: 'brightness(0) invert(1)' }} src="https://www.iconbolt.com/iconsets/darkwing-free/edit.svg" alt="edit card" onClick={()=> openEditCardModal(c)} disabled={showEditCard}/>
                                        </Tooltip>
                                        <Tooltip content='Delete your card'>
                                            <img class="first-line:h-5 w-5 flex-wrap justify-self-center cursor-pointer hover:scale-110 hover:text-slate-200" style={{ filter: 'brightness(0) invert(1)' }} src="https://www.iconbolt.com/iconsets/flowbite-solid/trash-bin.svg" alt= "delete card" onClick={()=> openDeleteCardModal(c)} disabled={showDeleteCard}/>
                                        </Tooltip>

                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                    <div className='flex mb-10 mt-3 col-span-3 justify-self-center ml-10'>
                    <button
                        type="submit"
                        className="w-60 inline-flex text-white self-center bold rounded-lg px-5 py-2.5 addCard-btn"
                        onClick={()=> setShowAddCardModal(true)}
                        disabled={showAddCardModal}> 
                        ADD NEW CARD
                        <svg className="w-6 h-6 ml-3" fill='currentColor' stroke='white' aria-hidden="true" xmlns="https://reactsvgicons.com/search?q=add" viewBox="0 0 512 512">
                            <path fill="none" stroke="currentColor" strokeMiterlimit={10} strokeWidth={32} d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"/>
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={32} d="M256 176v160M336 256H176"/>
                        </svg>
                    </button>
                </div>
                </div>
                </>
                ): (
                    <></>
                )}

                {/* ORDERED KEYS */}
                { value ===  2 ? (
                    <div style={{ backgroundColor: 'transparent', maxHeight: '80vh', paddingRight: '17px', boxSizing: 'content-box' }} className="overflow-y-auto justify-items-center h-auto w-full my-6 mr-12 mt-24 row-start-1 row-end-1 col-start-2 col-end-5 " >
                        <h5 className="justify-self-center text-center text-4xl mb-6 font-bold tracking-tight text-white font-mono" > MY ORDER KEYS</h5>
                        {OrderDetails.length === 0 ? (
                            <div className="text-2xl text-white mt-32 mb-44 font-mono text-center">NO ORDERS STORED WITHIN YOUR ACCOUNT.<br/> PLEASE PURCHASE PRODUCTS!!</div>
                        ) : (
                            OrderDetails.sort((a, b) => {
                                const dateA = new Date(a.date.split('/').reverse().join('/'));
                                const dateB = new Date(b.date.split('/').reverse().join('/'));
                                return dateB - dateA;
                            }).map((o, index) => (
                            
                                <Card key={o.id}  className="flex h-auto w-full summary-box mt-6">
                                    <div className=' grid grid-cols-3 flex-wrap ml-3 mr-3 p-3' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr ', justifyItems: 'start' }}>
                                        <h3 className='font-bold tracking-tight'>Order Number:</h3>
                                        <h3 className='font-bold tracking-tight'>Date Placed:</h3>
                                        <h3 className='font-bold tracking-tight'>Total Amount:</h3>
                                        <h3 className='font-bold tracking-tight'>Status:</h3>
                                    </div>
                                    <div className='rounded-1 border-b-2 border-white grid grid-cols-3 flex-wrap mb-6 ml-3 mr-3 p-3' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', justifyItems: 'start' }}>
                                        <a className='tracking-tight dark:text-white text-white'>{o.id.substring(1, 8)}</a>
                                        <a className='tracking-tight dark:text-white text-white'> {o.date}</a>
                                        <a className='tracking-tight dark:text-white text-white'>{"£ "+ parseFloat(o.price).toFixed(2)}</a>
                                        <a className='tracking-tight dark:text-white text-white'>{o.status}</a>
                                    </div>
                                    <div className=' grid grid-cols-5 flex-wrap ml-3 mr-3 p-3' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', justifyItems: 'start' }}>
                                        <a className='tracking-tight dark:text-white text-white'>Product</a>
                                        <a className='tracking-tight dark:text-white text-white'></a>
                                        <a className='tracking-tight dark:text-white text-white'>Price</a>
                                        <a className='tracking-tight dark:text-white text-white'>Review</a>
                                        <a className='tracking-tight dark:text-white text-white'>Key</a>
                                        <a className='tracking-tight dark:text-white text-white'></a>
                                    </div>
                                    
                                    {/* Display item details */}
                                    {getItemsForOrder(o.id).map((item, itemIdex) => (
                                            <div key={itemIdex} className='grid grid-cols-7 items-center flex-wrap border-b border-gray-300 ml-3 mr-3 p-3' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', justifyItems: 'start' }}>    
                                                {item && item.product && (
                                                    <Fragment key={item.product.id}>
                                                        {console.log('item.product:', item.product)}
                                                        <div className='inline-flex col-span-2'>
                                                        <img className="w-16 h-16 object-cover rounded-lg" src={item.product.images[0]} alt="Product Image"/>
                                                        <div>
                                                        <div className=" mt-3 text-start flex dark:text-white text-white font-mono ml-6">{item.product.name.substring(0, 19)}</div>
                                                        </div>
                                                        </div>
                                                        <div className="flex text-center dark:text-white text-white font-mono">{'£ ' + item.product.price}</div>
                                                        {console.log('Review Details:', reviewDetails)}
                                                        {reviewDetails.find(review => review.userID === currentUser.uid && review.productID === item.product.id) ? (
                                                        <Tooltip content='You have already reviewed this product'>
                                                            <RateReview className="cursor-pointer" style={{ height: '20px', width: '20px', justifySelf: 'center',color: '#9E9E9E' }} disabled />
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip content='Review this product'>
                                                            <RateReview className = "cursor-pointer hover:scale-110 hover:text-slate-200" style={{ height: '20px', width: '20px', justifySelf: 'center', filter: 'brightness(0) invert(1)' }} 
                                                            onClick={()=> openReviewProductModal(item.product)}
                                                            disabled={showReviewModal}></RateReview>
                                                        </Tooltip>
                                                    )}  
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <input
                                                                type="text"
                                                                value={o.gameKey}
                                                                readOnly
                                                                style={{ flex: '1', backgroundColor: 'transparent', border: 'none' }}
                                                            />
                                                            <button className='px-5 py-2.5 w-auto text-white bold rounded-lg px-1' onClick={() => copyToClipboard(index,o.gameKey)}>
                                                            {copiedStates[index] ? 
                                                                <Tooltip content="Copied!">
                                                                <svg class="w-3 h-3 text-white me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                                                                </svg> 
                                                                </Tooltip>
                                                                    : 
                                                                <Tooltip content="Copy">
                                                                <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                                                    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
                                                                </svg>
                                                                </Tooltip>}
                                                            </button>
                                                        </div>

                                                    </Fragment>
                                                )}
                                            </div>
                                    ))}
                                </Card>
                            ))
                        )}
                    </div> 
                ): (
                    <></>
                )}

                {/* MY REVIEWS */}
                { value ===  3 ? (
                    <div style={{ backgroundColor: 'transparent', maxHeight: '80vh', paddingRight: '17px', boxSizing: 'content-box'}} className="overflow-y-auto justify-items-center h-auto w-full my-6 mr-12 mt-24  row-start-1 row-end-1 col-start-2 col-end-5 " >
                        <h5 className="justify-self-center text-center text-4xl mb-6 font-bold tracking-tight text-white font-mono"> MY REVIEWS</h5>
                        {reviewDetails.length === 0 ? (
                            <div className="text-2xl text-white mt-32 mb-44 font-mono text-center">NO PRODUCT REVIEW STORED WITHIN YOUR ACCOUNT.<br/> PLEASE REVIEW PRODUCTS!!</div>
                        ) : (
                            reviewDetails.sort((a, b) => {
                                const dateA = new Date(a.date.split('/').reverse().join('/'));
                                const dateB = new Date(b.date.split('/').reverse().join('/'));
                                return dateB - dateA;
                            }).map((review) => (
                                <Card key={review.id} className="flex h-auto w-full summary-box mt-6">
                                    <div className='grid grid-cols-3 border-b border-gray-300 flex-wrap ml-3 mr-3 p-3' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', justifyItems: 'start' }}>
                                        <h3 className='font-bold tracking-tight dark:text-white text-white'>Game</h3>
                                        <h3 className='font-bold tracking-tight dark:text-white text-white'>Name</h3>
                                        <h3 className='font-bold tracking-tight dark:text-white text-white'>Date Placed:</h3>
                                        <h3 className='font-bold tracking-tight dark:text-white text-white'>Posted as:</h3>
                                        <div className='inline-flex self-start'>
                                            <h3 className='font-bold tracking-tight dark:text-white text-white'>Rating:</h3>
                                            <Tooltip content='Delete review'>
                                                <img className="self-end ml-48 first-line:h-5 w-5 flex-wrap self-end cursor-pointer hover:scale-110 hover:text-slate-200" style={{ filter: 'brightness(0) invert(1)' }} src="https://www.iconbolt.com/iconsets/flowbite-solid/trash-bin.svg " alt= "delete card" onClick={()=> openDeleteReviewModal(review)} disabled={showDeleteReview}/>
                                            </Tooltip>
                                        </div>
                                    
                                        {getProductDetails(review.productID) && (
                                            <Fragment>
                                                {console.log('product details:', getProductDetails(review.productID))}
                                                <img className="mt-6 w-28 h-28 object-cover rounded-lg" src={getProductDetails(review.productID).images[1]} alt="Product Image" />
                                                <a className='mt-6 mr-16 tracking-tight dark:text-white text-white' style={{ wordWrap: 'break-word' }}>{getProductDetails(review.productID).name}</a>
                                                <a className='mt-6 tracking-tight dark:text-white text-white'>{review.date}</a>
                                                <a className='mt-6 tracking-tight dark:text-white text-white'>{review.userName}</a>
                                                <div className='inline-flex self-start'>
                                                    {[...Array(5)].map((star, index) => {
                                                        const currentRating = review.rating;
                                                        return (
                                                            <label key={index}>
                                                                <FaStar
                                                                    className='star ml-1 mt-6'
                                                                    size={20}
                                                                    color={index + 1 <= currentRating ? "#ffc107" : "#e4e5e9"}
                                                                />
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </Fragment>
                                        )}
                                    
                                    </div>
                                    <div className='self-start'>
                                        <a className='ml-3 mb-3 font-bold text-white'>{review.title}</a>
                                        <p className='ml-3 text-white'>{review.comment}</p>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                ): (
                    <></>
                )}
            </div> 

            {/*logout modal */}          
            <Modal isVisible={showLogoutModal} onClose ={()=> setShowLogoutModal(false)}>
                <h3 className='text-xl flex self-center font-semibold text-white mb-5'>LOG OUT</h3>
                <h3 className='flex self-center font-semibold text-white  mb-5'>Are you sure you want to logout?</h3>
                <div className='flex justify-evenly mt-10 mb-10'>
                    <Button type="submit" className="w-52" color="gray" onClick ={()=>setShowLogoutModal(false)}>NO</Button>
                    <Button type="submit" className="w-52"  style={{background: '#00052d', border : '#00052d'}} onClick={signOut}>YES</Button>
                </div>
            </Modal>

            {/*Personal details modal */}
            <Modal isVisible={showModal} userDetails = {userDetails} onClose ={()=> setShowModal(false)}>
                <h3 className='text-xl flex self-center font-semibold text-white mb-5'>PERSONAL DETAILS CHANGES</h3>
                <h3 className='flex self-center font-semibold text-white  mb-5'>Are you sure you want to save the changes?</h3>
                <div className='flex justify-evenly mt-10'>
                    <Button className="w-52" color="gray" onClick ={()=>setShowModal(false)}> DISMISS</Button>
                    <Button className="w-52"  style={{background: '#00052d', border : '#00052d'}} onClick={()=>handleConfirmButtonClick()}>CONFIRM</Button>
                </div>
            </Modal>

            {/*Change password modal */}
            <Modal isVisible={showPasswordModal} onClose ={()=> setShowPasswordModal(false)}>
                <h3 className='text-xl flex self-center font-semibold text-white mb-5'>CHANGE YOUR PASSWORD</h3>
                <h3 className='flex self-center font-semibold text-white mb-5'>Fill out the form below</h3>
                <div className="self-center sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="text-white font-mono" onSubmit={handleSubmit}>
                        <div >
                            <label htmlFor="password" className='text-white'>Old Password</label>
                            <div className="relative">
                                    <input className="block w-full mt-2 rounded-md border-1  py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    id="oldPassword" name="oldPassword" required onChange={handleOldPasswordChange} ref={oldPassword} type={showOldPassword ? "text" : "password"}/>
                                            <button
                                                type="button"
                                                aria-label={
                                                showOldPassword ? "Password Visible" : "Password Invisible."
                                                }
                                                className="text-black dark:text-white"
                                                onClick={() => {
                                                setShowOldPassword((prev) => !prev);
                                                }}
                                            >
                                                {showOldPassword ? (
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
                                            {oldPasswordError && <span style={{ color: 'red', fontSize: '12px' }}>{oldPasswordError}</span>}
                            </div> 
                        </div>

                        <div>
                            <label htmlFor="password" className='text-white'>New Password</label>
                            <div className="relative">
                                    <input className="block w-full mt-2 rounded-md border-1  py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    id="newPassword" name="newPassword" required onChange={handleNewPasswordChange} ref={newPassword} type={showPassword ? "text" : "password"}/>
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
                                            {newPasswordError && <span style={{ color: 'red', fontSize: '12px' }}>{newPasswordError}</span>}
                            </div> 
                        </div>

                        <div>
                            <label htmlFor="password" className='text-white'>Confirm New Password</label>
                            <div className="relative">
                                    <input className="block w-full mt-2 rounded-md border-1  py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    id="confirmNewPassword" name="confirmNewPassword" required onChange={handleNewConfirmPasswordChange} ref={newConfPassword} type={showConfirmPassword ? "text" : "password"}/>
                                            <button
                                                type="button"
                                                aria-label={
                                                showConfirmPassword ? "Password Visible" : "Password Invisible."
                                                }
                                                className="text-black dark:text-white"
                                                onClick={() => {
                                                setShowConfirmPassword((prev) => !prev);
                                                }}
                                            >
                                                {showConfirmPassword ? (
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
                                            {newConfPasswordError && <span style={{ color: 'red', fontSize: '14px' }}>{newConfPasswordError}</span>}
                            </div> 
                        </div>
                        <div className='flex justify-evenly my-10'>
                            <Button type="submit" className="w-52 mr-2 cardButton text-white" color='gray' onClick ={()=>setShowPasswordModal(false)}> DISMISS</Button>
                            <Button type="submit" className="w-52 ml-2" style={{background: '#00052d', border : '#00052d'}}>CONFIRM</Button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/*Delete account modal */}          
            <Modal isVisible={showDeletedModal} onClose ={()=> setShowDeleteModal(false)}>
                <h3 className='text-xl flex self-center font-semibold text-white mb-5'>DELETE ACCOUNT</h3>
                <h3 className='flex self-center font-semibold text-white  mb-5'>Are you sure you want to delete yur acount?</h3>
                <div className='flex justify-evenly mt-10 mb-10'>
                    <Button type="submit" className="w-52" color="gray" onClick ={()=>setShowDeleteModal(false)}> DISMISS</Button>
                    <Button type="submit" className="w-52"  style={{background: '#00052d', border : '#00052d'}} onClick={()=>handleDeleteAccountButtonClick()}>CONFIRM</Button>
                </div>
            </Modal>

            {/* ADD CARD MODAL */}
            <Modal  isVisible={showAddCardModal} onClose ={()=> setShowAddCardModal(false)}>
                <h3 className='text-xl flex self-center font-semibold text-white mb-5'>ADD NEW CARD</h3>
                <h3 className='flex self-center font-semibold text-white mb-5'>Add card by filling the details below</h3>
                <div className="self-center sm:mx-auto sm:w-full sm:max-w-sm">

                    <form className="space-y-6 text-white font-mono" onSubmit={handleSubmitAddNewCard}>
                        
                        <div>
                            <label htmlFor="text" className='text-white'>Cardholder Name</label>
                            <input className="block w-full my-2.5 rounded-md p-1.5 text-gray-900 "
                            type="text" id="cardName" name="cardName" placeholder='John Wick' required value={formData.cardName} onChange={handleChangeCardDetails}/>
                        </div>

                        <div class="noIncrementer"> {/*noIncrementer is a CSS class*/}
                            <label htmlFor="number" className='text-white'>Card Number</label>
                            <InputMask className="block w-full rounded-md p-1.5 text-gray-900 "
                            id="cardNumber" name="cardNumber" mask="9999 9999 9999 9999" maskChar="" placeholder='4625 2563 2356 8514' required value={formData.cardNumber} 
                            onInput={checkLengthCardNumber(19)} onChange={handleChangeCardDetails}/>
                        </div>

                        <div className="noIncrementer">
                            <label htmlFor="number" className='text-white'>Sort Code</label>
                            <InputMask className="block w-full rounded-md p-1.5 text-gray-900 "
                            id="sortCode" name="sortCode" mask="99 99 99" maskChar="" placeholder='26 02 54' required value={formData.sortCode} 
                            onInput={checkLengthCardNumber(8)} onChange={handleChangeCardDetails}/>
                        </div>

                        <div className='inline-flex justify-evenly'>
                            <div className='mr-5'>
                                <label htmlFor="number" className='text-white'>Exp.Date</label>
                                <input className="block w-52 my-2.5 rounded-md p-1.5 text-gray-900 "
                                type="month" id="expDate" name="expDate" placeholder='12/24' required value={formData.expDate}
                                onInput={checkAddModalDate} onChange={handleChangeCardDetails}/>
                                {checkDateError && <span style={{ color: 'red', fontSize: '12px' }}>{checkDateError}</span>}
                            </div>
                            
                            <div className='ml-5 noIncrementer'>
                                <label htmlFor="number" className='inline-flex text-white'>CVV
                                <Tooltip content="Three digit code on the back of your card">
                                    <svg  className = 'ml-2' width="24px" height="24px" stroke-width="1.5" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF">
                                    <path d="M12 11.5V16.5" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M12 7.51L12.01 7.49889" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </Tooltip>
                                </label>
                                <input className="block w-full my-2.5 rounded-md p-1.5 text-gray-900 "
                                type="number" inputmode="numeric" id="securityCode" name="securityCode" placeholder='342' required value={formData.securityCode} 
                                onInput={checkLengthCardNumber(3)} onChange={handleChangeCardDetails}/>
                            </div>
                        </div>

                        <div className='flex justify-evenly mt-10'>
                            <Button className="w-2/4 mr-3 mb-4 mt-4" onClick ={()=>setShowAddCardModal(false)}> DISMISS</Button>
                            <Button type="submit" className="w-2/4 ml-3 mb-4 mt-4"  style={{background: '#00052d', border : '#00052d'}} >CONFIRM</Button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* EDIT CARD MODAL */}
            <Modal isVisible={showEditCard} card = {card} onClose ={()=> setShowEditCard(false)}>
                <h3 className='text-xl flex self-center font-semibold text-white mb-5'>EDIT YOUR CARD</h3>
                <h3 className='flex self-center font-semibold text-white mb-5'>Edit your card by filling the details below</h3>
                
                <div className="self-center sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6 text-white font-mono" method="POST onSubmit={handleSubmit}">

                        <div>
                            <label htmlFor="text" className='text-white'>Card Holder</label>
                            <input className="block w-full my-2.5 rounded-md p-1.5 text-gray-900 "
                            type="text" id="card_holder" name="card_holder" placeholder='John Wick' required value={card.cardName} onChange={(e) => setCard({ ...card, fullName: e.target.value })}/>
                        </div>

                        <div class="noIncrementer">
                            <label htmlFor="number" className='text-white'>Card Number</label>
                            <InputMask className="block w-full rounded-md p-1.5 text-gray-900 "
                            id="card_number" name="card_number" mask="9999 9999 9999 9999" maskChar="" placeholder='4625 2563 2356 8514' required value={card.cardNumber} 
                            onInput={checkLengthCardNumber(19)} onChange={(e) => setCard({ ...card, cardNumber: e.target.value })}/> 
                        </div>

                        <div class="noIncrementer">
                            <label htmlFor="number" className='text-white'>Sort Code</label>
                            <InputMask className="block w-full rounded-md p-1.5 text-gray-900 "
                            id="sort_code" name="sort_code" mask="99 99 99" maskChar="" placeholder='26 02 54' required value={card.sortCode}
                            onInput={checkLengthCardNumber(8)} onChange={(e) => setCard({ ...card, sortCode: e.target.value })}/> 
                        </div>

                        <div className='inline-flex justify-evenly'>
                            <div className='mr-3'>
                                <label htmlFor="number" className='text-white'>Exp.Date</label>
                                <input className="block w-full my-3.5 rounded-md p-1.5 text-gray-900 "
                                type="month" id="exp_date" name="exp_date" placeholder='12/24' required value={card.expDate}
                                onInput={checkEditModalDate} onChange={(e) => setCard({ ...card, expDate: e.target.value })}/>
                                {checkDateError && <span style={{ color: 'red', fontSize: '12px' }}>{checkDateError}</span>}
                            </div>

                            <div className='ml-3' class="noIncrementer">
                                <label htmlFor="number" className='inline-flex text-white'>CVV
                                <Tooltip content="Three digit code on the back of your card">
                                    <svg  className = 'ml-2' width="24px" height="24px" stroke-width="1.5" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF">
                                    <path d="M12 11.5V16.5" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M12 7.51L12.01 7.49889" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </Tooltip>
                                </label>
                                <input className="block w-full my-3.5 rounded-md p-1.5 text-gray-900 "
                                type="number" id="cvv" name="cvv" placeholder='342' required value={card.securityCode}
                                onInput={checkLengthCardNumber(3)} onChange={(e) => setCard({ ...card, securityCode: e.target.value })}/>
                            </div>
                        </div>
                    </form>
                </div>

                <div className='flex justify-evenly mt-10 mb-2'>
                    <Button type="submit"className="w-2/6 mr-1" onClick ={()=>setShowEditCard(false)}> DISMISS</Button>
                    <Button type="submit" className="w-2/6 ml-1"  style={{background: '#00052d', border : '#00052d'}} onClick={()=>handleConfirmEditCardClick(card)}>CONFIRM</Button>
                </div>
            </Modal>

            {/*Delete card modal */}
            <Modal isVisible={showDeleteCard} card = {card} onClose ={()=> setShowDeleteCard(false)}>
                <h3 className='text-xl flex self-center font-semibold text-white mb-5'>DELETE CARD</h3>
                <h3 className='flex self-center font-semibold text-white  mb-5'>Are you sure you want to delete this card?</h3>
                <div className='flex justify-evenly mt-10 mb-2'>
                    <Button type="submit"className="w-52" color="gray" onClick ={()=>showDeleteCard(false)}> DISMISS</Button>
                    <Button type="submit" className="w-52"  style={{background: '#00052d', border : '#00052d'}} onClick={()=>handleConfirmDeleteCardClick(card)}>CONFIRM</Button>
                </div>
            </Modal>

            {/*Review product modal */}          
            <Modal isVisible={showReviewModal} onClose ={()=> setShowReviewModal(false)}>
                   <h3 className='text-xl flex self-center font-semibold text-white mb-5'>WRITE A REVIEW</h3>
                   <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
                        {review && review.images && review.images[0] && (
                            <img className="self-center w-full h-28 object-cover rounded-lg" src={review.images[0]} alt="Product Image"/>
                        )}
                        <div className=" w-full mt-3 flex dark:text-white text-white font-mono justify-center items-center">{review.name}</div>
                            <div className='inline-flex self-center'>
                                {[...Array(5)].map((star, index) =>{
                                    const currentRating = index + 1;
                                    return (
                                        <label>
                                            <input type='radio' className='stars-input' required name='rating' value={currentRating} onClick={() => setRating(currentRating)}></input>
                                            <FaStar className= 'star ml-6 mt-3' size={50} 
                                            color={currentRating <= (hover || rating) ? "#ffc107" : "e4e5e9"}
                                            onMouseEnter={() => setHover(currentRating)}
                                            onMouseLeave={() => setHover(null)}
                                            />
                                        </label>
                                    );
                                })}
                            </div>
                        <div className='justify-center mt-2'>
                            <label className=' mb-2'>Title</label>
                            <textarea
                                class="self-center peer h-12 mt-2 min-h-[10px] w-96 resize-none rounded-[7px] border border-blue-gray-200  bg-white px-3 py-2.5 font-sans text-sm font-normal text-gray-900 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200"
                                placeholder=" "
                                required
                                name= "title"
                                maxLength={100}
                                value={reviewData.title} onChange={handleOrderDetailsChange}>
                            </textarea>
                        </div>
                        <div className='justify-self-center mt-2'>
                            <label className=' mb-2'>Write your comment</label> 
                            <textarea
                                class="peer h-full min-h-[150px] w-96 mt-2 resize-none rounded-[7px] border border-blue-gray-200  bg-white px-3 py-2.5 font-sans text-sm font-normal text-gray-900 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200"
                                placeholder=" "
                                name= "comment"
                                required
                                maxLength={300}
                                value={reviewData.comment} onChange={handleOrderDetailsChange}>
                            </textarea>
                        </div>
                        <div className='flex items-center mt-4'>
                            <input
                                type="checkbox"
                                id="anonymousCheckbox"
                                name="anonymousCheckbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="anonymousCheckbox" className="ml-2 block text-sm text-white">
                                Post anonymously
                            </label>
                        </div>
                        <div className='flex justify-evenly mt-5 mb-10'>
                            <Button  className="w-52 mr-2" color="gray" onClick ={()=>closewModal()}> DISMISS</Button>
                            <Button  className="w-52 ml-2"  style={{background: '#00052d', border : '#00052d'}} disabled={isButtonDisabled} onClick={()=>handleReviewProductButtonClick()}>POST</Button>
                        </div>
                    </div>
            </Modal>

            {/*Delete review modal */}
            <Modal isVisible={showDeleteReview} review={reviews} onClose={()=> setShowDeleteReview(false)}>
                <h3 className='text-xl flex self-center font-semibold text-white mb-5'>DELETE REVIEW</h3>
                <h3 className='flex self-center font-semibold text-white  mb-5'>Are you sure you want to delete this review?</h3>
                <div className='flex justify-evenly mt-10 mb-2'>
                    <Button type="submit" className="w-52" color="gray" onClick={()=> setShowDeleteReview(false)}> DISMISS</Button>
                    <Button type="submit" className="w-52"  style={{background: '#00052d', border : '#00052d'}} onClick={()=>handleConfirmDeleteReviewClick(reviews)}>CONFIRM</Button>
                </div>
            </Modal>
        </Fragment>
    );
}
