import React, { useState, useRef } from 'react';
import { API } from '../../services/Api';

export default function SearchDoctorForm() {
  const [searchType, setSearchType] = useState('id');
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewLoadingStates, setViewLoadingStates] = useState({});
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [statusType, setStatusType] = useState('success');
  const searchTimeout = useRef();

  const handleSearch = async () => {
    setLoading(true);
    try {
      let res, raw;
      if (searchType === 'id') {
        res = await fetch(`${API}/api/doctors/${searchInput.trim()}`);
        if (!res.ok) throw new Error('Doctor not found');
        raw = await res.json();
        // Robustly extract doctor data
        const docData = raw.doctorDTO || raw.doctor || raw;
        if (!docData || !docData.doctorId) throw new Error('Doctor not found');
        setResults([{ doctor: docData, availableDates: raw.availableDates || raw.dates || [] }]);
      } else if (searchType === 'name' && !searchInput.trim()) {
        // Fetch all doctors if name input is empty
        res = await fetch(`${API}/api/doctors`);
        if (!res.ok) throw new Error('No doctors found');
        const doctors = await res.json();
        setResults(
          doctors.map(item => {
            const doc = item.doctor || item.doctorDTO || item;
            return {
              doctor: doc,
              availableDates: item.availableDates || item.dates || []
            };
          })
        );
      } else {
        res = await fetch(`${API}/api/doctors/search?name=${searchInput.trim()}`);
        if (!res.ok) throw new Error('No doctors found');
        const doctors = await res.json();
        setResults(
          doctors.map(item => {
            const doc = item.doctor || item.doctorDTO || item;
            return {
              doctor: doc,
              availableDates: item.availableDates || item.dates || []
            };
          })
        );
      }

      setSelectedDoctor(null);
      setStatus('');
      setStatusType('success');
    } catch (err) {
      console.error(err);
      setResults([]);
      setSelectedDoctor(null);
      setStatus(err.message);
      setStatusType('error');
    }
    setLoading(false);
  };

  const handleViewDoctor = async (item) => {
    const doctorId = item.doctor.doctorId;
    setViewLoadingStates(prev => ({ ...prev, [doctorId]: true }));
    try {
      // Fetch doctor details with dates
      const res = await fetch(`${API}/api/doctors/${doctorId}`);
      if (!res.ok) throw new Error('Failed to fetch doctor details');
      const doctorData = await res.json();
      
      // Extract doctor and dates from response
      const docData = doctorData.doctorDTO || doctorData.doctor || doctorData;
      const availableDates = doctorData.availableDates || doctorData.dates || [];
      
      setSelectedDoctor({
        doctor: docData,
        availableDates: availableDates
      });
    } catch (err) {
      console.error(err);
      setStatus('Failed to load doctor details');
      setStatusType('error');
    } finally {
      setViewLoadingStates(prev => ({ ...prev, [doctorId]: false }));
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* <h2 className="text-xl font-semibold text-gray-800">Search Doctor</h2> */}

      {/* Search bar */}
      <div className="flex gap-2">
        <select
          value={searchType}
          onChange={e => setSearchType(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          placeholder={`Enter ${searchType === 'id' ? 'Doctor ID' : 'Doctor Name'}`}
          className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
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

      {/* Results */}
      {results.length > 0 && (
        <ul className="space-y-4 w-full h-[350px] overflow-y-auto mt-4 pr-2">
          {results.map((item, idx) => (
            item.doctor ? (
              <li
                key={idx}
                className="flex justify-between items-center bg-gray-50 border border-gray-300 shadow-sm rounded-xl px-6 py-4"
              >
                <div>
                  <p className="font-semibold text-lg text-gray-800">{item.doctor.name}</p>
                  <p className="text-sm text-gray-600">
                     ID: {item.doctor.doctorId} | Age:  {item.doctor.age} | Specialist: {item.doctor.specialist}
                  </p>
                </div>
                <button
                  onClick={() => handleViewDoctor(item)}
                  disabled={viewLoadingStates[item.doctor.doctorId]}
                  className="px-4 py-2 rounded border border-green-600 text-green-700 font-semibold hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {viewLoadingStates[item.doctor.doctorId] ? (
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></span>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    'View'
                  )}
                </button>
              </li>
            ) : null
          ))}
        </ul>
      )}


      {/* Overlay Doctor Detail */}
      {selectedDoctor && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[420px] max-h-[80vh] overflow-y-auto text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Doctor Details</h3>
            {Object.values(viewLoadingStates).some(loading => loading) ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                  <span className="text-blue-600 font-medium">Loading doctor details...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="text-left text-sm space-y-2 text-gray-700">
                  <p><strong>ID:</strong> {selectedDoctor.doctor.doctorId}</p>
                  <p><strong>Name:</strong> {selectedDoctor.doctor.name}</p>
                  <p><strong>Age:</strong> {selectedDoctor.doctor.age}</p>
                  <p><strong>Gender:</strong> {selectedDoctor.doctor.gender}</p>
                  <p><strong>Phone:</strong> {selectedDoctor.doctor.number}</p>
                  <p><strong>Specialist:</strong> {selectedDoctor.doctor.specialist}</p>
                </div>

                <div className="mt-4 text-left">
                  <h4 className="font-semibold mb-1">Availability</h4>
                  {selectedDoctor.availableDates.length > 0 ? (
                    <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                      {selectedDoctor.availableDates.map((d, i) => (
                        <li key={i}>
                          <strong>{d.date}:</strong>{' '}
                          {d.timeSlots
                            .filter(ts => ts.available)
                            .map(ts => ts.time)
                            .join(', ') || 'No slots'}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No available dates.</p>
                  )}
                </div>
              </>
            )}

            <button
              onClick={() => setSelectedDoctor(null)}
              className="mt-6 px-4 py-2 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
