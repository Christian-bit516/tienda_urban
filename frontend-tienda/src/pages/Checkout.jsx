import { useState } from 'react';
import { ArrowLeft, Lock, CreditCard, ShieldCheck, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function Checkout({ carrito, total, irAlInicio, setCarrito }) {
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [compraExitosa, setCompraExitosa] = useState(false);

  const handleFinalizarCompra = (e) => {
    e.preventDefault(); 
    axios.post('http://localhost/tienda_urban/backend/api/finalizar_compra.php', { carrito, total: total.toFixed(2) })
      .then(res => {
        if (res.data.status === "ok") {
          setCompraExitosa(true);
          setCarrito([]);
        }
      });
  };

  if (compraExitosa) {
    return (
      <div className="checkout-page">
        <div className="success-screen">
          <CheckCircle size={80} color="#28a745" />
          <h2>¡Pago Procesado con Éxito!</h2>
          <p>Tu número de orden es: <strong>#URB-{Math.floor(Math.random() * 10000)}</strong></p>
          <p>Te hemos enviado un correo de confirmación con los detalles del envío.</p>
          <button onClick={() => { setCompraExitosa(false); irAlInicio(); }} className="success-btn">
            Volver a la Pantalla Principal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-form-section">
          <button className="back-btn checkout-back" onClick={irAlInicio} style={{marginBottom: '20px'}}>
            <ArrowLeft size={18} /> Seguir comprando
          </button>

          <h2><Lock size={20} /> Pago Seguro</h2>
          <form onSubmit={handleFinalizarCompra} className="checkout-form">
            <div className="form-section">
              <h3>1. Información de Contacto</h3>
              <input type="email" placeholder="Correo electrónico" required className="checkout-input" />
              <input type="text" placeholder="Teléfono / Celular" required className="checkout-input" />
            </div>
            <div className="form-section">
              <h3>2. Dirección de Envío</h3>
              <div className="input-group-2">
                <input type="text" placeholder="Nombres" required className="checkout-input" />
                <input type="text" placeholder="Apellidos" required className="checkout-input" />
              </div>
              <input type="text" placeholder="DNI / CE" required className="checkout-input" />
              <input type="text" placeholder="Dirección completa (Calle, número, dpto)" required className="checkout-input" />
              <div className="input-group-2">
                <select required className="checkout-input">
                  <option value="">Selecciona tu Distrito</option>
                  <option value="lima">Lima Cercado</option>
                  <option value="miraflores">Miraflores</option>
                </select>
                <input type="text" placeholder="Referencia" className="checkout-input" />
              </div>
            </div>
            
            <div className="form-section">
              <h3>3. Método de Pago</h3>
              <div className="payment-methods">
                <label className="payment-option">
                  <input type="radio" name="pago" value="tarjeta" checked={metodoPago === 'tarjeta'} onChange={() => setMetodoPago('tarjeta')} />
                  <span>Tarjeta de Crédito / Débito <CreditCard size={18}/></span>
                </label>
                {metodoPago === 'tarjeta' && (
                  <div className="card-details">
                    <input type="text" placeholder="Número de Tarjeta (16 dígitos)" maxLength="16" required className="checkout-input" style={{marginBottom: 0}} />
                    <input type="text" placeholder="Nombre en la Tarjeta" required className="checkout-input" style={{marginBottom: 0}} />
                    <div className="card-row">
                      <input type="text" placeholder="MM/AA" maxLength="5" required className="checkout-input" style={{marginBottom: 0}} />
                      <input type="text" placeholder="CVV" maxLength="4" required className="checkout-input" style={{marginBottom: 0}} />
                    </div>
                  </div>
                )}
                <label className="payment-option">
                  <input type="radio" name="pago" value="yape" checked={metodoPago === 'yape'} onChange={() => setMetodoPago('yape')} />
                  <span>Pago virtual con Yape / Plin</span>
                </label>
                {metodoPago === 'yape' && (
                  <div className="qr-container">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR de Pago" className="qr-img" />
                    <p className="qr-text">1. Abre Yape o Plin.<br/>2. Escanea el código QR y paga <b>S/ {(total + 15).toFixed(2)}</b>.<br/>3. Haz clic en "Procesar Pago".</p>
                  </div>
                )}
              </div>
            </div>
            <button type="submit" className="pay-btn">{metodoPago === 'tarjeta' ? 'Pagar de forma Segura' : 'Procesar Pago'}</button>
            <p className="secure-text"><ShieldCheck size={14}/> Datos protegidos por encriptación de 256-bits.</p>
          </form>
        </div>

        <div className="checkout-summary-section">
          <h3>Resumen de tu pedido</h3>
          <div className="checkout-items">
            {carrito.map((item, i) => (
              <div key={i} className="checkout-item">
                <div className="checkout-item-img" style={{borderRadius: '10px', overflow: 'hidden'}}><img src={item.imagen} alt={item.nombre} /></div>
                <div className="checkout-item-info">
                  <h4>{item.nombre}</h4>
                  <p>Talla: {item.talla} | Color: {item.color}</p>
                </div>
                <div className="checkout-item-price">S/ {item.precio}</div>
              </div>
            ))}
          </div>
          <div className="summary-totals">
            <div className="summary-row"><span>Subtotal:</span> <span>S/ {total.toFixed(2)}</span></div>
            <div className="summary-row"><span>Envío estimado:</span> <span>S/ 15.00</span></div>
            <div className="summary-row total"><span>Total a pagar:</span> <span>S/ {(total + 15).toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}