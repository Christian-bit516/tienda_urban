import { ShoppingCart, Search } from 'lucide-react';

export default function Navbar({ vista, irAlInicio, busqueda, setBusqueda, setVerCarrito, carrito }) {
  return (
    <nav className="navbar">
      <div className="logo" onClick={irAlInicio}>
        URBAN<span>STORE</span>
      </div>

      {vista === 'inicio' && (
        <div className="search-container">
          <Search className="search-icon" size={20} />
          <input 
            type="text" className="search-input"
            placeholder="Buscar colección..." 
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      )}

      <div className="nav-actions">
        <div className="cart-trigger" onClick={() => setVerCarrito(true)}>
          <ShoppingCart size={26} />
          {carrito.length > 0 && <span className="cart-count">{carrito.length}</span>}
        </div>
      </div>
    </nav>
  );
}