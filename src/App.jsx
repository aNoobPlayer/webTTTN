import { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Home from './components/Home.jsx';
import Menu from './components/Menu.jsx';
import Cart from './components/Cart.jsx';
import Checkout from './components/Checkout.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Account from './components/Account.jsx';
import Review from './components/Review.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';

const API_BASE_URL = 'https://apiwebtttn.onrender.com/api/';

function App() {
  const [view, setView] = useState('home');
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}danhmuc?page=1&size=100`)
      .then((res) => res.json())
      .then((data) => {
        const mappedCategories = data.data.map((c) => ({
          id: c.MaDM,
          name: c.TenDM,
        }));
        setCategories([{ id: '', name: 'All Categories' }, ...mappedCategories]);
        setError('');
      })
      .catch((err) => {
        console.error('Failed to fetch categories:', err);
        fetch(`${API_BASE_URL}sanpham?all=true`)
          .then((res) => res.json())
          .then((data) => {
            const uniqueCategories = [...new Set(data.data.map((p) => p.MaDM))].map((maDM) => ({
              id: maDM,
              name: maDM,
            }));
            setCategories([{ id: '', name: 'All Categories' }, ...uniqueCategories]);
          })
          .catch(() => setError('Failed to fetch categories'));
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const url = new URL(`${API_BASE_URL}sanpham`);
    url.searchParams.append('all', 'true');
    if (selectedCategory) {
      url.searchParams.append('maDM', selectedCategory);
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const mappedProducts = data.data.map((p) => ({
          id: p.MaSP,
          name: p.TenSP,
          category: p.MaDM || 'Unknown',
          price: p.Gia,
          image: p.HinhAnh || 'https://via.placeholder.com/150',
          description: p.MoTa || '',
          stock: p.SoLuongTon || 0,
        }));
        setProducts(mappedProducts);
        setError('');
      })
      .catch(() => setError('Failed to fetch products'))
      .finally(() => setIsLoading(false));
  }, [selectedCategory]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let url = `${API_BASE_URL}donhang?page=1&size=10`;
        if (user && user.role === 'customer' && user.maKH) {
          url += `&maKH=${user.maKH}`;
        }
        const res = await fetch(url);
        const data = await res.json();

        if (data.status === 'success' && data.data) {
          const fetchTotals = await Promise.all(
            data.data.map(async (o) => {
              const resChiTiet = await fetch(`${API_BASE_URL}donhang/${o.MaDH}`);
              const dataChiTiet = await resChiTiet.json();
              let total = 0;

              if (dataChiTiet.status === 'success' && dataChiTiet.data?.chitiet) {
                total = dataChiTiet.data.chitiet.reduce(
                  (sum, ct) => sum + ct.DonGia * ct.SoLuong,
                  0
                );
              }

              return {
                id: o.MaDH,
                customer: o.MaKH || 'Unknown',
                date: o.NgayDat || new Date().toISOString().split('T')[0],
                status: o.TrangThai,
                total,
                chitiet: dataChiTiet.data.chitiet,
              };
            })
          );

          setOrders(fetchTotals);
          setError('');
        } else {
          setOrders([]);
          setError('No orders found');
        }
      } catch (err) {
        setOrders([]);
        setError('Failed to fetch orders');
      }
    };

    fetchOrders();
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
    setView(userData.role === 'admin' ? 'admin' : 'account');
  };

  const handleLogout = () => {
    setUser(null);
    setOrders([]);
    setView('home');
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      setCart(
        cart.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleCheckout = (address, paymentMethod) => {
    const orderData = {
      MaKH: user?.maKH || 'GUEST',
      NgayDatHang: new Date().toISOString().split('T')[0],
      TongTien: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      TrangThai: 'Processing',
      DiaChiGiaoHang: address,
      ChiTietDonHangs: cart.map((item) => ({
        MaSP: item.id,
        SoLuong: item.quantity,
        Gia: item.price,
      })),
    };

    fetch(`${API_BASE_URL}donhang`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    })
      .then((res) => res.json())
      .then((data) => {
        alert('Order placed successfully!');
        setCart([]);
        setView('account');
        setOrders([
          ...orders,
          {
            id: data.MaDH,
            customer: data.MaKH,
            date: data.NgayDatHang,
            status: data.TrangThai,
            total: data.TongTien,
          },
      ])})
      .catch(() => setError('Failed to place order'));
  };

  const handleAddProduct = (id, name, price, category, image, description, stock) => {
    const productData = {
      maSP: id,
      tenSP: name,
      gia: parseFloat(price),
      maDM: category,
      hinhAnh: image || 'https://via.placeholder.com/150',
      moTa: description,
      soLuongTon: parseInt(stock) || 100,
      loaiSP: '',
    };

    fetch(`${API_BASE_URL}sanpham`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts([
          ...products,
          {
            id: data.data.maSP,
            name: data.data.tenSP,
            category: data.data.maDM,
            price: data.data.gia,
            image: data.data.hinhAnh,
            description: data.data.moTa,
            stock: data.data.soLuongTon,
          },
        ]);
        alert('Product added!');
        setError('');
      })
      .catch(() => setError('Failed to add product'));
  };

  const handleUpdateProduct = (id, name, price, category, image, description, stock) => { 
    const productData = {
      tenSP: name,
      gia: parseFloat(price),
      maDM: category,
      hinhAnh: image || 'https://via.placeholder.com/150',
      moTa: description,
      soLuongTon: parseInt(stock) || 100,
      loaiSP: '', // thêm nếu backend yêu cầu
    };
  
    fetch(`${API_BASE_URL}sanpham/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(
          products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  name: data.data.tenSP,
                  price: data.data.gia,
                  category: data.data.maDM,
                  image: data.data.hinhAnh,
                  description: data.data.moTa,
                  stock: data.data.soLuongTon,
                }
              : p
          )
        );
        alert('Product updated!');
        setError('');
      })
      .catch(() => setError('Failed to update product'));
  };
  

  const handleDeleteProduct = (id) => {
    fetch(`${API_BASE_URL}sanpham/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setProducts(products.filter((p) => p.id !== id));
        alert('Product deleted!');
        setError('');
      })
      .catch(() => setError('Failed to delete product'));
  };

  const handleUpdateOrder = (orderId, newStatus) => {
    fetch(`${API_BASE_URL}donhang/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stereotype({ TrangThai: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(
          orders.map((o) => (o.id === orderId ? { ...o, status: data.TrangThai } : o))
        );
        alert(`Order ${orderId} updated!`);
        setError('');
      })
      .catch(() => setError('Failed to update order'));
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <Navbar
        view={view}
        setView={setView}
        cart={cart}
        user={user}
        handleLogout={handleLogout}
      />
      <div className="container mx-auto p-4 flex-grow">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {isLoading && <p className="text-gray-600 mb-4">Loading products...</p>}
        {view === 'home' && <Home setView={setView} />}
        {view === 'menu' && (
          <Menu
            products={products}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            addToCart={addToCart}
          />
        )}
        {view === 'cart' && (
          <Cart
            cart={cart}
            setView={setView}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />
        )}
        {view === 'checkout' && (
          <Checkout handleCheckout={handleCheckout} setError={setError} />
        )}
        {view === 'login' && (
          <Login handleLogin={handleLogin} setView={setView} setError={setError} />
        )}
        {view === 'register' && <Register setView={setView} setError={setError} />}
        {view === 'account' && user && user.role === 'customer' && (
          <Account orders={orders} user={user} setView={setView} />
        )}
        {view === 'review' && <Review setView={setView} setError={setError} />}
        {view === 'admin' && user && user.role === 'admin' && (
          <AdminDashboard
            products={products}
            orders={orders}
            categories={categories}
            handleAddProduct={handleAddProduct}
            handleUpdateProduct={handleUpdateProduct}
            handleDeleteProduct={handleDeleteProduct}
            handleUpdateOrder={handleUpdateOrder}
            setError={setError}
          />
        )}
      </div>
      <footer className="bg-red-600 text-white p-4 text-center">
        <p>© 2025 KFC Vietnam. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;