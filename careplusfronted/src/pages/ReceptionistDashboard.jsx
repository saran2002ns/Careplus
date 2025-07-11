import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddPatientForm from "../components/Patient/AddPatientForm";
import UpdatePatientForm from "../components/Patient/UpdatePatientForm";
import SearchPatientForm from "../components/Patient/SearchPatientForm";
import DeletePatientForm from "../components/Patient/DeletePatientForm";
import {  FaSignOutAlt } from 'react-icons/fa';

export default function ReceptionistDashboard() {
  const [activeTab, setActiveTab] = useState("add");
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const receptionistName = localStorage.getItem("name"); 

const handleLogout = () => {
  setShowLogoutModal(true);
};

const confirmLogout = () => {
  localStorage.clear();
  sessionStorage.clear();
  navigate("/", { replace: true });
  window.location.reload();
};


  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timeout);
  }, [activeTab]);

  const renderContent = () => {
    if (loading) return <SkeletonLoader />;
    switch (activeTab) {
      case "add":
        return <AddPatientForm />;
      case "update":
        return <UpdatePatientForm />;
      case "search":
        return <SearchPatientForm />;
      case "delete":
        return <DeletePatientForm />;
      default:
        return null;
    }
  };

  const tabLabels = {
    add: "Add Patient",
    update: "Update Patient",
    search: "Search Patient",
    delete: "Delete Patient",
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-green-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center bg-white rounded-t-2xl shadow px-6 py-4">
          <h1 className="text-xl font-bold text-green-700">
            Welcome, {receptionistName}
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded border border-red-600 text-red-700 font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          >
            <FaSignOutAlt className="text-lg" />
            Logout
          </button>
        </div>

        {/* Logout Confirmation Overlay */}
        {showLogoutModal && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/40 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96 text-center border border-red-500">
              <h3 className="text-lg font-semibold mb-4 text-red-700">Are you sure you want to logout?</h3>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 rounded border border-red-600 text-red-700 font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

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
                    ? "text-green-700 border-b-4 border-green-600 bg-green-50"
                    : "text-gray-600 hover:bg-gray-100 border-b-4 border-transparent"
                }`}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 min-h-[400px]">
            {/* Optional heading */}
            {/* <h2 className="text-2xl font-semibold text-green-700 capitalize mb-4">{tabLabels[activeTab]}</h2> */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton Loader while switching tabs
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
