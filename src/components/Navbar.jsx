function Navbar({ view, setView, cart, user, handleLogout }) {
  return (
    <nav className="bg-red-600 text-white p-4 flex justify-between items-center">
      <div className="text-2xl font-bold">KFC</div>
      <div className="space-x-4">
        <button onClick={() => setView('home')} className="hover:underline">
          Home
        </button>
        <button onClick={() => setView('menu')} className="hover:underline">
          Menu
        </button>
        <button onClick={() => setView('cart')} className="hover:underline">
          Cart ({cart.length})
        </button>
        {user ? (
          <>
            <button
              onClick={() => setView(user.role === 'admin' ? 'admin' : 'account')}
              className="hover:underline"
            >
              {user.role === 'admin' ? 'Admin Dashboard' : 'Account'}
            </button>
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => setView('login')} className="hover:underline">
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;