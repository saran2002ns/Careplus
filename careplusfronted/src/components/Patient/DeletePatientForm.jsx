import React, { useState, useRef } from 'react';
import axios from 'axios';
import { API } from '../../services/Api';

function DeletePatientForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [patientResults, setPatientResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [statusType, setStatusType] = useState('success');
  const searchTimeout = useRef();
  const [showModal, setShowModal] = useState(false);

  const handleSearch = async () => {
    setPatientResults([]);
    setSelectedPatient(null);
    setStatus('');
    setLoading(true);
    try {
      let res;
      if (!searchInput.trim() && searchType === 'id') {
        setStatus('Please enter a valid ID.');
        setStatusType('error');
        setSearchAttempted(true);
        setLoading(false);
        return;
      }
      if (searchType === 'id') {
        res = await axios.get(`${API}/api/patients/${searchInput}`);
        setPatientResults([res.data]);
      } else if (searchType === 'name' && !searchInput.trim()) {
        // Fetch all patients if name input is empty
        res = await axios.get(`${API}/api/patients`);
        setPatientResults(res.data);
      } else {
        res = await axios.get(`${API}/api/patients/search?name=${searchInput}`);
        setPatientResults(res.data); 
      }
      setStatus('');
      setStatusType('success');
    } catch (err) {
      setStatus('No patient found.');
      setStatusType('error');
      if (searchAttempted) {
        // Inline status message instead of overlay
        setLoading(false);
      }
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${API}/api/patients/${selectedPatient.id}`);
      setStatus(res.data);
      setStatusType('success');
    } catch (err) {
      setStatus(err.response?.data || 'Failed to delete patient.');
      setStatusType('error');
    } finally {
      setShowModal(true);
      setPatientResults([]);
      setSelectedPatient(null);
      setSearchInput('');
    }
  };

  return (
    <div className="space-y-6 min-h-[500px] flex flex-col">
      {/* <h2 className="text-xl font-semibold mb-4 text-green-700">Delete Patient</h2> */}

      {!selectedPatient ? (
        <>
          {/* Search Row */}
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
          {/* Results */}
          {!loading && patientResults.length === 0 && searchInput && (
            ((searchType === 'name' && searchInput.length > 1) || (searchType === 'id' && searchAttempted)) && (
              <div className="text-green-600 mt-2">No patient data available.</div>
            )
          )}
          {patientResults.length > 0 && (
            <ul className="space-y-4 w-full h-[450px] overflow-y-auto mt-4 pr-2">
              {patientResults.map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between items-center bg-gray-50 border border-gray-300 shadow-sm rounded-xl px-6 py-4"
                >
                  <div>
                    <p className="font-semibold text-lg text-gray-800">{p.name}</p>
                    <p className="text-sm text-gray-600">
                      ID: {p.id} | Gender: {p.gender} | Age: {p.age}
                    </p>
                    <p className="text-sm text-gray-600">Phone: {p.number}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPatient(p)}
                    className="px-4 py-2 rounded border border-red-600 text-red-700 font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}

        </>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-lg">Are you sure you want to delete this patient?</p>
          <div className="text-sm font-medium border p-4 rounded text-left bg-gray-50 w-full max-w-md mx-auto shadow-sm">
            <p><strong>ID:</strong> {selectedPatient.id}</p>
            <p><strong>Name:</strong> {selectedPatient.name}</p>
            <p><strong>Age:</strong> {selectedPatient.age}</p>
            <p><strong>Gender:</strong> {selectedPatient.gender}</p>
            <p><strong>Phone:</strong> {selectedPatient.number}</p>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded border border-red-600 text-red-700 font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            >
              Confirm Delete
            </button>
            <button
              onClick={() => setSelectedPatient(null)}
              className="px-4 py-2 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Inline status message instead of overlay */}
      {/* {status && searchAttempted && (
        <div className={`mt-4 p-3 rounded text-center border ${statusType === 'success' ? 'border-green-500 text-green-700 bg-green-50' : 'border-red-500 text-red-700 bg-red-50'}`}>
          {status}
        </div>
      )} */}

      {/* Show overlay after delete */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/40 z-50">
          <div className={`bg-white p-6 rounded shadow-lg w-96 text-center border ${statusType === 'success' ? 'border-green-500' : 'border-red-500'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${statusType === 'success' ? 'text-green-700' : 'text-red-700'}`}>{status}</h3>
            <button
              onClick={() => {
                setShowModal(false);
                setStatus('');
              }}
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

export default DeletePatientForm;
