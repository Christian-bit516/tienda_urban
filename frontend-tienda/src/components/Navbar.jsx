import { ShoppingCart, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ vista, irAlInicio, busqueda, setBusqueda, setVerCarrito, carrito }) {
  return (
    <nav className="navbar">
      <div className="logo" onClick={irAlInicio}>
        URBAN<span>STORE</span>
      </div>

      {vista === 'inicio' && (
        <motion.div 
          className="search-container" 
          style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
          <Search className="search-icon" size={20} style={{ position: 'absolute', left: '15px', color: '#888' }} />
          <input 
            type="text" className="search-input"
            placeholder="Buscar colección..." 
            value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          />
          <AnimatePresence>
            {busqueda && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                style={{ position: 'absolute', right: '15px', cursor: 'pointer', color: '#888', display: 'flex' }}
                onClick={() => setBusqueda('')}
              >
                <X size={18} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <div className="nav-actions">
        <div className="cart-trigger" onClick={() => setVerCarrito(true)}>
          <ShoppingCart size={26} />
          <AnimatePresence>
            {carrito.length > 0 && (
              <motion.span 
                className="cart-count"
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              >
                {carrito.length}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}