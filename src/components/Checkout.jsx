import { useState } from 'react';

function Checkout({ cart, handleCheckout, setError, setView }) {
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('momo');

  const handleSubmit = () => {
    if (!address.trim()) {
      setError('Please enter a delivery address');
      return;
    }

    if (!cart || cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    handleCheckout(address, paymentMethod);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-gray-700">Delivery Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your address"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="momo">Momo</option>
            <option value="cash">Cash on Delivery</option>
          </select>
        </div>
        <div className="text-right mb-4">
          <p className="text-xl font-bold">
            Total: VND{' '}
            {cart
              .reduce((sum, item) => sum + item.price * item.quantity, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setView('cart')}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded hover:bg-gray-200"
          >
            Back to Cart
          </button>
          <button
            onClick={handleSubmit}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;