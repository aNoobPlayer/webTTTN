function Home({ setView }) {
  return (
    <div>
      <div className="bg-red-600 text-white p-8 rounded-lg mb-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Welcome to KFC</h1>
        <p className="text-lg">Order your favorite fried chicken and drinks now!</p>
        <button
          onClick={() => setView('menu')}
          className="mt-4 bg-white text-red-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-200"
        >
          View Menu
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Promotions</h2>
          <p>Get 20% off on buckets this week!</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Store Locator</h2>
          <p>Find a KFC near you.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Fast Delivery</h2>
          <p>Order now, delivered in 30 mins!</p>
        </div>
      </div>
    </div>
  );
}

export default Home;