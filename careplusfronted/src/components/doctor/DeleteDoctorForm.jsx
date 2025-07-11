import React, { useState, useRef } from 'react';
import { API } from '../../services/Api';

export default function DeleteDoctorForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [statusType, setStatusType] = useState('success');
  const searchTimeout = useRef();

  const handleSearch = async () => {
    setLoading(true);
    try {
      let response;
      if (!searchInput.trim() && searchType === 'id') {
        setStatus("Please enter a valid ID.");
        setStatusType('error');
        setResults([]);
        setLoading(false);
        return;
      }
      if (searchType === 'id') {
        response = await fetch(`${API}/api/doctors/${searchInput.trim()}`);
        if (!response.ok) throw new Error("Doctor not found");
        const doctor = await response.json();
        // Robustly check for doctor data
        const docData = doctor.doctorDTO || doctor.doctor || doctor;
        if (!docData || !docData.doctorId) throw new Error("Doctor not found");
        setResults([{
          doctorId: docData.doctorId,
          name: docData.name,
          specialist: docData.specialist,
          availableDates: doctor.dates || [],
        }]);
      } else if (searchType === 'name' && !searchInput.trim()) {
        // Fetch all doctors if name input is empty
        response = await fetch(`${API}/api/doctors`);
        if (!response.ok) throw new Error("Doctors not found");
        const doctors = await response.json();
        const formatted = doctors.map(doc => ({
          doctorId: doc.doctor?.doctorId || doc.doctorId,
          name: doc.doctor?.name || doc.name,
          specialist: doc.doctor?.specialist || doc.specialist,
          availableDates: doc.availableDates || [],
        }));
        setResults(formatted);
      } else {
        response = await fetch(`${API}/api/doctors/search?name=${searchInput.trim()}`);
        if (!response.ok) throw new Error("Doctors not found");
        const doctors = await response.json();
        const formatted = doctors.map(doc => ({
          doctorId: doc.doctor?.doctorId || doc.doctorId,
          name: doc.doctor?.name || doc.name,
          specialist: doc.doctor?.specialist || doc.specialist,
          availableDates: doc.availableDates || [],
        }));
        setResults(formatted);
      }
      setSelectedDoctor(null);
      setStatus('');
      setStatusType('success');
    } catch (error) {
      console.error("Error fetching doctor(s):", error);
      setStatus(error.message || "Doctor not found or server error.");
      setStatusType('error');
      setResults([]);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API}/api/doctors/${selectedDoctor.doctorId}`, {
        method: 'DELETE',
      });

      const result = await response.text();

      if (response.ok) {
        setStatus(`Doctor ${selectedDoctor.name} (ID: ${selectedDoctor.doctorId}) deleted successfully!`);
        setStatusType('success');
        setResults(prev => prev.filter(doc => doc.doctorId !== selectedDoctor.doctorId));
      } else {
        setStatus(`Failed to delete doctor: ${result}`);
        setStatusType('error');
      }
    } catch (err) {
      console.error("Delete error:", err);
      setStatus("Error connecting to server.");
      setStatusType('error');
    }

    setShowOverlay(true);
    setSelectedDoctor(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Delete Doctor</h2>

      {!selectedDoctor ? (
        <>
          <div className="flex gap-2">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="id">Search by ID</option>
              <option value="name">Search by Name</option>
            </select>
            <input
              type="text"
              placeholder={`Enter ${searchType === 'id' ? 'ID' : 'Name'}`}
              className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchInput}
              onChange={e => {
                setSearchInput(e.target.value);
                setSearchAttempted(false);
                if (searchType === 'name') {
                  if (searchTimeout.current) clearTimeout(searchTimeout.current);
                  searchTimeout.current = setTimeout(() => handleSearch(), 300);
                }
              }}
              onKeyDown={e => { if (e.key === 'Enter') { setSearchAttempted(true); handleSearch(); } }}
            />
            <button
              onClick={() => { setSearchAttempted(true); handleSearch(); }}
              className="px-4 py-2 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              Search
            </button>
          </div>

          {loading && (
            <div className="flex items-center gap-2 mt-2">
              <span className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></span>
              <span className="text-purple-600 font-medium">Loading doctor data...</span>
            </div>
          )}
          {!loading && results.length === 0 && searchInput && (
            ((searchType === 'name' && searchInput.length > 1) || (searchType === 'id' && searchAttempted)) && (
              <div className="text-purple-600 mt-2">No doctor data available.</div>
            )
          )}

      {results.length > 0 && (
        <ul className="space-y-4 w-full h-[350px] overflow-y-auto mt-4 pr-2">
          {results.map(doc => (
            doc && doc.name && doc.doctorId ? (
              <li
                key={doc.doctorId}
                className="flex justify-between items-center bg-gray-50 border border-gray-300 shadow-sm rounded-xl px-6 py-4"
              >
                <div>
                  <p className="font-semibold text-lg text-gray-800">{doc.name}</p>
                  <p className="text-sm text-gray-600">
                    ID: {doc.doctorId} | Specialist: {doc.specialist}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDoctor(doc)}
                  className="px-4 py-2 rounded border border-red-600 text-red-700 font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                >
                  Delete
                </button>
              </li>
            ) : null
          ))}
        </ul>
      )}

        </>
      ) : (
        <div className="text-center space-y-4 border p-6 rounded bg-gray-50 shadow-sm">
          <p className="text-lg font-medium text-gray-700">Are you sure you want to delete this doctor?</p>
          <div className="text-sm font-medium border p-4 rounded bg-white text-gray-700">
            <p><strong>ID:</strong> {selectedDoctor.doctorId}</p>
            <p><strong>Name:</strong> {selectedDoctor.name}</p>
            <p><strong>Specialist:</strong> {selectedDoctor.specialist}</p>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded border border-red-600 text-red-700 font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            >
              Confirm Delete
            </button>
            <button
              onClick={() => setSelectedDoctor(null)}
              className="px-4 py-2 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showOverlay && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
          <div className={`bg-white p-6 rounded shadow-lg w-96 text-center border ${statusType === 'success' ? 'border-green-500' : 'border-red-500'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${statusType === 'success' ? 'text-green-700' : 'text-red-700'}`}>{status}</h3>
            <button
              onClick={() => setShowOverlay(false)}
              className="px-4 py-2 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
