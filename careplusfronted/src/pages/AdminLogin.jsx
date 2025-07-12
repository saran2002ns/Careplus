import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../services/Api";

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${API}/api/admins/login`, {
        identifier,
        password,
      });
     
      if (response.status === 200) {
        localStorage.setItem("adminToken", "true");
        if (response.data && response.data.name) {
          localStorage.setItem("name", response.data.name);
        }
        navigate("/admin-dashboard");
      }
    } catch (err) {
      
      setError("Invalid ID/Number or Password");
    } finally {
      setLoading(false);
    }
  };

  
  const handleQuickLogin = () => {
    setIdentifier("7094250807"); 
    setPassword("saran123");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-blue-700">
          Admin Login
        </h2>

        <input
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Admin ID or Number"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <input
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          )}
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          onClick={handleQuickLogin}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded-lg transition duration-200"
        >
          Quick Login (Demo)
        </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition duration-200"
          >
            Back
          </button>
      </div>
    </div>
  );
}
