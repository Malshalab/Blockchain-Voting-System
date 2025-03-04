import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <h1 className="text-xl font-bold">VoteChain</h1>
      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-black">Home</Link>
        <Link to="/dashboard" className="text-gray-700 hover:text-black">Dashboard</Link>
        <Link to="/settings" className="text-gray-700 hover:text-black">Settings</Link>
        <Link to="/login" className="text-white bg-[#26282C] py-3 px-6 rounded-2xl">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
