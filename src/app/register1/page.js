import Link from 'next/link'
import { Card, Button } from 'flowbite-react';


export default function Home() {
  return (

    <div className='grid grid-rows-1 grid-cols-1 p-8 flex justify-content-center bg-dark-night'>

      {/*Status bar */}
      <div className="justify-self-center w-full py-6">
        <div className="flex">
          <div className="w-1/4">
            <div className="relative mb-2">
              <div className="w-10 h-10 mx-auto bg-green-500 rounded-full text-lg text-white flex items-center">
                <span className="text-center text-white w-full">
                  <svg className="w-full fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="text-xs text-white font-mono text-center md:text-base">Personal Information</div>
          </div>

          <div className="w-1/4">
            <div className="relative mb-2">
              <div className="absolute flex align-center items-center align-middle content-center" style={{ width: 'calc(100% - 2.5rem - 1rem)', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                  <div className="w-0  py-1 bg-green-300 rounded" style={{ width: '50%' }}></div>{/*bg-green-300 */}
                </div>
              </div>

              <div className="w-10 h-10 mx-auto bg-white rounded-full text-lg text-white flex items-center">{/*bg-green-300 */}
                <span className="text-center text-gray-600 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>

                </span>
              </div>
            </div>

            <div className="text-xs text-white font-mono text-center md:text-base">Address Details</div>
          </div>

          <div className="w-1/4">
            <div className="relative mb-2">
              <div className="absolute flex align-center items-center align-middle content-center" style={{ width: 'calc(100% - 2.5rem - 1rem)', top: '50%', transform: 'translate(-50%, -50%)' }}>
                <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                  <div className="w-0 py-1  rounded" style={{width: '33%'}}></div>{/*bg-green-300  */}
                </div>
              </div>

          <div className="w-10 h-10 mx-auto bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center">
            <span className="text-center text-gray-600 w-full">
              <svg className="w-full fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="24" height="24">
                <path className="heroicon-ui" d="M14 3a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4a1 1 0 011-1h12zM2 2a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H2z"/>
                <path className="heroicon-ui" d="M2 5.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-1zm0 3a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zm0 2a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zm3 0a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zm3 0a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5zm3 0a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5z" />
              </svg>
            </span>
          </div>
        </div>

        <div className="text-xs text-white font-mono text-center md:text-base">Card Details</div>
      </div>
    </div>
    </div>

      
      {/*Sign in information card*/}
      <Card className="justify-self-center h-auto w-4/5 my-6 bg-blue-900 border-blue-900">
        
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white self-center text-white font-mono">SIGN-IN INFORMATION</h1>
        <br/>

        <form className="grid grid-rows-3 grid-cols-2 gap-6 display: flex text-white font-mono">

          <div>
            <label for="firstName">First Name</label>
            <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="text" id="firstName"  name="firstName" required></input>
          </div>
          
          <div>
            <label for="lastName">Last Name</label>
            <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="text" id="lastName"  name="lastName" required></input>
          </div>

          <div>
            <label for="email">Email</label>
            <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="email" id="email" name="email" required></input>
          </div>

          <div>
            <label for="confirmEmail">Confirm email</label>
            <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="email" id="confirmEmail" name="confirmEmail" required></input>
          </div>

          <div>
            <label for="password">Password</label>
            <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="password" id="password" name="password" required></input>
          </div>          

          <div>
            <label for="confirmPassword">Confirm Password</label>
            <input className="block w-full rounded-md py-1.5 px-1.5 border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            type="password" id="confirmPassword" name="confirmPassword" required></input>            
          </div>

          <Button className="w-4/12 inline-flex col-span-2 justify-self-center mt-6" color='success' type="submit">
          <Link href="/register2">NEXT</Link>
          </Button>

          <Button href='/register2'>NEXT(temp)</Button>
        </form>
      </Card>

    </div>
  )}