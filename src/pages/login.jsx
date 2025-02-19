


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import image from "../assets/signup.jpg";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("userRole");

        if (token) {
            navigate(userRole === "guest" ? "/home" : "/dashboard", { replace: true });
        }
    }, []); //  Empty dependency array to run only once

    const validateForm = () => {
        if (!email.trim() || !password.trim()) {
            setErrorMessage("❌ Both fields are required.");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrorMessage("❌ Invalid email format.");
            return false;
        }
        if (password.length < 6) {
            setErrorMessage("❌ Password must be at least 6 characters.");
            return false;
        }

        setErrorMessage(null); // Clear error if validation is successful
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);
        setIsLoading(true);

        if (!validateForm()) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("https://event-backend-production-c3a4.up.railway.app/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || "❌ Invalid credentials.");
                return;
            }

            // Store token and user details
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("userRole", data.userRole);

            // Navigate based on user role
            navigate(data.userRole === "guest" ? "/home" : "/dashboard");

        } catch (error) {
            setErrorMessage("❌ An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="login-container">
            <section className="container px-6 py-12 h-full">
                <div className="flex justify-center items-center flex-wrap h-full gap-6 text-gray-800">

                    {/* Left Side: Image */}
                    <div className="hidden md:block md:w-1/3 lg:w-1/2">
                        <div
                            className="w-full h-full bg-cover bg-center rounded-lg shadow-lg"
                            style={{
                                backgroundImage: `url(${image})`,
                                height: "80vh",
                            }}
                        />
                    </div>

                    {/* Right Side: Login Form */}
                    <div className="md:w-8/12 lg:w-5/12 lg:ml-20">
                        <main className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                            <h1 className="text-3xl font-bold mb-6 text-gray-900">Login</h1>
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
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
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-gray-700 hover:bg-gray-800 text-white p-3 rounded-lg transition duration-300"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Logging in..." : "Login"}
                                </button>
                            </form>

                            {/*  Error Message */}
                            {errorMessage && (
                                <p className="text-center text-sm text-red-500 mt-4">
                                    {errorMessage}
                                </p>
                            )}

                            {/* Redirect to signup */}
                            <p className="text-center text-sm text-gray-600 mt-4">
                                Don't have an account?{" "}
                                <span
                                    onClick={() => navigate("/")}
                                    className="text-gray-700 cursor-pointer underline"
                                >
                                    Sign up here.
                                </span>
                            </p>
                        </main>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;
