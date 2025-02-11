

import React, { useState, useEffect } from "react";
import { FaUserAlt } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [token, setToken] = useState(null);
    const [isClient, setIsClient] = useState(false);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        setIsClient(true);
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        setToken(storedToken);
        setUser(storedUser ? JSON.parse(storedUser) : null);
    }, []);

    const toggleDropdown = () => setDropdownOpen((prev) => !prev);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (!isClient) return null;

    const isGuestUser = user?.role === "guest"; // Check if the user is a guest

    return (
        <header className="w-full bg-black sticky top-0 z-10">
            <nav className="container mx-auto px-4 h-20 flex justify-between items-center">
                {/* Logo */}
                <h1 className="text-blue-700 text-lg font-bold">
                    <Link to="/">MYTODOS</Link>
                </h1>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex gap-x-6 text-white">
                    <li><Link to="/" className="hover:text-blue-700">About Us</Link></li>
                    <li><Link to="/" className="hover:text-blue-700">Services</Link></li>
                    <li><Link to="/" className="hover:text-blue-700">Contacts</Link></li>
                </ul>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button onClick={toggleDropdown} className="h-12 w-12 rounded-full bg-blue-700 flex items-center justify-center">
                        <FaUserAlt className="text-lg" />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                            <ul className="py-2">
                                {!token ? (
                                    <>
                                        <li className="px-4 py-2 hover:bg-gray-200">
                                            <Link to="/login">Login</Link>
                                        </li>
                                        <li className="px-4 py-2 hover:bg-gray-200">
                                            <Link to="/signup">Signup</Link>
                                        </li>
                                        <li className="px-4 py-2 hover:bg-gray-200">
                                            <Link to="/guest-register">Guest Register</Link>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        {/* Hide Dashboard if user is a guest */}
                                        {!isGuestUser && (
                                            <li className="px-4 py-2 hover:bg-gray-200">
                                                <Link to="/dashboard">Dashboard</Link>
                                            </li>
                                        )}
                                        <li className="px-4 py-2 hover:bg-gray-200">
                                            <button onClick={handleLogout} className="w-full text-left">Logout</button>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden bg-gray-500 text-white px-4">
                <ul className="flex flex-col gap-y-2 py-4">
                    <li><Link to="/">About Us</Link></li>
                    <li><Link to="/">Services</Link></li>
                    <li><Link to="/">Contacts</Link></li>
                    {!token ? (
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/signup">Signup</Link></li>
                            <li><Link to="/guest-register">Guest Register</Link></li>
                        </>
                    ) : (
                        <>
                            {!isGuestUser && <li><Link to="/dashboard">Dashboard</Link></li>}
                            <li><button onClick={handleLogout}>Logout</button></li>
                        </>
                    )}
                </ul>
            </div>
        </header>
    );
};

export default Navbar;
