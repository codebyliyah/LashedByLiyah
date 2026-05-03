import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './App.css';

const HomePage = () => (
  <div className="content-wrap">
    <header className="hero-section">
      <div className="about-card">
        <h2 className="parisienne-font about-header">About the Brand</h2>
        <img src="/mainphoto.jpg" alt="Liyah" className="profile-img" />
        <p className="description-text">
          <strong>LashedByLiyah</strong> is the premier on-campus destination for 
          all things lashes in the heart of the AUC. What started as a passion for 
          artistry has evolved into a professional <strong>Lash Service and Supply Boutique</strong>.
        </p>
        <Link to="/lash-lab" className="buy-btn shop-now-btn">Book an Appointment</Link>
      </div>
    </header>
  </div>
);

const ProductsPage = ({ categoryTitle, filterType, bio, cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null); 
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', timeSlotId: '' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('category', categoryTitle);

      if (productData) {
        setProducts(productData);
      } else if (productError) {
        console.error("Error fetching products:", productError);
      }

      if (categoryTitle === "Services") {
        const { data: slotData } = await supabase
          .from('availability')
          .select('*')
          .eq('is_booked', false)
          .gte('slot_date', new Date().toISOString().split('T')[0]);

        if (slotData) setAvailableSlots(slotData);
      }
      setLoading(false);
    };
    fetchData();
  }, [categoryTitle]);
  
  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const toggleAddon = (addon) => {
    setSelectedAddons(prev => 
      prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]
    );
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const selectedSlot = availableSlots.find(s => s.id === formData.timeSlotId);
    
    if (!selectedSlot) return alert("Please select a time slot");

    let finalPrice = selectedItem.price; 
    if (selectedAddons.includes('Squeeze-in')) finalPrice += 30;
    if (selectedAddons.includes('Bottoms')) finalPrice += 10;
    if (selectedAddons.includes('Color')) finalPrice += 10;
    if (selectedAddons.includes('Lash Bath')) finalPrice += 10;

    const { error } = await supabase.from('bookings').insert([{
      client_name: formData.name,
      service_booked: selectedItem.name,
      date_time: `${selectedSlot.slot_date} ${selectedSlot.slot_time}`,
      snapshot_price: finalPrice, 
      status: 'confirmed'
    }]);

    if (!error) {
      await supabase.from('availability').update({ is_booked: true }).eq('id', formData.timeSlotId);
      alert("Booking Snapshot Saved! See you soon. ✨");
      setSelectedItem(null);
      setAvailableSlots(prev => prev.filter(s => s.id !== formData.timeSlotId));
    } else {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="content-wrap">
      <h2 className="parisienne-font brand-header" style={{textAlign: 'center', marginTop: '40px'}}>{categoryTitle}</h2>
      {bio && <div className="brand-bio-box"><p>{bio}</p></div>}
      
      <main className="product-grid">
        {loading ? (
          <p style={{textAlign: 'center', width: '100%', color: 'white'}}>Loading items...</p>
        ) : products.length > 0 ? (
          products.map((item) => (
            <div key={item.id} className="product-card">
              <img src={`/${item.image_url}`} alt={item.name} />
              <h3>{item.name}</h3>
              <p className="price-tag">${item.price}</p>
              <button 
                className="buy-btn" 
                onClick={() => filterType === 'Services' ? setSelectedItem(item) : addToCart(item)}
              >
                {filterType === 'Services' ? 'Book Now' : 'Add to Cart'}
              </button>
            </div>
          ))
        ) : (
          <p style={{textAlign: 'center', width: '100%', color: 'white'}}>No products found in this category.</p>
        )}
      </main>
      
      {cart.length > 0 && (
        <Link to="/checkout" className="floating-cart-btn">
          🛒 Checkout (${cart.reduce((s, i) => s + i.price, 0)})
        </Link>
      )}
      
      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content wider-modal">
            <h2 className="parisienne-font">Book: {selectedItem.name}</h2>
            <form onSubmit={handleBookingSubmit} className="admin-form">
              <input type="text" placeholder="Full Name" required onChange={e => setFormData({...formData, name: e.target.value})} />
              <input type="email" placeholder="Email" required onChange={e => setFormData({...formData, email: e.target.value})} />
              <input type="tel" placeholder="Phone" required onChange={e => setFormData({...formData, phone: e.target.value})} />
              
              <select required onChange={e => setFormData({...formData, timeSlotId: e.target.value})}>
                <option value="">Select Available Time</option>
                {availableSlots.map(slot => (
                  <option key={slot.id} value={slot.id}>
                    {slot.slot_date} @ {slot.slot_time.slice(0, 5)}
                  </option>
                ))}
              </select>

              <div className="addons-container">
                <h4 style={{margin: '0 0 10px 0'}}>Enhancements:</h4>
                <label><input type="checkbox" onChange={() => toggleAddon('Bottoms')} /> Bottoms (+$10)</label>
                <label><input type="checkbox" onChange={() => toggleAddon('Color')} /> Color (+$10)</label>
                <label><input type="checkbox" onChange={() => toggleAddon('Lash Bath')} /> Lash Bath (+$10)</label>
                <label><input type="checkbox" onChange={() => toggleAddon('Squeeze-in')} /> Squeeze-in Fee (+$30)</label>
              </div>
              <button type="submit" className="buy-btn">Confirm Appointment</button>
              <button type="button" onClick={() => setSelectedItem(null)} className="cancel-btn">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckoutPage = ({ cart, setCart, session }) => {
  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState({ name: '', address: '', city: '', zip: '' });
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const finalTotal = subtotal - discount;

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setDiscount(subtotal * 0.10);
      alert("Promo applied! You saved 10%");
    } else {
      alert("Invalid code. Try 'SAVE10'");
    }
  };

  const handleCompleteOrder = async (e) => {
    if (e) e.preventDefault();
    try {
      for (const item of cart) {
        await supabase.from('orders').insert([{
          user_id: session?.user?.id || null, 
          product_name: item.name,           
          purchased_price: item.price,       
          status: 'pending'
        }]);
      }
      setStep(3); 
      setCart([]);
      localStorage.removeItem('cart');
    } catch (err) {
      alert("Error saving order: " + err.message);
    }
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="content-wrap" style={{textAlign:'center', padding:'100px'}}>
        <h2 className="parisienne-font" style={{fontSize: '3rem', color: 'white'}}>Your cart is empty</h2>
        <Link to="/boutique" className="buy-btn" style={{width:'auto', display:'inline-block', marginTop: '20px'}}>Go Shopping</Link>
      </div>
    );
  }

  return (
    <div className="content-wrap" style={{ paddingTop: '60px', paddingBottom: '100px' }}>
      <div className="step-indicator">
        <span className={step === 1 ? 'step-active' : ''}>01 Details</span>
        <span style={{color: 'white'}}>→</span>
        <span className={step === 2 ? 'step-active' : ''}>02 Payment</span>
        <span style={{color: 'white'}}>→</span>
        <span className={step === 3 ? 'step-active' : ''}>03 Success</span>
      </div>

      <div className="checkout-container wider-checkout">
        <div className="about-card wider-box">
          {step === 1 && (
            <form className="admin-form" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              <h2 className="parisienne-font" style={{fontSize: '2.5rem'}}>Shipping Details</h2>
              <input placeholder="Full Name" required onChange={e => setShippingData({...shippingData, name: e.target.value})} />
              <input placeholder="Street Address" required />
              <div className="side-by-side" style={{display: 'flex', gap: '10px'}}>
                  <input placeholder="City" required style={{flex: 2}} />
                  <input placeholder="Zip Code" required style={{flex: 1}} />
              </div>
              <button type="submit" className="buy-btn" style={{marginTop: '20px'}}>Continue to Payment</button>
            </form>
          )}

          {step === 2 && (
            <form className="admin-form" onSubmit={handleCompleteOrder}>
              <h2 className="parisienne-font" style={{fontSize: '2.5rem'}}>Payment</h2>
              <input placeholder="Card Number" required />
              <div className="side-by-side" style={{display: 'flex', gap: '10px'}}>
                  <input placeholder="Exp MM/YY" required style={{flex: 1}} />
                  <input placeholder="CVV" required style={{flex: 1}} />
              </div>
              <button type="submit" className="buy-btn" style={{marginTop: '20px'}}>Complete Purchase</button>
              <button type="button" onClick={() => setStep(1)} style={{background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginTop: '15px', textDecoration: 'underline'}}>Back to Shipping</button>
            </form>
          )}

          {step === 3 && (
            <div style={{textAlign:'center', padding: '40px 0'}}>
              <h2 className="parisienne-font" style={{fontSize:'4rem'}}>Yay! 🌟</h2>
              <p>Your order is confirmed and has been added to our records.</p>
              <Link to="/" className="buy-btn" style={{textDecoration:'none', marginTop: '20px', display: 'inline-block'}}>Back Home</Link>
            </div>
          )}
        </div>

        <div className="order-summary wider-box">
          <h3 className="parisienne-font">Your Order Summary</h3>
          <div style={{maxHeight: '300px', overflowY: 'auto', marginBottom: '20px'}}>
            {cart.map((item, i) => (
              <div key={i} className="cart-item-mini">
                <span>{item.name}</span>
                <strong>${item.price}</strong>
              </div>
            ))}
          </div>

          <div className="promo-section" style={{display: 'flex', gap: '10px', marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px'}}>
            <input 
              placeholder="Promo Code" 
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              style={{flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #ddd'}}
            />
            <button type="button" onClick={applyPromo} className="buy-btn" style={{width: 'auto', padding: '0 20px', fontSize: '0.8rem'}}>Apply</button>
          </div>

          <div className="cart-total">
            <div style={{display: 'flex', flexDirection: 'column', gap: '5px', width: '100%'}}>
               <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', opacity: 0.8}}>
                  <span>Subtotal</span>
                  <span>${subtotal}</span>
               </div>
               {discount > 0 && (
                 <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#ff4d4d'}}>
                    <span>Discount</span>
                    <span>-${discount}</span>
                 </div>
               )}
               <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '10px'}}>
                  <span>Total</span>
                  <span>${finalTotal}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [promoCodes, setPromoCodes] = useState([]); 
  const [availability, setAvailability] = useState([]); 
  const [view, setView] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [newBooking, setNewBooking] = useState({ name: '', service: 'Full Set', date: '', time: '' });
  const [promoData, setPromoData] = useState({ code: '', type: 'percentage', value: '' });
  const [availData, setAvailData] = useState({ date: '', time: '' });

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) setInventory(inventory.filter(p => p.id !== id));
    }
  };

  const handleUploadPromo = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('promo_codes').insert([{
      code: promoData.code.toUpperCase(),
      discount_type: promoData.type,
      discount_value: parseFloat(promoData.value)
    }]);
    if (!error) {
      alert("Promo Code Active! ✨");
      window.location.reload();
    }
  };

  const handleAddAvail = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('availability').insert([{
      slot_date: availData.date,
      slot_time: availData.time
    }]);
    if (!error) {
      alert("Slot opened for booking!");
      window.location.reload();
    }
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      const { data: oData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      const { data: iData } = await supabase.from('products').select('*').order('name', { ascending: true });
      const { data: cData } = await supabase.from('bookings').select('client_name');
      const { data: pData } = await supabase.from('promo_codes').select('*');
      const { data: aData } = await supabase.from('availability').select('*').eq('is_booked', false);
      
      if (oData) setOrders(oData);
      if (iData) setInventory(iData);
      if (pData) setPromoCodes(pData);
      if (aData) setAvailability(aData);
      if (cData) {
        const uniqueCustomers = [...new Set(cData.map(c => c.client_name))];
        setCustomers(uniqueCustomers);
      }
      setLoading(false);
    };
    fetchAdminData();
  }, []);

  const handleAddBooking = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('bookings').insert([{
      client_name: newBooking.name,
      service_booked: newBooking.service,
      date_time: `${newBooking.date} ${newBooking.time}`,
      status: 'confirmed'
    }]);
    if (!error) {
      alert("Appointment added!");
      window.location.reload(); 
    }
  };

  const filteredInventory = selectedCategory === 'All' 
    ? inventory 
    : inventory.filter(item => item.category === selectedCategory);

  const categories = ['All', 'Services', 'Supplies', 'Apparel', 'Training', '1 on 1'];

  return (
    <div className="content-wrap" style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <h2 className="parisienne-font" style={{ color: 'white', textAlign: 'center', fontSize: '3.5rem', marginBottom: '20px' }}>
        Admin Dashboard
      </h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
        <button onClick={() => setView('dashboard')} className="buy-btn" style={{ width: 'auto', background: view === 'dashboard' ? '#000' : '#888' }}>Main Dashboard</button>
        <button onClick={() => setView('customers')} className="buy-btn" style={{ width: 'auto', background: view === 'customers' ? '#000' : '#888' }}>Customer Info</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', maxWidth: '1100px', margin: '0 auto' }}>
        {view === 'dashboard' ? (
          <>
            <div className="about-card" style={{ background: 'white', padding: '40px', borderRadius: '25px', width: '100%', boxSizing: 'border-box' }}>
              <h3 className="parisienne-font" style={{ fontSize: '2rem', marginBottom: '20px' }}>Open Booking Slot</h3>
              <form onSubmit={handleAddAvail} className="admin-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input type="date" required onChange={e => setAvailData({...availData, date: e.target.value})} />
                <input type="time" required onChange={e => setAvailData({...availData, time: e.target.value})} />
                <button type="submit" className="buy-btn" style={{ gridColumn: 'span 2' }}>Add to Live Schedule</button>
              </form>
            </div>
            <div className="about-card" style={{ background: 'white', padding: '40px', borderRadius: '25px', width: '100%', boxSizing: 'border-box' }}>
              <h3 className="parisienne-font" style={{ fontSize: '2rem', marginBottom: '20px' }}>Create Promo Code</h3>
              <form onSubmit={handleUploadPromo} className="admin-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <input placeholder="CODE (SAVE10)" required onChange={e => setPromoData({...promoData, code: e.target.value})} />
                <select onChange={e => setPromoData({...promoData, type: e.target.value})}>
                  <option value="percentage">% Off</option>
                  <option value="fixed">$ Off</option>
                </select>
                <input placeholder="Value (10)" type="number" required onChange={e => setPromoData({...promoData, value: e.target.value})} />
                <button type="submit" className="buy-btn" style={{ gridColumn: 'span 3' }}>Activate Promo</button>
              </form>
            </div>
            <div className="about-card" style={{ background: 'white', padding: '40px', borderRadius: '25px', width: '100%', boxSizing: 'border-box' }}>
              <h3 className="parisienne-font" style={{ fontSize: '2rem', marginBottom: '20px' }}>Direct Booking (Manual)</h3>
              <form onSubmit={handleAddBooking} className="admin-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <input placeholder="Client Name" required onChange={e => setNewBooking({...newBooking, name: e.target.value})} />
                <select onChange={e => setNewBooking({...newBooking, service: e.target.value})}>
                  <option value="Full Set">Full Set</option>
                  <option value="Fill In">Fill In</option>
                </select>
                <input type="date" required onChange={e => setNewBooking({...newBooking, date: e.target.value})} />
                <input type="time" required onChange={e => setNewBooking({...newBooking, time: e.target.value})} />
                <button type="submit" className="buy-btn" style={{ gridColumn: 'span 2' }}>Save to Database</button>
              </form>
            </div>
            <div className="about-card" style={{ background: 'white', padding: '40px', borderRadius: '25px', width: '100%', boxSizing: 'border-box' }}>
              <h3 className="parisienne-font" style={{ fontSize: '2.5rem', marginBottom: '30px', textAlign: 'center' }}>Order History</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 3fr 1.5fr 1.5fr', borderBottom: '2px solid #000', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem', paddingBottom: '15px', marginBottom: '10px' }}>
                <span>Date</span>
                <span>Product Item</span>
                <span>Price</span>
                <span style={{ textAlign: 'right' }}>Status</span>
              </div>
              {orders.map(o => (
                <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 3fr 1.5fr 1.5fr', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ color: '#888', fontSize: '0.9rem' }}>{new Date(o.created_at).toLocaleDateString()}</span>
                  <span style={{ fontWeight: '600' }}>{o.product_name}</span>
                  <span style={{ fontWeight: '500' }}>${o.purchased_price}</span>
                  <div style={{ textAlign: 'right' }}>
                    <span className="order-status-pill" style={{ background: '#000', color: '#fff', padding: '6px 15px', borderRadius: '20px', fontSize: '0.7rem' }}>
                      {o.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="about-card" style={{ background: 'white', padding: '40px', borderRadius: '25px', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px' }}>
                <h3 className="parisienne-font" style={{ fontSize: '2.5rem', margin: 0 }}>Inventory</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ fontSize: '0.75rem', padding: '8px 15px', background: selectedCategory === cat ? '#000' : '#eee', color: selectedCategory === cat ? '#fff' : '#000', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}>{cat}</button>
                  ))}
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {filteredInventory.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '20px 0', fontWeight: '500' }}>{item.name}</td>
                      <td>${item.price}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', marginRight: '15px', fontWeight: 'bold' }}>Edit</button>
                        <button onClick={() => deleteProduct(item.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="about-card" style={{ background: 'white', padding: '40px', borderRadius: '25px', width: '100%', boxSizing: 'border-box' }}>
            <h3 className="parisienne-font" style={{ fontSize: '2.5rem', marginBottom: '30px', textAlign: 'center' }}>Client Database</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px' }}>
              {customers.map((name, i) => (
                <div key={i} style={{ padding: '30px', border: '1px solid #eee', borderRadius: '20px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem', boxShadow: '0 5px 15px rgba(0,0,0,0.02)' }}>
                  👤 {name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  const [session, setSession] = useState(null);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const isAdmin = session?.user?.email === "admin@liyah.com"; 

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <h1 className="parisienne-font logo">LashedByLiyah</h1>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/lash-lab">Services</Link>
            <Link to="/boutique">Supplies</Link>
            <Link to="/apparel">Apparel</Link>
            <Link to="/academy">1-on-1</Link>
            {isAdmin && <Link to="/admin">Admin</Link>}
            {!session ? <Link to="/login">Login</Link> : <button onClick={() => supabase.auth.signOut()} className="logout-link">Logout</button>}
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lash-lab" element={<ProductsPage categoryTitle="Services" filterType="Services" cart={cart} setCart={setCart} />} />
          <Route path="/boutique" element={<ProductsPage categoryTitle="Supplies" filterType="Supplies" cart={cart} setCart={setCart} />} />
          <Route path="/apparel" element={<ProductsPage categoryTitle="Apparel" filterType="Apparel" cart={cart} setCart={setCart} />} />
          <Route path="/academy" element={<ProductsPage categoryTitle="Training" filterType="Training" cart={cart} setCart={setCart} />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} setCart={setCart} />} />
          <Route path="/admin" element={isAdmin ? <AdminPage /> : <HomePage />} />
          <Route path="/login" element={<LoginPage cart={cart} setCart={setCart} />} />
        </Routes>
      </div>
    </Router>
  );
}

const LoginPage = ({ cart, setCart }) => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  
  const handleLogin = async (event) => {
    event.preventDefault(); 
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email: email, 
      password: password 
    });

    if (error) {
      alert(error.message); 
    } else {
      if (cart.length > 0) {
        const { error: mergeError } = await supabase
          .from('user_carts')
          .upsert({
            user_id: data.user.id,
            items: cart,
            updated_at: new Date()
          });

        if (!mergeError) {
          localStorage.removeItem('cart');
        }
      }
      window.location.href = "/admin"; 
    }
  };

  return (
    <div className="content-wrap">
      <div className="about-card wider-modal">
        <form onSubmit={handleLogin} className="admin-form">
          <h2 className="parisienne-font" style={{fontSize: '2.5rem', marginBottom: '20px'}}>Member Login</h2>
          <input 
            placeholder="Email" 
            type="email"
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            placeholder="Password" 
            type="password" 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button className="buy-btn">Login & Sync</button>
        </form>
      </div>
    </div>
  );
};

export default App;