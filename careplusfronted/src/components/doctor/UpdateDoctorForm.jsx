import React, { useState, useRef } from 'react';
import { specialists } from '../../services/db';
import { API } from '../../services/Api';

export default function UpdateDoctorForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [doctorResults, setDoctorResults] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [updatedDoctor, setUpdatedDoctor] = useState({});
  const [status, setStatus] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
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
        setDoctorResults([]);
        setLoading(false);
        return;
      }
      if (searchType === 'id') {
        response = await fetch(`${API}/api/doctors/${searchInput.trim()}`);
        if (!response.ok) throw new Error("Doctor not found");
        const data = await response.json();
        // Robustly check for doctor data
        const docData = data.doctorDTO || data.doctor || data;
        if (!docData || !docData.doctorId) throw new Error("Doctor not found");
        setDoctorResults([{
          doctorId: docData.doctorId,
          name: docData.name,
          age: docData.age,
          gender: docData.gender,
          number: docData.number,
          specialist: docData.specialist,
          specialistId: docData.specialistId,
        }]);
      } else if (searchType === 'name' && !searchInput.trim()) {
        // Fetch all doctors if name input is empty
        response = await fetch(`${API}/api/doctors`);
        if (!response.ok) throw new Error("Doctors not found");
        const data = await response.json();
        const flattened = data.map(d => ({
          doctorId: d.doctor?.doctorId || d.doctorId,
          name: d.doctor?.name || d.name,
          age: d.doctor?.age || d.age,
          gender: d.doctor?.gender || d.gender,
          number: d.doctor?.number || d.number,
          specialist: d.doctor?.specialist || d.specialist,
          specialistId: d.doctor?.specialistId || d.specialistId,
        }));
        setDoctorResults(flattened);
      } else {
        response = await fetch(`${API}/api/doctors/search?name=${searchInput.trim()}`);
        if (!response.ok) throw new Error("No matching doctors found");
        const data = await response.json();
        const flattened = data.map(d => ({
          doctorId: d.doctor?.doctorId || d.doctorId,
          name: d.doctor?.name || d.name,
          age: d.doctor?.age || d.age,
          gender: d.doctor?.gender || d.gender,
          number: d.doctor?.number || d.number,
          specialist: d.doctor?.specialist || d.specialist,
          specialistId: d.doctor?.specialistId || d.specialistId,
        }));
        setDoctorResults(flattened);
      }
      setSelectedDoctor(null);
      setStatus('');
      setStatusType('success');
    } catch (err) {
      console.error("Search error:", err);
      setStatus(err.message || "Failed to find doctor.");
      setDoctorResults([]);
      setStatusType('error');
    }
    setLoading(false);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setUpdatedDoctor({ ...doctor });
  };

  const handleInputChange = (e) => {
    setUpdatedDoctor({ ...updatedDoctor, [e.target.name]: e.target.value });
  };

  const handleSpecialistChange = (e) => {
    const selectedSpecialist = e.target.value;
    const specialistIndex = specialists.indexOf(selectedSpecialist);
    setUpdatedDoctor({
      ...updatedDoctor,
      specialist: selectedSpecialist,
      specialistId: specialistIndex + 1,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Validate age
    const age = parseInt(updatedDoctor.age);
    if (isNaN(age) || age <= 0 || age >= 150) {
      setStatus('Age must be greater than 0 and less than 150.');
      setStatusType('error');
      setShowOverlay(true);
      return;
    }
    
    try {
      const response = await fetch(`${API}/api/doctors/${updatedDoctor.doctorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDoctor),
      });

      const result = await response.text();

      if (response.ok) {
        setStatus(`Doctor ${updatedDoctor.name} updated successfully!`);
        setStatusType('success');
      } else {
        setStatus(`Update failed: ${result}`);
        setStatusType('error');
      }
    } catch (err) {
      console.error("Update error:", err);
      setStatus("Server error occurred while updating doctor.");
      setStatusType('error');
    }

    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
    setSelectedDoctor(null);
    setDoctorResults([]);
    setSearchInput('');
  };

  return (
    <div className="space-y-6">
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
          {!loading && doctorResults.length === 0 && searchInput && (
            ((searchType === 'name' && searchInput.length > 1) || (searchType === 'id' && searchAttempted)) && (
              <div className="text-purple-600 mt-2">No doctor data available.</div>
            )
          )}

        {doctorResults.length > 0 && (
          <ul className="space-y-4 w-full h-[350px] overflow-y-auto mt-4 pr-2">
            {doctorResults.map(doc => (
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
                    onClick={() => handleDoctorSelect(doc)}
                    className="px-4 py-2 rounded border border-green-600 text-green-700 font-semibold hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  >
                    Select
                  </button>
                </li>
              ) : null
            ))}
          </ul>
        )}

        </>
      ) : (
        <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4">
          <div className="col-span-2 font-medium text-gray-700">
            Updating: <strong>{selectedDoctor.name}</strong>
          </div>

          <input
            type="text"
            name="name"
            placeholder="Name"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={updatedDoctor.name}
            onChange={handleInputChange}
            required
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={updatedDoctor.age}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="gender"
            placeholder="Gender"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={updatedDoctor.gender}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="number"
            placeholder="Phone Number"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={updatedDoctor.number}
            onChange={handleInputChange}
            required
          />

          <select
            name="specialist"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={updatedDoctor.specialist}
            onChange={handleSpecialistChange}
            required
          >
            <option value="">Select Specialist</option>
            {specialists.map((s, idx) => (
              <option key={idx} value={s}>{s}</option>
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
                setSelectedDoctor(null);
                setDoctorResults([]);
                setSearchInput('');
              }}
              className="px-4 py-2 rounded border border-red-600 text-red-700 font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            >
              Back
            </button>
          </div>
        </form>
      )}

      {showOverlay && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">{status}</h3>
            <button
              onClick={handleCloseOverlay}
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
