import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./header";
import Footer from "./footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Buster Games",
  description: "E-commerce Group Research Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
