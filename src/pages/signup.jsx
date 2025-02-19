


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import image from "../assets/signup.jpg";

const Signup = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [userExists, setUserExists] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        let newErrors = {};


        if (!formData.email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Enter a valid email address.";
        }


        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirm Password is required.";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [id]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await axios.post("https://event-backend-production-c3a4.up.railway.app/signup", formData);

            if (response.data.message === "User registered successfully") {
                navigate("/login");
            }
        } catch (err) {
            if (err.response?.data?.message === "Email already registered") {
                setUserExists(true);
            } else {
                setErrors({ general: "Failed to register. Please try again." });
            }
        }
    };

    return (
        <section className="register-container">
            <div className="container px-6 py-12 h-full">
                <div className="flex justify-center items-center flex-wrap h-full gap-6 text-gray-800">
                    {/* Left side: Image */}
                    <div className="hidden md:block md:w-1/3 lg:w-1/2">
                        <div
                            className="w-full h-full bg-cover bg-center rounded-lg"
                            style={{
                                backgroundImage: `url(${image})`,
                                height: "80vh",
                            }}
                        />
                    </div>

                    {/* Right side: Signup Form */}
                    <div className="w-full md:w-2/3 lg:w-1/3">
                        <main className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                            <h1 className="text-3xl font-bold mb-6 text-gray-900">Sign Up</h1>
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-gray-600"
                                            }`}
                                    />
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-gray-600"
                                            }`}
                                    />
                                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "focus:ring-gray-600"
                                            }`}
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                                    )}
                                </div>
                                {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
                                <button
                                    type="submit"
                                    className="w-full bg-gray-700 hover:bg-gray-800 text-white p-3 rounded-lg transition duration-300"
                                >
                                    Sign Up
                                </button>
                            </form>

                            {/* If user already exists, show sign-in link */}
                            {userExists ? (
                                <p className="text-center text-sm text-red-500 mt-4">
                                    User already exists.{" "}
                                    <span
                                        onClick={() => navigate("/login")}
                                        className="text-gray-700 cursor-pointer underline"
                                    >
                                        Sign in here.
                                    </span>
                                </p>
                            ) : (
                                <div className="w-full text-center">
                                    <p className="text-sm text-gray-600">
                                        Already have an account?{" "}
                                        <a href="/login" className="text-blue-500 hover:underline">
                                            Login
                                        </a>
                                    </p>
                                </div>
                            )}

                        </main>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Signup;
