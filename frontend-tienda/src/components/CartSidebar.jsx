import { X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartSidebar({ carrito, setVerCarrito, eliminarDelCarrito, total, irAlCheckout }) {
  // Animación física realista para el carrito
  const sidebarVariant = {
    hidden: { x: '100%', opacity: 0.5 },
    show: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',     // Física de resorte
        damping: 30,        // Resistencia (sin rebote excesivo)
        stiffness: 250,     // Velocidad de entrada
        mass: 1,
        staggerChildren: 0.08,
        delayChildren: 0.1
      } 
    },
    exit: { 
      x: '100%', 
      opacity: 0.8,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
    show: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.8, x: -50, transition: { duration: 0.3 } }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}>
      {/* Fondo con Blur Elegante */}
      <motion.div 
        className="overlay" 
        onClick={() => setVerCarrito(false)}
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', pointerEvents: 'auto' }}
      />
      
      <motion.div 
        className="cart-sidebar"
        variants={sidebarVariant}
        initial="hidden" 
        animate="show" 
        exit="exit"
        style={{ pointerEvents: 'auto', position: 'absolute', right: 0, top: 0 }}
      >
        <motion.div className="cart-header" variants={itemVariant}>
          <h3>Tu Bolsa ({carrito.length})</h3>
          <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.3 }}>
            <X className="close-cart" onClick={() => setVerCarrito(false)} style={{cursor: 'pointer'}} size={28}/>
          </motion.div>
        </motion.div>
        
        <div className="cart-items" style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
          {carrito.length === 0 ? (
            <motion.p variants={itemVariant} className="empty-msg" style={{color: '#888', marginTop: '20px'}}>Tu bolsa está vacía. ¡Descubre nuestra nueva colección!</motion.p>
          ) : (
            <AnimatePresence>
              {carrito.map((item, index) => (
                <motion.div 
                  key={`${item.id}-${index}`} 
                  className="cart-item"
                  variants={itemVariant}
                  style={{ background: '#fafafa', padding: '15px', borderRadius: '16px', alignItems: 'center', border: '1px solid #eee' }}
                >
                  <img src={item.imagen} alt="" style={{width: '80px', height:'100px', objectFit:'cover', borderRadius:'10px'}} />
                  <div className="item-details" style={{flex: 1, marginLeft: '5px'}}>
                    <h4 style={{fontSize: '1.05rem', marginBottom: '4px'}}>{item.nombre}</h4>
                    <p className="item-meta" style={{fontSize: '0.85rem', color: '#777'}}>{item.color} | Talla {item.talla}</p>
                    <span className="item-price" style={{fontSize: '1.1rem', fontWeight: 900}}>S/ {item.precio}</span>
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.15, color: '#dc3545', rotate: 5 }} 
                    whileTap={{ scale: 0.9 }}
                    style={{ padding: '10px', cursor: 'pointer', color: '#aaa' }}
                  >
                    <Trash2 className="remove-icon" size={22} onClick={() => eliminarDelCarrito(index)} style={{margin: 0}} />
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {carrito.length > 0 && (
          <motion.div className="cart-footer" variants={itemVariant} style={{ marginTop: '20px' }}>
            <div className="total-box" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontWeight: '900', fontSize: '1.3rem' }}>
              <span>Subtotal:</span>
              <span className="total-amount" style={{ color: 'var(--accent)' }}>S/ {total.toFixed(2)}</span>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: '#222' }} whileTap={{ scale: 0.98 }} 
              className="btn-solid" style={{width:'100%', padding:'22px', borderRadius: '16px', fontSize: '1.1rem'}} 
              onClick={irAlCheckout}
            >
              Procesar Pago Seguro
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}