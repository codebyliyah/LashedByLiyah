import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './App.css';

// --- HOME PAGE ---
const HomePage = () => (
  <div className="content-wrap">
    <header className="hero-section">
      <div className="about-card">
        <h2 className="parisienne-font brand-header">About the Brand</h2>
        <img src="mainphoto.jpg" alt="Liyah" className="profile-img" style={{ maxWidth: '350px', border: '3px solid #000', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }} />
        <p className="description-text">
          <strong>LashedByLiyah</strong> meets student entrepreneurship. Based in the heart of the AUC, 
          I have transitioned to a <strong>premium lash supply boutique</strong>. 
          As a graduating senior at <strong>Clark Atlanta University</strong>, I’ve curated a collection of 
          professional-grade tools and essentials.
        </p>
        <Link to="/shop" className="buy-btn shop-now-btn">Shop the Collection</Link>
      </div>
    </header>
  </div>
);

// --- PRODUCTS SHOP PAGE ---
const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*');
      if (data) setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="content-wrap">
      <h2 className="parisienne-font brand-header" style={{textAlign: 'center', marginTop: '40px'}}>Supplies & Inventory</h2>
      <main className="product-grid">
        {products.map((item) => (
          <div key={item.id} className="product-card">
            <img src={item.image_url} alt={item.name} />
            <h3>{item.name}</h3>
            <p className="price-tag">${item.price}</p>
            <button className="buy-btn">Add to Cart</button>
          </div>
        ))}
      </main>
    </div>
  );
};

// --- ADMIN DASHBOARD (CRUD) ---
const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', image_url: '', category: '' });

  useEffect(() => { fetchInventory(); }, []);

  const fetchInventory = async () => {
    const { data } = await supabase.from('products').select('*');
    if (data) setProducts(data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('products').insert([form]);
    if (!error) {
      alert("Product Added!");
      setForm({ name: '', price: '', image_url: '', category: '' });
      fetchInventory();
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) fetchInventory();
  };

  return (
    <div className="admin-container">
      <div className="about-card admin-form-card">
        <h2 className="parisienne-font logo-black">Add New Supply</h2>
        <form onSubmit={handleAdd} className="admin-form">
          <input placeholder="Product Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input placeholder="Price" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
          <input placeholder="Image Filename (e.g., lash_fan.jpg)" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} required />
          <input placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
          <button type="submit" className="buy-btn">Post to Shop</button>
        </form>
      </div>

      <div className="inventory-list">
        <h2 className="parisienne-font logo-black" style={{textAlign: 'center'}}>Current Inventory</h2>
        <div className="admin-grid">
          {products.map(item => (
            <div key={item.id} className="admin-item">
              <span><strong>{item.name}</strong> - ${item.price}</span>
              <button onClick={() => handleDelete(item.id)} className="delete-btn">Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <h1 className="parisienne-font logo">LashedByLiyah</h1>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/admin">Admin</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ProductsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;