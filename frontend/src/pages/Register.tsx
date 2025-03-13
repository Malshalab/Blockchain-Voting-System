import { useState } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import logo from "../assets/VoteChain.png";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        console.log("Registering user:", { name, email, password });
        // TODO: Send data to backend API for user registration
    };

    return (
        <div className="flex h-screen">
            {/* Left Side - Branding */}
            <div className="hidden w-1/2 bg-[#3699E1] p-10 md:flex flex-col justify-center items-center">
                <img src={logo} alt="Register Preview" className="w-full" />
            </div>

            {/* Right Side - Register Form */}
            <div className="flex w-full md:w-1/2 items-center justify-center p-8">
                <div className="w-full max-w-md space-y-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Create an account
                    </h2>
                    <p className="text-gray-500">
                        Join us by creating an account!
                    </p>

                    {/* Register Form */}
                    <form className="space-y-4" onSubmit={handleRegister}>
                        <div>
                            <input
                                type="text"
                                className="mt-1 w-full rounded-2xl bg-[#F3F3F3] p-3"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                className="mt-1 w-full rounded-2xl bg-[#F3F3F3] p-3"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <div className="relative">
                                <input
                                    type="password"
                                    className="mt-1 w-full rounded-2xl bg-[#F3F3F3] p-3"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                                <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer">
                                    👁️
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className="relative">
                                <input
                                    type="password"
                                    className="mt-1 w-full rounded-2xl bg-[#F3F3F3] p-3"
                                    placeholder="Password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                />
                                <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer">
                                    👁️
                                </span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-[#3699E1] py-3 text-white transition-all hover:bg-[#287ab5] focus:ring-2 focus:ring-orange-300"
                        >
                            Sign Up
                        </button>
                    </form>

                    {/* Already have an account? */}
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-[#3699E1] hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
