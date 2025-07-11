import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  
  return (
   <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Welcome to <span className="text-blue-600">CarePlus</span>
        </h1>
        <p className="text-gray-500 text-lg">
          Manage your hospital efficiently.
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/admin-login")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition duration-300"
          >
            Admin Login
          </button>
          <button
            onClick={() => navigate("/receptionist-login")}
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition duration-300"
          >
            Receptionist Login
          </button>
        </div>
      </div>
    </div>
  );
}
