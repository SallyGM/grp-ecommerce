"use client"; 
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.js'
import { useRouter } from 'next/navigation'
import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { AccountCircle, Payment, VpnKey, RateReview, ExitToApp } from '@mui/icons-material'; // Import icons
import Modal from '@/components/modal.js';
import { Button } from 'flowbite-react';

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

export default function VerticalTabs() {
  const [value, setValue] = useState(0);
  const router = useRouter();
  const { signout } = useAuth();
  const [error, setError] = useState(false);
  const theme = useTheme();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
    .MuiTab-root {
        color: white !important;
        borderRight: 4px  solid #6497ff;
        margin-bottom: 20px;
        font-size: 16px
    }
    .MuiTabs-vertical .MuiTab-root:hover {
        color: #6497ff !important;
        borderRight: 4px  solid #6497ff;
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

  const handleTabChangeValue = (event, newValue) => {
    setValue(newValue);
    console.log(newValue);
  };

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
        //setShowLogoutModal(true); 
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

  return (
    <div className="justify-self-end h-auto w-auto my-6 row-span-1 col-start-1 col-end-2"style={{ backgroundColor: 'transparent'}} >
      <Box sx={{  display: 'flex',lineHeight: 300, height: 500, width: 200, marginTop: 10 ,marginRight:5, justifyContent: 'center', flexGrow:1}}>
        <Tabs orientation="vertical" value={value} onChange={handleTabChangeValue} aria-label="Vertical tabs menu" sx={{ borderRight: 1, borderColor: 'gray' }}>      
          <Tab icon={<AccountCircle />} label="ACCOUNT" {...a11yProps(0)}  onClick={()=>handleTabChange(0)}/>
          <Tab icon={<Payment />} label="STORED CARDS" {...a11yProps(1)}  onClick={()=>handleTabChange(1)} />
          <Tab icon={<VpnKey />} label="ORDERED KEYS" {...a11yProps(2)}  onClick={()=>handleTabChange(2)}/>
          <Tab icon={<RateReview />} label="MY REVIEWS" {...a11yProps(3)}  onClick={()=>handleTabChange(3)}/>
          <Tab icon={<ExitToApp />} label="LOGOUT" {...a11yProps(4)}  onClick={()=>handleTabChange(4)} />
        </Tabs>
      </Box>
      {/*logout modal */}          
      <Modal isVisible={showLogoutModal} onClose ={()=> setShowLogoutModal(false)}>
        <h3 className='text-xl flex self-center font-semibold text-white mb-5'>LOG OUT</h3>
        <h3 className='flex self-center font-semibold text-white  mb-5'>Are you sure you want to logout?</h3>
        <div className='flex justify-evenly mt-10 mb-10'>
            <Button type="submit" className="w-52" color="gray" onClick ={()=>setShowLogoutModal(false)}>NO</Button>
            <Button type="submit" className="w-52"  style={{background: '#00052d', border : '#00052d'}} onClick={signOut}>YES</Button>
        </div>
      </Modal>
    </div>
    
  );
}