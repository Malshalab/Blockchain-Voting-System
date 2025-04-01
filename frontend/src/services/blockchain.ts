// frontend/src/services/blockchain.ts
import { ethers } from "ethers";
import VotingArtifact from "../Voting.json"; // Adjust the path as needed

// Extend the Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

const RPC_URL = process.env.REACT_APP_RPC_URL || "http://127.0.0.1:8545";
const VOTING_CONTRACT_ADDRESS = process.env.REACT_APP_VOTING_CONTRACT_ADDRESS || "";

export const getProvider = async (): Promise<ethers.BrowserProvider | null> => {
  if (window.ethereum) {
    // ethers v6: use BrowserProvider for browser environments (like MetaMask)
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // Request access
    return provider;
  } else {
    console.error("MetaMask not found. Please install MetaMask.");
    return null;
  }
};

export const getVotingContract = async (): Promise<ethers.Contract | null> => {
  const provider = await getProvider();
  if (!provider) return null;
  // In ethers v6, getSigner() returns a Promise, so we await it.
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(VOTING_CONTRACT_ADDRESS, VotingArtifact.abi, signer);
  return contract;
};

export const createPollOnChain = async (
  question: string,
  options: string[]
): Promise<ethers.TransactionReceipt | null> => {
  const contract = await getVotingContract();
  if (!contract) throw new Error("Voting contract is not available");
  const tx = await contract.createPoll(question, options);
  const receipt = await tx.wait();
  console.log("Poll created on-chain. Receipt:", receipt);
  return receipt;
};

export const voteOnPoll = async (
  pollId: number,
  optionIndex: number
): Promise<ethers.TransactionReceipt | null> => {
  const contract = await getVotingContract();
  if (!contract) throw new Error("Voting contract is not available");
  const tx = await contract.vote(pollId, optionIndex);
  const receipt = await tx.wait();
  console.log("Vote cast on-chain. Receipt:", receipt);
  return receipt;
};

export const getPollQuestionOnChain = async (pollId: number): Promise<string> => {
  const contract = await getVotingContract();
  if (!contract) throw new Error("Voting contract is not available");
  return await contract.getPollQuestion(pollId);
};

export const getPollOptionsOnChain = async (pollId: number): Promise<string[]> => {
  const contract = await getVotingContract();
  if (!contract) throw new Error("Voting contract is not available");
  return await contract.getPollOptions(pollId);
};

export const getPollVotesOnChain = async (pollId: number): Promise<number[]> => {
  const contract = await getVotingContract();
  if (!contract) throw new Error("Voting contract is not available");
  const votes = await contract.getPollVotes(pollId);
  // Here, votes is assumed to be an array of BigNumberish values.
  return votes.map((value: any) => Number(value));
};