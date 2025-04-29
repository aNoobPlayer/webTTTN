import { useState } from 'react';

function AdminDashboard({
  products,
  orders,
  categories,
  handleAddProduct,
  handleUpdateProduct,
  handleDeleteProduct,
  handleUpdateOrder,
  setError,
}) {
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [productDescription, setProductDescription] = useState('');
  const [productStock, setProductStock] = useState('');
  const [receiptId, setReceiptId] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImage(file);
    }
  };

  const handleSubmitProduct = () => {
    if (productName && productPrice && productCategory && productStock) {
      const imagePath = productImage ? `./images/${productImage.name}` : editingProduct?.image || '';
      if (editingProduct) {
        handleUpdateProduct(
          editingProduct.id,
          productName,
          productPrice,
          productCategory,
          imagePath,
          productDescription,
          productStock
        );
      } else {
        handleAddProduct(
          productId,
          productName,
          productPrice,
          productCategory,
          imagePath,
          productDescription,
          productStock
        );
      }
      resetForm();
    } else {
      setError('Please fill in all required fields');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductId(product.id);
    setProductName(product.name);
    setProductPrice(product.price);
    setProductCategory(product.category);
    setProductImage(null);
    setProductDescription(product.description);
    setProductStock(product.stock);
  };

  const handleDeleteConfirm = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (productToDelete) {
      handleDeleteProduct(productToDelete.id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setProductId('');
    setProductName('');
    setProductPrice('');
    setProductCategory('');
    setProductImage(null);
    setProductDescription('');
    setProductStock('');
  };

  // Filter and search products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? product.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];
    if (sortField === 'price' || sortField === 'stock') {
      return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    }
    return sortOrder === 'asc'
      ? fieldA.localeCompare(fieldB)
      : fieldB.localeCompare(fieldA);
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Management */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Product Management</h3>
            {/* Add/Update Product Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product ID *</label>
                <input
                  type="text"
                  placeholder="Enter Product ID"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  disabled={editingProduct}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  placeholder="Enter Product Name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                <input
                  type="number"
                  placeholder="Enter Price"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">Select Category</option>
                  {categories.map(
                    (category) =>
                      category.id && (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      )
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
                />
                {editingProduct && productImage === null && (
                  <p className="text-sm text-gray-500 mt-1">Current: {editingProduct.image}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label>
                <input
                  type="number"
                  placeholder="Enter Stock Quantity"
                  value={productStock}
                  onChange={(e) => setProductStock(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Enter Description"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  rows="4"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleSubmitProduct}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!productName || !productPrice || !productCategory || !productStock}
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button
                onClick={resetForm}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Clear
              </button>
            </div>

            {/* Search and Filter */}
            <div className="mt-6 flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Products</label>
                <input
                  type="text"
                  placeholder="Search by name or ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <div className="flex-1 mt-4 md:mt-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="">All Categories</option>
                  {categories.map(
                    (category) =>
                      category.id && (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      )
                  )}
                </select>
              </div>
            </div>

            {/* Sort Controls */}
            <div className="mt-4 flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortField}
                onChange={(e) => handleSort(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="stock">Stock</option>
              </select>
              <button
                onClick={() => handleSort(sortField)}
                className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                title={sortOrder === 'asc' ? 'Sort descending' : 'Sort ascending'}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            {/* Product List */}
            <div className="mt-6">
              {sortedProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No products found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Image</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('name')}>
                          Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Category</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('price')}>
                          Price {sortField === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer" onClick={() => handleSort('stock')}>
                          Stock {sortField === 'stock' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedProducts.map((product) => (
                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-2">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-10 h-10 object-contain rounded"
                              />
                            ) : (
                              <span className="text-gray-500">N/A</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-gray-800">{product.name}</td>
                          <td className="px-4 py-2 text-gray-800">{product.id}</td>
                          <td className="px-4 py-2 text-gray-600">
                            {categories.find((c) => c.id === product.category)?.name || product.category}
                          </td>
                          <td className="px-4 py-2 text-gray-600">VND {product.price.toLocaleString()}</td>
                          <td className="px-4 py-2 text-gray-600">{product.stock}</td>
                          <td className="px-4 py-2 flex space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-800 font-medium transition"
                              title="Edit Product"
                              onClick={() => handleEditProduct(product)}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800 font-medium transition"
                              title="Delete Product"
                              onClick={() => handleDeleteConfirm(product)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Deletion</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setProductToDelete(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Order and Inventory Management */}
          <div className="space-y-6">
            {/* Order Management */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Order Management</h3>
              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No orders available.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          Order #{order.id} - {order.customer}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Date: {new Date(order.date).toLocaleDateString()} | Total: VND{' '}
                          {order.total.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <select
                          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          onChange={(e) => handleUpdateOrder(order.id, e.target.value)}
                          value={order.status}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inventory Management */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Inventory Management</h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Receipt ID</label>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Enter Receipt ID"
                    value={receiptId}
                    onChange={(e) => setReceiptId(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  <button
                    onClick={() => {
                      if (receiptId) {
                        alert(`Inbound receipt ${receiptId} created!`);
                        setReceiptId('');
                      } else {
                        setError('Please enter a receipt ID');
                      }
                    }}
                    className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    Create
                  </button>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Stock Overview</h4>
                {sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex justify-between py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-gray-800">{product.name}</span>
                    <span className="text-gray-600">Stock: {product.stock}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;