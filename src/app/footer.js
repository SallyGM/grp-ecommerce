{/* Importing Link for navigation and icons */}
import Link from 'next/link';
import Image from 'next/image';
import amexIcon from '../../public/amexIcon.png';
import masterCardIcon from '../../public/mastercardIcon.png';
import visaIcon from '../../public/visaIcon.png';

export default function Footer() {
  return (
    <div className='bg-dark-night py-2'>
      <hr className='h-px mx-3 bg-slate-600 border-0 dark:bg-gray-700'/>
      <div className="grid grid-rows-3 grid-cols-5 gap-1 text-xs px-3 pt-5 text-white">

        <div className='mx-3'>
          <b>MY ACCOUNT</b> <br/>
          <Link href="/">
            MY ACCOUNT
          </Link> <br/>
          <Link href="/">
            MY ORDERS
          </Link>
        </div>
        <div>
          <b>CUSTOMER SERVICE</b><br/>
          HELP DESK<br/>
          FAQ
        </div>
        <div className='col-span-2'>
          <b>CONTACT US</b><br/>
          SUPPORT@GAMEBUSTER.COM
        </div>

        <div className='row-span-2 text-center mx-auto'>
          <b>WE ACCEPT:</b><br/><br/>
          <img
            src={visaIcon.src}
            className='w-8 h-4 mx-auto'
            alt="visa card"
          /><br/>
          <img
            src={amexIcon.src}
            className='w-9 h-5 mx-auto'
            alt="amex"
          /><br/>
          <img
            src={masterCardIcon.src}
            className='w-10 h-7 mx-auto'
            alt="master card"
          />
        </div>

        <div className='col-span-4'>
          <hr className="h-px my-8 bg-slate-600 border-0 dark:bg-gray-700"/>
        </div>

        <div className='col-span-5 text-center'>
          <b>FOLLOW US: </b>
        </div>
      </div>
    </div>
  );
}