import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Wallet,
  ListTree,
  BarChart2,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FC } from "react";
import { useUser } from "../context/UserContext"; // ✅ Correct import

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Labours", path: "/labours" },
  { icon: CalendarDays, label: "Attendance", path: "/attendance" },
  { icon: Wallet, label: "Salary", path: "/salary" },
  { icon: ListTree, label: "Categories", path: "/categories" },
  { icon: BarChart2, label: "Reports", path: "/reports" },
  { icon: Settings, label: "Settings", path: "/admin" },
];

const Sidebar: FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user } = useUser(); // ✅ Access user from context

  return (
    <div
      className="fixed top-0 left-0 h-screen z-50 bg-gradient-to-b from-blue-100 to-white border-r border-gray-200 shadow-md flex flex-col justify-between transition-all duration-300 overflow-y-auto"
      style={{
        width: isOpen ? "30vw" : "10vw",
        minWidth: isOpen ? "220px" : "80px",
        maxWidth: isOpen ? "320px" : "120px",
        overflowX: "hidden",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-300">
        <span className="text-blue-800 font-bold text-xl tracking-wide">
          {isOpen ? "CRM System" : ""}
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-500 hover:text-blue-600 transition"
        >
          {isOpen ? <ChevronLeft size={22} /> : <ChevronRight size={15} />}
        </button>
      </div>

      {/* Navigation */}
      <nav
        className={`flex flex-col ${
          isOpen ? "items-start px-3 py-10 space-y-4" : "items-center py-10 space-y-5"
        }`}
      >
        {menuItems.map(({ icon: Icon, label, path }) => (
          <div key={path} className="relative w-full">
            <NavLink
              to={path}
              className={({ isActive }) =>
                `group relative flex items-center rounded-lg text-[15px] font-medium transition-all duration-200 ${
                  isOpen ? "gap-4 px-4 py-2 w-full" : "justify-center"
                } ${
                  isActive
                    ? "bg-blue-200 text-blue-800"
                    : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                }`
              }
            >
              <Icon size={22} className="transition-transform group-hover:scale-110" />
              {isOpen ? (
                <span>{label}</span>
              ) : (
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 shadow pointer-events-none">
                  {label}
                </span>
              )}
            </NavLink>
          </div>
        ))}
      </nav>

      {/* User Info */}
      {user?.username && (
        <div
          className={`text-sm text-gray-700 ${
            isOpen ? "text-left px-4 pb-2" : "text-center pb-2"
          }`}
        >
          <span className="font-medium text-l">{user.username}</span>
        </div>
      )}

      {/* Footer */}
      <div
        className={`border-t border-gray-200 ${
          isOpen ? "px-3 py-4" : "py-4 flex justify-center"
        }`}
      >
        <NavLink
          to="/logout"
          className={`group relative flex items-center rounded-lg text-[15px] font-medium transition-all duration-200 ${
            isOpen ? "gap-4 px-4 py-2 w-full" : "justify-center"
          } text-gray-600 hover:text-red-500 hover:bg-red-100`}
        >
          <LogOut size={22} className="group-hover:scale-110 transition-transform" />
          {isOpen ? (
            <span>Logout</span>
          ) : (
            <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 shadow pointer-events-none">
              Logout
            </span>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
