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
import { FaStar } from 'react-icons/fa';

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
    const [ fullNameError, setFullNameError] = useState(false)
    const [ cardNumberError, setCardNumberError] = useState(false)  
    const [ sortCodeError, setSortCodeError] = useState(false)  
    const [ cvvError, setCVVError] = useState(false)
    const [checkDateError, setCheckDateError] = useState('');     
    const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = useState(true); 
    const [ fullNameEditCardError, setFullNameEditCardError] = useState(false)
    const [ cardNumberEditCardError, setCardNumberEditCardError] = useState(false)  
    const [ sortCodeEditCardError, setSortCodeEditCardError] = useState(false)  
    const [ cvvEditCardError, setCVVEditCardError] = useState(false)
    const [checkDateEditCardError, setCheckDateEditCardError] = useState('');     
    const [isConfirmButtonEditCardDisabled, setIsConfirmButtonEditCardDisabled] = useState(true);
    const [ showCVV, setShowCVV] = useState(false)
    const [ showEditCardCVV, setShowEditCardCVV] = useState(false)
    const [ showAddCardCVV, setShowAddCardCVV] = useState(false)
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
    const [showTabMenu, setShowTabMenu] = useState(false);
    

    const [reviewData, setReviewData] = useState({
        rating: '',
        title: '',
        comment: '',
        userName: ''
    });
    //#endregion
    
    const toggleTabMenu = () => {
        setShowTabMenu(!showTabMenu)
        var element = document.getElementById("tabMenu");
        if(showTabMenu){
            element.classList.remove("hidden")
        }else{
            element.classList.add("hidden")
        }
        
    };

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

        
        if (!currentUser) {
            toast.error("No current user logged in")
            return;
        }

        const userId = currentUser.uid;
        const detailsRef = ref(database, 'User/'+ userId);

        // Use the update method to update the details
        update(detailsRef, newDetails)
            .then(() => {
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
            
            if (!currentUser) {
                return;
            }
            const userId = currentUser.uid;
            setLoading(true);
            // Remove user data from the Realtime Database
            await remove(ref(database, `/User/` + userId));
            // Delete the currently authenticated user's account
            await deleteUser(currentUser);
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
            
            if (!currentUser) {
                return;
            }
            const userId = currentUser.uid;
            const userRef = ref(database, 'User/' + userId);
        
        
            try {
                const snapshot = ((await get(userRef)));
                if (snapshot.exists()) {
                    const userDetails = snapshot.val();
                    // Extract required fields (first name, last name, email)
                    const { firstName, lastName } = userDetails;
                    setUserDetails({ firstName, lastName });
                } else {
                    toast.error("No Data available")
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
                setValue(0);
                break;
            case 1:
                setValue(1);
                break;
            case 2:
                setValue(2);
                break;
            case 3:
                setValue(3);
                break;
            case 4:
                setValue(3);
                setShowLogoutModal(true); 
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
        
        if (!currentUser) {
            return;
        }
        const userId = currentUser.uid;

        // Generate a unique key for the new card
        const newCardKey = push(ref(database, 'User/' + userId + '/card')).key;

        // Set the new card object at the specified path in the database
        set(ref(database, 'User/' + userId + '/card/' + newCardKey), newCard)
            .then(() => {
                toast.success('New card added successfully');
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
    const checkLengthCardNumber = (maxLength) => {
        return function (e) {
            if (e.target.value.length > maxLength)
                e.target.value = e.target.value.slice(0, maxLength);
        }
    }
    // function to enable/disable CONFIRM button add card modal
    const checkAllAddCardFieldsChange = () => {

        if (fullNameError == '' &&  formData.cardName != '' && cardNumberError == '' && formData.cardNumber != ''
        && sortCodeError == '' && formData.sortCode != '' && checkDateError == '' && formData.expDate != '' &&
        cvvError == ''&& formData.securityCode != '') {
        setIsConfirmButtonDisabled(false);
        } else {
        setIsConfirmButtonDisabled(true);
        }   
    };
    // function to enable/disable CONFIRM button edit card modal
    const checkAllEditCardFieldsChange = () => {

        if (fullNameEditCardError == '' &&  card.cardName != '' && cardNumberEditCardError == '' && card.cardNumber != ''
        && sortCodeEditCardError == '' && card.sortCode != '' && checkDateEditCardError == '' && card.expDate != '' &&
        cvvEditCardError == ''&& card.securityCode != '') {
        setIsConfirmButtonEditCardDisabled(false);
        } else {
        setIsConfirmButtonEditCardDisabled(true);
        }   
    };

    // CARD HOLDER NAME VALIDATION ADD CARD MODAL
    const handleFullName = (e) => {
        const isValid = /^([A-Z ][a-z ]*|[a-z ]+)$/i.test(e.target.value) && e.target.value.length <= 40 && e.target.value.length >0;

        if (!isValid ) {
        setFullNameError('Full name cannot contain special characters or numbers');
        } else {
        setFullNameError('');
        }
    checkAllAddCardFieldsChange();
    };
    // CARD HOLDER NAME VALIDATION EDIT CARD MODAL
    const handleFullNameEditCard = (e) => {
        const isValid = /^([A-Z ][a-z ]*|[a-z ]+)$/i.test(e.target.value) && e.target.value.length <= 40 && e.target.value.length >0;

        if (!isValid ) {
        setFullNameEditCardError('Full name cannot contain special characters or numbers');
        } else {
            setFullNameEditCardError('');
        }
        checkAllEditCardFieldsChange();
    };
    // CARD NUNMBER VALIDATION ADD CARD MODAL
    const handleCardNumber = (e) => {
        const input = e.target.value
        const isValid = /^([0-9 ]+)$/i.test(input) && input.length === 19;
        
        if (!isValid && input.length < 20 && input.length > 0 ) { 
        setCardNumberError('Card number has to be 16 digits long'); 
        } else {
        setCardNumberError('');
        }
    
        checkAllAddCardFieldsChange();
    };
    // CARD NUNMBER VALIDATION EDIT CARD MODAL
    const handleCardNumberEditCard = (e) => {
        const input = e.target.value
        const isValid = /^([0-9 ]+)$/i.test(input) && input.length === 19;
        
        if (!isValid && input.length < 20 && input.length > 0 ) { 
        setCardNumberEditCardError('Card number has to be 16 digits long'); 
        } else {
        setCardNumberEditCardError('');
        }
    
        checkAllEditCardFieldsChange();
    };

    // SORT CODE VALIDATION ADD CARD MODAL
    const handleSortCode = (e) => {
        const isValid = /^([0-9-]+)$/i.test(e.target.value) && e.target.value.length === 8;
        
        if (!isValid && e.target.value.length < 9 && e.target.value.length > 0) { 
        setSortCodeError('Sort code should be 6 digits long');
        } else { 
        setSortCodeError('');
        }
        checkAllAddCardFieldsChange();
    };
    // SORT CODE VALIDATION EDIT CARD MODAL
    const handleSortCodeEditCard = (e) => {
        const isValid = /^([0-9-]+)$/i.test(e.target.value) && e.target.value.length === 8;
        
        if (!isValid && e.target.value.length < 9 && e.target.value.length > 0) { 
        setSortCodeEditCardError('Sort code should be 6 digits long');
        } else { 
        setSortCodeEditCardError('');
        }
        checkAllEditCardFieldsChange();
    };

    // CHECKS IF EXPIRY DATE IS VALID ADD CARD MODAL
    const checkAddModalDate = (e) => {
        const currentDate = new Date;
        const expireDate = new Date(e.target.value);
        if (expireDate!= null && currentDate > expireDate) {
          setCheckDateError('Invalid Date')
        } else {
          setCheckDateError('')
        }
        checkAllAddCardFieldsChange();
    }
    // CHECKS IF EXPIRY DATE IS VALID EDIT CARD MODAL
    const checkEditModalDate = (e) => {
        const currentDate = new Date;
        const expireDate = new Date(e.target.value);
        if (expireDate!= null && currentDate > expireDate) {
          setCheckDateEditCardError('Invalid Date')
        } else {
        setCheckDateEditCardError('')
        }
        checkAllEditCardFieldsChange();
    }
    // CVV VALIDATION ADD CARD MODAL
    const handleCVV = (e) => {
        const isValid = /^([0-9 ]+)$/i.test(e.target.value) && e.target.value.length === 3;
        
        if (!isValid && e.target.value.length < 4 && e.target.value.length > 0) {
        setCVVError('3 digits long');
        } else {
        setCVVError('');
        }
    
        checkAllAddCardFieldsChange();
    };
    // CVV VALIDATION EDIT CARD MODAL
    const handleCVVEditCard = (e) => {
        const isValid = /^([0-9 ]+)$/i.test(e.target.value) && e.target.value.length === 3;
        
        if (!isValid && e.target.value.length < 4 && e.target.value.length > 0) {
        setCVVEditCardError('3 digits long');
        } else {
        setCVVEditCardError('');
        }
    
        checkAllEditCardFieldsChange();
    };
    

    // Function that handle confirm button click on edit card dialog
    const handleConfirmEditCardClick = (card) => {
        
        if (!currentUser) {
            return;
        }
            
        const userId = currentUser.uid;
        const cardRef = ref(database, 'User/' + userId + '/card/'+ card.id);
        // Use the update method to update the card
        update(cardRef, card)
            .then(() => {
                toast.success("Card updated successfully");
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
        if (!currentUser) {
            return;
        }
            const userId = currentUser.uid;
        const cardRef = ref(database, 'User/' + userId + '/card/'+ card.id);
        // Use the update method to update the address
        remove(cardRef, card)
            .then(() => {
                toast.success("Card deleted successfully");
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
            
            if (!currentUser) {
                return;
            }

            const userId = currentUser.uid;
    
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
        
                        setOrderDetails(orders);
                    } else {
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
    
                            setReviewDetails(reviews);
                        } else {
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
        
        if (!currentUser) {
            return;
        }
        const userId = currentUser.uid;
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
    const getProductDetails = (productId) => {
        return products.find(product => product.id === productId) || {};
    };

    

    // Function to open delete review modal
    const openDeleteReviewModal = (review) => {
        setReviews(review);
        setShowDeleteReview(true);
    };
    // Function that handle confirm button click on delete review dialog
    const handleConfirmDeleteReviewClick = (review) => {
        
        if (!currentUser) {
            return;
        }
        
        const reviewRef = ref(database, 'Reviews/' + review.id);
        remove(reviewRef, review)
            .then(() => {
                toast.success("Review deleted successfully");
                // Update local state with the new values
                setReviewDetails(prevReviewDetails => prevReviewDetails.filter(rw => rw.id !== review.id));
                setShowDeleteReview(false);
            })
            .catch((error) => {
                toast.error("Error deleting card:", error);
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
            <div className='sm-grid-cols-1 bg-blue-gradient grid grid-rows-1 md:grid-cols-4 md:gap-x-6  md:row-start-1 md:row-end-2 md:col-start-1 md:col-end-3 bg-dark-night justify-items-center overflow-x-scroll no-scrollbar'> 
                
                <div className="relative">
                    {/* Button to toggle visibility of tab menu */}
                    <button className="absolute top-0 left-0 mt-4 w-36 px-4 py-2 bg-dark-night text-white rounded" onClick={toggleTabMenu}>
                        MENU
                    </button>

                    {/* Tab menu */}
                    <div className="mt-20 border-none absolute top-0 left-0 p-4 border border-gray-300 md:bg-transparent bg-dark-night rounded-lg"
                        style={{ zIndex: 10 }} id = "tabMenu">
                        <Tabs
                            orientation='vertical'
                            value={value}
                            onChange={handleChange}
                            aria-label="Vertical tabs menu"
                            sx={{
                                borderRight: '2px solid purple',
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#c50edd', // Set the color of the indicator to the desired color
                                },
                            }}>
                            <Tab className='tab' icon={<AccountCircle />} label={<span className="tab-label">ACCOUNT</span>} {...a11yProps(0)} onClick={() => handleTabChange(0)} />
                            <Tab className='tab' icon={<Payment />} label={<span className="tab-label">STORED CARDS</span>} {...a11yProps(1)} onClick={() => handleTabChange(1)} />
                            <Tab className='tab' icon={<VpnKey />} label={<span className="tab-label">ORDERED KEYS</span>} {...a11yProps(2)} onClick={() => handleTabChange(2)} />
                            <Tab className='tab' icon={<RateReview />} label={<span className="tab-label"><br/>MY<br/> REVIEWS</span>} {...a11yProps(3)} onClick={() => handleTabChange(3)} />
                            <Tab className='tab' icon={<ExitToApp />} label={<span className="tab-label">LOGOUT</span>} {...a11yProps(4)} onClick={() => handleTabChange(4)} />
                        </Tabs>
                    </div>
                </div>
                {/* ACCOUNT */}
                {value ===  0 ? (
                    <>
                    <div className="sm:flex-cols sm:justify-self-center md:justify-self-start h-auto w-72 md:w-full my-6 row-start-1 row-end-1 col-start-2 col-end-5" >
                        {userDetails && (
                        <div className='grid grid-rows-1'>
                        <h5 className="justify-self-center sm:text-2xl text-center md:text-4xl font-bold tracking-tight mt-10 text-white font-mono" > ACCOUNT INFORMATION</h5>

                            <div style={{ backgroundColor: 'transparent' }} className="flex justify-center mt-6 h-auto w-full bg-transparent border-white border-b-2 border-teal-500">
                                <form>
                                    <div className='mb-3 sm:w-full' style={{ display: 'grid', gridTemplateColumns: '1fr', justifyItems: 'start', alignItems: 'start' }}>    
                                        <h2 id="first_name" className="flex text-white font-mono ">FIRST NAME:</h2>
                                        <input onClick={handleEditButtonClick} disabled={!editButtonClicked || saveButtonClicked} className="block md:w-full sm:w-full sm:text-sm sm:leading-6 bg-transparent text-white rounded-md py-1.5 px-1.5 border-2 border-white hover:shadow-input hover:border-fuchsia-800 focus:shadow-input focus:border focus:border-fuchsia-800 focus:outline-none focus:bg-transparent"
                                        type="first_name" id="first name" name="firstName" value={userDetails.firstName} onChange={handleChange}/>
                                    </div>
                                    <div className='mb-3' style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', justifyItems: 'start', alignItems: 'start' }}>    
                                        <h2 id="last_name" className="flex text-white  font-mono ">LAST NAME:</h2>
                                        <input onClick={handleEditButtonClick} disabled={!editButtonClicked || saveButtonClicked} className="block w-64 sm:text-sm sm:leading-6 bg-transparent text-white rounded-md py-1.5 px-1.5 border-2 border-white hover:shadow-input hover:border-fuchsia-800 focus:shadow-input focus:border focus:border-fuchsia-800 focus:outline-none focus:bg-transparent"
                                        type="last_name" id="first name" name="lastName" value={userDetails.lastName} onChange={handleChange}/>
                                    </div>
                                    <div className='mb-3' style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', justifyItems: 'start', alignItems: 'start' }}>    
                                        <h2 id="email_address" className="flex text-white  font-mono ">EMAIL ADDRESS:</h2>
                                        <input disabled className="block w-64 sm:text-sm sm:leading-6 text-white bg-transparent rounded-md py-1.5 px-1.5 border-2 border-white hover:shadow-input hover:border-fuchsia-800 focus:shadow-input focus:border focus:border-fuchsia-800 focus:outline-none focus:bg-transparent"
                                        type="email" defaultValue={(currentUser ? currentUser.email : "")} id="first name" name="email"/>
                                    </div>
                                    
                                    <div className='mb-3' style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', justifyItems: 'start', alignItems: 'start' }}>    
                                    <h2 id="empty_content" className="flex  text-white font-mono "></h2>

                                        <button
                                            className={`w-40 visible justify-self-end mt-6 mb-6 mr-3 self-end text-white bold focus:outline-none focus:ring-4 focus:ring-green-300 rounded-lg px-5 py-2.5 ${editButtonClicked && !saveButtonClicked ? 'bg-green-400 hover:bg-green-500' : 'bg-gray-400'}`}
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
                        <div className='flex flex-col sm:flex-row justify-center sm:justify-evenly mt-10'>
                            <button className="md:w-52 pay-btn text-white rounded-lg text-m w-full sm:w-auto px-5 py-2.5 text-center roboto-light" onClick={() => setShowPasswordModal(true)} disabled={showPasswordModal}>
                                CHANGE PASSWORD
                            </button>
                            <button className="md:w-52 sm:w-32 text-white bold focus:outline-none focus:ring-4 focus:ring-green-300 rounded-lg px-5 py-2.5 bg-green-400 hover:bg-green-500 mt-3 sm:mt-0" onClick={handleEditButtonClick} disabled={editButtonClicked}>
                                EDIT INFORMATION
                            </button>
                        </div>

                        <div className='sm:flex sm:col-span-1 md:self-center sm:justify-center h-auto md:row-start-2 md:row-end-2 md:col-start-2 md:col-end-5 mb-6'>
                            <div>
                                <button type="submit" className="text-white bold rounded-lg px-5 py-2.5 mt-10 deleteAccount-btn" onClick={() => setShowDeleteModal(true)} disabled={showDeletedModal}>
                                    DELETE ACCOUNT
                                </button>
                            </div>
                        </div>
                    </div>

                </>
                ) : (
                    <></>
                )}

                {/* STORED CARDS */}
                { value ===  1 ? (
                    <>
                    <div style={{ backgroundColor: 'transparent'}} className="overflow-y-auto content-center h-auto sm:w-56 md:w-full my-6 mr-12 mt-24 bg-blue-900 border-blue-900 row-start-1 row-end-2 col-start-2 col-end-5 " >
                        <h5 style={{ position: 'sticky', top: 0, zIndex: 1 }} className="justify-self-center sm:justify-self-center text-center sm:text-center sm:text-2xl mb-3 md:text-4xl font-bold tracking-tight text-white font-mono" > MY STORED CARDS</h5>
                        {cardDetails.length === 0 ? (
                            <div className="text-2xl text-white mt-3 mb-44 font-mono text-center">NO CARD STORED WITHIN YOUR ACCOUNT.<br/> PLEASE ADD ONE!</div>
                        ) : (
                            <div className='md:rounded-none md:border-b-2 md:border-white md:grid md:grid-cols-6 md:flex-wrap md:mt-3 md:mb-3 md:ml-10 md:mr-10 p-3 hidden md:grid' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1 }}>
                                <h3 className='font-bold tracking-tight dark:text-white text-white'>Card Type</h3>
                                <h3 className='font-bold tracking-tight dark:text-white text-white'>Name on Card</h3>
                                <h3 className='font-bold tracking-tight dark:text-white text-white'>Card Ending</h3>
                                <h3 className='font-bold tracking-tight dark:text-white text-white'></h3>
                                <h3 className='font-bold tracking-tight dark:text-white text-white'></h3>
                            </div>
                        )}

                        <div style={{ backgroundColor: 'transparent', maxHeight: '45vh', paddingRight: '17px', boxSizing: 'content-box'}} className="overflow-y-auto content-center h-auto w-full my-6 mr-12 mt-3 mb-3 bg-blue-900 border-blue-900 row-start-1 row-end-2 col-start-2 col-end-5 " >
                            {/*This is the card that can be used as a component nested in cardStored component */}
                            <div className='grid grid-rows-3 flex-wrap m-s md:ml-10 sm:ml-10 sm:mr-10'>
                                {cardDetails.map((c) => (
                                    <Card key={c.id} className="flex md:h-auto md:w-full sm:w-full sm:justify-self-center summary-box mt-6">
                                    <div className='sm:flex sm:flex-row sm:justify-between sm:w-full md:grid md:grid-cols-6 md:items-center md:flex-wrap' style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr', alignItems: 'center' }}>    
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
                                            className="w-12 h-12"
                                        />
                                        <h2 className="dark:text-white text-white font-mono">{c.cardName}</h2>
                                        <h2 className="dark:text-white text-white font-mono">{c.cardNumber.slice(-4)}</h2>
                                        <div className="flex-col my-8 md:my-0 md:inline-flex relative">
                                            <Tooltip content='Edit your card'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute first-line:h-6 w-6 left-0 bottom-0 cursor-pointer hover:scale-110 hover:text-slate-200"  onClick={()=> openEditCardModal(c)} disabled={showEditCard}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                                </svg>
                                            </Tooltip>
                                            <Tooltip content='Delete your card'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute first-line:h-6 w-6 right-0 bottom-0 cursor-pointer hover:scale-110 hover:text-slate-200"   onClick={()=> openDeleteCardModal(c)} disabled={showDeleteCard}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </Tooltip>
                                        </div>

                                    </div>
                                </Card>
                                
                                ))}
                            </div>
                        </div>
                        <div className='flex mb-10 mt-3 col-span-3 justify-self-center ml-10'>
                            <button
                                type="submit"
                                className="inline-flex text-white align-center bold rounded-lg px-5 py-2.5 pay-btn"
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
                    <div style={{ backgroundColor: 'transparent', maxHeight: '80vh', paddingRight: '17px', boxSizing: 'content-box' }} className="overflow-y-auto justify-items-center h-auto sm:flex-col w-72 sm:ml-16 md:w-full md:my-6 mt-24 row-start-1 row-end-1 col-start-2 col-end-5 " >
                        <h5 className="justify-self-center text-center sm:text-2xl md:text-4xl mb-6 font-bold tracking-tight text-white font-mono" > MY ORDERED KEYS</h5>
                        {OrderDetails.length === 0 ? (
                            <div className="text-2xl text-white mt-32 mb-44 bebas-neue-regular text-center">NO ORDERS STORED WITHIN YOUR ACCOUNT.<br/> PLEASE PURCHASE PRODUCTS!!</div>
                        ) : (
                            OrderDetails.sort((a, b) => {
                                const dateA = new Date(a.date.split('/').reverse().join('/'));
                                const dateB = new Date(b.date.split('/').reverse().join('/'));
                                return dateB - dateA;
                            }).map((o, index) => (
                            
                                <Card key={o.id}  className="flex h-auto md:w-full roboto-bold summary-box mt-6">
                                    <div className='rounded-1 border-b-2 border-white mb-6 ml-3 mr-3 p-3 sm:flex sm:flex-wrap sm:justify-between sm:grid sm:grid-cols-4'>
                                        <div className="flex flex-wrap sm:flex-nowrap w-full">
                                            <h3 className='font-bold tracking-tight w-full sm:w-auto'>Order Number:</h3>
                                            <a className='tracking-tight dark:text-white text-white md:ml-2 w-full sm:w-auto'>{o.id.substring(1, 8)}</a>
                                        </div>
                                        <div className="flex flex-wrap sm:flex-nowrap w-full">
                                            <h3 className='font-bold tracking-tight w-full sm:w-auto'>Date Placed:</h3>
                                            <a className='tracking-tight dark:text-white text-white md:ml-2 w-full sm:w-auto'> {o.date}</a>
                                        </div>
                                        <div className="flex flex-wrap sm:flex-nowrap w-full">
                                            <h3 className='font-bold tracking-tight w-full sm:w-auto'>Total Amount:</h3>
                                            <a className='tracking-tight dark:text-white text-white md:ml-2 w-full sm:w-auto'>{"£ "+ parseFloat(o.price).toFixed(2)}</a>
                                        </div>
                                        <div className="flex flex-wrap sm:flex-nowrap w-full">
                                            <h3 className='font-bold tracking-tight w-full sm:w-auto'>Status:</h3>
                                            <a className='tracking-tight dark:text-white text-white md:ml-2 w-full sm:w-auto'>{o.status}</a>
                                        </div>
                                    </div>

                                    {/* Display item details */}
                                    {getItemsForOrder(o.id).map((item, itemIdex) => (
                                           <div key={itemIdex} className='flex flex-wrap border-b border-gray-300 ml-3 mr-3 p-3 md:grid md:grid-cols-5  md:items-center'>
                                           {item && item.product && (
                                               <Fragment key={item.product.id}>
                                                   <div className='flex flex-col md:flex-row md:col-span-2'>
                                                       <img className="md:w-16 h-16 object-cover rounded-lg" src={item.product.images[0]} alt="Product Image"/>
                                                       <div className="md:ml-3 mt-3 md:mt-6 md:text-left sm:mt-3 sm:ml-0 sm:w-full sm:text-center dark:text-white text-white">{item.product.name.substring(0, 19)}</div>
                                                   </div>
                                       
                                                   <div className="flex w-full justify-start dark:text-white text-white mt-2">{`£ ${item.product.price}`}</div>
                                       
                                                   {/* Check review details */}
                                                   {reviewDetails.find(review => review.userID === currentUser.uid && review.productID === item.product.id) ? (
                                                       <Tooltip content='You have already reviewed this product'>
                                                       <div className="relative">
                                                           {/* Position the icon at the top right corner */}
                                                           <div className="absolute top-0 right-0 -mt-2 mr-2">
                                                           <RateReview className="cursor-pointer" style={{
                                                               height: '20px',
                                                               width: '20px',
                                                               justifySelf: 'center',
                                                               filter: 'brightness(0) invert(1)',
                                                               marginTop: '3px',
                                                           }} disabled />
                                                           </div>
                                                       </div>
                                                   </Tooltip>
                                               ) : (
                                                   <Tooltip content='Review this product'>
                                                    <div className="relative">
                                                        <div className="absolute top-0 right-0 -mt-2 mr-2">
                                                            <RateReview className="cursor-pointer hover:scale-110 hover:text-slate-200" 
                                                                style={{ height: '20px', marginTop: '3px', width: '20px', justifySelf: 'center', filter: 'brightness(0) invert(1)' }} 
                                                                onClick={() => openReviewProductModal(item.product)}
                                                                disabled={showReviewModal} />
                                                           </div>
                                                   </div>
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
                                                           {copiedStates[index] ? (
                                                               <Tooltip content="Copied!">
                                                                   <svg className="w-3 h-3 text-white me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                                                       <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                                                                   </svg> 
                                                               </Tooltip>
                                                           ) : (
                                                               <Tooltip content="Copy">
                                                                   <svg className="w-3.5 h-3.5 hover:scale-110 hover:text-slate-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                                                       <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
                                                                   </svg>
                                                               </Tooltip>
                                                           )}
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
                    <div style={{ backgroundColor: 'transparent', minHeight: '70vh', maxHeight: '80vh', paddingRight: '17px', boxSizing: 'content-box'}} className="overflow-y-auto justify-items-center h-auto sm:flex-col w-72 sm:ml-16 md:w-full md:my-6 mt-24 row-start-1 row-end-1 col-start-2 col-end-5 " >
                        <h5 className="justify-self-center sm:text-2xl text-center md:text-4xl mb-6 font-bold tracking-tight text-white font-mono"> MY REVIEWS</h5>
                        {reviewDetails.length === 0 ? (
                            <div className="text-2xl text-white mt-32 mb-44 font-mono text-center">NO PRODUCT REVIEW STORED WITHIN YOUR ACCOUNT.<br/> PLEASE REVIEW PRODUCTS!!</div>
                        ) : (
                            reviewDetails.sort((a, b) => {
                                const dateA = new Date(a.date.split('/').reverse().join('/'));
                                const dateB = new Date(b.date.split('/').reverse().join('/'));
                                return dateB - dateA;
                            }).map((review) => (
                                <Card key={review.id} className="h-auto w-full summary-box mt-6">
                                    <div className='flex flex-col sm:flex-row sm:flex-wrap border-b border-gray-300 ml-3 mr-3 p-3 md:grid md:grid-cols-5 md:gap-4 md:items-center'>
                                        <div className='mb-3 sm:mb-0 sm:w-1/5'>
                                            <h3 className='font-bold tracking-tight dark:text-white text-white'>Game</h3>
                                            {getProductDetails(review.productID) && (
                                                <img className="mt-2 md:w-24 h-16 sm:w-full object-cover sm:h-16 rounded-lg" src={getProductDetails(review.productID).images[1]} alt="Product Image" />

                                            )}
                                        </div>
                                        <div className='mb-3 sm:mb-0 sm:w-1/5'>
                                            <h3 className='font-bold tracking-tight dark:text-white text-white'>Name</h3>
                                            {getProductDetails(review.productID) && (
                                                <a className='mt-2 sm:mt-1 tracking-tight dark:text-white text-white'>{getProductDetails(review.productID).name}</a>
                                            )}
                                        </div>
                                        <div className='mb-3 sm:mb-0 sm:w-1/5'>
                                            <h3 className='font-bold tracking-tight dark:text-white text-white'>Date Placed:</h3>
                                            <a className='mt-2 sm:mt-1 tracking-tight dark:text-white text-white'>{review.date}</a>
                                        </div>
                                        <div className='mb-3 sm:mb-0 sm:w-1/5'>
                                            <h3 className='font-bold tracking-tight dark:text-white text-white'>Posted as:</h3>
                                            <a className='mt-2 sm:mt-1 tracking-tight dark:text-white text-white'>{review.userName}</a>
                                        </div>
                                        <div className='mb-3 sm:mb-0 sm:w-1/5'>
                                            <h3 className='font-bold tracking-tight dark:text-white text-white'>Rating:</h3>
                                                <div className='flex items-center'>
                                                    {[...Array(5)].map((star, index) => {
                                                        const currentRating = review.rating;
                                                        return (
                                                            <label key={index}>
                                                                <FaStar
                                                                    className='star ml-1 mt-2'
                                                                    size={20}
                                                                    color={index + 1 <= currentRating ? "#ffc107" : "#e4e5e9"}
                                                                />
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                        </div>
                                    </div>
                                    <div className='self-start w-full'>
                                        <a className='ml-3 mb-3 font-bold text-white mr-3'>{review.title}</a>
                                        <p className='ml-3 text-white break-words mr-3'>{review.comment}</p>
                                        <div className='flex items-center'>
                                            <div className='ml-auto'>
                                                <Tooltip content='Delete review'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-5 w-5 cursor-pointer hover:scale-110 hover:text-slate-200" onClick={()=> openDeleteReviewModal(review)} disabled={showDeleteReview}>
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                                </Tooltip>
                                            </div>
                                        </div>
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
                    <button type="submit" className="dismiss-btn text-white rounded-lg text-m px-5 py-2.5 text-center roboto-light" onClick ={()=>setShowLogoutModal(false)}>NO</button>
                    <button type="submit" className="confirm-btn text-white rounded-lg text-m px-5 py-2.5 text-center roboto-light" onClick={signOut}>YES</button>
                </div>
            </Modal>

            {/*Personal details modal */}
            <Modal isVisible={showModal} userDetails = {userDetails} onClose ={()=> setShowModal(false)}>
                <h3 className='text-xl flex self-center font-semibold text-white mb-5'>PERSONAL DETAILS CHANGES</h3>
                <h3 className='flex self-center font-semibold text-white  mb-5'>Are you sure you want to save the changes?</h3>
                <div className='flex justify-evenly mt-10'>
                    <button className="dismiss-btn text-white rounded-lg text-m px-5 py-2.5 text-center roboto-light" color="gray" onClick ={()=>setShowModal(false)}> DISMISS</button>
                    <button className="confirm-btn text-white rounded-lg text-m px-5 py-2.5 text-center roboto-light" onClick={()=>handleConfirmButtonClick()}>CONFIRM</button>
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
                                <input className="block w-full bg-transparent placeholder:text-grey-200 sm:text-sm sm:leading-6 rounded-md py-1.5 px-1.5 mt-2 focus:bg-transparent border-2 border-white hover:shadow-input hover:border-fuchsia-800 focus:shadow-input focus:shadow-focus focus:border focus:border-fuchsia-800 focus:outline-none focus:placeholder:text-white"
                                id="oldPassword" name="oldPassword" required onChange={handleOldPasswordChange} ref={oldPassword} type={showOldPassword ? "text" : "password"}/>
                                <button type="button" aria-label={ showOldPassword ? "Password Visible" : "Password Invisible."} className="text-white" onClick={() => { setShowOldPassword((prev) => !prev); }}>
                                    {showOldPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                        stroke="currentColor" className="w-6 select-none cursor-pointer h-6 absolute top-2 right-2" tabIndex="-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z">
                                        </path>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 select-none cursor-pointer h-6 absolute top-2 right-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
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
                                <input className="block w-full bg-transparent placeholder:text-grey-200 sm:text-sm sm:leading-6 rounded-md py-1.5 px-1.5 mt-2 focus:bg-transparent border-2 border-white hover:shadow-input hover:border-fuchsia-800 focus:shadow-input focus:shadow-focus focus:border focus:border-fuchsia-800 focus:outline-none focus:placeholder:text-white"
                                    id="newPassword" name="newPassword" required onChange={handleNewPasswordChange} ref={newPassword} type={showPassword ? "text" : "password"}/>
                                <button
                                    type="button"
                                    aria-label={
                                    showPassword ? "Password Visible" : "Password Invisible."
                                    }
                                    className="text-white"
                                    onClick={() => {
                                    setShowPassword((prev) => !prev);
                                    }}
                                >
                                    {showPassword ? (
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
                                        <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
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
                                    <input className="block w-full bg-transparent placeholder:text-grey-200 sm:text-sm sm:leading-6 rounded-md py-1.5 px-1.5 mt-2 focus:bg-transparent border-2 border-white hover:shadow-input hover:border-fuchsia-800 focus:shadow-input focus:shadow-focus focus:border focus:border-fuchsia-800 focus:outline-none focus:placeholder:text-white"
                                    id="confirmNewPassword" name="confirmNewPassword" required onChange={handleNewConfirmPasswordChange} ref={newConfPassword} type={showConfirmPassword ? "text" : "password"}/>
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
                                            {newConfPasswordError && <span style={{ color: 'red', fontSize: '14px' }}>{newConfPasswordError}</span>}
                            </div> 
                        </div>
                        <div className='flex justify-evenly my-10'>
                            <button type="submit" className="dismiss-btn text-white rounded-lg text-m px-5 py-2.5 text-center roboto-light" color='gray' onClick ={()=>setShowPasswordModal(false)}> DISMISS</button>
                            <button type="submit" className="confirm-btn text-white rounded-lg text-m px-5 py-2.5 text-center roboto-light" >CONFIRM</button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/*Delete account modal */}          
            <Modal isVisible={showDeletedModal} onClose ={()=> setShowDeleteModal(false)}>
                <h3 className='text-xl flex self-center font-semibold text-white mb-5'>DELETE ACCOUNT</h3>
                <h3 className='flex self-center font-semibold text-white  mb-5'>Are you sure you want to delete yur acount?</h3>
                <div className='flex justify-evenly mt-10 mb-10'>
                    <button type="submit" className="dismiss-btn text-white rounded-lg text-m px-5 py-2.5 text-center roboto-light" color="gray" onClick ={()=>setShowDeleteModal(false)}> DISMISS</button>
                    <button type="submit" className="confirm-btn text-white rounded-lg text-m px-5 py-2.5 text-center roboto-light" onClick={()=>handleDeleteAccountButtonClick()}>CONFIRM</button>
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
                            <input className="block w-full bg-transparent sm:text-sm sm:leading-6 placeholder-text-grey-200 rounded-md py-1.5 px-1.5 mt-2 border-2 border-white focus:bg-transparent hover:shadow-input hover:border-fuchsia-800 focus:shadow-input focus:shadow-focus focus:border focus:border-fuchsia-800 focus:outline-none focus:placeholder:text-white"
                            onInput={handleFullName} type="text" id="cardName" name="cardName" placeholder='John Wick' required value={formData.cardName} onChange={handleChangeCardDetails}/>
                            {fullNameError && <span style={{ color: 'red', fontSize: '12px' }}>{fullNameError}</span>}
                        </div>

                        <div> 
                            <label htmlFor="number" className='text-white'>Card Number</label>
                            <InputMask className="block w-full bg-transparent sm:text-sm sm:leading-6 placeholder-text-grey-200 rounded-md py-1.5 px-1.5 mt-2 border-2 border-white focus:bg-transparent hover:shadow-input hover:border-fuchsia-800 focus:shadow-input focus:shadow-focus focus:border focus:border-fuchsia-800 focus:outline-none focus:placeholder:text-white"
                            id="cardNumber" name="cardNumber" mask="9999 9999 9999 9999" maskChar="" placeholder='4625 2563 2356 8514' required value={formData.cardNumber} 
                            onInput={handleCardNumber} onChange={handleChangeCardDetails}/>
                            {cardNumberError && <span style={{ color: 'red', fontSize: '12px' }}>{cardNumberError}</span>}
                        </div>

                        <div>
                            <label htmlFor="number" className='text-white'>Sort Code</label>
                            <InputMask className="block w-full bg-transparent sm:text-sm sm:leading-6 placeholder-text-grey-200 rounded-md py-1.5 px-1.5 mt-2 border-2 border-white focus:bg-transparent hover:shadow-input hover:border-fuchsia-800 focus:shadow-input focus:shadow-focus focus:border focus:border-fuchsia-800 focus:outline-none focus:placeholder:text-white"
                            id="sortCode" name="sortCode" mask="99 99 99" maskChar="" placeholder='26 02 54' required value={formData.sortCode} 
                            onInput={handleSortCode} onChange={handleChangeCardDetails}/>
                            <span className={sortCodeError.length > 1 ? '' : "text-opacity-0"} style={{ color: 'red', fontSize: '12px' }}>{sortCodeError}</span>
                        </div>

                        <div className='inline-flex justify-evenly'>
                            <div className='mr-5'>
                                <label htmlFor="number" className='text-white'>Exp.Date</label>
                                <input className="block w-full bg-transparent sm:text-sm sm:leading-6 placeholder-text-grey-200 rounded-md py-1.5 px-1.5 mt-2 border-2 border-white focus:bg-transparent hover:shadow-input hover:border-fuchsia-800 focus:shadow-input focus:shadow-focus focus:border focus:border-fuchsia-800 focus:outline-none focus:placeholder:text-white"
                                type="month" id="expDate" name="expDate" placeholder='12/24' required value={formData.expDate}
                                onInput={checkAddModalDate} onChange={handleChangeCardDetails}/>
                                {checkDateError && <span style={{ color: 'red', fontSize: '12px' }}>{checkDateError}</span>}
                            </div>
                            
                            <div className="ml-5 noIncrementer relative">
                                <label htmlFor="number" className='inline-flex text-white'>CVV
                                <Tooltip content="Three digit code on the back of your card">
                                    <svg  className='ml-2' width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF">
                                    <path d="M12 11.5V16.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M12 7.51L12.01 7.49889" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                </Tooltip>
                                </label>
                                <InputMask className="block w-full bg-transparent sm:text-sm sm:leading-6 placeholder-text-grey-200 rounded-md py-1.5 px-1.5 mt-2 border-2 border-white focus:bg-transparent hover:shadow-input hover:border-fuchsia-800 focus:shadow-input focus:shadow-focus focus:border focus:border-fuchsia-800 focus:outline-none focus:placeholder:text-white"
                                type={showAddCardCVV ? "text" : "password"}
                                mask="999"
                                maskChar=""
                                inputMode="numeric" id="securityCode" name="securityCode" placeholder='342' required value={formData.securityCode} 
                                onInput={handleCVV} onChange={handleChangeCardDetails}/>
                                
                                {/* Eye toggle to hide/show CVV */}
                                <button
                                        className="text-white"
                                        type="button"
                                        aria-label={
                                            showAddCardCVV ? "Password Visible" : "Password Invisible."
                                        }
                                        onClick={() => {
                                            setShowAddCardCVV((prev) => !prev);
                                        }}>
                                        {showAddCardCVV ? (
                                            <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="w-6 select-none cursor-pointer h-6 absolute top-10 right-4"
                                            tabIndex="-1"
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
                                        {cvvError && <span style={{ color: 'red', fontSize: '14px', fontWeight:"bold" }}>{cvvError}</span>}
                            </div>
                        </div>

                        <div className='flex justify-evenly mt-10'>
                            <button className="dismiss-btn text-white rounded-lg text-m px-5 py-2.5 text-center roboto-light" onClick ={()=>setShowAddCardModal(false)}> DISMISS</button>
                            <button disabled={isConfirmButtonDisabled} type="submit" className="confirm-btn text-white rounded-lg text-m px-5 py-2.5 text-center roboto-light" >CONFIRM</button>
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
                            <label htmlFor="text" className='text-white'>Cardholder Name</label>
                            <input className="block w-full bg-transparent sm:text-sm sm:leading-6 placeholder-text-grey-200 rounded-md py-1.5 px-1.5 mt-2 border-2 border-white focus:bg-transparent hover:shadow-input hover:border-fuchsia-800 focus:shadow-input focus:shadow-focus focus:border focus:border-fuchsia-800 focus:outline-none focus:placeholder:text-white"
                            onInput={handleFullNameEditCard} type="text" id="card_holder" name="card_holder" placeholder='John Wick' required value={card.cardName} onChange={(e) => setCard({ ...card, fullName: e.target.value })}/>
                            {fullNameEditCardError && <span style={{ color: 'red', fontSize: '12px' }}>{fullNameEditCardError}</span>}
                        </div>

                        <div>
                            <label htmlFor="number" className='text-white'>Card Number</label>
                            <InputMask className="block w-full bg-transparent sm:text-sm sm:leading-6 placeholder-text-grey-200 rounded-md py-1.5 px-1.5 mt-2 border-2 border-white focus:bg-transparent hover:shadow-input hover:border-fuchsia-800 focus:shadow-input focus:shadow-focus focus:border focus:border-fuchsia-800 focus:outline-none focus:placeholder:text-white"
                            id="card_number" name="card_number" mask="9999 9999 9999 9999" maskChar="" placeholder='4625 2563 2356 8514' required value={card.cardNumber} 
                            onInput={handleCardNumberEditCard} onChange={(e) => setCard({ ...card, cardNumber: e.target.value })}/> 
                            {cardNumberEditCardError && <span style={{ color: 'red', fontSize: '12px' }}>{cardNumberEditCardError}</span>}
                        </div>

                        <div>
                            <label htmlFor="number" className='text-white'>Sort Code</label>
                            <InputMask className="block w-full bg-transparent sm:text-sm sm:leading-6 placeholder-text-grey-200 rounded-md py-1.5 px-1.5 mt-2 border-2 border-white focus:bg-transparent hover:shadow-input hover:border-fuchsia-800 focus:shadow-input focus:shadow-focus focus:border focus:border-fuchsia-800 focus:outline-none focus:placeholder:text-white"
                            id="sort_code" name="sort_code" mask="99 99 99" maskChar="" placeholder='26 02 54' required value={card.sortCode}
                            onInput={handleSortCodeEditCard} onChange={(e) => setCard({ ...card, sortCode: e.target.value })}/> 
                            <span className={sortCodeEditCardError.length > 1 ? '' : "text-opacity-0"} style={{ color: 'red', fontSize: '12px' }}>{sortCodeEditCardError}</span>
                        </div>

                        <div className='inline-flex justify-evenly'>
                            <div className='mr-5'>
                                <label htmlFor="number" className='text-white'>Exp.Date</label>
                                <input className="block w-full bg-transparent sm:text-sm sm:leading-6 placeholder-text-grey-200 rounded-md py-1.5 px-1.5 mt-2 border-2 border-white focus:bg-transparent hover:shadow-input hover:border-fuchsia-800 focus:shadow-input focus:shadow-focus focus:border focus:border-fuchsia-800 focus:outline-none focus:placeholder:text-white"
                                type="month" id="exp_date" name="exp_date" placeholder='12/24' required value={card.expDate}
                                onInput={checkEditModalDate} onChange={(e) => setCard({ ...card, expDate: e.target.value })}/>
                                {checkDateEditCardError && <span style={{ color: 'red', fontSize: '12px' }}>{checkDateEditCardError}</span>}
                            </div>

                            <div className="ml-5 noIncrementer relative">
                                <label htmlFor="number" className='inline-flex text-white'>CVV
                                <Tooltip content="Three digit code on the back of your card">
                                    <svg  className = 'ml-2' width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" color="#FFFFFF">
                                    <path d="M12 11.5V16.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M12 7.51L12.01 7.49889" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                </Tooltip>
                                </label>
                                    <InputMask
                                    type={showEditCardCVV ? "text" : "password"}
                                    className="block w-full bg-transparent sm:text-sm sm:leading-6 placeholder-text-grey-200 rounded-md py-1.5 px-1.5 mt-2 border-2 border-white focus:bg-transparent hover:shadow-input hover:border-fuchsia-800 focus:shadow-input focus:shadow-focus focus:border focus:border-fuchsia-800 focus:outline-none focus:placeholder:text-white"
                                    inputMode="numeric"
                                    mask="999"
                                    maskChar=""
                                    id="cvv"
                                    name="cvv"
                                    placeholder="342"
                                    required
                                    value={card.securityCode}
                                    onInput={handleCVVEditCard}
                                    onChange={(e) => setCard({ ...card, securityCode: e.target.value })}
                                    />
                                    {/* Eye toggle to hide/show CVV */}
                                    <button
                                        className="text-white"
                                        type="button"
                                        aria-label={
                                            showEditCardCVV ? "Password Visible" : "Password Invisible."
                                        }
                                        onClick={() => {
                                            setShowEditCardCVV((prev) => !prev);
                                        }}>
                                        {showEditCardCVV ? (
                                            <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="w-6 select-none cursor-pointer h-6 absolute top-10 right-4"
                                            tabIndex="-1"
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
                                        {cvvEditCardError && <span style={{ color: 'red', fontSize: '14px', fontWeight:"bold" }}>{cvvEditCardError}</span>}
                            </div>
                        </div>
                    </form>
                </div>

                <div className='flex justify-evenly mt-10 mb-2'>
                    <button type="submit"className="dismiss-btn text-white rounded-lg text-m  px-5 py-2.5 text-center roboto-light" onClick ={()=>setShowEditCard(false)}> DISMISS</button>
                    <button disabled={isConfirmButtonEditCardDisabled} type="submit" className="confirm-btn text-white rounded-lg text-m px-5 py-2.5 text-center roboto-light" onClick={()=>handleConfirmEditCardClick(card)}>CONFIRM</button>
                </div>
            </Modal>

            {/*Delete card modal */}
            <Modal isVisible={showDeleteCard} card = {card} onClose ={()=> setShowDeleteCard(false)}>
                <h3 className='text-xl flex self-center font-semibold text-white mb-5'>DELETE CARD</h3>
                <h3 className='flex self-center font-semibold text-white  mb-5'>Are you sure you want to delete this card?</h3>
                <div className='flex justify-evenly mt-10 mb-2'>
                    <button type="submit"className="dismiss-btn text-white rounded-lg text-m px-5 py-2.5 text-center roboto-light" color="gray" onClick ={()=>setShowDeleteCard(false)}> DISMISS</button>
                    <button type="submit" className="confirm-btn text-white rounded-lg text-m px-5 py-2.5 text-center roboto-light" onClick={()=>handleConfirmDeleteCardClick(card)}>CONFIRM</button>
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
                                className="self-center peer h-12 mt-2 min-h-[10px] w-96 resize-none rounded-[7px] bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-gray-200 outline outline-0 transition-all  border-2 border-white focus:bg-transparent hover:shadow-input hover:border-fuchsia-800 focus:shadow-input focus:shadow-focus focus:border focus:border-fuchsia-800 focus:outline-none focus:placeholder:text-white"
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
                                className="peer h-full min-h-[150px] w-96 mt-2 resize-none rounded-[7px] px-3 py-2.5 font-sans text-sm font-normal text-gray-200 outline outline-0 transition-all  border-2 border-white focus:bg-transparent hover:shadow-input hover:border-fuchsia-800 focus:shadow-input focus:shadow-focus focus:border focus:border-fuchsia-800 focus:outline-none focus:placeholder:text-white"
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
                            <button className="dismiss-btn text-white rounded-lg text-m px-5 py-2.5 text-center roboto-light" onClick ={()=>closewModal()}> DISMISS</button>
                            <button className="confirm-btn text-white rounded-lg text-m px-5 py-2.5 text-center roboto-light" disabled={isButtonDisabled} onClick={()=>handleReviewProductButtonClick()}>POST</button>
                        </div>
                    </div>
            </Modal>

            {/*Delete review modal */}
            <Modal isVisible={showDeleteReview} review={reviews} onClose={()=> setShowDeleteReview(false)}>
                <h3 className='text-xl flex self-center font-semibold text-white mb-5'>DELETE REVIEW</h3>
                <h3 className='flex self-center font-semibold text-white  mb-5'>Are you sure you want to delete this review?</h3>
                <div className='flex justify-evenly mt-10 mb-2'>
                    <button type="submit" className="dismiss-btn text-white rounded-lg text-m  py-2.5 text-center roboto-light"  onClick={()=> setShowDeleteReview(false)}> DISMISS</button>
                    <button type="submit" className="confirm-btn text-white rounded-lg text-m px-5 py-2.5 text-center roboto-light" onClick={()=>handleConfirmDeleteReviewClick(reviews)}>CONFIRM</button>
                </div>
            </Modal>
        </Fragment>
    );
}
