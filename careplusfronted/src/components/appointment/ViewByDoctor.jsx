import React, { useState } from 'react';
import axios from 'axios';
import { API } from '../../services/Api';
function ViewByDoctor() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let response;
      if (!searchInput.trim()) {
        // If empty input, get all appointments
        response = await axios.get(`${API}/api/appointments`);
      } else if (searchType === 'id') {
        response = await axios.get(`${API}/api/appointments/doctor/${searchInput}`);
      } else {
        response = await axios.get(`${API}/api/appointments/doctor/search?name=${searchInput}`);
      }
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setResults([]);
      alert("No appointments found or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold">Search Appointments by Doctor</h2>

      {/* Search bar with orange border */}
      <div className="flex gap-2">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border border-orange-600 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="id">Doctor ID</option>
          <option value="name">Doctor Name</option>
        </select>
        <input
          type="text"
          placeholder={`Enter ${searchType === 'id' ? 'Doctor ID' : 'Doctor Name'}`}
          className="border border-orange-600 px-3 py-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={searchInput}
          onChange={e => {
            setSearchInput(e.target.value);
            setSearchAttempted(false);
            if (searchType === 'name') {
              setTimeout(() => handleSearch(), 0);
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

      {/* Appointments Display */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
            <span className="text-orange-600 font-medium text-lg">Loading appointments...</span>
          </div>
        </div>
      ) : (
        <>
          {!loading && results.length === 0 && searchInput && (
            (searchType === 'name' || (searchType === 'id' && searchAttempted)) && (
              <div className="text-orange-600 mt-2">No appointment data available.</div>
            )
          )}
          <div className="grid gap-4">
            {results.map((appt) => (
              <div key={appt.id} className="border rounded-lg p-4 shadow bg-white">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Appointment ID: {appt.id}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-1">Doctor Info</h4>
                    <p><strong>Name:</strong> {appt.docter?.doctor?.name || 'N/A'}</p>
                    <p><strong>ID:</strong> {appt.docter?.doctor?.doctorId || 'N/A'}</p>
                    <p><strong>Phone:</strong> {appt.docter?.doctor?.number || 'N/A'}</p>
                    <p><strong>Specialist:</strong> {appt.docter?.doctor?.specialist || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Patient Info</h4>
                    <p><strong>Name:</strong> {appt.patient?.name || 'N/A'}</p>
                    <p><strong>ID:</strong> {appt.patient?.id || 'N/A'}</p>
                    <p><strong>Phone:</strong> {appt.patient?.number || 'N/A'}</p>
                    <p><strong>Gender:</strong> {appt.patient?.gender || 'N/A'}</p>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <p><strong>Date:</strong> {appt.date}</p>
                  <p><strong>Time:</strong> {appt.time}</p>
                </div>
              </div>
            ))}
          </div>
          {/* {results.length === 0 && (
            <p className="text-gray-500">No appointments found.</p>
          )} */}
        </>
      )}
    </div>
  );
}

export default ViewByDoctor;
