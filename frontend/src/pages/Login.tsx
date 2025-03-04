import { useState } from "react";
import { Link } from "react-router-dom";
import logo from '../assets/VoteChain.png'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

//   const handleLogin = (e) => {
//     e.preventDefault();
//     alert("Login clicked"); // Replace with actual authentication logic
//   };

  return (
    <div className="flex h-screen">
      {/* Left Side - Image & Branding */}
      <div className="hidden w-1/2 bg-[#3699E1] p-10 md:flex flex-col justify-center items-center">
        <img src={logo} alt="Login Preview" className="w-full" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Sign in to VoteChain!</h2>
          <p className="text-gray-500">Welcome back! Please enter your details.</p>

          {/* Login Form */}
          <form className="space-y-4">
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
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer">
                  👁️
                </span>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="h-4 w-4 text-[#3699E1] border-gray-300 rounded" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-[#3699E1] hover:underline">Forgot Password?</Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-[#3699E1] py-3 text-white transition-all hover:bg-[#287ab5] focus:ring-2 focus:ring-orange-300"
            >
              Sign In
            </button>
          </form>

          {/* Social Login */}
          <div className="flex items-center justify-between">
            <span className="h-px w-full bg-gray-300"></span>
            <span className=" w-full text-sm text-gray-500">Or login with</span>
            <span className="h-px w-full bg-gray-300"></span>
          </div>

          <div className="flex flex-col gap-3">
            <button className="flex items-center justify-center w-full rounded-lg border border-gray-300 py-2 text-gray-700 shadow-sm transition hover:bg-gray-100">
              <img src="/google-icon.svg" alt="Google" className="mr-2 h-5 w-5" />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
