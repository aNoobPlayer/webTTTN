import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function Review({ setView, setError, user, orders }) {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [products, setProducts] = useState([]);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch products for the selected order
  useEffect(() => {
    if (selectedOrder) {
      const order = orders.find((o) => o.id === selectedOrder);
      if (order && order.chitiet && Array.isArray(order.chitiet)) {
        const fetchProducts = async () => {
          try {
            const productPromises = order.chitiet.map((item) =>
              fetch(`https://apiwebtttn.onrender.com/api/sanpham/${item.MaSP}`).then((res) =>
                res.json()
              )
            );
            const productResponses = await Promise.all(productPromises);
            const productData = productResponses
              .filter((p) => p.status === 'success' && p.data)
              .map((p) => ({
                id: p.data.MaSP,
                name: p.data.TenSP || 'Unknown Product',
              }));
            setProducts(productData);
            setSelectedProduct('');
          } catch (err) {
            setFormError('Failed to fetch products for this order');
          }
        };
        fetchProducts();
      } else {
        setProducts([]);
        setFormError('No products found for this order');
      }
    } else {
      setProducts([]);
      setSelectedProduct('');
    }
  }, [selectedOrder, orders]);

  // Function to generate a random 3-digit number padded with zeros
  const generateMaDG = async () => {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      // Generate a random number between 0 and 999, pad with zeros to ensure 3 digits
      const randomNum = Math.floor(Math.random() * 1000);
      const maDG = `DG${randomNum.toString().padStart(3, '0')}`; // e.g., DG123

      try {
        // Check if maDG already exists
        const response = await fetch(`https://apiwebtttn.onrender.com/api/danhgia/${maDG}`);
        const data = await response.json();

        if (data.status === 'error' && data.message === 'DanhGia not found') {
          return maDG; // maDG is unique
        }
      } catch (err) {
        // If the GET request fails for other reasons, assume maDG is available
        return maDG;
      }

      attempts++;
    }

    throw new Error('Could not generate a unique maDG after multiple attempts');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setError('');

    // Validate inputs
    if (!user || !user.maKH) {
      setFormError('Please log in to submit a review');
      setView('login');
      return;
    }
    if (!selectedOrder) {
      setFormError('Please select an order');
      return;
    }
    if (!selectedProduct) {
      setFormError('Please select a product');
      return;
    }
    if (!rating || rating < 1 || rating > 5) {
      setFormError('Please provide a rating between 1 and 5');
      return;
    }
    if (!comment.trim()) {
      setFormError('Please provide a comment');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate a unique maDG
      const maDG = await generateMaDG();
      const ngayDanhGia = new Date().toISOString().split('T')[0]; // Current date

      const reviewData = {
        maDG,
        maKH: user.maKH,
        maSP: selectedProduct,
        maDH: selectedOrder,
        ngayDanhGia,
        noiDung: comment,
        tieuDe: 'Review',
        soSao: parseInt(rating),
        hinhAnh: null,
        phanHoiCuaHang: null,
      };

      const response = await fetch('https://apiwebtttn.onrender.com/api/danhgia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      const data = await response.json();

      if (data.status === 'success') {
        alert('Review submitted successfully!');
        setView('account');
        setRating('');
        setComment('');
        setSelectedOrder('');
        setSelectedProduct('');
      } else {
        throw new Error(data.message || 'Failed to submit review');
      }
    } catch (err) {
      setFormError(`Failed to submit review: ${err.message}`);
      setError(`Failed to submit review: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
      <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
        {formError && <p className="text-red-500 mb-4">{formError}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Select Order</label>
            <select
              value={selectedOrder}
              onChange={(e) => setSelectedOrder(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select an order</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  Order #{order.id} - {order.date}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Select Product</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full p-2 border rounded"
              required
              disabled={!selectedOrder}
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded"
              rows="4"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}

Review.propTypes = {
  setView: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  user: PropTypes.object,
  orders: PropTypes.array.isRequired,
};

export default Review;