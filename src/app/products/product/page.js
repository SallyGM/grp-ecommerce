import { Button } from "flowbite-react";

export default function Home() {
  
  return (
    <div>    
        <div className="container m-auto grid grid-cols-2 gap-5" style={{ flexWrap: 'wrap' }}>
            <div className="part1" style={{ width: '500px', height: '385px', display:"flex", marginTop:"10px" }}>
                <div className="card" style={{ background: 'url("https://flowbite.com/docs/images/carousel/carousel-1.svg")', backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', height: '100%' }} >
                    <div className="container">
                        <div className="banner-game">
                            <p style={{ margin: 0, fontSize: '12px' }}>PLAYSTATION VERSION</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="part2" style={{  flex: '1 1 auto' }}>
                <h1 className="text-center"style={{fontSize: "25px"}}>Game Title</h1>
                <h2 className="text-left" style={{fontSize:"22px", fontWeight:"bold"}}> £69.99 </h2>
                <div className="relative overflow-x-auto">
                    <table className="game-table" style={{border:"10px"}}>
                        <tbody>
                            <tr>
                                <th scope="row" className="px-6 py-3 font-medium text-white-900 whitespace-nowrap dark:text-white">
                                    Release Date
                                </th>
                                <td className="px-6 py-3">
                                    1/01/2024
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" className="px-6 py-3 font-medium text-white-900 whitespace-nowrap dark:text-white">
                                    Developer
                                </th>
                                <td className="px-6 py-3">
                                    AAAAAA
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" className="px-6 py-3 font-medium text-white-900 whitespace-nowrap dark:text-white">
                                    Publisher
                                </th>
                                <td className="px-6 py-3">
                                    AAAAAAA
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" className="px-6 py-3 font-medium text-white-900 whitespace-nowrap dark:text-white">
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
                    <Button className='prod_btn'>
                    ADD TO CART
                    </Button>
                </div>
            </div>   
        </div>
        <div className="container m-auto grid grid-rows-1 gap-2" style={{ flexWrap: 'wrap' }}>
            <div className="part2" style={{ width: 'auto', height: 'auto' }}>

                <div className="product data items">
                    <div className="data item title active" id="tab-label-description" >
                        <a className="data switch" tabIndex="-1" data-toggle="trigger" href="#description" id="tab-label-description-title">About The Game</a>
                    </div>
                    <div className="data item title" id="tab-label-screenshots">
                        <a className="data switch" tabIndex="-1" data-toggle="trigger" href="#screenshots" id="tab-label-screenshots-title">Specifications</a>
                    </div>
                    <div className="data item content hidden" aria-labelledby="tab-label-screenshots-title" id="screenshots" data-role="content">
                    </div>
                    <div className="data item title" id="tab-label-reviews">
                        <a className="data switch" tabIndex="-1" data-toggle="trigger" href="#reviews" id="tab-label-reviews-title">Reviews</a>
                    </div>
                    <div className="data item content hidden" aria-labelledby="tab-label-reviews-title" id="reviews" data-role="content">
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}