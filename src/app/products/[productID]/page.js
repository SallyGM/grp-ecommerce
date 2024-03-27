"use client"; 
import { Button, Tabs} from "flowbite-react";
import {database} from '../../firebaseConfig';
import { ref, get } from "firebase/database";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';


/*Product Page*/

export default function Page({ params }) {
    const [activeTab, setActiveTab] = useState('tab-1');

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    }

 
    const [product, setProduct] = useState(false);

  
    const prodRef = ref(database, "Product");
    
    useEffect(() => {  
   
    get(prodRef).then((snapshot) => {
        if (snapshot.exists()) {
            let productArray = snapshot.child(params.productID).val();
            productArray.id = params.productID;
            setProduct(productArray);
        } else {
            console.log("No data found");
            setProduct(false);
        }
    }).catch((error) => {
        console.error(error);
        setProduct(false);
    });


    }, []);


    return (
        <div>

       
            
        {product ? (
                
            <div>
 
                <div className=" bg-blue-800">    
                
                    <div className="pl-20 pr-20 pt-20 flex flex-wrap gap-20" >
                        <div className="flex-1" style={{ width: '500px', height: '385px', display:"flex", marginTop:"10px" }}>
                            <div className="card" style={{ background: 'url("https://flowbite.com/docs/images/carousel/carousel-1.svg")', backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', height: '100%' }} >
                                <div className="flex-wrap w-full">
                                    <div className="banner-game">
                                        <p className="text-center text-lg dark:text-white self-center text-white font-mono m-auto" >PLAYSTATION VERSION</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1" style={{  flex: 'wrap', alignItems:"right"}}>
                            <h1 className="text-center text-2xl dark:text-white self-center text-white font-mono">{product.name}</h1>
                            <h2 className="text-left text-xl font-bold dark:text-white self-center text-white font-mono" > £69.99 </h2>
                            <div className="relative overflow-x-auto">
                                <table className="game-table dark:text-white self-center text-white font-mono" style={{border:"10px"}}>
                                    <tbody>
                                        <tr>
                                            <th id="release_date" scope="row" className="px-6 py-3 font-medium text-white-900 whitespace-nowrap">
                                                Release Date
                                            </th>
                                            <td className="px-6 py-3">
                                                1/01/2024
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="px-6 py-3 font-medium text-white-900 whitespace-nowrap">
                                                Developer
                                            </th>
                                            <td className="px-6 py-3">
                                                AAAAAA
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="px-6 py-3 font-medium text-white-900 whitespace-nowrap">
                                                Publisher
                                            </th>
                                            <td className="px-6 py-3">
                                                AAAAAAA
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="px-6 py-3 font-medium text-white-900 whitespace-nowrap">
                                                Delivery
                                            </th>
                                            <td className="px-6 py-3">
                                                Instant Delivery
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="px-6 py-3 font-medium text-white-900 whitespace-nowrap dark:text-white">
                                                Platform
                                            </th>
                                            <td className="px-6 py-3">
                                                AAAA
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row" className="px-6 py-3 font-medium text-white-900 whitespace-nowrap dark:text-white">
                                                Language
                                            </th>
                                            <td className="px-6 py-3">
                                                English
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <Button className='prod_btn w-52 bg-green-400'>
                                ADD TO CART
                                </Button>
                            </div>
                        </div>   
                    </div>
                    <div className="flex pl-20 pr-20 pb-20 my-20 gap-2 " >
                        <div className="p-5 ">
            
                            <div class="tabs">
                                <input class="input" name="tabs" type="radio" id="tab-1" checked={activeTab ==='tab-1'} onChange={() => handleTabChange('tab-1')} />
                                <label class="label text-center text-xl dark:text-white self-center text-white font-mono" for="tab-1">ABOUT THE GAME</label>
                                <div class="panel text-lg dark:text-white text-white font-mono" >
                                    <p>Mauris ultrices eros in cursus turpis. Ut pharetra sit amet aliquam id diam maecenas. <br/>
                                    Praesent semper feugiat nibh sed pulvinar proin gravida hendrerit. Quisque non tellus orci ac auctor augue mauris augue neque. Nisl tincidunt eget nullam non. <br/>
                                    Sed cras ornare arcu dui vivamus arcu felis bibendum ut. 
                                    Amet luctus venenatis lectus magna fringilla urna porttitor rhoncus. Sem integer vitae justo eget magna. <br/>
                                    Blandit cursus risus at ultrices mi. Consectetur adipiscing elit ut aliquam purus sit.</p>
                                </div>
                                <input class="input" name="tabs" type="radio" id="tab-2" checked={activeTab ==='tab-2'} onChange={() => handleTabChange('tab-2')}/>
                                <label class="label text-center text-xl dark:text-white self-center text-white font-mono" for="tab-2">SPECIFICATIONS</label>
                                <div class="panel text-lg dark:text-white text-white font-mono">
                                    <p>ILorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu augue ut lectus arcu bibendum at.<br/>
                                        Sed blandit libero volutpat sed cras. Et malesuada fames ac turpis. Lectus vestibulum mattis ullamcorper velit sed ullamcorper. <br/>
                                        Facilisis volutpat est velit egestas dui id. Non sodales neque sodales ut etiam sit amet nisl purus. A cras semper auctor neque vitae. <br/>
                                        Vulputate dignissim suspendisse in est ante in nibh mauris cursus. Quam nulla porttitor massa id neque aliquam vestibulum morbi. Purus gravida quis blandit turpis cursus in hac habitasse platea.<br/>
                                        Viverra nibh cras pulvinar mattis nunc sed blandit libero. Viverra vitae congue eu consequat. <br/>
                                        Aliquet risus feugiat in ante metus dictum. Ultrices in iaculis nunc sed augue lacus viverra vitae. Quis viverra nibh cras pulvinar mattis nunc sed blandit.</p>
                                </div>
                                <input class="input" name="tabs" type="radio" id="tab-3"checked={activeTab ==='tab-3'} onChange={() => handleTabChange('tab-3')}/>
                                <label class="label text-center text-xl dark:text-white self-center text-white font-mono" for="tab-3">REVIEWS</label>
                                <div class="panel text-lg dark:text-white text-white font-mono">
                                    <p>Eu consequat ac felis donec et. Magna etiam tempor orci eu lobortis elementum nibh tellus molestie. Mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus et. <br/>
                                    Augue ut lectus arcu bibendum at varius vel. Enim blandit volutpat maecenas volutpat blandit aliquam etiam erat velit. Habitasse platea dictumst quisque sagittis purus.<br/>
                                    Sed elementum tempus egestas sed. Maecenas pharetra convallis posuere morbi leo urna molestie at elementum. Imperdiet proin fermentum leo vel orci porta non pulvinar. <br/>
                                    Adipiscing diam donec adipiscing tristique risus. Quisque id diam vel quam elementum pulvinar etiam. <br/>
                                    Parturient montes nascetur ridiculus mus mauris vitae. Ultrices tincidunt arcu non sodales.</p>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                
                </div>
            
             </div>
             
             ) :
             (<div>
                <p>Prod not found</p>
              </div>)

            }
            </div>


            
          );
          
  
  
}