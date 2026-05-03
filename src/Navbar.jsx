import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ display: 'flex', gap: '20px', padding: '15px', background: '#fff0f5' }}>
      <h2 style={{ margin: 0 }}>LashedByLiyah</h2>
      <Link to="/">Home</Link>
      <Link to="/services">The Lash Lab</Link>
      <Link to="/shop">LBL Boutique</Link>
      <Link to="/academy">The Academy</Link>
      <Link to="/admin" style={{ color: 'red' }}>Admin</Link>
    </nav>
  );
}

export default Navbar;