export default function Header() {
    return (
        <div>
            <nav class="bg-white border-gray-200 dark:bg-gray-900">
                <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
                    <a href="https://flowbite.com" class="flex items-center space-x-3 rtl:space-x-reverse">
                        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Logo</span>
                    </a>
                    <div class="relative hidden md:block">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                            <span class="sr-only">Search icon</span>
                        </div>
                        <input type="text" id="search-navbar" class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..."/>
                    </div>
                    <div class="flex items-center space-x-6 rtl:space-x-reverse">
                        <a href="#" class="text-sm  text-blue-600 dark:text-blue-500 hover:underline">Login</a>
                    </div>
                </div>
            </nav>
            <nav class="bg-gray-50 dark:bg-gray-700">
                <div class="max-w-screen-xl px-4 py-3 mx-auto">
                    <div class="flex justify-center items-center">
                        <ul class="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
                            <li>
                                <a href="#" class="text-gray-900 dark:text-white hover:underline" aria-current="page">Home</a>
                            </li>
                            <li>
                                <a href="#" class="text-gray-900 dark:text-white hover:underline">PC</a>
                            </li>
                            <li>
                                <a href="#" class="text-gray-900 dark:text-white hover:underline">XBOX</a>
                            </li>
                            <li>
                                <a href="#" class="text-gray-900 dark:text-white hover:underline">Playstation</a>
                            </li>
                            <li>
                                <a href="#" class="text-gray-900 dark:text-white hover:underline">Best Sellers</a>
                            </li>
                            <li>
                                <a href="#" class="text-gray-900 dark:text-white hover:underline">SALES</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>   
    );
  }