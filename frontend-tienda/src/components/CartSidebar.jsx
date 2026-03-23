import { X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartSidebar({ carrito, setVerCarrito, eliminarDelCarrito, total, irAlCheckout }) {
  return (
    <>
      <motion.div 
        className="overlay" 
        onClick={() => setVerCarrito(false)}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2999 }}
      />
      <motion.div 
        className="cart-sidebar"
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <div className="cart-header">
          <h3>Tu Bolsa ({carrito.length})</h3>
          <X className="close-cart" onClick={() => setVerCarrito(false)} style={{cursor: 'pointer'}} />
        </div>
        
        <div className="cart-items" style={{ flex: 1, overflowY: 'auto' }}>
          {carrito.length === 0 ? <p className="empty-msg" style={{color: '#888'}}>Tu bolsa está vacía.</p> : 
            <AnimatePresence>
              {carrito.map((item, index) => (
                <motion.div 
                  key={index} 
                  className="cart-item"
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, scale: 0.8, x: -50 }} /* ANIMACIÓN GENIAL AL ELIMINAR */
                  transition={{ delay: index * 0.05 }}
                  style={{ background: '#fafafa', padding: '10px', borderRadius: '12px', alignItems: 'center' }}
                >
                  <img src={item.imagen} alt="" style={{width: '75px', height:'90px', objectFit:'cover', borderRadius:'8px'}} />
                  <div className="item-details" style={{flex: 1}}>
                    <h4 style={{fontSize: '1rem', marginBottom: '2px'}}>{item.nombre}</h4>
                    <p className="item-meta" style={{fontSize: '0.8rem'}}>{item.color} | Talla {item.talla}</p>
                    <span className="item-price" style={{fontSize: '1rem'}}>S/ {item.precio}</span>
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.2, color: '#dc3545', rotate: 10 }} 
                    whileTap={{ scale: 0.9 }}
                    style={{ padding: '10px', cursor: 'pointer', color: '#888' }}
                  >
                    <Trash2 className="remove-icon" size={20} onClick={() => eliminarDelCarrito(index)} style={{margin: 0}} />
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          }
        </div>

        {carrito.length > 0 && (
          <div className="cart-footer">
            <div className="total-box"><span>Subtotal:</span><span className="total-amount">S/ {total.toFixed(2)}</span></div>
            <motion.button 
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} 
              className="btn-solid" style={{width:'100%', marginTop:'15px', padding:'18px'}} 
              onClick={irAlCheckout}
            >
              Ir al Pago Seguro
            </motion.button>
          </div>
        )}
      </motion.div>
    </>
  );
}