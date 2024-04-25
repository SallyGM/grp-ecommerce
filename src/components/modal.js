import React from 'react';
import { Button } from 'flowbite-react';





const Modal = ({isVisible, onClose, children}) => {
    //const classes = useStyles();
    
    if(!isVisible) return null;

    return(
        <div className='z-50 fixed inset-0 bg-black overflow-y-auto bg-opacity-5 backdrop-blur-sm flex justify-center z-10 items-center transition-opacity duration-700'>
            <div className='w-full md:max-w-[500px] md:w-[50%] mx-auto text-white p-2 rounded flex flex-col transition-opacity duration-700 bg-modalbBackground'>
                {/* Close Button */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" onClick ={()=>onClose()} className="place-self-end transition cursor-pointer text-white w-6 h-6 hover:scale-110">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                {children}
            </div>
        </div>

    )

}

export default Modal;
