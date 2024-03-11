import { Carousel } from 'flowbite-react';
import { Card, Button } from 'flowbite-react';
import { BeakerIcon } from '@heroicons/react/24/solid'
import Image from 'next/image';
import amexIcon from './images/amexIcon.png';

export default function Home() {

  return (
    <div>
      {/*Insert costumised banner over here*/}
      <Carousel slide={true} className="h-56 sm:h-64 xl:h-80 2xl:h-96">
        <img src="https://flowbite.com/docs/images/carousel/carousel-1.svg" alt="..." />
        <img src="https://flowbite.com/docs/images/carousel/carousel-2.svg" alt="..." />
        <img src="https://flowbite.com/docs/images/carousel/carousel-3.svg" alt="..." />
        <img src="https://flowbite.com/docs/images/carousel/carousel-4.svg" alt="..." />
        <img src="https://flowbite.com/docs/images/carousel/carousel-5.svg" alt="..." />
      </Carousel>

      <div className='grid grid-rows-1 grid-cols-5'> 
        <h5 className="text-2xl text-center ml-3 mr-0 my-3 font-bold tracking-tight text-gray-900 dark:text-white">
          Check our best sellers
        </h5>
        <hr className="h-px col-span-4 mr-1 my-8 bg-slate-500 border-0 dark:bg-gray-700"/>
      </div>

      <div className='grid grid-rows-1 grid-cols-5'> 
        <Card className="max-w-sm mx-3" renderImage={() => <Image className="mx-auto" width={50} height={50} src={amexIcon} alt="image 1"  />}>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            GAME_NAME1
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            £0.00
          </p>
          <Button.Group>
            <Button color="gray">View product</Button>
            <Button color="gray">
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M5 3a1 1 0 0 0 0 2h.7l2.1 10.2a3 3 0 1 0 4 1.8h2.4a3 3 0 1 0 2.8-2H9.8l-.2-1h8.2a1 1 0 0 0 1-.8l1.2-6A1 1 0 0 0 19 6h-2.3c.2.3.3.6.3 1a2 2 0 0 1-2 2 2 2 0 1 1-4 0 2 2 0 0 1-1.7-3H7.9l-.4-2.2a1 1 0 0 0-1-.8H5Z" clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M14 5a1 1 0 1 0-2 0v1h-1a1 1 0 1 0 0 2h1v1a1 1 0 1 0 2 0V8h1a1 1 0 1 0 0-2h-1V5Z" clip-rule="evenodd"/>
              </svg>
            </Button>
          </Button.Group>
        </Card>

        <Card className="max-w-sm mx-3" renderImage={() => <Image className="mx-auto" width={50} height={50} src={amexIcon} alt="image 1"  />}>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            GAME_NAME2
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            £0.00
          </p>
          <Button.Group>
            <Button color="gray">View product</Button>
            <Button color="gray">
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M5 3a1 1 0 0 0 0 2h.7l2.1 10.2a3 3 0 1 0 4 1.8h2.4a3 3 0 1 0 2.8-2H9.8l-.2-1h8.2a1 1 0 0 0 1-.8l1.2-6A1 1 0 0 0 19 6h-2.3c.2.3.3.6.3 1a2 2 0 0 1-2 2 2 2 0 1 1-4 0 2 2 0 0 1-1.7-3H7.9l-.4-2.2a1 1 0 0 0-1-.8H5Z" clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M14 5a1 1 0 1 0-2 0v1h-1a1 1 0 1 0 0 2h1v1a1 1 0 1 0 2 0V8h1a1 1 0 1 0 0-2h-1V5Z" clip-rule="evenodd"/>
              </svg>
            </Button>
          </Button.Group>
        </Card>

        <Card className="max-w-sm mx-3" renderImage={() => <Image className="mx-auto" width={50} height={50} src={amexIcon} alt="image 1"  />}>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            GAME_NAME3
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            £0.00
          </p>
          <Button.Group>
            <Button color="gray">View product</Button>
            <Button color="gray">
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M5 3a1 1 0 0 0 0 2h.7l2.1 10.2a3 3 0 1 0 4 1.8h2.4a3 3 0 1 0 2.8-2H9.8l-.2-1h8.2a1 1 0 0 0 1-.8l1.2-6A1 1 0 0 0 19 6h-2.3c.2.3.3.6.3 1a2 2 0 0 1-2 2 2 2 0 1 1-4 0 2 2 0 0 1-1.7-3H7.9l-.4-2.2a1 1 0 0 0-1-.8H5Z" clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M14 5a1 1 0 1 0-2 0v1h-1a1 1 0 1 0 0 2h1v1a1 1 0 1 0 2 0V8h1a1 1 0 1 0 0-2h-1V5Z" clip-rule="evenodd"/>
              </svg>
            </Button>
          </Button.Group>
        </Card>

        <Card className="max-w-sm mx-3" renderImage={() => <Image className="mx-auto" width={50} height={50} src={amexIcon} alt="image 1"  />}>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            GAME_NAME4
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            £0.00
          </p>
          <Button.Group>
            <Button color="gray">View product</Button>
            <Button color="gray">
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M5 3a1 1 0 0 0 0 2h.7l2.1 10.2a3 3 0 1 0 4 1.8h2.4a3 3 0 1 0 2.8-2H9.8l-.2-1h8.2a1 1 0 0 0 1-.8l1.2-6A1 1 0 0 0 19 6h-2.3c.2.3.3.6.3 1a2 2 0 0 1-2 2 2 2 0 1 1-4 0 2 2 0 0 1-1.7-3H7.9l-.4-2.2a1 1 0 0 0-1-.8H5Z" clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M14 5a1 1 0 1 0-2 0v1h-1a1 1 0 1 0 0 2h1v1a1 1 0 1 0 2 0V8h1a1 1 0 1 0 0-2h-1V5Z" clip-rule="evenodd"/>
              </svg>
            </Button>
          </Button.Group>
        </Card>

        <Card className="max-w-sm mx-3" renderImage={() => <Image className="mx-auto" width={50} height={50} src={amexIcon} alt="image 1"  />}>
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            GAME_NAME5
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            £0.00
          </p>
          <Button.Group>
            <Button color="gray">View product</Button>
            <Button color="gray">
              <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M5 3a1 1 0 0 0 0 2h.7l2.1 10.2a3 3 0 1 0 4 1.8h2.4a3 3 0 1 0 2.8-2H9.8l-.2-1h8.2a1 1 0 0 0 1-.8l1.2-6A1 1 0 0 0 19 6h-2.3c.2.3.3.6.3 1a2 2 0 0 1-2 2 2 2 0 1 1-4 0 2 2 0 0 1-1.7-3H7.9l-.4-2.2a1 1 0 0 0-1-.8H5Z" clip-rule="evenodd"/>
                <path fill-rule="evenodd" d="M14 5a1 1 0 1 0-2 0v1h-1a1 1 0 1 0 0 2h1v1a1 1 0 1 0 2 0V8h1a1 1 0 1 0 0-2h-1V5Z" clip-rule="evenodd"/>
              </svg>
            </Button>
          </Button.Group>
        </Card>

        <div className='col-span-2'>
          
        </div>

        <Button className='mx-auto mx-4 my-6'>
          See more
        </Button>

        <div className='col-span-2'>
          
        </div>

      </div>
      <br/>
    </div>
  );
}