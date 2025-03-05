import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";

// Sample donut data
const donutData = [
  { name: "QLD", value: 8.8 },
  { name: "SA", value: 3.5 },
  { name: "WA", value: 2.2 },
  { name: "VIC", value: 5.0 },
];
const donutColors = ["#6366F1", "#F59E0B", "#10B981", "#EC4899"];

// Sample "Details" area chart data
const detailsData = [
  { name: "Week 1", Opened: 7000, Engaged: 4000, EOI: 2000 },
  { name: "Week 2", Opened: 10000, Engaged: 6000, EOI: 3000 },
  { name: "Week 3", Opened: 13000, Engaged: 9000, EOI: 4000 },
  { name: "Week 4", Opened: 16000, Engaged: 11000, EOI: 4500 },
];

// Sample "New Request Trend" line chart data
const requestTrendData = [
  { name: "Jan", Development: 400, Investment: 240, BuildHold: 240 },
  { name: "Feb", Development: 300, Investment: 139, BuildHold: 221 },
  { name: "Mar", Development: 200, Investment: 980, BuildHold: 229 },
  { name: "Apr", Development: 278, Investment: 390, BuildHold: 200 },
  { name: "May", Development: 189, Investment: 480, BuildHold: 218 },
  { name: "Jun", Development: 239, Investment: 380, BuildHold: 250 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-white text-gray-800">
      {/* SIDEBAR */}
      <aside className="hidden md:flex flex-col w-20 xl:w-64 bg-white shadow-sm">
        {/* Top Section: Logo / Brand */}
        <div className="flex items-center justify-center xl:justify-start p-4 h-16 border-b border-gray-200">
          {/* Replace with your logo or brand icon */}
          <div className="w-8 h-8 bg-black rounded-full mr-0 xl:mr-2" />
          <span className="hidden xl:inline-block font-bold text-lg">YourBrand</span>
        </div>

        {/* Navigation Links (dummy data) */}
        <nav className="flex-1 flex flex-col p-4 space-y-4">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-black transition">
            <div className="w-5 h-5 bg-gray-300 rounded" />
            <span className="hidden xl:inline">Dashboard</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-black transition">
            <div className="w-5 h-5 bg-gray-300 rounded" />
            <span className="hidden xl:inline">Projects</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-black transition">
            <div className="w-5 h-5 bg-gray-300 rounded" />
            <span className="hidden xl:inline">Teams</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-black transition">
            <div className="w-5 h-5 bg-gray-300 rounded" />
            <span className="hidden xl:inline">Calendar</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-black transition">
            <div className="w-5 h-5 bg-gray-300 rounded" />
            <span className="hidden xl:inline">Reports</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-black transition">
            <div className="w-5 h-5 bg-gray-300 rounded" />
            <span className="hidden xl:inline">Settings</span>
          </button>
        </nav>

        {/* Bottom Section: User Avatar */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
            <div className="hidden xl:inline">
              <p className="font-semibold">Username</p>
              <p className="text-sm text-gray-500">View Profile</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-6">
        {/* Header Row */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between mb-6">
          {/* Dashboard Title */}
          <h1 className="text-2xl md:text-3xl font-bold mb-4 xl:mb-0">Dashboard</h1>

          {/* Top Stats (aligned right on large screens) */}
          <div className="flex items-center space-x-6">
            {/* Stat 1 */}
            <div className="text-right">
              <p className="text-xl md:text-2xl font-bold">12K+</p>
              <p className="text-sm text-gray-500">Creating and submitting your EOI</p>
            </div>
            {/* Divider */}
            <div className="w-px h-6 bg-gray-300" />
            {/* Stat 2 */}
            <div className="text-right">
              <p className="text-xl md:text-2xl font-bold">81%</p>
              <p className="text-sm text-gray-500">Approval of new requests</p>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">
            {/* Borrowers by State (Donut Chart) */}
            <div className="bg-white rounded-xl shadow p-4 md:p-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full" />
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg md:text-xl font-semibold">Borrowers by State</h3>
                  <span className="text-gray-500">$25.5M Total Amount</span>
                </div>
                <div className="flex items-center justify-center h-72 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        label
                      >
                        {donutData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={donutColors[index % donutColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <div>QLD: $8.8M</div>
                  <div>SA: $3.5M</div>
                  <div>WA: $2.2M</div>
                  <div>VIC: $5.0M</div>
                </div>
              </div>
            </div>

            {/* Details (Wave/Area Chart) */}
            <div className="bg-white rounded-xl shadow p-4 md:p-6 relative overflow-hidden">
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-50 rounded-full" />
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg md:text-xl font-semibold">Details</h3>
                  <span className="text-gray-500">EOI Metrics</span>
                </div>
                <div className="relative h-72 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={detailsData}>
                      <defs>
                        <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorEngaged" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorEOI" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="Opened"
                        stroke="#3B82F6"
                        fillOpacity={1}
                        fill="url(#colorOpened)"
                      />
                      <Area
                        type="monotone"
                        dataKey="Engaged"
                        stroke="#10B981"
                        fillOpacity={1}
                        fill="url(#colorEngaged)"
                      />
                      <Area
                        type="monotone"
                        dataKey="EOI"
                        stroke="#F59E0B"
                        fillOpacity={1}
                        fill="url(#colorEOI)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <div>Opened: 27.8K</div>
                  <div>Engaged: 67%</div>
                  <div>EOI Sent: 24%</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">
            {/* Map Preview */}
            <div className="bg-white rounded-xl shadow p-4 md:p-6 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-yellow-50 rounded-full" />
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg md:text-xl font-semibold">Map Preview</h3>
                  <span className="text-gray-500">$13.26M Western Australia</span>
                </div>
                {/* Placeholder for a real map */}
                <div className="flex items-center justify-center h-72 bg-gray-100 rounded mb-4">
                  <span className="text-gray-400">Map Visualization</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <div>0-60%</div>
                  <div>60-80%</div>
                  <div>80-100%</div>
                </div>
              </div>
            </div>

            {/* New Request Trend (Line Chart) */}
            <div className="bg-white rounded-xl shadow p-4 md:p-6 relative overflow-hidden">
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-green-50 rounded-full" />
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg md:text-xl font-semibold">New Request Trend</h3>
                  <span className="text-gray-500">Overview</span>
                </div>
                <div className="h-72 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={requestTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="Development"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="Investment"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="BuildHold"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-around text-sm text-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full" />
                    <span>Development</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                    <span>Investment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <span>Build and Hold</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;