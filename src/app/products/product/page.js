"use client"; 
import { Button, Tabs} from "flowbite-react";
import React, { useState } from 'react';

export default function Home() {

    const [showSpecifications, setShowSpecifications] = useState(false);

    const toggleSpecifications = () => {
        setShowSpecifications(!showSpecifications);
    };

    
  return (
    <div className=" bg-blue-800">    
        <div className="pl-20 pr-20 pt-20 flex flex-wrap gap-20" >
            <div className="flex-1" style={{ width: '500px', height: '385px', display:"flex", marginTop:"10px" }}>
                <div className="card" style={{ background: 'url("https://flowbite.com/docs/images/carousel/carousel-1.svg")', backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', height: '100%' }} >
                    <div className="flex-wrap w-full">
                        <div className="banner-game">
                            <p className="text-center m-auto" style={{fontSize: '12px', margin:"auto" }}>PLAYSTATION VERSION</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1" style={{  flex: 'wrap', alignItems:"right"}}>
                <h1 className="text-center text-2xl dark:text-white self-center text-white font-mono">Game Title</h1>
                <h2 className="text-left text-xl font-bold dark:text-white self-center text-white font-mono" > £69.99 </h2>
                <div className="relative overflow-x-auto">
                    <table className="game-table dark:text-white self-center text-white font-mono" style={{border:"10px"}}>
                        <tbody>
                            <tr>
                                <th scope="row" className="px-6 py-3 font-medium text-white-900 whitespace-nowrap">
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
        <div className="flex pl-20 pr-20 pb-20 my-20 gap-2 bg-black" >
            <div className="p-10">
                <Tabs aria-label="Pills" theme='fullWidth'style="fullWidth">
                    <Tabs.Item active title="About The Game" style={{background:"#020a4f"}}>
                        <p className="text-sm text-white dark:text-white">"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
                        totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
                        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                         Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. 
                         Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? 
                        Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"</p>
                    </Tabs.Item>
                    <Tabs.Item title="Specifications">
                        <p className="text-sm text-white dark:text-white">""At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident,
                         similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore,
                          cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. 
                         Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
                         Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.""</p>
                    </Tabs.Item>
                    <Tabs.Item title="Reviews">
                        <p className="text-sm text-white dark:text-white">"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
                        totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
                        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                         Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. 
                         Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? 
                        Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"</p>
                    </Tabs.Item>
     
            </Tabs>
            </div>
            
        </div>
    </div>

    
  );
}