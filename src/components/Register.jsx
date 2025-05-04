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

function Register({ setView, setError }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000); // Auto-close after 3 seconds
  };

  const generateUniqueId = () => {
    const randomNumber = Math.floor(100 + Math.random() * 900); // 3 chữ số
    return 'KH' + randomNumber;
  };
  

  const validatePhoneNumber = (sdt) => {
    return /^\d{10}$/.test(sdt);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !email || !password || !phoneNumber || !address) {
      showNotification('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      showNotification('Phone number must be 10 digits');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create a customer in KHACHHANG to get maKH
      const customerResponse = await fetch(`${API_BASE_URL}khachhang`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maKH: generateUniqueId(), // Unique maKH
          tenKH: username,
          email,
          sdt: phoneNumber,
          diaChi: address,
          loaiKH: 'KhachHang', // Generic customer type
        }),
      });

      const customerResult = await customerResponse.json();

      if (!customerResponse.ok || customerResult.status !== 'success') {
        const errorMessage = customerResult.message || `Failed to create customer (Status: ${customerResponse.status})`;
        showNotification(errorMessage);
        console.error('Customer creation error:', customerResult);
        setLoading(false);
        return;
      }

      const maKH = customerResult.data.maKH;

      // Step 2: Register the account in TAIKHOAN
      const accountResponse = await fetch(`${API_BASE_URL}taikhoan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maTK: `TK${generateUniqueId()}`, // Unique maTK
          maKH,
          tenTK: username,
          tinhTrang: 'HoatDong', // Active status
          ngayTao: new Date().toISOString().split('T')[0], // Current date
          matKhau: password,
        }),
      });

      const accountResult = await accountResponse.json();

      if (accountResponse.ok && accountResult.status === 'success') {
        showNotification('Registration successful! Please log in.');
        setUsername('');
        setEmail('');
        setPassword('');
        setPhoneNumber('');
        setAddress('');
        setView('login');
      } else {
        showNotification(accountResult.message || 'Registration failed');
        console.error('Account creation error:', accountResult);
      }
    } catch (err) {
      showNotification('Failed to connect to server. Please try again.');
      console.error('Registration error:', err);
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
      <h2 className="text-2xl font-bold mb-4">Register</h2>
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
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border rounded"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              className="w-full p-2 border rounded"
              placeholder="Enter 10-digit phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              id="address"
              className="w-full p-2 border rounded"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-2">
          Already have an account?{' '}
          <button
            onClick={() => setView('login')}
            className="text-red-600 hover:underline"
            disabled={loading}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;