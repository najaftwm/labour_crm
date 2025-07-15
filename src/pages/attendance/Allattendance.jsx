import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://www.test.scorpionlogistics.qa/api/";

export default function AllAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [labours, setLabours] = useState([]);
  const [labourId, setLabourId] = useState("");
  const [status, setStatus] = useState("Present");
  const [date, setDate] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${BASE_URL}get_attendance.php`);
      if (res.data.status) {
        setAttendance(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  const fetchLabours = async () => {
    try {
      const res = await axios.get(`${BASE_URL}get_labours.php`);
      if (res.data.status) {
        setLabours(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching labours:", err);
    }
  };

  useEffect(() => {
    fetchAttendance();
    fetchLabours();
  }, []);

  const getLabourName = (id) => {
    const labour = labours.find((l) => l.id === parseInt(id));
    return labour ? labour.name : `ID ${id}`;
  };

  const handleSubmit = async () => {
    if (!labourId || !date || !status || !hoursWorked || !hourlyRate) {
      alert("All fields are required");
      return;
    }

    try {
      const url = editingId
        ? `${BASE_URL}update_attendance.php`
        : `${BASE_URL}add_attendance.php`;

      const payload = editingId
        ? { id: editingId, status }
        : {
            labour_id: parseInt(labourId),
            status,
            date,
            time: new Date().toLocaleTimeString(),
            hours_worked: parseFloat(hoursWorked),
            hourly_rate: parseFloat(hourlyRate),
          };

      const res = await axios.post(url, payload);
      alert(res.data.message);
      setEditingId(null);
      setLabourId("");
      setStatus("Present");
      setDate("");
      setHoursWorked("");
      setHourlyRate("");
      fetchAttendance();
    } catch (err) {
      console.error("Error submitting attendance:", err);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setLabourId(row.labour_id);
    setStatus(row.status);
    setDate(row.date);
    setHoursWorked(row.hours_worked || "");
    setHourlyRate(row.hourly_rate || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this attendance record?")) return;

    try {
      const res = await axios.post(`${BASE_URL}delete_attendance.php`, { id });
      alert(res.data.message);
      fetchAttendance();
    } catch (err) {
      console.error("Error deleting attendance:", err);
    }
  };

  const totalPages = Math.ceil(attendance.length / itemsPerPage);
  const paginatedData = attendance.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="p-4 bg-white text-gray-800 text-[12px] space-y-4">
      <h1 className="text-lg font-bold text-blue-700">Attendance Manager</h1>

      {/* Form */}
      <div className="bg-blue-50 border border-blue-100 p-3 rounded">
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
          <select
            value={labourId}
            onChange={(e) => setLabourId(e.target.value)}
            className="p-1 border rounded text-[12px]"
            disabled={!!editingId}
          >
            <option value="">Select Labour</option>
            {labours.map((labour) => (
              <option key={labour.id} value={labour.id}>
                {labour.name} (ID: {labour.id})
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Hours"
            value={hoursWorked}
            onChange={(e) => setHoursWorked(e.target.value)}
            className="p-1 border rounded text-[12px]"
          />

          <input
            type="number"
            placeholder="Hourly Rate"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            className="p-1 border rounded text-[12px]"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-1 border rounded text-[12px]"
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Half">Half</option>
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-1 border border-black rounded text-[12px] text-black cursor-pointer"
            disabled={!!editingId}
          />

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-[12px]"
          >
            {editingId ? "Update" : "Add"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded bg-white max-h-[60vh] overflow-y-auto">
        <table className="min-w-full text-[11px] border-collapse">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Labour</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Hours</th>
              <th className="p-2 border">Rate</th>
              <th className="p-2 border">Daily Wage</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => {
              const wage = (parseFloat(row.hours_worked || 0) * parseFloat(row.hourly_rate || 0)).toFixed(2);
              return (
                <tr key={row.id} className="hover:bg-blue-50">
                  <td className="p-2 border text-center">
                    {(page - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-2 border text-center">
                    {row.labour_name || getLabourName(row.labour_id)}
                  </td>
                  <td className="p-2 border text-center">{row.date}</td>
                  <td className="p-2 border text-center">{row.status}</td>
                  <td className="p-2 border text-center">{row.hours_worked || "-"}</td>
                  <td className="p-2 border text-center">{row.hourly_rate || "-"}</td>
                  <td className="p-2 border text-center">{wage}</td>
                  <td className="p-2 border text-center space-x-2">
                    <button
                      onClick={() => handleEdit(row)}
                      className="text-yellow-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-3 text-gray-500">
                  No attendance found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 mt-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
