import { X, Trash2 } from 'lucide-react';

export default function CartSidebar({ carrito, setVerCarrito, eliminarDelCarrito, total, irAlCheckout }) {
  return (
    <div className="cart-sidebar">
      <div className="cart-header">
        <h3>Tu Bolsa ({carrito.length})</h3>
        <X className="close-cart" onClick={() => setVerCarrito(false)} />
      </div>
      <div className="cart-items">
        {carrito.length === 0 ? <p className="empty-msg">Tu bolsa está vacía.</p> : 
          carrito.map((item, index) => (
            <div key={index} className="cart-item">
              <img src={item.imagen} alt="" />
              <div className="item-details">
                <h4>{item.nombre}</h4>
                <p className="item-meta">{item.color} | Talla {item.talla}</p>
                <span className="item-price">S/ {item.precio}</span>
              </div>
              <Trash2 className="remove-icon" size={18} onClick={() => eliminarDelCarrito(index)} />
            </div>
          ))
        }
      </div>
      {carrito.length > 0 && (
        <div className="cart-footer">
          <div className="total-box"><span>Subtotal:</span><span className="total-amount">S/ {total.toFixed(2)}</span></div>
          <button className="btn-solid" style={{width:'100%', marginTop:'15px', padding:'18px'}} onClick={irAlCheckout}>Ir al Pago Seguro</button>
        </div>
      )}
    </div>
  );
}