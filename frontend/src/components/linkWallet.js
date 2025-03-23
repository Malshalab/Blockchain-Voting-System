import { ethers } from "ethers";
import { verifyMessage } from "../api/auth";

const linkWallet = async (token) => {
  if (!window.ethereum) return alert("Please install MetaMask");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const message = `Link wallet to your VoteChain account: ${Date.now()}`;
  const signature = await signer.signMessage(message); // 👈 MetaMask popup

  const response = await verifyMessage(token, address, message, signature);

  console.log('result:', response);

  if (response.success) {
    return response.user.walletAddress;
  } else {
    throw new Error(`Failed: ${response.error}`);
  }
};

export default linkWallet;