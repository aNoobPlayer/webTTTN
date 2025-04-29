function Review({ setView, setError }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
      <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700">Rating (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            id="rating"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Comment</label>
          <textarea
            id="comment"
            className="w-full p-2 border rounded"
            rows="4"
            required
          ></textarea>
        </div>
        <button
          onClick={() => {
            const rating = document.getElementById('rating').value;
            const comment = document.getElementById('comment').value;
            if (rating && comment) {
              alert('Review submitted!');
              setView('account');
            } else {
              setError('Please fill in all fields');
            }
          }}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}

export default Review;