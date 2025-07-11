import React, { useState, useRef } from 'react';
import axios from 'axios';
import { API } from '../../services/Api';
function SearchPatientForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [patientResults, setPatientResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [statusType, setStatusType] = useState('success');
  const searchTimeout = useRef();

  const handleSearch = async () => {
    setPatientResults([]);
    setSelectedPatient(null);
    setStatus('');
    setLoading(true);
    try {
      if (!searchInput.trim() && searchType === 'id') {
        setStatus('Please enter a valid ID.');
        setStatusType('error');
        setSearchAttempted(true);
        setLoading(false);
        return;
      }
      if (searchType === 'id') {
        const res = await axios.get(`${API}/api/patients/${searchInput}`);
        setPatientResults([res.data]);
      } else if (searchType === 'name' && !searchInput.trim()) {
        // Fetch all patients if name input is empty
        const res = await axios.get(`${API}/api/patients`);
        setPatientResults(res.data);
      } else {
        const res = await axios.get(`${API}/api/patients/search?name=${searchInput}`);
        setPatientResults(res.data);
      }
      setStatus('');
      setStatusType('success');
    } catch (err) {
      setStatus('No patient found !');
      setStatusType('error');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 min-h-[500px] flex flex-col">
      {/* <h2 className="text-xl font-semibold mb-4 text-green-700">Search Patient</h2> */}

      {/* Search Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500"
        >
          <option value="id">Search by ID</option>
          <option value="name">Search by Name</option>
        </select>

        <input
          type="text"
          placeholder={`Enter ${searchType === 'id' ? 'ID' : 'Name'}`}
          className="border p-2 flex-1 rounded-md min-w-[200px] focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500"
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
          <span className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></span>
          <span className="text-green-600 font-medium">Loading patient data...</span>
        </div>
      )}
      {/* Status Message */}
      {!loading && patientResults.length === 0 && searchInput && (
        ((searchType === 'name' && searchInput.length > 1) || (searchType === 'id' && searchAttempted)) && (
          <div className="text-green-600 mt-2">No patient data available.</div>
        )
      )}

      {/* Inline status message instead of overlay */}
      {/* {status && searchAttempted && (
        <div className={`mt-4 p-3 rounded text-center border ${statusType === 'success' ? 'border-green-500 text-green-700 bg-green-50' : 'border-red-500 text-red-700 bg-red-50'}`}>
          {status}
        </div>
      )} */}

      {/* Result List */}
      {patientResults.length > 0 && (
        <ul className="space-y-4 w-full h-[450px] overflow-y-auto mt-4 pr-2">
          {patientResults.map((p) => (
            <li
              key={p.id}
              className="flex justify-between items-center bg-gray-50 border border-gray-300 shadow-sm rounded-xl px-6 py-4"
            >
              <div>
                <p className="font-semibold text-lg text-gray-800">{p.name}</p>
                <p className="text-sm text-gray-600">ID: {p.id} | Gender: {p.gender} | Age: {p.age}</p>
                <p className="text-sm text-gray-600">Phone: {p.number}</p>
              </div>
              <button
                onClick={() => setSelectedPatient(p)}
                className="px-4 py-2 rounded border border-green-600 text-green-700 font-semibold hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              >
                View
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/40">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-auto relative text-left">
            <h2 className="text-xl font-bold mb-4 text-center">Patient Details</h2>
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {selectedPatient.id}</p>
              <p><strong>Name:</strong> {selectedPatient.name}</p>
              <p><strong>Age:</strong> {selectedPatient.age}</p>
              <p><strong>Gender:</strong> {selectedPatient.gender}</p>
              <p><strong>Phone:</strong> {selectedPatient.number}</p>
              <p><strong>Address:</strong> {selectedPatient.address}</p>
              <p><strong>Available:</strong> {selectedPatient.date} at {selectedPatient.time}</p>
              <p><strong>Allocated:</strong> {selectedPatient.allocated?"Yes":"No"}</p>
            </div>
            <button
              onClick={() => setSelectedPatient(null)}
              className="mt-6 w-full px-4 py-2 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPatientForm;
