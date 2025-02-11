import { useState } from "react";
import { useNavigate } from "react-router-dom";
import image from "../assets/signup.jpg";
import axios from "axios";

const GuestSignup = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [userExists, setUserExists] = useState(false);
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [id]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const { email, password, confirmPassword } = formData;

        // Validate password length and confirm password match
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/guestsignup", {
                email,
                password,
                confirmPassword,
            });

            // If signup is successful, redirect to login page
            if (response.data.message === "User registered successfully") {
                alert("Signup successful! Redirecting to login...");
                navigate("/login");
            }
        } catch (err) {
            if (err.response?.data?.message === "Email already registered") {
                setUserExists(true);
                setError("");
            } else {
                setError("Failed to register. Please try again.");
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

                    {/* Right side: Guest Signup Form */}
                    <div className="w-full md:w-2/3 lg:w-1/3">
                        <main className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                            <h1 className="text-3xl font-bold mb-6 text-gray-900">Guest Signup</h1>
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
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                                        required
                                    />
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
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                                        required
                                        minLength={6}
                                    />
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
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <button
                                    type="submit"
                                    className="w-full bg-gray-700 hover:bg-gray-800 text-white p-3 rounded-lg transition duration-300"
                                >
                                    Sign Up
                                </button>
                            </form>

                            {/* If user already exists, show sign-in link */}
                            {userExists && (
                                <p className="text-center text-sm text-red-500 mt-4">
                                    User already exists.{" "}
                                    <span
                                        onClick={() => navigate("/login")}
                                        className="text-gray-700 cursor-pointer underline"
                                    >
                                        Sign in here.
                                    </span>
                                </p>
                            )}
                            <div className="w-full text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <a href="/login" className="text-blue-500 hover:underline">
                                        Login
                                    </a>
                                </p>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GuestSignup;
