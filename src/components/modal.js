import React from 'react';
import { Button } from 'flowbite-react';





const Modal = ({isVisible, onClose, children}) => {
    //const classes = useStyles();
    
    if(!isVisible) return null;

    return(
        <div className='fixed inset-0 bg-black overflow-y-auto bg-opacity-5 backdrop-blur-sm flex justify-center shadow-lg z-10 items-center transition-opacity duration-700'>
            <div className='md:w-[500px] md:w-[50%] mx-auto text-white p-2 rounded flex flex-col transition-opacity duration-700' style={{background: '#512DA8', border : '#512DA8'}}>
                <Button className= 'text-white place-self-end' color="gray" onClick ={()=>onClose()}>X</Button>
                {children}
            </div>
        </div>
    )

}

export default Modal;
