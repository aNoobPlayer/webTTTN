function Checkout({ handleCheckout, setError }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-gray-700">Delivery Address</label>
          <input
            type="text"
            id="address"
            className="w-full p-2 border rounded"
            placeholder="Enter your address"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Payment Method</label>
          <select id="paymentMethod" className="w-full p-2 border rounded">
            <option value="momo">Momo</option>
            <option value="cash">Cash on Delivery</option>
          </select>
        </div>
        <button
          onClick={() => {
            const address = document.getElementById('address').value;
            const paymentMethod = document.getElementById('paymentMethod').value;
            if (address) {
              handleCheckout(address, paymentMethod);
            } else {
              setError('Please enter a delivery address');
            }
          }}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
}

export default Checkout;