import { useState } from 'react';
import axiosInstance from '../services/axiosConfig';

export default function TestCors() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testCors = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/admins/test');
      setResult(`Success: ${response.data}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
      console.error('CORS Test Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">CORS Test</h2>
      <button
        onClick={testCors}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {loading ? 'Testing...' : 'Test CORS'}
      </button>
      {result && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}
