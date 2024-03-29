import React from 'react';
import { Button } from 'flowbite-react';


const Modal = ({isVisible, onClose, children}) => {
    
    if(!isVisible) return null;

    return(
        <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
            <div className='md:w-[500px] md:w-[50%] mx-auto text-white bg-dark-night p-2 rounded flex flex-col'>
                <Button className= 'text-white place-self-end' color="gray" onClick ={()=>onClose()}>X</Button>
                {children}
            </div>
        </div>
    )

}

export default Modal;
