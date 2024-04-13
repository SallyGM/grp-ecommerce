import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./header";
import Footer from "./footer";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { BasketProvider } from "./context/BasketContext";
import { ProductProvider } from "./context/ProductContext";
import { FavouriteProvider } from "./context/FavouriteContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Game Busters",
  description: "E-commerce Group Research Project",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className}> 
        <ProductProvider>
          <AuthProvider>
            <BasketProvider>
              <FavouriteProvider>
                <Header/>
                {children}
                <Toaster position = "bottom-center"/>
                <Footer/>
              </FavouriteProvider>
            </BasketProvider>
          </AuthProvider>
        </ProductProvider>
      </body>
    </html>
  );
}
