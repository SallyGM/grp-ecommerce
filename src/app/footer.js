{/* Importing Link for navigation and icons */}
import Link from 'next/link'
import Image from 'next/image'
import amexIcon from './images/amexIcon.png';
import masterCardIcon from './images/mastercardIcon.png';
import visaIcon from './images/visaIcon.png';

export default function Footer() {
  return (
    <div className="grid grid-rows-3 grid-cols-5 gap-1 text-xs mx-3 mt-2">

      <div>
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

      <div className='row-span-2'>
        <b>WE ACCEPT:</b><br/>
        <Image
          src={visaIcon}
          height={40}
          width={40}
          alt="visa card"
        />
        <Image
          src={amexIcon}
          height={40}
          width={40}
          alt="amex"
        />
        <Image
          src={masterCardIcon}
          height={40}
          width={40}
          alt="master card"
        />
      </div>

      <div className='col-span-4'>
        <hr class="h-px my-8 bg-slate-600 border-0 dark:bg-gray-700"/>
      </div>

      <div className='col-span-5 text-center'>
        <b>FOLLOW US: </b>
      </div>

    </div>
  );
}