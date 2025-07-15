import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import LabourManager from './pages/Labours/AllLabours';
import AllAttendance from './pages/attendance/Allattendance';
import LoginPage from './pages/login';
import ProtectedRoute from './components/ProtectedRoute';
// Import other pages like Salary, Reports, Categories, Admin as needed

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route: Login */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected layout wrapper */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            </ProtectedRoute>
          }
        >
          {/* All protected routes now flattened */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/labours" element={<LabourManager />} />
          <Route path="/attendance" element={<AllAttendance />} />
          {/* Add other routes similarly */}
          {/* <Route path="/salary" element={<Salary />} /> */}
          {/* <Route path="/categories" element={<Categories />} /> */}
          {/* <Route path="/reports" element={<Reports />} /> */}
          {/* <Route path="/admin" element={<AdminSettings />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
