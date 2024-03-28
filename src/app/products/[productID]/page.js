"use client"; 
import { Button, Tabs} from "flowbite-react";
import {database} from '../../firebaseConfig';
import { ref, get } from "firebase/database";
import { useEffect, useState } from 'react';

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
    
                    <div className=" back-prod ">    
                    
                        <div className="grid grid-cols-2 gap-20 pt-20 mr-20 ml-20" >
                            <div>
                                <div className="card grid grid-rows-2 flex-wrap mt-16" style={{ gridTemplateRows: '1fr 3fr'}} >
                                        <div className="banner-game pt-5 pb-5">
                                            <p className="text-center text-lg dark:text-white self-center text-white font-mono m-auto" >PLAYSTATION VERSION</p>
                                        </div>
                                        <div className="prod-img ">
                                            <img src={product.images[0]} alt="Image" className=" object-contain rounded-lg" />
                                        </div>
                                </div>
                            </div>
                            <div className="flex-1" style={{ flex: 'wrap', alignItems:"right"}}>
                                <h1 className="text-center text-2xl dark:text-white self-center text-white font-mono">{product.name}</h1>
                                <h2 className="text-left text-xl font-bold dark:text-white self-center text-white font-mono" > £{product.price} </h2>
                                <div className="relative overflow-x-auto">
                                    <table className="game-table dark:text-white self-center text-white font-mono" style={{border:"10px"}}>
                                        <tbody>
                                            <tr>
                                                <th id="release_date" scope="row" className="px-6 py-3 font-medium text-white-900 whitespace-nowrap">
                                                    Release Date
                                                </th>
                                                <td className="px-6 py-3">
                                                    {product.releaseDate}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row" className="px-6 py-3 font-medium text-white-900 whitespace-nowrap">
                                                    Developer
                                                </th>
                                                <td className="px-6 py-3">
                                                    {product.developer}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row" className="px-6 py-3 font-medium text-white-900 whitespace-nowrap">
                                                    Publisher
                                                </th>
                                                <td className="px-6 py-3">
                                                    {product.publisher}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row" className="px-6 py-3 font-medium text-white-900 whitespace-nowrap">
                                                    Delivery
                                                </th>
                                                <td className="px-6 py-3">
                                                    {product.delivery}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row" className="px-6 py-3 font-medium text-white-900 whitespace-nowrap dark:text-white">
                                                    Platform
                                                </th>
                                                <td className="px-6 py-3">
                                                    {product.platform}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row" className="px-6 py-3 font-medium text-white-900 whitespace-nowrap dark:text-white">
                                                    Console
                                                </th>
                                                <td className="px-6 py-3">
                                                    {product.console}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row" className="px-6 py-3 font-medium text-white-900 whitespace-nowrap dark:text-white">
                                                    Language
                                                </th>
                                                <td className="px-6 py-3">
                                                    {product.language}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row" className="px-6 py-3 font-medium text-white-900 whitespace-nowrap dark:text-white">
                                                    PG
                                                </th>
                                                <td className="px-6 py-3">
                                                    {product.ageRestriction}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="row" className="px-6 py-3 font-medium text-white-900 whitespace-nowrap dark:text-white">
                                                    Genre
                                                </th>
                                                <td className="px-6 py-3">
                                                    {product.genre}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <button className='prod_btn w-52 rounded-lg' hoverClassName='c50edd'>
                                    ADD TO CART
                                    </button>
                                </div>
                            </div>   
                        </div>
                        <div className="flex pl-20 pr-20 pb-20 my-20 gap-2 " >
                            <div className="p-5 ">
                
                                <div className="tabs">
                                    <input className="input" name="tabs" type="radio" id="tab-1" checked={activeTab ==='tab-1'} onChange={() => handleTabChange('tab-1')} />
                                    <label className="label text-center text-xl dark:text-white self-center text-white font-mono" for="tab-1">ABOUT THE GAME</label>
                                    <div className="panel text-lg dark:text-white text-white font-mono" style={{ height: '300px', width:'900px', overflowY: 'auto' }} >
                                        <p>{product.description}</p>
                                    </div>
                                    <input className="input" name="tabs" type="radio" id="tab-2" checked={activeTab ==='tab-2'} onChange={() => handleTabChange('tab-2')}/>
                                    <label className="label text-center text-xl dark:text-white self-center text-white font-mono" for="tab-2">SPECIFICATIONS</label>
                                    <div className="panel text-lg dark:text-white text-white font-mono" style={{ height: '300px',width:'900px', overflowY: 'auto' }}>
                                        <p>{product.specifications}</p>
                                    </div>
                                    <input className="input" name="tabs" type="radio" id="tab-3"checked={activeTab ==='tab-3'} onChange={() => handleTabChange('tab-3')}/>
                                    <label className="label text-center text-xl dark:text-white self-center text-white font-mono" for="tab-3" >REVIEWS</label>
                                    <div className="panel text-lg dark:text-white text-white font-mono" style={{ height: '300px',width:'900px', overflowY: 'auto' }}>
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
                
                ) : (
                <div>
                    <p>Prod not found</p>
                </div>
                )}
            </div>
   
          );
}