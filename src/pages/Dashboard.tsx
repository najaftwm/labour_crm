import { useEffect, useState } from 'react';
import {
  Users,
  CalendarDays,
  Wallet,
  HandCoins,
  Plus,
  Clock,
  FileText,
  AlertCircle,
} from 'lucide-react';

export default function Dashboard() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen text-gray-800 space-y-8">
      {/* 👋 Welcome Banner */}
      <div>
        <h1 className="text-3xl font-bold text-blue-800">Welcome back, Admin</h1>
        <p className="text-sm text-gray-500 mt-1">{dateTime.toLocaleString()}</p>
      </div>

      {/* 🔢 Key Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Labours" value="58" icon={<Users size={28} className="text-blue-600" />} />
        <StatCard title="Present Today" value="45" icon={<CalendarDays size={28} className="text-blue-600" />} />
        <StatCard title="Today's Wage Expense" value="₹18,500" icon={<Wallet size={28} className="text-blue-600" />} />
        <StatCard title="Pending Advances" value="₹3,000" icon={<HandCoins size={28} className="text-blue-600" />} />
      </div>

      {/* 📊 Attendance Chart & 💰 Salary Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-5 rounded-lg shadow-sm border border-blue-100">
          <h2 className="font-semibold text-blue-800 mb-3 text-lg">Weekly Attendance</h2>
          <div className="h-48 bg-white border border-dashed border-blue-200 rounded-md flex items-center justify-center text-gray-400">
            [Attendance Chart Placeholder]
          </div>
        </div>

        <div className="bg-blue-50 p-5 rounded-lg shadow-sm border border-blue-100 space-y-3">
          <h2 className="font-semibold text-blue-800 mb-3 text-lg">Salary Summary</h2>
          <SummaryItem label="Monthly Salary Paid" value="₹48,000" />
          <SummaryItem label="Advance Paid This Month" value="₹5,500" />
          <SummaryItem label="Upcoming Dues" value="₹12,000" />
        </div>
      </div>

      {/* 🛠️ Quick Actions & 📢 Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-blue-100 space-y-3">
          <h2 className="font-semibold text-blue-800 mb-3 text-lg">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <ActionButton label="Add Labour" icon={<Plus size={16} />} />
            <ActionButton label="Mark Attendance" icon={<Clock size={16} />} />
            <ActionButton label="Create Salary Slip" icon={<FileText size={16} />} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-blue-100 space-y-3">
          <h2 className="font-semibold text-blue-800 mb-3 text-lg">Alerts & Reminders</h2>
          <AlertItem message="3 labours missing attendance today" />
          <AlertItem message="2 labour contracts expiring next week" />
          <AlertItem message="Advance payment pending for 5 labours" />
        </div>
      </div>

      {/* 📆 Mini Calendar */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-blue-100">
        <h2 className="font-semibold text-blue-800 mb-3 text-lg">Mini Calendar</h2>
        <div className="h-64 bg-blue-50 rounded-md flex items-center justify-center text-gray-400">
          [Mini Calendar Placeholder]
        </div>
      </div>
    </div>
  );
}

// 🔁 Reusable Components

const StatCard = ({ title, value, icon }) => (
  <div className="bg-blue-50 rounded-lg p-4 shadow-sm flex items-center gap-4 border border-blue-100">
    <div className="bg-white rounded-full p-2 shadow">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold text-blue-800">{value}</p>
    </div>
  </div>
);

const SummaryItem = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold text-blue-800">{value}</span>
  </div>
);

const ActionButton = ({ label, icon }) => (
  <button className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded hover:bg-blue-200 transition text-sm font-medium">
    {icon}
    {label}
  </button>
);

const AlertItem = ({ message }) => (
  <div className="flex items-center gap-2 text-sm text-blue-800">
    <AlertCircle size={16} className="text-blue-600" />
    {message}
  </div>
);
