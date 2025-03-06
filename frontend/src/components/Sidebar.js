import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBuilding, FaChartLine, FaUserCircle, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import VoteChainCircle from '../assets/VoteChainCircle.png'

const Sidebar = () => {
  const [active, setActive] = useState("Polls");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: "Polls", icon: <FaBuilding /> },
    { name: "Dashboard", icon: <FaChartLine /> },
  ];

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
              to={`/${item.name.toLowerCase()}`}
              className={`flex items-center space-x-3 p-2 rounded-lg transition ${
                active === item.name
                  ? "bg-purple-100 text-purple-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setActive(item.name)}
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
                <p className="text-gray-800 font-semibold">Gianmarco</p>
              </div>
            </div>
            <button
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
