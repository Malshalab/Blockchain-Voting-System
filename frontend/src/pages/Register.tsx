import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { registerUser } from "../api/auth";
import logo from "../assets/VoteChain.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        level: "Very Weak",
        color: "bg-red-500",
        width: "25%",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () =>
        setShowConfirmPassword(!showConfirmPassword);

    const checkPasswordStrength = (password: string) => {
        const unmetCriteria: string[] = [];

        if (password.length < 8) unmetCriteria.push("At least 8 characters");
        if (!/[A-Z]/.test(password))
            unmetCriteria.push("At least 1 uppercase letter");
        if (!/[a-z]/.test(password))
            unmetCriteria.push("At least 1 lowercase letter");
        if (!/\d/.test(password)) unmetCriteria.push("At least 1 number");
        if (!/[@$!%*?&]/.test(password))
            unmetCriteria.push("At least 1 special character (@$!%*?&)");

        const passed = 5 - unmetCriteria.length;

        let level = "Very Weak";
        let color = "bg-red-500";
        let width = "25%";

        if (passed === 5) {
            level = "Strong";
            color = "bg-green-500";
            width = "100%";
        } else if (passed === 4) {
            level = "Moderate";
            color = "bg-yellow-500";
            width = "75%";
        } else if (passed === 3) {
            level = "Weak";
            color = "bg-orange-500";
            width = "50%";
        }

        return { level, color, width, unmetCriteria };
    };

    // New submit handler using the login helper function
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log("Email:", email, "Password:", password);
        e.preventDefault(); // Prevent the form from reloading the page
        setLoading(true);
        setError(null);

        if (!email.endsWith("@torontomu.ca")) {
            toast.error("Only @torontomu.ca emails are allowed to register.");
            setLoading(false);
            return;
        }

        if (passwordStrength.level !== "Strong") {
            toast.error(
                `Password is weak. Missing:\n${passwordStrength.unmetCriteria.join(
                    ", "
                )}`
            );
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        console.log("Registering user:", { name, email, password });
        try {
            // Call the loginUser helper function with email and password
            const data = await registerUser({ name, email, password });
            console.log("Registration successful:", data);
            localStorage.setItem("token", data.token);
            // Process the data, e.g., store the token in localStorage, update context, etc.
            navigate("/"); // <-- Redirect to the home page
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : String(err);
            setError(errorMessage);
        }
        setLoading(false);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordStrength(checkPasswordStrength(value));
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
                    <form className="space-y-4" onSubmit={handleSubmit}>
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
                                    type={showPassword ? "text" : "password"}
                                    className="mt-1 w-full rounded-2xl bg-[#F3F3F3] p-3"
                                    placeholder="Password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <span
                                    className="absolute inset-y-0 top-1 right-3 flex items-center text-gray-500 cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            {password && (
                                <div>
                                    <div className="mt-2 w-full h-2 rounded-lg bg-gray-200">
                                        <div
                                            className={`h-full rounded-lg ${passwordStrength.color}`}
                                            style={{
                                                width: passwordStrength.width,
                                            }}
                                        ></div>
                                    </div>
                                    <p
                                        className={`text-sm text-end font-medium ${
                                            passwordStrength.color ===
                                            "bg-green-500"
                                                ? "text-green-600"
                                                : passwordStrength.color ===
                                                  "bg-yellow-500"
                                                ? "text-yellow-600"
                                                : passwordStrength.color ===
                                                  "bg-orange-500"
                                                ? "text-orange-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {passwordStrength.level}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="relative">
                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    className="w-full rounded-2xl bg-[#F3F3F3] p-3"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                />
                                <span
                                    className="absolute inset-y-0 top-1 right-3 flex items-center text-gray-500 cursor-pointer"
                                    onClick={toggleConfirmPasswordVisibility}
                                >
                                    {showConfirmPassword ? (
                                        <FaEyeSlash />
                                    ) : (
                                        <FaEye />
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-[#3699E1] py-3 text-white transition-all hover:bg-[#287ab5]"
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
