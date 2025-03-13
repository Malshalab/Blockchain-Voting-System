import { FaSearch } from "react-icons/fa";
import { CiWallet } from "react-icons/ci";

const TopBar = ({ title }) => {
  return (
    <div className="flex justify-between items-center bg-white p-4 shadow-sm border-b">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>

      {/* Icons (New Poll + Search) */}
      <div className="flex space-x-4">
        <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
          <FaSearch className="text-gray-600" />
        </button>
        <button className="flex space-x-2 items-center p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition">
          <CiWallet className="text-white" />
          <span className="hidden md:inline-block text-white">Connect Wallet</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
