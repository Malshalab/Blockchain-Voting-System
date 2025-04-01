import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { loginUser, loginUserWithGoogle } from "../api/auth";
import logo from "../assets/VoteChain.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../services/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { setUser } = useContext(AuthContext);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Google login handler: send the raw token to the backend
  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      const data = await loginUserWithGoogle({ token: credentialResponse.credential });
      localStorage.setItem("token", data.token);
      localStorage.setItem("isAdmin", data.user.isAdmin);
      localStorage.setItem("walletAddress", data.user.walletAddress);
      localStorage.setItem("user", JSON.stringify(data.user));
      // Update AuthContext with the logged-in user
      setUser(data.user);
      navigate("/");
    } catch (err) {
      toast.error("Google login failed.");
    }
  };

  const handleGoogleLoginError = () => {
    toast.error("Google login failed.");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("isAdmin", data.user.isAdmin);
      localStorage.setItem("walletAddress", data.user.walletAddress);
      localStorage.setItem("user", JSON.stringify(data.user));
      // Immediately update the AuthContext
      setUser(data.user);
      navigate("/");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  return (
    <GoogleOAuthProvider
      clientId={
        process.env.REACT_APP_GOOGLE_CLIENT_ID ||
        "139401816309-f0pr0i3hot6jqordnv7bamjhhp8tjdc1.apps.googleusercontent.com"
      }
    >
      <div className="flex h-screen">
        {/* Left Side - Branding */}
        <div className="hidden w-1/2 bg-[#3699E1] p-10 md:flex flex-col justify-center items-center">
          <img src={logo} alt="Login Preview" className="w-full" />
        </div>
        {/* Right Side - Login Form */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-8">
          <div className="w-full max-w-md space-y-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Sign in to VoteChain!
            </h2>
            <p className="text-gray-500">
              Welcome back! Please enter your details.
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
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
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="absolute inset-y-0 top-1 right-3 flex items-center text-gray-500 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-[#3699E1] border-gray-300 rounded"
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-[#3699E1] hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-[#3699E1] py-3 text-white transition-all hover:bg-[#287ab5]"
              >
                Sign In
              </button>
            </form>
            <div className="flex items-center justify-between">
              <span className="h-px w-full bg-gray-300"></span>
              <span className="w-full text-sm text-gray-500">
                Or login with
              </span>
              <span className="h-px w-full bg-gray-300"></span>
            </div>
            <div className="flex flex-col gap-3">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginError}
                auto_select={false}
              />
            </div>
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#3699E1] hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;