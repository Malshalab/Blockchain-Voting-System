import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBuilding, FaChartLine, FaUserCircle, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import VoteChainCircle from '../assets/VoteChainCircle.png'
import { IoIosSettings } from "react-icons/io";
import { isTokenValid } from "../utils/auth";

const Sidebar = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(isTokenValid());
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const userData = user ? JSON.parse(user) : null; // Parse user data from localStorage

  const menuItems = [
    { name: "Polls", to: '/', icon: <FaBuilding /> },
    { name: "Dashboard", to: '/dashboard', icon: <FaChartLine /> },
    { name: "Settings", to: '/settings', icon: <IoIosSettings /> },
  ];

    useEffect(() => {
    const interval = setInterval(() => {
      if (!isTokenValid()) {
        localStorage.removeItem("token"); // Remove expired token
        setIsLoggedIn(false);
        navigate("/login"); // Redirect to login
      }
    }, 600000); // Check token validity every minute

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

    const handleLogout = () => {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      navigate("/login");
    };

  return (
    <div className="h-screen w-64 bg-white border-r shadow-lg fixed top-0 left-0 p-6 flex flex-col justify-between">
      {/* Logo & Navigation */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
            <img src={VoteChainCircle} alt="Logo" className="w-16 h-auto" />
            <h1 className="text-2xl font-bold text-gray-900">VoteChain</h1>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={`${item.to}`}
              className={`flex items-center space-x-3 p-2 rounded-lg transition ${
                location.pathname === item.to
                  ? "bg-purple-100 text-purple-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto">
        {isLoggedIn ? (
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaUserCircle className="text-gray-700 text-3xl" />
              <div>
                <p className="text-gray-800 font-semibold">{userData.name ? userData.name : userData.email.split("@")[0]}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 flex items-center space-x-2 bg-red-500 text-white px-4 py-2 w-full rounded-lg hover:bg-red-600 transition"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 w-full rounded-lg hover:bg-purple-700 transition"
          >
            <FaSignInAlt />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
