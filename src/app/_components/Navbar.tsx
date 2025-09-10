/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import Link from "next/link";
import logo from "../../assets/images/freshcart-logo.svg";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { CartRes} from '../cart/typescript/cart.interface'
import   {useQuery} from "@tanstack/react-query"
import { useWishlist } from "@/contexts/WishlistContext"

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const { data } = useQuery<CartRes>({
    queryKey: ["cart"], 
    queryFn: async() => {
      const res = await fetch("/api/cart")  
      const payload = await res.json();
      return payload;
    },
    enabled: !!session && status === "authenticated", // Only fetch when authenticated
    retry: false, // Don't retry failed requests
  });

  const { wishlistCount } = useWishlist();

  const links = [
    { path: "/products", element: "products" },
    { path: "/categories", element: "categories" },
    { path: "/subcategories", element: "subcategories" },
    { path: "/brands", element: "brands" },
  ];

  const auths = [
    { path: "/auth/register", element: "register" },
    { path: "/auth/login", element: "login" },
  ];

  function handleLogOut(){
    signOut({callbackUrl:"/"})
  }

  return (
    <>
      <nav className="bg-light w-full border-gray-200 dark:bg-gray-900 shadow-sm">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          {/* Logo and User Info */}
          <Link
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <Image src={logo} className="h-8 w-auto" alt="FreshCart Logo" />
            <div className="hidden sm:block">
              {session ? (
                <span className="text-sm text-main font-medium">{session?.user?.name}</span>
              ) : (
                <span className="text-xs text-main">Not logged in</span>
              )}
            </div>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-default"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>

          <div className={`${!isOpen ? 'hidden' : ''} w-full md:block md:w-auto`} id="navbar-default">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-8 mt-4 md:mt-0">
              
              <ul className="flex flex-col md:flex-row md:space-x-6 lg:space-x-8 p-4 md:p-0 mt-4 md:mt-0 border border-gray-100 rounded-lg md:border-0 bg-gray-50 md:bg-transparent">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="block py-2 px-3 text-gray-700 hover:text-main transition-colors duration-200 md:p-0 font-medium text-sm lg:text-base"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.element.toUpperCase()}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 lg:space-x-6 p-4 md:p-0 mt-4 md:mt-0 border-t md:border-t-0 border-gray-100">
                
                <div className="flex space-x-4 mb-4 md:mb-0">
                  <i className="fa-brands fa-facebook text-gray-500 hover:text-main cursor-pointer transition-colors"></i>
                  <i className="fa-brands fa-twitter text-gray-500 hover:text-main cursor-pointer transition-colors"></i>
                  <i className="fa-brands fa-instagram text-gray-500 hover:text-main cursor-pointer transition-colors"></i>
                  <i className="fa-brands fa-youtube text-gray-500 hover:text-main cursor-pointer transition-colors"></i>
                </div>

                {status === "unauthenticated" ? (
                  <div className="flex flex-col md:flex-row md:space-x-4">
                    {auths.map((link) => (
                      <Link
                        key={link.path}
                        href={link.path}
                        className="block py-2 px-3 text-gray-500 hover:text-main transition-colors duration-200 md:p-0 font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.element.toUpperCase()}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
                    
                    <div className="flex items-center space-x-4">
                      <Link href="/cart" className="relative group" onClick={() => setIsOpen(false)}>
                        <i className="fa-solid fa-cart-shopping text-gray-600 hover:text-main transition-colors text-lg"></i>
                        {data?.numOfCartItems && data.numOfCartItems > 0 && (
                          <span className="absolute -top-2 -right-2 text-xs font-bold bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                            {data.numOfCartItems}
                          </span>
                        )}
                      </Link>

                      <Link href="/wishlist" className="relative group" onClick={() => setIsOpen(false)}>
                        <i className={`fa-solid fa-heart text-lg transition-colors ${wishlistCount > 0 ? 'text-red-500' : 'text-gray-600 hover:text-main'}`}></i>
                        {wishlistCount > 0 && (
                          <span className="absolute -top-2 -right-2 text-xs font-bold bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>

                      <Link href="/allorders" className="group" onClick={() => setIsOpen(false)}>
                        <i className="fa-solid fa-box text-gray-600 hover:text-main transition-colors text-lg"></i>
                      </Link>

                      <Link href="/addresses" className="group" onClick={() => setIsOpen(false)}>
                        <i className="fa-solid fa-location-dot text-gray-600 hover:text-main transition-colors text-lg"></i>
                      </Link>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center md:space-x-3 pt-2 md:pt-0 border-t md:border-t-0 border-gray-200">
                      <div className="flex items-center space-x-2 mb-2 md:mb-0">
                        {session?.user?.image && (
                          <img className="w-6 h-6 rounded-full" alt="User avatar" src={session.user.image} />
                        )}
                        <span className="text-sm text-gray-600 md:hidden">Hi {session?.user?.name}</span>
                      </div>
                      <button 
                        className="text-sm text-gray-500 hover:text-red-500 transition-colors font-medium" 
                        onClick={() => {
                          handleLogOut();
                          setIsOpen(false);
                        }}
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}