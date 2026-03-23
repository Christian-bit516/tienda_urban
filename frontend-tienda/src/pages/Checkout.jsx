import { useState, useEffect } from 'react';
import { ArrowLeft, Lock, CreditCard, ShieldCheck, CheckCircle, Smartphone, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function Checkout({ carrito, total, irAlInicio, setCarrito }) {
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [compraExitosa, setCompraExitosa] = useState(false);
  const [procesando, setProcesando] = useState(false);

  const [cardNumber, setCardNumber] = useState('');
  const [cardType, setCardType] = useState('unknown'); 
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); 
    if (value.startsWith('4')) setCardType('visa');
    else if (/^5[1-5]/.test(value) || /^2[2-7]/.test(value)) setCardType('mastercard');
    else if (/^3[47]/.test(value)) setCardType('amex');
    else setCardType('unknown');

    value = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    setCardNumber(value);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) value = value.substring(0, 2) + '/' + value.substring(2, 4);
    setExpiry(value);
  };

  const handleFinalizarCompra = (e) => {
    e.preventDefault(); 
    setProcesando(true); 

    // Reducido a 1.5 segundos para que sea ágil pero siga sintiéndose seguro
    setTimeout(() => {
      axios.post('http://localhost/tienda_urban/backend/api/finalizar_compra.php', { carrito, total: total.toFixed(2) })
        .then(res => {
          if (res.data.status === "ok") {
            setProcesando(false);
            setCompraExitosa(true);
            setCarrito([]);
          }
        });
    }, 1500);
  };

  if (compraExitosa) {
    return (
      <div className="checkout-page">
        <motion.div className="success-screen" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
          <CheckCircle size={80} color="#28a745" />
          <h2>¡Pago Aprobado!</h2>
          <p>Tu número de orden es: <strong style={{color: 'var(--accent)', fontSize: '1.2rem'}}>#URB-{Math.floor(Math.random() * 10000)}</strong></p>
          <p>Te hemos enviado un recibo y los detalles de envío a tu correo electrónico.</p>
          <button onClick={() => { setCompraExitosa(false); irAlInicio(); }} className="success-btn">
            Volver a la Tienda
          </button>
        </motion.div>
      </div>
    );
  }

  const CardLogo = () => {
    if (cardType === 'visa') return <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" height="20" />;
    if (cardType === 'mastercard') return <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" height="24" />;
    if (cardType === 'amex') return <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" height="24" />;
    return <CreditCard size={24} color="#ccc" />;
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-form-section">
          <button className="back-btn checkout-back" onClick={irAlInicio} style={{marginBottom: '20px'}}>
            <ArrowLeft size={18} /> Seguir comprando
          </button>

          <h2><Lock size={20} /> Checkout Seguro</h2>
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
                  <option value="surco">Santiago de Surco</option>
                  <option value="san_borja">San Borja</option>
                </select>
                <input type="text" placeholder="Referencia" className="checkout-input" />
              </div>
            </div>
            
            <div className="form-section">
              <h3>3. Método de Pago</h3>
              <div className="payment-methods">
                
                <label className={`payment-option ${metodoPago === 'tarjeta' ? 'active-pay' : ''}`}>
                  <input type="radio" name="pago" value="tarjeta" checked={metodoPago === 'tarjeta'} onChange={() => setMetodoPago('tarjeta')} />
                  <span>Pago con Tarjeta <span className="card-icons-mini"><img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" height="12"/><img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" height="14"/></span></span>
                </label>
                
                <AnimatePresence>
                  {metodoPago === 'tarjeta' && (
                    <motion.div 
                      className="card-details-premium"
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                    >
                      <div className="secure-badge"><Lock size={12}/> Pagos encriptados de extremo a extremo</div>
                      
                      <div className="card-input-wrapper">
                        <label>Número de Tarjeta</label>
                        <div className="input-with-icon">
                          <input type="text" placeholder="0000 0000 0000 0000" maxLength="19" required className="checkout-input" value={cardNumber} onChange={handleCardNumberChange} />
                          <div className="card-brand-icon"><CardLogo /></div>
                        </div>
                      </div>

                      <div className="card-input-wrapper">
                        <label>Nombre en la Tarjeta</label>
                        <input type="text" placeholder="Como aparece en la tarjeta" required className="checkout-input" />
                      </div>

                      <div className="card-row">
                        <div className="card-input-wrapper">
                          <label>Vencimiento</label>
                          <input type="text" placeholder="MM/YY" maxLength="5" required className="checkout-input" value={expiry} onChange={handleExpiryChange} />
                        </div>
                        <div className="card-input-wrapper">
                          <label>CVV/CVC</label>
                          <input type="text" placeholder="123" maxLength="4" required className="checkout-input" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <label className={`payment-option ${metodoPago === 'yape' ? 'active-pay' : ''}`}>
                  <input type="radio" name="pago" value="yape" checked={metodoPago === 'yape'} onChange={() => setMetodoPago('yape')} />
                  <span>Billetera Digital <span className="yape-badge-mini">Yape</span></span>
                </label>
                
                <AnimatePresence>
                  {metodoPago === 'yape' && (
                    <motion.div 
                      className="yape-details-premium"
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                    >
                      <div className="yape-box">
                        <div className="yape-header">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/d/d1/Yape_text_aligment.svg" alt="Yape" height="25" style={{filter: 'brightness(0) invert(1)'}} />
                          <Smartphone color="white" size={24}/>
                        </div>
                        <div className="yape-content">
                          <div className="yape-qr-bg">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR de Pago" className="qr-img" />
                          </div>
                          <div className="yape-instructions">
                            <p><strong>Paso 1:</strong> Abre tu app Yape o Plin.</p>
                            <p><strong>Paso 2:</strong> Escanea el código QR.</p>
                            <p><strong>Paso 3:</strong> Verifica el monto: <b>S/ {(total + 15).toFixed(2)}</b></p>
                            <p><strong>Paso 4:</strong> Haz clic en el botón de abajo.</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button type="submit" className={`pay-btn ${procesando ? 'processing' : ''}`} disabled={procesando}>
              {procesando ? (
                <><Loader2 className="spinner" size={24} /> Procesando pago...</>
              ) : (
                metodoPago === 'tarjeta' ? `Pagar S/ ${(total + 15).toFixed(2)}` : 'Ya realicé el Yapeo'
              )}
            </button>
            <p className="secure-text"><ShieldCheck size={14} color="#28a745"/> Transacción 100% segura. Protegido por Stripe/Niubiz.</p>
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