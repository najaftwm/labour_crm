import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Plus } from "lucide-react";

const BASE_URL = "https://www.test.scorpionlogistics.qa/api/";

export default function LabourManager() {
  const [labours, setLabours] = useState([]);
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchLabours();
  }, []);

  const fetchLabours = async () => {
    try {
      const res = await axios.get(`${BASE_URL}get_labours.php`);
      if (res.data.status) {
        setLabours(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch labours", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name) return alert("Name is required");

    const url = editId
      ? `${BASE_URL}update_labour.php`
      : `${BASE_URL}create_labour.php`;

    const payload = {
      ...formData,
      id: editId || undefined,
      is_active: "1",
    };

    try {
      const res = await axios.post(url, payload);
      alert(res.data.message);
      setFormData({});
      setEditId(null);
      fetchLabours();
    } catch (error) {
      alert("Failed to submit labour data.");
    }
  };

  const handleEdit = (labour) => {
    setFormData(labour);
    setEditId(labour.id);
  };

  const handleCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeactivate = async () => {
    for (const id of selectedIds) {
      await axios.post(`${BASE_URL}deactivate_labour.php`, {
        id,
      });
    }
    setSelectedIds([]);
    fetchLabours();
  };

  return (
    <div className="w-full bg-white min-h-screen text-gray-800 p-3 space-y-4 text-[11px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-blue-800">Labour Manager</h1>
        <button
          onClick={() => {
            setFormData({});
            setEditId(null);
          }}
          className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs"
        >
          <Plus size={14} />
          Create
        </button>
      </div>

      {/* Form */}
      <div className="bg-blue-50 p-2 rounded border border-blue-100">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <input name="name" value={formData.name || ""} onChange={handleChange} placeholder="Name" className="p-1 border border-black rounded text-[11px]" />
          <input name="category" value={formData.category || ""} onChange={handleChange} placeholder="Category" className="p-1 border border-black rounded text-[11px]" />
          <input name="contact" value={formData.contact || ""} onChange={handleChange} placeholder="Contact" className="p-1 border border-black rounded text-[11px]" />
          <input name="department" value={formData.department || ""} onChange={handleChange} placeholder="Department" className="p-1 border border-black rounded text-[11px]" />
          <input name="id_proof" value={formData.id_proof || ""} onChange={handleChange} placeholder="ID Proof" className="p-1 border border-black rounded text-[11px]" />
        </div>
        <button
          onClick={handleSubmit}
          className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
        >
          {editId ? "Update" : "Create"}
        </button>
      </div>

      {/* Table Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-base font-semibold text-blue-700">Labour List</h2>
        {selectedIds.length > 0 && (
          <button
            onClick={handleDeactivate}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
          >
            Deactivate Selected
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded bg-white max-h-[60vh] overflow-y-auto">
        <table className="min-w-full text-[11px]">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="p-1 text-left">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 bg-white border border-black rounded"
                  checked={selectedIds.length === labours.length && labours.length > 0}
                  onChange={() =>
                    setSelectedIds(
                      selectedIds.length === labours.length ? [] : labours.map((l) => l.id)
                    )
                  }
                />
              </th>
              <th className="p-1 text-left">Name</th>
              <th className="p-1 text-left">Category</th>
              <th className="p-1 text-left">Contact</th>
              <th className="p-1 text-left">Department</th>
              <th className="p-1 text-left">ID Proof</th>
              <th className="p-1 text-left">Status</th>
              <th className="p-1 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {labours.map((l) => (
              <tr
                key={l.id}
                className={l.is_active === "1" ? "bg-white" : "bg-gray-100 text-gray-500"}
              >
                <td className="p-1">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 bg-white border border-black rounded"
                    checked={selectedIds.includes(l.id)}
                    onChange={() => handleCheckbox(l.id)}
                  />
                </td>
                <td className="p-1">{l.name}</td>
                <td className="p-1">{l.category}</td>
                <td className="p-1">{l.contact}</td>
                <td className="p-1">{l.department || "-"}</td>
                <td className="p-1">{l.id_proof}</td>
                <td className="p-1 font-semibold">
                  {l.is_active === "1" ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-red-500">Inactive</span>
                  )}
                </td>
                <td className="p-1">
                  <button
                    onClick={() => handleEdit(l)}
                    className="text-blue-300 hover:underline text-[11px] flex items-center gap-1 bg-white border border-black rounded px-1 py-0.5"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {labours.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-3 text-gray-500">
                  No labours found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
