import React, { useState } from 'react';
import axios from 'axios';
import { API } from '../../services/Api';

export default function AddReceptionistForm() {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    password: '',
    confirmPassword: '',
  });

  const [status, setStatus] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const [error, setError] = useState('');
  // Add statusType state
  const [statusType, setStatusType] = useState('success'); // 'success' or 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password.length < 6) {
    setError("❗ Password must be at least 6 characters.");
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    setError("❗ Passwords do not match.");
    return;
  }

  const receptionistPayload = {
    name: formData.name,
    number: formData.number,
    password: formData.password,
  };

  try {
    const response = await axios.post(`${API}/api/receptionists`, receptionistPayload);
    setStatus(` ${response.data}`);
    setShowOverlay(true);
    setFormData({
      name: '',
      number: '',
      password: '',
      confirmPassword: '',
    });
  } catch (err) {
    setError(`❌ Failed to add receptionist: ${err.response?.data || err.message}`);
  }
};




  return (
    <div className="relative space-y-6">
      {/* <h2 className="text-xl font-semibold mb-4">Add Receptionist</h2> */}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="flex flex-col col-span-2 sm:col-span-1">
          <label className="text-sm font-medium text-gray-700 mb-1">Enter your name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Priya Sharma"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col col-span-2 sm:col-span-1">
          <label className="text-sm font-medium text-gray-700 mb-1">Enter phone number</label>
          <input
            type="text"
            name="number"
            placeholder="e.g. 9876543210"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col col-span-2 sm:col-span-1">
          <label className="text-sm font-medium text-gray-700 mb-1">Enter password</label>
          <input
            type="password"
            name="password"
            placeholder="Minimum 6 characters"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col col-span-2 sm:col-span-1">
          <label className="text-sm font-medium text-gray-700 mb-1">Confirm password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your password"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <div className="col-span-2 text-red-600 text-sm">{error}</div>
        )}

        <div className="col-span-2">
         <button
            className="px-4 py-2 rounded border border-green-600 text-green-700 font-semibold hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          >
            Add Receptionist
          </button>

        </div>
      </form>

      {showOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/40">
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
