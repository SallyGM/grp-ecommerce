import ProductDetails from '@/components/productDetails.js'
import { ref, get } from "firebase/database";
import { database } from '@/app/firebaseConfig.js';

export default function Page({ params }) {
    const { productID } = params;
    if (productID) {
        return (
        <div>
            <ProductDetails productIDParam={productID}>
            </ProductDetails>
        </div>
        );
    } else {
        return <div>Product not found</div>;
    }
}

export async function generateStaticParams() {
    const productIDs = ["1ODsYuYVgIYydinlIkkTuvlMG7Wdt0jr",
    "7tilk19afpeo66r9df2ihcfmmzprn2cm",
    "bfbc0u66at1bob0y16041ozseveqbxip",
    "ca06c64znq9w12ue08y1shgtmmhuv17s",
    "cwnl11fyild2fq5v3x6za9a3hk03uwwc",
    "gh1kgn04ph0n9axao30upgkiyz94a86j",
    "i6d0hkskj3d2hq73duja1nm5awa9v7pp",
    "jvspf7o03lrwtw33q4bujt5vaipfveif",
    "kk2b8amtrz0vjzgvhs6w9g2k53rbnhw6",
    "ksmpm3iyh44v5inqtfsjde970hmwv6lr",
    "nytrb2h0piqbk9n0ssw4t835d2pzwkvx",
    "o8huddgwrrsz8elph8ayzahc92sndqd6",
    "oy2ptisgzl3iik6o62r2lzd0gkudw6i0",
    "q40x37n9ofvuypukwrjpk2nxyp5cu8bf",
    "qp8hx81mv5uonjydnfdt8z6t2eb75j2y",
    "s6gjmrzfxrn2pwnvrp5rwn961gtul2st",
    "wa5o0cwfwqe5yhawmiy1vaey8svsc0fs",
    "x3v743qk8rzsq740b6gh0i09z0tmf7j4",
    "x9ws06dzn3771h3gfcptvojp667qi69r",
    "zv9kkdcojd26dj7uw7jy7pyax60hevd8"]

    const staticParams = productIDs.map((id) => ({
        productID: id,
      }));
    
      return staticParams;

    /*const prodRef = ref(database, 'Product');
    const snapshot = await get(prodRef);
  
    const staticParams = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const product = childSnapshot.val();
        
        staticParams.push({ productID: product.id });
      });
    }

    return staticParams;*/
}