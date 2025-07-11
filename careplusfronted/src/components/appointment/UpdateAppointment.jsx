import React, { useState } from 'react';
import axios from 'axios';
import { API } from '../../services/Api';
function UpdateAppointment() {
  const [appointmentId, setAppointmentId] = useState('');
  const [appointmentData, setAppointmentData] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [showNotFoundOverlay, setShowNotFoundOverlay] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const handleSearch = async () => {
    setSearchAttempted(true);
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/appointments/${appointmentId}`);
      setAppointmentData(res.data);
      setSelectedDate(res.data.date);
      setSelectedTime(res.data.time);
    } catch (err) {
      setAppointmentData(null);
      setShowNotFoundOverlay(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API}/api/appointments/${appointmentId}`, {
        id: appointmentData.id,
        date: selectedDate,
        time: selectedTime,
        patientId: appointmentData.patient?.id,
        docterId: appointmentData.docter?.doctor?.doctorId,
      });

      setShowConfirm(false);
      setShowSuccess(true);
    } catch (err) {
      alert('Failed to update appointment');
      console.error(err);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API}/api/appointments/${appointmentId}`);
      setShowDeleteConfirm(false);
      setShowDeleteSuccess(true);
      setAppointmentData(null);
      setAppointmentId('');
      setSelectedDate('');
      setSelectedTime('');
    } catch (err) {
      setShowDeleteConfirm(false);
      alert('Could not delete appointment.');
    }
  };

  const resetForm = () => {
    setAppointmentId('');
    setAppointmentData(null);
    setSelectedDate('');
    setSelectedTime('');
    setShowSuccess(false);
  };

  const availableDates = appointmentData?.docter?.availableDates || [];
  const doctor = appointmentData?.docter?.doctor;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Update Appointment</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Appointment ID"
          className="border border-orange-500 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={appointmentId}
          onChange={(e) => setAppointmentId(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          Search
        </button>
      </div>
      {loading && (
        <div className="flex items-center gap-2 mt-2">
          <span className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
          <span className="text-orange-600 font-medium">Loading appointment...</span>
        </div>
      )}
      {!loading && !appointmentData && searchAttempted && (
        <div className="text-orange-600 mt-2">No appointment data available.</div>
      )}
      {showNotFoundOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Appointment not found!</h3>
            <button
              onClick={() => setShowNotFoundOverlay(false)}
              className="px-4 py-2 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {appointmentData && (
        <div className="space-y-4 border border-orange-400 p-4 rounded">
          <h3 className="text-lg font-bold text-center">Appointment Info</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-1">Patient Details</h4>
              <p><strong>Name:</strong> {appointmentData.patient?.name}</p>
              <p><strong>Phone:</strong> {appointmentData.patient?.number}</p>
              <p><strong>Gender:</strong> {appointmentData.patient?.gender}</p>
              <p><strong>Address:</strong> {appointmentData.patient?.address}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Doctor Details</h4>
              <p><strong>Name:</strong> {doctor?.name}</p>
              <p><strong>Specialist:</strong> {doctor?.specialist}</p>
              <p><strong>Phone:</strong> {doctor?.number}</p>
              <p><strong>Gender:</strong> {doctor?.gender}</p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium">Change Date and Time</h4>
            <select
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime('');
              }}
              className="border border-orange-500 p-2 mt-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">Select Date</option>
              {availableDates.map((d, idx) => (
                <option key={idx} value={d.date}>{d.date}</option>
              ))}
            </select>

            {selectedDate && (
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="border border-orange-500 p-2 mt-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">Select Time</option>
                {availableDates
                  .find((d) => d.date === selectedDate)
                  ?.timeSlots.map((t, idx) => (
                    <option key={idx} value={t.time}>
                      {t.time}
                    </option>
                  ))}
              </select>
            )}
          </div>

          <div className="mt-4 flex gap-4">
            <button
              onClick={() => setShowConfirm(true)}
              className="px-4 py-2 rounded border border-yellow-600 text-yellow-700 font-semibold hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            >
              Update Appointment
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded border border-red-600 text-red-700 font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Confirm Overlay */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center border border-orange-400">
            <h3 className="text-lg font-semibold mb-4">Confirm Update?</h3>
            <p>New Date: <strong>{selectedDate}</strong></p>
            <p>New Time: <strong>{selectedTime}</strong></p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded border border-green-600 text-green-700 font-semibold hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded border border-gray-400 text-gray-700 font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center border border-green-500">
            <h3 className="text-lg font-semibold mb-4">Appointment Updated Successfully!</h3>
            <button
              onClick={resetForm}
              className="px-4 py-2 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center border border-orange-400">
            <h3 className="text-lg font-semibold mb-4 text-orange-700">Confirm Delete?</h3>
            <p>Are you sure you want to delete <strong>Appointment #{appointmentId}</strong>?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded border border-red-600 text-red-700 font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded border border-gray-400 text-gray-700 font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Overlay */}
      {showDeleteSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 text-center border border-green-500">
            <h3 className="text-lg font-semibold mb-4 text-green-700">Appointment Deleted Successfully!</h3>
            <button
              onClick={() => setShowDeleteSuccess(false)}
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

export default UpdateAppointment;
