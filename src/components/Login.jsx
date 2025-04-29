import { useState } from 'react';

const API_BASE_URL = 'https://apiwebtttn.onrender.com/api/';

function Notification({ message, onClose }) {
  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center">
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200"
      >
        ✕
      </button>
    </div>
  );
}

function Login({ handleLogin, setView, setError }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000); // Auto-close after 3 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      showNotification('Please enter both username and password');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}taikhoan/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenTK: username, matKhau: password }),
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        const { maTK, tenTK, maKH } = result.data;
        const role = tenTK === 'admin' ? 'admin' : 'customer';
        handleLogin({ username: tenTK, role, maKH });
        setUsername('');
        setPassword('');
      } else {
        // Handle error from API
        showNotification(result.message || 'Invalid username or password');
      }
    } catch (err) {
      showNotification('Failed to connect to server. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification('')}
        />
      )}
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              className="w-full p-2 border rounded"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <button
            type="submit"
            className={`bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-2">
          Don't have an account?{' '}
          <button
            onClick={() => setView('register')}
            className="text-red-600 hover:underline"
            disabled={loading}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;