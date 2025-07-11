import React, { useState } from 'react';
import { timeOptions } from '../../services/db';
import { API } from '../../services/Api';

export default function AddPatientForm() {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    age: '',
    gender: '',
    addressLine: '',
    district: '',
    state: '',
    date: '',
    time: '',
    allocated: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('success'); // 'success' or 'error'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate 10-digit phone number
  const phonePattern = /^[0-9]{10}$/;
  if (!phonePattern.test(formData.number)) {
    setStatus('Phone number must be exactly 10 digits.');
    setStatusType('error');
    setShowModal(true);
    return;
  }

  // Validate age
  const age = parseInt(formData.age);
  if (isNaN(age) || age <= 0 || age >= 150) {
    setStatus('Age must be greater than 0 and less than 150.');
    setStatusType('error');
    setShowModal(true);
    return;
  }

  const fullNumber = `${formData.number}`;
  const fullAddress = `${formData.addressLine}, ${formData.district}, ${formData.state}`;

  const patientDTO = {
    name: formData.name,
    number: fullNumber,
    age: parseInt(formData.age),
    gender: formData.gender,
    address: fullAddress,
    date: formData.date,
    time: formData.time,
    allocated: formData.allocated || false,
  };

  try {
    const res = await fetch(`${API}/api/patients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(patientDTO)
    });

    const text = await res.text();

    if (res.ok) {
      setStatus(text);
      setStatusType('success');
      setFormData({
        name: '',
        number: '',
        age: '',
        gender: '',
        addressLine: '',
        district: '',
        state: '',
        date: '',
        time: '',
        allocated: false,
      });
    } else {
      setStatus("Error: " + text);
      setStatusType('error');
    }
    setShowModal(true);
  } catch (err) {
    setStatus("Failed to connect to server");
    setStatusType('error');
    setShowModal(true);
  }
};


  return (
    <div className="relative">
      {/* <h2 className="text-xl font-semibold mb-4">Patient Details Form</h2> */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-700 font-medium mb-1">Enter your name</span>
          <input
            type="text"
            name="name"
            placeholder="e.g. John Doe"
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-gray-700 font-medium mb-1">Enter your phone number</span>
          <div className="flex">
            <span className="bg-gray-200 border border-r-0 p-2 rounded-l-lg">+91</span>
            <input
              type="text"
              name="number"
              placeholder="e.g. 9876543210"
              className="border p-2 w-full rounded-r-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500"
              required
              value={formData.number}
              onChange={handleChange}
              maxLength={10}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-gray-700 font-medium mb-1">Enter your age</span>
          <input
            type="number"
            name="age"
            placeholder="e.g. 30"
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500"
            required
            value={formData.age}
            onChange={handleChange}
          />
        </div>

       <div className="flex flex-col">
        <span className="text-sm text-gray-700 font-medium mb-1">Select your gender</span>
        <select
          name="gender"
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500"
          required
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>


        <div className="flex flex-col">
          <span className="text-sm text-gray-700 font-medium mb-1">Address line</span>
          <input
            type="text"
            name="addressLine"
            placeholder="e.g. 123, Main Street"
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500"
            required
            value={formData.addressLine}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-gray-700 font-medium mb-1">District</span>
          <input
            type="text"
            name="district"
            placeholder="e.g. Chennai"
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500"
            required
            value={formData.district}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-gray-700 font-medium mb-1">State</span>
          <input
            type="text"
            name="state"
            placeholder="e.g. Tamil Nadu"
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500"
            required
            value={formData.state}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-gray-700 font-medium mb-1">Select a date</span>
          <input
            type="date"
            name="date"
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500"
            required
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <span className="text-sm text-gray-700 font-medium mb-1">Select a time slot</span>
          <select
            name="time"
            className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500"
            required
            value={formData.time}
            onChange={handleChange}
          >
            <option value="">Select Time</option>
            {timeOptions.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            className="mt-4 px-4 py-2 rounded border border-green-600 text-green-700 font-semibold hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Inline status message instead of overlay */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/40 z-50">
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
