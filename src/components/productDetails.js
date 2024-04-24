"use client"
import {database} from '../app/firebaseConfig';
import { ref, get } from "firebase/database";
import { useEffect, useState } from 'react';
import { useBasketContext } from "../app/context/BasketContext";
import toast from 'react-hot-toast';
import StarRating from '../app/starRating.js';
import { useProductContext } from '../app/context/ProductContext';

/*Product Page*/

export default function Page({ productIDParam }) {
    const productID = productIDParam;
    const [activeTab, setActiveTab] = useState('tab-1');

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    }

    const { addToBasket } = useBasketContext();
    const [review, setReview] = useState([]);

    const [numReviews, setNumReviews] = useState(0);
    const [averageReviews, setAverageReviews] = useState(0);
    const { loading, products } = useProductContext();
    const [product, setProduct] = useState(false);
   
    useEffect(() => {
        if (!loading && productIDParam !== undefined) {
          const foundProduct = products.find(prod => prod.id === productID);
          if (foundProduct) {
              setProduct(foundProduct);
          } else {
              setProduct(null);
          }
        }
    }, [loading, products, productID]);

  
    //Retrieves reviews from database
    useEffect(() => {
        const prodRef = ref(database, "Reviews");
       
        get(prodRef).then((snapshot) => {
            if (snapshot.exists()) {
                const reviews = [];
                let total = 0; // Initialize total outside the loop
                snapshot.forEach((childSnapshot) => {
                    const reviewData = childSnapshot.val();
                    if (reviewData.productID === productID) {
                        const review = { ...reviewData, id: childSnapshot.key };
                        reviews.push(review);
                        total += review.rating; // Add the rating to the total
                    }
                });
                setReview(reviews);
                setNumReviews(reviews.length);
                if (reviews.length > 0) {
                    const averageRating = total / reviews.length;
                    setAverageReviews(averageRating);
                } else {
                    setAverageReviews(0); // Set average to 0 if there are no reviews
                }
            } else {
                console.log("No reviews found.");
                setReview([]);
                setNumReviews(0);
                setAverageReviews(0); // Set average to 0 if there are no reviews
            }
        }).catch((error) => {
            console.error(error);
            setReview([]);
            setNumReviews(0);
            setAverageReviews(0); // Set average to 0 if there's an error
        });
    }, []);

    function handleClickAddToCart(productID, e){
        addToBasket(productID, 1);
        toast.success('Product added to basket!');
      }
    
    
    return (
        <div>
            {product ? (
            <div>
                <div className="bg-blue-gradient pb-1">  
                    <div className="flex-row pt-10" >
                        <div className="flex flex-col gap-20 mr-20 ml-20 w-auto h-auto mb-5" >
                        <div className='w-full text-center'>
                            <h1 className="  bebas-neue-regular ">{product.name}</h1>
                        </div>

                        </div> 
                        <div className="flex flex-col md:flex-row gap-20 mr-20 ml-20" >
                            <div className='md:w-1/2 w-full'>
                                <div className="card grid grid-rows-2 flex-wrap mt-16" style={{ gridTemplateRows: '1fr 3fr'}} >
                                        <div className="banner-game pt-5 pb-5">
                                        <p className="text-center text-lg dark:text-white self-center text-white roboto-light m-auto" >{product.console} VERSION</p>
                                        </div>
                                        <div className="prod-img ">
                                            <img src={product.images[0]} alt="Image" className=" object-contain rounded-lg" />
                                        </div>
                                </div>
                            </div>
                            <div className='md:w-1/2 w-full '>
                                <div className="flex-wrap mt-2" style={{ flex: 'wrap', alignItems:"right"}}>
                                    <div className="flex flex-row justify-between">
                                    {product.discount > 0 && (
                                            <div>
                                            <h2 className="text-left roboto-lightLarge  dark:text-white self-center text-white " >
                                                Price:&nbsp;
                                                <span style={{ textDecoration: "line-through" }}>
                                                £{product.price.toFixed(2)}
                                                </span>{" "}
                                                £{(product.price - (product.price * product.discount)).toFixed(2)}
                                            </h2>
                                            </div>
                                        )}
                                        {product.discount === 0 && (
                                            <h2 className="text-left roboto-lightLarge  dark:text-white self-center text-white " >Price: £{product.price.toFixed(2)}</h2>
                                        )}
                                        <div>
                                            <h2 className="text-right flex flex-row roboto-lightLarge text-white">{averageReviews.toFixed(2)}&nbsp;<StarRating rating={averageReviews}></StarRating>&nbsp;({numReviews})</h2>

                                        </div>

                                    </div>    

                                
                                    <div className=" mt-5 ">
                                        <table className="game-table dark:text-white self-center text-white overflow-x-scroll no-scrollbar" >
                                            <tbody>
                                                <tr className="row-1-gt">
                                                    <th scope="row" className="px-6 py-3 ">
                                                        Release Date
                                                    </th>
                                                    <td className="px-6 py-3 ">
                                                        {product.releaseDate}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row" className="px-6 py-3 ">
                                                        Developer
                                                    </th>
                                                    <td className="px-6 py-3">
                                                        {product.developer}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row" className="px-6 py-3 ">
                                                        Publisher
                                                    </th>
                                                    <td className="px-6 py-3">
                                                        {product.publisher}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row" className="px-6 py-3 ">
                                                        Delivery
                                                    </th>
                                                    <td className="px-6 py-3">
                                                        {product.delivery}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row" className="px-6 py-3 ">
                                                        Platform
                                                    </th>
                                                    <td className="px-6 py-3">
                                                        {product.platform}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row" className="px-6 py-3 ">
                                                        Console
                                                    </th>
                                                    <td className="px-6 py-3">
                                                        {product.console}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row" className="px-6 py-3 f">
                                                        Language
                                                    </th>
                                                    <td className="px-6 py-3">
                                                        {product.language}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row" className="px-6 py-3 ">
                                                        PG
                                                    </th>
                                                    <td className="px-6 py-3">
                                                        {product.ageRestriction}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row" className="px-6 py-3 ">
                                                        Genre
                                                    </th>
                                                    <td className="px-6 py-3">
                                                        {product.genre}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <button className='prod_btn w-full  rounded-lg roboto-light' hoverClassName='c50edd' onClick={(e) => handleClickAddToCart(product.id, product.amount, e)}>
                                        ADD TO CART
                                        </button>
                                    </div>
                                </div>    
                            </div>   
                        </div>
                        <div className="flex w-full md:w-11/12 gap-2 my-5 mx-5 md:my-20 md:mx-20" >
                            <div className="">
            
                                <div className="tabs w-11/12">
                                    <input className="input" name="tabs" type="radio" id="tab-1" checked={activeTab ==='tab-1'} onChange={() => handleTabChange('tab-1')} />
                                    <label className="label rounded-md text-center text-xl self-center mx-2 text-white w-11/12 md:mr-5 md:ml-0" for="tab-1">ABOUT THE GAME</label>
                                    <div className="panel text-lg dark:text-white text-white shadow-2xl h-64 ml-2 md:ml-0 w-11/12 md:w-10/12" style={{ overflowY: 'auto' }} >
                                        <p>{product.description}</p>
                                    </div>

                                    <input className="input" name="tabs" type="radio" id="tab-2" checked={activeTab ==='tab-2'} onChange={() => handleTabChange('tab-2')}/>
                                    <label className="label text-center text-xl dark:text-white self-center w-11/12 text-white mx-2 md:mr-5 md:ml-0" for="tab-2">SPECIFICATIONS</label>
                                    <div className="panel text-lg dark:text-white text-white shadow-2xl h-64 ml-2 md:ml-0 w-11/12 md:w-10/12" style={{ overflowY: 'auto' }}>
                                        <p>{product.specifications}</p>
                                    </div>

                                    <input className="input" name="tabs" type="radio" id="tab-3"checked={activeTab ==='tab-3'} onChange={() => handleTabChange('tab-3')}/>
                                    <label className="label text-center text-xl dark:text-white self-center w-11/12 text-white mx-2 md:mr-5 md:ml-0" for="tab-3" >REVIEWS ({numReviews})</label>
                                    <div className="panel text-lg -webkit-scrollbar dark:text-white text-white h-64  ml-2 md:ml-0 shadow-2xl w-11/12 md:w-10/12" style={{ overflowY: 'auto' }}>
                                    
                                        {/* Map reviews to card, each review it's placed in one div insidethe card*/}

                                        <div className="review-card bg-transparent mb-10"  >
                                            {review.map((review) => (
                                                <div className="mb-16" key={review.id} >
                                            
                                                    <StarRating rating={review.rating}></StarRating>
                                                    <div className="grid grid-cols-2 flex-wrap roboto-light">
                                                        <p className=" flex justify-start">Reviewed by {review.userName}</p>
                                                        <p className=" flex justify-end">{review.date}</p>
                                                    </div>
                                                    <hr className="border-t border-white w-full my-auto" />
                                                    <div className="grid grid-rows-2 flex-wrap">
                                                        <p className="flex-wrap roboto-bold ">{review.title}</p>
                                                        <p className="mb-0 roboto-light">"{review.comment}"</p>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                        </div>                                    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                        
                </div>
            </div>
            ) : (
            <div>
                <p>Product not found</p>
            </div>
            )}
        </div>
        
    );
}