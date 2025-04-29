import { useState, useEffect } from 'react';

function Account({ orders, user, setView }) {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [orderProducts, setOrderProducts] = useState({}); // Store products for each order

  // Fetch reviews for the logged-in customer
  useEffect(() => {
    if (user && user.maKH) {
      fetch(`https://apiwebtttn.onrender.com/api/danhgia?maKH=${user.maKH}&page=1&size=10`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'success' && data.data && Array.isArray(data.data)) {
            setReviews(
              data.data.map((r) => ({
                id: r.MaDG,
                orderId: r.MaDH,
                productId: r.MaSP,
                title: r.TieuDe || 'No Title',
                content: r.NoiDung || 'No Content',
                rating: r.SoSao,
                date: r.NgayDanhGia || new Date().toISOString().split('T')[0],
                image: r.HinhAnh || 'https://via.placeholder.com/150',
                storeReply: r.PhanHoiCuaHang,
              }))
            );
            setError('');
          } else {
            setError('No reviews found for this customer');
          }
        })
        .catch(() => setError('Failed to fetch reviews'));
    }
  }, [user]);

  // Fetch product names for each order based on chitiet
  useEffect(() => {
    if (orders.length > 0) {
      const fetchOrderProducts = async () => {
        try {
          const productsByOrder = {};
          for (const order of orders) {
            if (order.chitiet && Array.isArray(order.chitiet)) {
              const productIds = order.chitiet.map((item) => item.MaSP).filter(Boolean);
              const uniqueProductIds = [...new Set(productIds)]; // Remove duplicates

              // Fetch product details for each MaSP
              const productPromises = uniqueProductIds.map((maSP) =>
                fetch(`https://apiwebtttn.onrender.com/api/sanpham/${maSP}`).then((res) =>
                  res.json()
                )
              );
              const productResponses = await Promise.all(productPromises);
              const products = productResponses
                .filter((p) => p.status === 'success' && p.data)
                .map((p) => p.data.TenSP || 'Unknown Product');

              productsByOrder[order.id] = products.length > 0 ? products : ['No Products Found'];
            } else {
              productsByOrder[order.id] = ['No Products Found'];
            }
          }
          setOrderProducts(productsByOrder);
        } catch (err) {
          console.error('Failed to fetch product names:', err);
          setError('Failed to fetch product details');
        }
      };
      fetchOrderProducts();
    }
  }, [orders]);

  // Check if user is defined and has username
  if (!user || !user.username) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">My Account</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <p>Please log in to view your account details.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Account</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <h3 className="text-lg font-semibold">Order History</h3>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border-b py-2">
              <p>Order #{order.id} - {order.date}</p>
              <p>
                Products:{' '}
                {orderProducts[order.id]
                  ? orderProducts[order.id].join(', ')
                  : 'Loading...'}
              </p>
              <p>Total: VND {order.total.toLocaleString()}</p>
              <button
                onClick={() => setView('review')}
                className="text-red-600 hover:underline"
              >
                Write a Review
              </button>
            </div>
          ))
        )}
        <h3 className="text-lg font-semibold mt-4">My Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews found.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b py-2">
              <p>
                Review for Order #{review.orderId} (Product #{review.productId}) - {review.title}
              </p>
              <p>Rating: {review.rating}/5</p>
              <p>{review.content}</p>
              {review.image && (
                <img
                  src={review.image}
                  alt="Review"
                  className="w-24 h-24 object-cover mt-2"
                />
              )}
              {review.storeReply && (
                <p className="text-gray-600 mt-2">
                  Store Reply: {review.storeReply}
                </p>
              )}
              <p className="text-gray-500 text-sm">Posted on {review.date}</p>
            </div>
          ))
        )}
        <h3 className="text-lg font-semibold mt-4">Profile</h3>
        <p>Username: {user.username}</p>
        <button
          onClick={() => alert('Profile update not implemented')}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}

export default Account;