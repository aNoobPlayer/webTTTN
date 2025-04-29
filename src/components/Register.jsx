function Register({ setView, setError }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700">Full Name</label>
          <input type="text" id="fullName" className="w-full p-2 border rounded" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input type="email" id="email" className="w-full p-2 border rounded" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input type="password" id="password" className="w-full p-2 border rounded" required />
        </div>
        <button
          onClick={() => {
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            if (fullName && email) {
              alert('Registration successful!');
              setView('login');
            } else {
              setError('Please fill in all fields');
            }
          }}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default Register;