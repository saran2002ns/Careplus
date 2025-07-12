import React, { useState } from 'react';
import { specialists } from "../../services/db";
import { API } from '../../services/Api';

function AddDoctorForm() {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('success'); // 'success' or 'error'
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    number: '',
  });
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [specialistId, setSpecialistId] = useState('');

  const handleSpecialistChange = (e) => {
    const selected = e.target.value;
    setSelectedSpecialist(selected);
    const index = specialists.indexOf(selected);
    setSpecialistId(index >= 0 ? index + 1 : '');
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate age
    const age = parseInt(formData.age);
    if (isNaN(age) || age <= 0 || age >= 150) {
      setStatus('Age must be greater than 0 and less than 150.');
      setStatusType('error');
      setShowModal(true);
      return;
    }

    setSubmitLoading(true);

    const doctorDTO = {
      name: formData.name,
      age: age,
      gender: formData.gender,
      number: formData.number,
      specialistId: parseInt(specialistId),
      specialist: selectedSpecialist
    };

    try {
      const res = await fetch(`${API}/api/doctors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(doctorDTO)
      });

      const text = await res.text();

      if (res.ok) {
        setStatus(text);
        setStatusType('success');
        setFormData({ name: '', age: '', gender: '', number: '' });
        setSelectedSpecialist('');
        setSpecialistId('');
      } else {
        setStatus("Error: " + text);
        setStatusType('error');
      }
    } catch (err) {
      setStatus("Failed to connect to server");
      setStatusType('error');
    } finally {
      setSubmitLoading(false);
    }

    setShowModal(true);
  };

  return (
    <div className="relative">
      <h2 className="text-xl font-semibold mb-4">Enter Doctor Details</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Enter your name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Enter your age</label>
          <input
            type="number"
            name="age"
            placeholder="Age"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.age}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Enter your gender</label>
          <input
            type="text"
            name="gender"
            placeholder="Gender"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.gender}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Enter phone number</label>
          <input
            type="text"
            name="number"
            placeholder="Phone Number"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.number}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Specialist Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Select specialist</label>
          <select
            value={selectedSpecialist}
            onChange={handleSpecialistChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">-- Choose Specialist --</option>
            {specialists.map((spec, index) => (
              <option key={index} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Specialist ID */}
        {/* <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Specialist ID</label>
          <input
            type="number"
            value={specialistId}
            readOnly
            placeholder="Specialist ID"
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-600"
          />
        </div> */}

        {/* Submit Button */}
        <div className="col-span-2 flex justify-start">
          <button
            type="submit"
            disabled={submitLoading}
            className="px-4 py-2 rounded border border-purple-600 text-purple-700 font-semibold hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitLoading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></span>
                <span>Adding Doctor...</span>
              </div>
            ) : (
              'Add Doctor'
            )}
          </button>

        </div>
      </form>





      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
          <div className={`bg-white p-6 rounded shadow-lg w-96 text-center border ${statusType === 'success' ? 'border-green-500' : 'border-red-500'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${statusType === 'success' ? 'text-green-700' : 'text-red-700'}`}>{status}</h3>
            <button
              onClick={() => setShowModal(false)}
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

export default AddDoctorForm;
