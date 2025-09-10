import { Encode_Sans_Expanded } from "next/font/google";
import "./globals.css";
import "../../node_modules/@fortawesome/fontawesome-free/css/all.min.css"
import "react-toastify/dist/ReactToastify.css";
import { Metadata } from "next";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import GlobalLoader from "@/component/GlobalLoader";
import  Providers from "../providers/Components/ReactQueryProvider.Provider"
import NextAuthProvider from "../providers/Components/nextauth.providers";
import { WishlistProvider } from "../contexts/WishlistContext";
import { ToastContainer} from 'react-toastify';

const Encode = Encode_Sans_Expanded({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "FreshCart - E-commerce Store",
  description: "Your one-stop shop for all your needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <html lang="en">
        <body className={Encode.className} suppressHydrationWarning={true}>

        <GlobalLoader/>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <NextAuthProvider>
          <Providers>
            <WishlistProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="container flex-1 mx-auto p-6">{children}</main>
                <Footer/>
              </div>
            </WishlistProvider>
          </Providers>
        </NextAuthProvider>
        </body>
      </html>
  
  );
}
