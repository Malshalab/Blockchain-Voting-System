import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";


// Define Settings State Type
interface SettingsType {
    name: string;
    email: string;
    profilePicture: string;
    wallet: string;
    changePassword: string;
    linkedAccounts: string[];
    twoFactorAuth: boolean;
    votingPrivacy: "public" | "private";
    defaultView: "Active Polls" | "All Polls" | "My Voted";
    notifications: {
        newVotes: boolean;
        pollExpiry: boolean;
        pollResults: boolean;
    };
    darkMode: boolean;
    autoClosePolls: boolean;
    allowVoteModification: boolean;
    requireIDVerification: boolean;
    voteVisibility: "public" | "private";
    sessionManagement: boolean;
    deleteAccount: boolean;
}

const Settings = () => {
    // Define Initial Settings
    const [settings, setSettings] = useState<SettingsType>({
        name: "Gianmarco Arena",
        email: "user@example.com",
        profilePicture: "/default-avatar.png",
        wallet: "0x1234567890abcdef",
        changePassword: "",
        linkedAccounts: ["Google"],
        twoFactorAuth: false,
        votingPrivacy: "public",
        defaultView: "Active Polls",
        notifications: {
            newVotes: true,
            pollExpiry: false,
            pollResults: true,
        },
        darkMode: false,
        autoClosePolls: true,
        allowVoteModification: false,
        requireIDVerification: true,
        voteVisibility: "public",
        sessionManagement: false,
        deleteAccount: false,
    });

    const user = localStorage.getItem("user");
    const userData = user ? JSON.parse(user) : null;

    // Ensure Type Safety for State Updates
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Ensure Type Safety for Checkbox Updates
    const handleCheckboxChange = (field: keyof SettingsType) => {
        setSettings((prev) => ({
            ...prev,
            [field]: !prev[field], // Toggle boolean value
        }));
    };

    // Ensure Type Safety for Nested Notifications
    const handleNestedCheckboxChange = (field: keyof SettingsType["notifications"]) => {
        setSettings((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [field]: !prev.notifications[field], // Toggle notification setting
            },
        }));
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="ml-64 flex flex-col w-full h-screen">
                <TopBar title="Settings" />
                <div className="p-6 flex-1 flex flex-col w-full h-full">
                    {/* Settings Panel */}
                    <div className="bg-white shadow-lg rounded-lg w-full h-full p-6 mx-auto flex flex-col">
                        
                        {/* Grid Layout for Compact Settings */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6 flex-grow">
                            
                            {/* Account Settings */}
                            <div className="space-y-3">
                                <h2 className="text-xl font-semibold">Account Settings</h2>

                                {/* Profile Picture */}
                                <div className="flex items-center space-x-4">
                                    <img src={settings.profilePicture} alt="Profile" className="w-12 h-12 rounded-full border" />
                                    <input type="file" className="hidden" id="upload-profile" />
                                    <label htmlFor="upload-profile" className="cursor-pointer px-3 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
                                        Change Picture
                                    </label>
                                </div>

                                {/* Username & Email */}
                                <div className="flex">
                                  <p className="font-bold text-xl">{userData.name}</p>
                                  <span className="font-semibold text-lg">&nbsp;({userData.email})</span>
                                </div>

                                {/* Change Password */}
                                <button className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Change Password</button>
                            </div>

                            {/* Voting Preferences */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Voting Preferences</h2>
                                <div className="flex items-center">
                                  <p className="w-full">Choose weather your votes will be publicly recorded on the blockchain</p>
                                <select name="votingPrivacy" value={settings.votingPrivacy} onChange={handleChange} className="w-1/4 p-2 border rounded-lg">
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                                </div>
                                <div className="flex justify-between items-center">
                                  <p>Default Voting Table View</p>
                                <select name="defaultView" value={settings.defaultView} onChange={handleChange} className="w-1/5 p-2 border rounded-lg">
                                    <option value="Active Polls">Active Polls</option>
                                    <option value="All Polls">All Polls</option>
                                    <option value="My Voted">My Voted</option>
                                </select>
                                </div>

                                {/* Dark Mode */}
                                <div className="flex items-center justify-between">
                                    <span>Enable Dark Mode</span>
                                    <input type="checkbox" className="w-4 h-4" checked={settings.darkMode} onChange={() => handleCheckboxChange("darkMode")} />
                                </div>
                            </div>

                            {/* Security & Privacy */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Security & Privacy</h2>
                                <div className="flex items-center justify-between">
                                    <span>Connected Wallet</span>
                                    <button className="px-3 py-2 bg-blue-500 text-white rounded-lg">{userData.walletAddress}</button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Delete Account</span>
                                    <button className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700">Delete</button>
                                </div>
                            </div>

                            {/* Notifications */}
                            {/* <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Notifications</h2>
                                <div className="flex items-center justify-between">
                                    <span>New Votes</span>
                                    <input type="checkbox" className="w-4 h-4" checked={settings.notifications.newVotes} onChange={() => handleNestedCheckboxChange("newVotes")} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Poll Expiry</span>
                                    <input type="checkbox" className="w-4 h-4" checked={settings.notifications.pollExpiry} onChange={() => handleNestedCheckboxChange("pollExpiry")} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Poll Results</span>
                                    <input type="checkbox" className="w-4 h-4" checked={settings.notifications.pollResults} onChange={() => handleNestedCheckboxChange("pollResults")} />
                                </div>
                            </div> */}

                            {/* Poll Management */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Poll Management (Admin Settings)</h2>
                                <div className="flex items-center justify-between">
                                    <span>Auto-close polls after expiry</span>
                                    <input type="checkbox" className="w-4 h-4" checked={settings.autoClosePolls} onChange={() => handleCheckboxChange("autoClosePolls")} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Allow vote modification</span>
                                    <input type="checkbox" className="w-4 h-4" checked={settings.allowVoteModification} onChange={() => handleCheckboxChange("allowVoteModification")} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Require TMU Email</span>
                                    <input type="checkbox" className="w-4 h-4" checked={settings.requireIDVerification} onChange={() => handleCheckboxChange("requireIDVerification")} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Results View</span>
                                    <select name="voteVisibility" value={settings.voteVisibility} onChange={handleChange} className="w-1/5 p-2 border rounded-lg">
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                                </div>
                            </div>
                        </div>

                        {/* Save Button - Sticks to Bottom Right */}
                        <div className="mt-auto flex justify-end">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
