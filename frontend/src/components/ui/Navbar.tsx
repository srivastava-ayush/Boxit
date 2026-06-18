"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuthStore } from "../../stores/authStore";


function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  const user = useAuthStore((state) => state.user);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



 

  return (
    <nav className="w-full hidden fixed top-0 z-[50] md:flex justify-center items-center">
      <ul
        className={`py-8 px-20 w-full transition-all duration-300 flex gap-8 items-center justify-between
          ${scrolled ? "onScrollNav" : ""}`}
      >
        <li className="font-bold  dark:text-white/80 russo text-2xl">Box'Lit</li>
        <li>
          <ul className="flex w-fit gap-4 justify-between items-center text-white/80 ">
            

            {!user && (
              <>
                <Link
                  to="/"
                  className="hover:cursor-pointer font-medium navlink transition-all duration-300"
                >
                  Home
                </Link>
                <Link
                  to="/signup"
                  className="hover:cursor-pointer font-medium navlink transition-all duration-300"
                >
                  Signup
                </Link>
                <Link
                  to="/login"
                  className="hover:cursor-pointer font-medium navlink transition-all duration-300"
                >
                  Login
                </Link>
              </>
            )}

            {user && (
              <Link to={"/learn"}
                className="hover:cursor-pointer font-medium navlink transition-all duration-300"
              >
                Learn
              </Link>
            )}

            {user && (
              <Link 
                to={"/select"}
                className="hover:cursor-pointer font-medium navlink transition-all duration-300"
              >
                Train
              </Link>
            )}

            {user && (
              <Link
                to={"/profile"}
                className="hover:cursor-pointer font-medium navlink transition-all duration-300   p-2 "
              >
                Profile
              </Link>
            )}
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
