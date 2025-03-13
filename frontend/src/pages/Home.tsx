import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import VotingTable from "../components/VotingTable";

const allPolls = {
    all: [
        {
            id: 1,
            name: "TMU Election 2025",
            description: "Vote for the next student council president. Vote for the next student council president. Vote for the next student council president.Vote for the next student council president. Vote for the next student council president.",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: [
                { id: "c1", name: "Jeff Johnson", image: "/jeff.png" },
                { id: "c2", name: "Bob Smith", image: "/bob.png" },
                { id: "c3", name: "Joe Davis", image: "/joe.png" },
                { id: "c4", name: "Moe Anderson", image: "/moe.png" },
                { id: "c5", name: "Jeff Johnson", image: "/jeff.png" },
                { id: "c6", name: "Bob Smith", image: "/bob.png" },
                { id: "c7", name: "Joe Davis", image: "/joe.png" },
                { id: "c8", name: "Moe Anderson", image: "/moe.png" },
                { id: "c9", name: "Jeff Johnson", image: "/jeff.png" },
                { id: "c10", name: "Bob Smith", image: "/bob.png" },
                { id: "c11", name: "Joe Davis", image: "/joe.png" },
                { id: "c12", name: "Moe Anderson", image: "/moe.png" },
                { id: "c9", name: "Jeff Johnson", image: "/jeff.png" },
                { id: "c10", name: "Bob Smith", image: "/bob.png" },
                { id: "c11", name: "Joe Davis", image: "/joe.png" },
                { id: "c12", name: "Moe Anderson", image: "/moe.png" },
                { id: "c9", name: "Jeff Johnson", image: "/jeff.png" },
                { id: "c10", name: "Bob Smith", image: "/bob.png" },
                { id: "c11", name: "Joe Davis", image: "/joe.png" },
                { id: "c12", name: "Moe Anderson", image: "/moe.png" },
                
            ],
            voters: 2,
            expiry: {
                time: "5:49:48",
                date: "Fri Sep 08 2023",
            },
            isActive: true,
            members: ["/member1.png", "/member2.png", "/member3.png"],
        },
        {
            id: 2,
            name: "New Two",
            description:
                "Select the best community leader for the upcoming year.",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: [
                { id: "c5", name: "Alice Carter", image: "/alice.png" },
                { id: "c6", name: "Tom Rogers", image: "/tom.png" },
            ],
            voters: 0,
            expiry: {
                time: "12:08:36",
                date: "Wed Aug 30 2023",
            },
            isActive: false,
            members: ["/member1.png", "/member2.png", "/member3.png"],
        },
    ],
    active: [
                {
            id: 1,
            name: "TMU Election 2025",
            description: "Vote for the next student council president.",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: [
                { id: "c1", name: "Jeff Johnson", image: "/jeff.png" },
                { id: "c2", name: "Bob Smith", image: "/bob.png" },
                { id: "c3", name: "Joe Davis", image: "/joe.png" },
                { id: "c4", name: "Moe Anderson", image: "/moe.png" },
                { id: "c1", name: "Jeff Johnson", image: "/jeff.png" },
                { id: "c2", name: "Bob Smith", image: "/bob.png" },
                { id: "c3", name: "Joe Davis", image: "/joe.png" },
                { id: "c4", name: "Moe Anderson", image: "/moe.png" },
                { id: "c1", name: "Jeff Johnson", image: "/jeff.png" },
                { id: "c2", name: "Bob Smith", image: "/bob.png" },
                { id: "c3", name: "Joe Davis", image: "/joe.png" },
                { id: "c4", name: "Moe Anderson", image: "/moe.png" },
            ],
            voters: 2,
            expiry: {
                time: "5:49:48",
                date: "Fri Sep 08 2023",
            },
            isActive: true,
            members: ["/member1.png", "/member2.png", "/member3.png"],
        },
                {
            id: 1,
            name: "TMU Election 2025",
            description: "Vote for the next student council president.",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: [
                { id: "c1", name: "Jeff Johnson", image: "/jeff.png" },
                { id: "c2", name: "Bob Smith", image: "/bob.png" },
                { id: "c3", name: "Joe Davis", image: "/joe.png" },
                { id: "c4", name: "Moe Anderson", image: "/moe.png" },
            ],
            voters: 2,
            expiry: {
                time: "5:49:48",
                date: "Fri Sep 08 2023",
            },
            isActive: true,
            members: ["/member1.png", "/member2.png", "/member3.png"],
        },
                {
            id: 1,
            name: "TMU Election 2025",
            description: "Vote for the next student council president.",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: [
                { id: "c1", name: "Jeff Johnson", image: "/jeff.png" },
                { id: "c2", name: "Bob Smith", image: "/bob.png" },
                { id: "c3", name: "Joe Davis", image: "/joe.png" },
                { id: "c4", name: "Moe Anderson", image: "/moe.png" },
            ],
            voters: 2,
            expiry: {
                time: "5:49:48",
                date: "Fri Sep 08 2023",
            },
            isActive: true,
            members: ["/member1.png", "/member2.png", "/member3.png"],
        },
    ],
    ended: [
                {
            id: 1,
            name: "TMU Election 2025",
            description: "Vote for the next student council president.",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: [
                { id: "c1", name: "Jeff Johnson", image: "/jeff.png" },
                { id: "c2", name: "Bob Smith", image: "/bob.png" },
                { id: "c3", name: "Joe Davis", image: "/joe.png" },
                { id: "c4", name: "Moe Anderson", image: "/moe.png" },
            ],
            voters: 2,
            expiry: {
                time: "5:49:48",
                date: "Fri Sep 08 2023",
            },
            isActive: true,
            members: ["/member1.png", "/member2.png", "/member3.png"],
        },
    ],
    voted: [
                {
            id: 1,
            name: "TMU Election 2025",
            description: "Vote for the next student council president.",
            address: "0x46B7D5C307D19A452d3aC8f9a19fd",
            candidates: [
                { id: "c1", name: "Jeff Johnson", image: "/jeff.png" },
                { id: "c2", name: "Bob Smith", image: "/bob.png" },
                { id: "c3", name: "Joe Davis", image: "/joe.png" },
                { id: "c4", name: "Moe Anderson", image: "/moe.png" },
            ],
            voters: 2,
            expiry: {
                time: "5:49:48",
                date: "Fri Sep 08 2023",
            },
            isActive: true,
            members: ["/member1.png", "/member2.png", "/member3.png"],
        },
    ],
};

const Home = () => {
    const [filter, setFilter] = useState<"all" | "active" | "ended" | "voted">(
        "all"
    );

    const [activeTab, setActiveTab] = useState("all");

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
