import React, { useState, useRef } from 'react';
import axios from 'axios';
import { API } from '../../services/Api';
function RemoveReceptionistForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [selectedReceptionist, setSelectedReceptionist] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('success'); // 'success' or 'error'
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const searchTimeout = useRef();

  const handleSearch = async () => {
    try {
      setLoading(true);
      let res;
      if (searchType === 'id') {
        if (!searchInput.trim()) {
          res = await axios.get(`${API}/api/receptionists`);
          setResults(res.data);
        } else {
          res = await axios.get(`${API}/api/receptionists/${searchInput}`);
          setResults([res.data]);
        }
      } else {
        if (!searchInput.trim()) {
          res = await axios.get(`${API}/api/receptionists`);
          setResults(res.data);
        } else {
          res = await axios.get(`${API}/api/receptionists/search?name=${searchInput}`);
          setResults(res.data);
        }
      }
    } catch (err) {
      setResults([]);
      setStatusMessage('Receptionist not found');
      setStatusType('error');
      setShowStatus(true);
    } finally {
      setLoading(false);
      setSearchAttempted(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/receptionists/${id}`);
      setStatusMessage('Receptionist deleted successfully!');
      setStatusType('success');
      setShowStatus(true);
      setResults(results.filter(r => r.id !== id));
    } catch (error) {
      setStatusMessage('Failed to delete receptionist.');
      setStatusType('error');
      setShowStatus(true);
    }
  };

  return (
    <div className="space-y-6">
      {!selectedReceptionist && (
        <>
          <div className="flex gap-2">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="border border-green-600 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="id">Search by ID</option>
              <option value="name">Search by Name</option>
            </select>
            <input
              type="text"
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
              className="border border-green-600 px-3 py-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder={`Enter ${searchType === 'id' ? 'Receptionist ID' : 'Receptionist Name'}`}
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
              <span className="text-green-600 font-medium">Loading receptionist data...</span>
            </div>
          )}
          {!loading && results.length === 0 && searchInput && (
            (searchType === 'name' || (searchType === 'id' && searchAttempted)) && (
              <div className="text-green-600 mt-2">No receptionist data available.</div>
            )
          )}

          {results.length > 0 && (
            <ul className="space-y-4 w-full h-[300px] overflow-y-auto mt-4 pr-2">
              {results.map((r) => (
                <li
                  key={r.id}
                  className="flex justify-between items-center bg-gray-50 border border-gray-300 shadow-sm rounded-xl px-6 py-4"
                >
                  <div>
                    <p className="font-semibold text-lg text-gray-800">{r.name}</p>
                    <p className="text-sm text-gray-600">ID: {r.id}</p>
                    <p className="text-sm text-gray-600">Phone: {r.number}</p>
                  </div>
                  <button
                    className="px-4 py-2 rounded border border-red-600 text-red-700 font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                    onClick={() => {
                      setSelectedReceptionist(r);
                      setShowConfirm(true);
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {showConfirm && selectedReceptionist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/40">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-sm mb-4">
              Are you sure you want to remove <strong>{selectedReceptionist.name}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleDelete(selectedReceptionist.id)}
                className="px-4 py-2 rounded border border-red-600 text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              >
                Yes, Delete
              </button>

              <button
                onClick={() => {
                  setShowConfirm(false);
                  setSelectedReceptionist(null);
                }}
                className="px-4 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Overlay */}
      {showStatus && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
          <div className={`bg-white p-6 rounded shadow-lg w-96 text-center border ${statusType === 'success' ? 'border-green-500' : 'border-red-500'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${statusType === 'success' ? 'text-green-700' : 'text-red-700'}`}>{statusMessage}</h3>
            <button
              onClick={() => {
                setShowStatus(false);
                if (showConfirm) setShowConfirm(false);
                setSelectedReceptionist(null); // Ensure search UI is visible after closing overlay
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

export default RemoveReceptionistForm;
