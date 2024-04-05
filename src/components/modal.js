import React from 'react';
import { Button } from 'flowbite-react';
import { styled, css } from '@mui/system';
import { Paper } from '@mui/material/Paper';

//import { makeStyles } from '@mui/material/styles';


const useStyles = styled((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: theme.shadows[15], // Setting the elevation (box shadow)

    }
  }));


const Modal = ({isVisible, onClose, children}) => {
    //const classes = useStyles();
    
    if(!isVisible) return null;

    return(
        <div className='fixed inset-0 bg-black overflow-y-auto bg-opacity-25 backdrop-blur-sm flex justify-center shadow-lg z-10 items-center transition-opacity duration-700'>
            <div className='md:w-[500px] md:w-[50%] mx-auto text-white bg-dark-night p-2 rounded flex flex-col transition-opacity duration-600'>
                <Button className= 'text-white place-self-end' color="gray" onClick ={()=>onClose()}>X</Button>
                {children}
            </div>
        </div>
    )

}

export default Modal;
