import React, { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Admin() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const addProduct = async () => {
    const { error } = await supabase
      .from('products')
      .insert([{ name, price: parseFloat(price), image_url: imgUrl }]);
    
    if (error) alert(error.message);
    else alert("Product Added!");
  };

  return (
    <div style={{ padding: '50px', background: 'white', minHeight: '100vh' }}>
      <h1>Admin Inventory Manager</h1>
      <input placeholder="Item Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Price" onChange={e => setPrice(e.target.value)} />
      <input placeholder="Image Filename (e.g. lash_fan.jpg)" onChange={e => setImgUrl(e.target.value)} />
      <button onClick={addProduct}>Post to Shop</button>
    </div>
  );
}