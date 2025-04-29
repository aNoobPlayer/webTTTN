function Menu({ products, categories, selectedCategory, setSelectedCategory, addToCart }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 tracking-tight">Our Menu</h2>
      
      {/* Category Filter */}
      <div className="mb-8">
        <label className="block text-gray-700 font-medium mb-3">Filter by Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-1/3 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full">No products found in this category.</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              {/* Image Container */}
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg bg-gray-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Product Details */}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-3">
                Category: {categories.find((c) => c.id === product.category)?.name || product.category}
              </p>
              <p className="text-red-600 font-bold text-lg mb-4">
                VND {product.price.toLocaleString()}
              </p>

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart(product)}
                className={`w-full py-2 px-4 rounded-lg font-medium text-white transition-colors duration-200 ${
                  product.stock === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Menu;