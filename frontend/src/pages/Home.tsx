import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import VotingTable from "../components/VotingTable";

const allPolls = {
    all: [
        {
            name: "TMU Election 2025",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: 4,
            voters: 2,
            time: "5:49:48",
            date: "Fri Sep 08 2023",
            members: ["/member1.png", "/member2.png", "/member3.png"],
        },
        {
            name: "New Two",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: 2,
            voters: 0,
            time: "12:08:36",
            date: "Wed Aug 30 2023",
            members: ["/member6.png"],
        },
    ],
    active: [
        {
            name: "TMU Election 2025",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: 4,
            voters: 2,
            time: "5:49:48",
            date: "Fri Sep 08 2023",
            members: ["/member1.png", "/member2.png", "/member3.png"],
        },
        {
            name: "TMU Election 2025",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: 4,
            voters: 2,
            time: "5:49:48",
            date: "Fri Sep 08 2023",
            members: ["/member1.png", "/member2.png", "/member3.png"],
        },
        {
            name: "TMU Election 2025",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: 4,
            voters: 2,
            time: "5:49:48",
            date: "Fri Sep 08 2023",
            members: ["/member1.png", "/member2.png", "/member3.png"],
        },
        {
            name: "TMU Election 2025",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: 4,
            voters: 2,
            time: "5:49:48",
            date: "Fri Sep 08 2023",
            members: ["/member1.png", "/member2.png", "/member3.png"],
        },
        {
            name: "TMU Election 2025",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: 4,
            voters: 2,
            time: "5:49:48",
            date: "Fri Sep 08 2023",
            members: ["/member1.png", "/member2.png", "/member3.png"],
        },
        {
            name: "TMU Election 2025",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: 4,
            voters: 2,
            time: "5:49:48",
            date: "Fri Sep 08 2023",
            members: ["/member1.png", "/member2.png", "/member3.png"],
        },
        {
            name: "TMU Election 2025",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: 4,
            voters: 2,
            time: "5:49:48",
            date: "Fri Sep 08 2023",
            members: ["/member1.png", "/member2.png", "/member3.png"],
        },
        {
            name: "TMU Election 2025",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: 4,
            voters: 2,
            time: "5:49:48",
            date: "Fri Sep 08 2023",
            members: ["/member1.png", "/member2.png", "/member3.png"],
        },
        {
            name: "TMU Election 2025",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: 4,
            voters: 2,
            time: "5:49:48",
            date: "Fri Sep 08 2023",
            members: ["/member1.png", "/member2.png", "/member3.png"],
        },
        {
            name: "TMU Election 2025",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: 4,
            voters: 2,
            time: "5:49:48",
            date: "Fri Sep 08 2023",
            members: ["/member1.png", "/member2.png", "/member3.png"],
        },
        {
            name: "TMU Election 2025",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: 4,
            voters: 2,
            time: "5:49:48",
            date: "Fri Sep 08 2023",
            members: ["/member1.png", "/member2.png", "/member3.png"],
        },
        {
            name: "TMU Election 2025",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: 4,
            voters: 2,
            time: "5:49:48",
            date: "Fri Sep 08 2023",
            members: ["/member1.png", "/member2.png", "/member3.png"],
        },
        {
            name: "TMU Election 2025",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: 4,
            voters: 2,
            time: "5:49:48",
            date: "Fri Sep 08 2023",
            members: ["/member1.png", "/member2.png", "/member3.png"],
        },
    ],
    ended: [
        {
            name: "New Two",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: 2,
            voters: 0,
            time: "12:08:36",
            date: "Wed Aug 30 2023",
            members: ["/member6.png"],
        },
        {
            name: "New Two",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: 2,
            voters: 0,
            time: "12:08:36",
            date: "Wed Aug 30 2023",
            members: ["/member6.png"],
        },
        {
            name: "New Two",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: 2,
            voters: 0,
            time: "12:08:36",
            date: "Wed Aug 30 2023",
            members: ["/member6.png"],
        },
    ],
    voted: [
        {
            name: "Student Council Elections",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: 5,
            voters: 10,
            time: "7:30:00",
            date: "Thu Sep 14 2023",
            members: ["/member4.png", "/member5.png"],
        },
    ],
};

const Home = () => {
    const [filter, setFilter] = useState<"all" | "active" | "ended" | "voted">(
        "active"
    );

    const [activeTab, setActiveTab] = useState("active");

    const tabs: {
        name: string;
        value: "all" | "active" | "ended" | "voted";
    }[] = [
        { name: "All Polls", value: "all" },
        { name: "Active", value: "active" },
        { name: "Ended", value: "ended" },
        { name: "My Voted", value: "voted" },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="ml-64 flex flex-col w-full h-screen">
                <TopBar title="Polling Dashboard" />
                <div className="flex flex-col flex-grow p-6 h-full">
                    {/* Filters */}
                    <div>
                        {tabs.map((tab) => (
                            <button
                                key={tab.value}
                                className={`px-4 py-2 rounded-t-lg bg-${
                                    activeTab === tab.value ? "white" : ""
                                } mr-4  hover:bg-${
                                    activeTab === tab.value ? "blue" : "gray"
                                }-300`}
                                onClick={() => (
                                    setActiveTab(tab.value),
                                    setFilter(tab.value)
                                )}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    <div className="flex-grow overflow-hidden h-full">
                        <VotingTable
                            title={`${
                                filter.charAt(0).toUpperCase() + filter.slice(1)
                            } Polls`}
                            data={allPolls[filter]}
                            isActive={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
