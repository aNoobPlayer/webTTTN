function Cart({ cart, setView, removeFromCart, updateQuantity }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 tracking-tight">Your Cart</h2>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Your cart is empty.</p>
          <button
            onClick={() => setView('menu')}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Back to Menu
          </button>
        </div>
      ) : (
        <div>
          {/* Cart Items */}
          {cart.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-white p-5 mb-4 rounded-xl shadow-lg flex items-center justify-between border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center space-x-4 flex-1">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-500 text-sm">
                    VND {item.price.toLocaleString()} x {item.quantity}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200"
                    disabled={item.quantity === 1}
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    -
                  </button>
                  <span className="text-gray-800 font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200"
                    disabled={item.stock <= item.quantity}
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>
                </div>
                <p className="text-red-600 font-bold text-lg">
                  VND {(item.price * item.quantity).toLocaleString()}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {/* Total and Checkout */}
          <div className="text-right mt-6">
            <p className="text-xl font-bold text-gray-800 mb-4">
              Total: VND{' '}
              {cart
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toLocaleString()}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setView('menu')}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => setView('checkout')}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;