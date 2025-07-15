import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen w-screen overflow-hidden">
      <div
        className="transition-all duration-300"
        style={{
          width: isSidebarOpen ? "30vw" : "7vw",
          minWidth: isSidebarOpen ? "220px" : "80px",
          maxWidth: isSidebarOpen ? "320px" : "90px",
        }}
      >
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
