import { FaSearch } from "react-icons/fa";

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
      </div>
    </div>
  );
};

export default TopBar;
