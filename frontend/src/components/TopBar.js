import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { CiWallet } from "react-icons/ci";
import linkWallet from "./linkWallet";

const TopBar = ({ title }) => {
  const token = localStorage.getItem("token");
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const savedWallet = localStorage.getItem("walletAddress");
    if (savedWallet) {
      setWalletAddress(savedWallet);
    }
  }, []);

  const handleWalletConnect = async () => {
    if (!token) {
      alert("User not logged in");
      return;
    }

    try {
      const address = await linkWallet(token); // linking returns address
      if (address) {
        localStorage.setItem("walletAddress", address);
        setWalletAddress(address);
      }
    } catch (err) {
      console.error("Wallet linking failed", err);
    }
  };

  const formatAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  return (
    <div className="flex justify-between items-center bg-white p-4 shadow-sm border-b">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>

      <div className="flex space-x-4">
        <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
          <FaSearch className="text-gray-600" />
        </button>

        <button
          onClick={handleWalletConnect}
          className="flex space-x-2 items-center p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
        >
          <CiWallet className="text-white" />
          <span className="hidden md:inline-block text-white">
            {walletAddress ? formatAddress(walletAddress) : "Connect Wallet"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
