import { ShoppingCart, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ vista, irAlInicio, busqueda, setBusqueda, setVerCarrito, carrito }) {
  return (
    <nav className="navbar" style={{ zIndex: 5000, position: 'sticky', top: 0 }}>
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
                style={{ position: 'absolute', right: '15px', cursor: 'pointer', color: '#888', display: 'flex', padding: '5px' }}
                onClick={() => setBusqueda('')}
              >
                <X size={18} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <div className="nav-actions">
        {/* Z-INDEX FORZADO Y ÁREA CLICKEABLE AMPLIADA */}
        <motion.div 
          className="cart-trigger" 
          onClick={(e) => {
            e.stopPropagation(); // Evita que otros eventos bloqueen el clic
            setVerCarrito(true);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.85 }}
          style={{ position: 'relative', cursor: 'pointer', padding: '10px', zIndex: 5001, display: 'flex', alignItems: 'center' }}
        >
          <ShoppingCart size={26} />
          <AnimatePresence>
            {carrito.length > 0 && (
              <motion.span 
                className="cart-count"
                initial={{ scale: 0, rotate: -45 }} 
                animate={{ scale: 1, rotate: 0 }} 
                exit={{ scale: 0, rotate: 45 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                {carrito.length}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </nav>
  );
}