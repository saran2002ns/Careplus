import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddAppointment from '../components/appointment/AddAppointment';
import UpdateAppointment from '../components/appointment/UpdateAppointment';
import CancelAppointment from '../components/appointment/CancelAppointment';
import ViewAllAppointments from '../components/appointment/ViewAllAppointments';
import ViewByPatient from '../components/appointment/ViewByPatient';
import ViewByDoctor from '../components/appointment/ViewByDoctor';

export default function AppointmentManagement() {
  const [activeTab, setActiveTab] = useState("add");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timeout);
  }, [activeTab]);

  const renderContent = () => {
    if (loading) return <SkeletonLoader />;
    switch (activeTab) {
      case "add":
        return <AddAppointment />;
      case "update":
        return <UpdateAppointment />;
      case "cancel":
        return <CancelAppointment />;
      case "viewAll":
        return <ViewAllAppointments />;
      case "byPatient":
        return <ViewByPatient />;
      case "byDoctor":
        return <ViewByDoctor />;
      default:
        return null;
    }
  };

  const tabLabels = {
    add: "Add Appointment",
    update: "Update Appointment",
    // cancel: "Cancel Appointment",
    viewAll: "View All Appointments",
    byPatient: "View by Patient",
    byDoctor: "View by Doctor",
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-orange-200 via-white to-orange-100 p-4">
      <div className="max-w-6xl mx-auto">

        {/* Top Bar */}
        <div className="flex justify-between items-center bg-white rounded-t-2xl shadow px-6 py-4">
          <h1 className="text-xl font-bold text-orange-800">
            Appointment Management
          </h1>
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="px-4 py-2 rounded border border-red-600 text-red-700 font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          >
            Back
          </button>
        </div>

        {/* Tabs + Content */}
        <div className="bg-white shadow rounded-b-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-300">
            {Object.entries(tabLabels).map(([key, label]) => (
              <div
                key={key}
                onClick={() => setActiveTab(key)}
                className={`cursor-pointer w-full text-center py-3 font-medium capitalize transition-all ${
                  activeTab === key
                    ? "text-orange-800 border-b-4 border-orange-700 bg-orange-100"
                    : "text-gray-600 hover:bg-gray-100 border-b-4 border-transparent"
                }`}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 min-h-[350px]">
            {/* <h2 className="text-2xl font-semibold text-orange-800 capitalize mb-4">
              {tabLabels[activeTab]}
            </h2> */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton loader
function SkeletonLoader() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
      <div className="h-4 w-full bg-gray-200 rounded"></div>
      <div className="h-4 w-full bg-gray-200 rounded"></div>
      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
      <div className="h-10 w-1/2 bg-gray-300 rounded mt-4"></div>
    </div>
  );
}
