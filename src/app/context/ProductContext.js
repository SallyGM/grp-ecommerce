"use client"
import React, { useContext, useState, useEffect, useMemo } from "react" 
import { database } from '../firebaseConfig';
import { ref, set, get } from "firebase/database";

const ProductContext = React.createContext();

export function ProductProvider({ children }) {

  const [products, setProducts] = useState([]);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const salesRef = ref(database, "Sales");

    get(salesRef).then((snapshot) => {
      if(snapshot.exists()){
        let salesArray = Object.entries(snapshot.val()).map(([id, data]) => ({
          id, 
          ...data,
        }));

        // filter by date
        
        salesArray = salesArray.filter((s) => {
          var date = s.endDate.split(/\//);
          return new Date(date[1] + "/" + date[0] + "/" + date[2]).getTime() >= new Date().getTime()
        }) 

        setError(false);
        if(salesArray.length != 0){
          setSales(salesArray[0])         
        } else {
          setSales([]) 
        }
      } else{
        setError(true)
      }
    }).catch((error) => {
      setError(true)
    });
  }, [])

  useEffect(() => {
    const prodRef = ref(database, "Product");
    
    get(prodRef).then((snapshot) => {
      if(snapshot.exists()){
        let amount = 0;
        let discount = 0;
        let prodArray = Object.entries(snapshot.val()).map(([id, data]) => ({
          id, amount, discount,
          ...data,
        }));

        setError(false);

        if(Object.keys(sales).length > 0){
          // if there is a sale going on it will add to the database
          prodArray = prodArray.map((p) => {
            if (sales.items[p.id] !== undefined) {
                p.discount = sales.items[p.id];
            } 
            return p;
          });
        } 

        setLoading(false)
        setProducts(prodArray)
        
      } else {
        setError(true)
      }
    }).catch((error) => {
      setError(true)
    });
  }, [sales]); 

  const getBestSellers = () => {
    let result = products.sort((a, b) => a.sold < b.sold ? 1 : -1);
    return result;
  }

  const getProductsOnSale = () => {
    let result = products.filter(p => p.discount > 0);
    return result;  
  }

  const contextValue = useMemo(() => {
    return {
      products,
      displayProducts,
      sales,
      getBestSellers,
      getProductsOnSale, 
      loading
    };
 }, [products, sales]);

   return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
   );
}

export function useProductContext() {
   return useContext(ProductContext);
}