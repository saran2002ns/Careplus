import React, { useState, useRef } from 'react';
import axios from 'axios';
import { timeOptions } from '../../services/db';
import { API } from '../../services/Api';
function UpdatePatientForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [patientResults, setPatientResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [statusType, setStatusType] = useState('success');
  const [showOverlay, setShowOverlay] = useState(false);
  const searchTimeout = useRef();

  const [updatedPatient, setUpdatedPatient] = useState({
    name: '',
    number: '',
    age: '',
    gender: '',
    address: '',
    date: '',
    time: ''
  });

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
      setStatus('No patient found.');
      setStatusType('error');
    }
    setLoading(false);
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setUpdatedPatient({ ...patient });
  };

  const handleChange = (e) => {
    setUpdatedPatient({ ...updatedPatient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate age
    const age = parseInt(updatedPatient.age);
    if (isNaN(age) || age <= 0 || age >= 150) {
      setStatus('Age must be greater than 0 and less than 150.');
      setStatusType('error');
      setShowModal(true);
      return;
    }
    
    try {
      const res = await axios.put(
        `${API}/api/patients/${selectedPatient.id}`,
        updatedPatient
      );
      setStatus(res.data);
      setStatusType('success');
    } catch (err) {
      setStatus(err.response?.data || 'Failed to update patient.');
      setStatusType('error');
    } finally {
      setShowModal(true);
      // Remove auto-close logic
      // setTimeout(() => {
      //   setSelectedPatient(null);
      //   setPatientResults([]);
      //   setSearchInput('');
      // }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* <h2 className="text-xl font-semibold mb-2">Update Patient</h2> */}

      {!selectedPatient ? (
        <>
          <div className="flex flex-wrap gap-2">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500"
            >
              <option value="id">Search by ID</option>
              <option value="name">Search by Name</option>
            </select>
            <input
              type="text"
              placeholder={`Enter ${searchType === 'id' ? 'ID' : 'Name'}`}
              className="border p-2 rounded flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500"
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
                  onClick={() => handleSelectPatient(p)}
                  className="px-4 py-2 rounded border border-yellow-600 text-yellow-700 font-semibold hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
           )}

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

      </>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2 font-medium mb-2">
            Updating: <strong>{selectedPatient.name}</strong>
          </div>

          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            className="border p-2 rounded"
            value={updatedPatient.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="number"
            placeholder="Enter Phone Number"
            className="border p-2 rounded"
            value={updatedPatient.number}
            onChange={handleChange}
          />
          <input
            type="number"
            name="age"
            placeholder="Enter Age"
            className="border p-2 rounded"
            value={updatedPatient.age}
            onChange={handleChange}
          />
          <input
            type="text"
            name="gender"
            placeholder="Enter Gender"
            className="border p-2 rounded"
            value={updatedPatient.gender}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Enter Address"
            className="border p-2 rounded"
            value={updatedPatient.address}
            onChange={handleChange}
          />
          <input
            type="date"
            name="date"
            className="border p-2 rounded"
            value={updatedPatient.date}
            onChange={handleChange}
          />
          <select
            name="time"
            className="border p-2 rounded"
            value={updatedPatient.time}
            onChange={handleChange}
          >
            <option value="">Select Time</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>

          <div className="col-span-2 flex justify-center gap-4">
            <button
              className="px-4 py-2 rounded border border-yellow-600 text-yellow-700 font-semibold hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            >
              Submit Update
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedPatient(null);
                setPatientResults([]);
                setSearchInput('');
              }}
              className="px-4 py-2 rounded border border-red-600 text-red-700 font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            >
              Back
            </button>
          </div>

        </form>
      )}

      {/* Show overlay after update */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/40 z-50">
          <div className={`bg-white p-6 rounded shadow-lg w-96 text-center border ${statusType === 'success' ? 'border-green-500' : 'border-red-500'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${statusType === 'success' ? 'text-green-700' : 'text-red-700'}`}>{status}</h3>
            <button
              onClick={() => {
                setShowModal(false);
                setSelectedPatient(null);
                setPatientResults([]);
                setSearchInput('');
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

export default UpdatePatientForm;
