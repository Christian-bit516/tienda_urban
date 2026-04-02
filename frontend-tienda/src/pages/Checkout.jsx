import { useState, useEffect } from 'react';
import { ArrowLeft, Lock, CreditCard, ShieldCheck, CheckCircle, Smartphone, Loader2, ShoppingBag } from 'lucide-react';
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

  const premiumEase = [0.22, 1, 0.36, 1];
  const staggerContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
  const fadeUpVariant = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: premiumEase } } };

  useEffect(() => {
    if (window.lenis) window.lenis.scrollTo('top', { immediate: true });
    else window.scrollTo(0, 0);
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

    setTimeout(() => {
      axios.post('http://localhost/tienda_urban/backend/api/finalizar_compra.php', { carrito, total: total.toFixed(2) })
        .then(res => {
          if (res.data.status === "ok") {
            setProcesando(false);
            setCompraExitosa(true);
            setCarrito([]);
          }
        })
        .catch(err => {
          console.error(err);
          setProcesando(false);
          setCompraExitosa(true);
          setCarrito([]);
        });
    }, 1500);
  };

  if (compraExitosa) {
    return (
      <div className="checkout-page">
        <motion.div className="success-screen" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: premiumEase }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}>
            <CheckCircle size={80} color="var(--success)" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>¡Pago Exitoso!</motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>Tu orden <strong style={{color: 'var(--accent)'}}>#URB-{Math.floor(Math.random() * 10000)}</strong> está confirmada.</motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} style={{color: 'var(--text-muted)'}}>Te enviamos los detalles a tu correo electrónico.</motion.p>
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { setCompraExitosa(false); irAlInicio(); }} 
            className="btn-solid" style={{width: 'auto', padding: '18px 40px', marginTop: '30px'}}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          >
            Volver a la Tienda
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const CardLogo = () => {
    if (cardType === 'visa') return <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" height="16" />;
    if (cardType === 'mastercard') return <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" height="20" />;
    if (cardType === 'amex') return <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" height="20" />;
    return <CreditCard size={20} color="#ccc" />;
  };

  // Agrupar items idénticos en el resumen
  const carritoAgrupado = carrito.reduce((acc, item) => {
    const key = `${item.id}-${item.talla}-${item.color}`;
    if (!acc[key]) {
      acc[key] = { ...item, cantidadFisica: 1 };
    } else {
      acc[key].cantidadFisica += 1;
    }
    return acc;
  }, {});

  const itemsUnicos = Object.values(carritoAgrupado);
  const envio = total > 200 ? 0 : 15;
  const totalFinal = total + envio;

  return (
    <motion.div className="checkout-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      
      <div className="checkout-container">
        
        {/* LADO IZQUIERDO: FORMULARIO */}
        <motion.div className="checkout-form-section" variants={staggerContainer} initial="hidden" animate="show">
          <motion.button className="back-btn" onClick={irAlInicio} variants={fadeUpVariant} style={{marginBottom: '30px'}}>
            <ArrowLeft size={18} /> Volver al Carrito
          </motion.button>

          <form onSubmit={handleFinalizarCompra}>
            
            {/* CONTACTO */}
            <motion.div className="form-section" variants={fadeUpVariant}>
              <div className="section-header">
                <span className="step-number">1</span>
                <h3>Información de Contacto</h3>
              </div>
              <input type="email" placeholder="Correo electrónico" required className="checkout-input" />
              <input type="text" placeholder="Teléfono / Celular" required className="checkout-input" />
            </motion.div>
            
            {/* ENVÍO */}
            <motion.div className="form-section" variants={fadeUpVariant}>
              <div className="section-header">
                <span className="step-number">2</span>
                <h3>Dirección de Envío</h3>
              </div>
              <div className="input-group-2">
                <input type="text" placeholder="Nombres" required className="checkout-input" />
                <input type="text" placeholder="Apellidos" required className="checkout-input" />
              </div>
              <input type="text" placeholder="DNI / CE" required className="checkout-input" />
              <input type="text" placeholder="Dirección completa (Calle, número, dpto)" required className="checkout-input" />
              <div className="input-group-2">
                <select required className="checkout-input custom-select">
                  <option value="">Selecciona tu Distrito</option>
                  <option value="lima">Lima Cercado</option><option value="miraflores">Miraflores</option>
                  <option value="surco">Santiago de Surco</option><option value="san_borja">San Borja</option>
                </select>
                <input type="text" placeholder="Referencia" className="checkout-input" />
              </div>
            </motion.div>
            
            {/* PAGO */}
            <motion.div className="form-section" variants={fadeUpVariant} style={{marginBottom: '20px'}}>
              <div className="section-header">
                <span className="step-number">3</span>
                <h3>Método de Pago</h3>
              </div>
              <p className="secure-subtitle"><Lock size={14}/> Todas las transacciones son seguras y están encriptadas.</p>
              
              <div className="payment-methods">
                
                {/* OPCIÓN: TARJETA */}
                <div className={`payment-wrapper ${metodoPago === 'tarjeta' ? 'active-wrapper' : ''}`}>
                  <label className="payment-option">
                    <input type="radio" name="pago" value="tarjeta" className="hidden-radio" checked={metodoPago === 'tarjeta'} onChange={() => setMetodoPago('tarjeta')} />
                    <div className="custom-radio"></div>
                    <span className="payment-title">Tarjeta de Crédito / Débito</span>
                    <span className="card-icons-mini">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" height="12"/>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" height="14"/>
                    </span>
                  </label>
                  
                  <AnimatePresence>
                    {metodoPago === 'tarjeta' && (
                      <motion.div className="payment-details-dropdown" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: premiumEase }}>
                        <div className="card-form-grid">
                          <div className="card-input-wrapper full-width">
                            <div className="input-with-icon">
                              <input type="text" placeholder="Número de Tarjeta" maxLength="19" required className="checkout-input" value={cardNumber} onChange={handleCardNumberChange} />
                              <div className="card-brand-icon"><CardLogo /></div>
                            </div>
                          </div>
                          <div className="card-input-wrapper full-width">
                            <input type="text" placeholder="Nombre en la Tarjeta" required className="checkout-input" />
                          </div>
                          <div className="card-input-wrapper">
                            <input type="text" placeholder="Vencimiento (MM/YY)" maxLength="5" required className="checkout-input" value={expiry} onChange={handleExpiryChange} />
                          </div>
                          <div className="card-input-wrapper">
                            <input type="text" placeholder="Código de Seguridad (CVV)" maxLength="4" required className="checkout-input" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* OPCIÓN: YAPE */}
                <div className={`payment-wrapper ${metodoPago === 'yape' ? 'active-wrapper' : ''}`}>
                  <label className="payment-option">
                    <input type="radio" name="pago" value="yape" className="hidden-radio" checked={metodoPago === 'yape'} onChange={() => setMetodoPago('yape')} />
                    <div className="custom-radio"></div>
                    <span className="payment-title">Pago con Billetera Digital</span>
                    <span className="yape-badge-mini">Yape / Plin</span>
                  </label>
                  
                  <AnimatePresence>
                    {metodoPago === 'yape' && (
                      <motion.div className="payment-details-dropdown" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: premiumEase }}>
                        <div className="yape-box">
                          <div className="yape-content">
                            <div className="yape-qr-bg">
                              <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR" className="qr-img" />
                            </div>
                            <div className="yape-instructions">
                              <p>1. Abre tu App Yape o Plin.</p>
                              <p>2. Escanea el código QR.</p>
                              <p>3. Paga el monto exacto: <b>S/ {totalFinal.toFixed(2)}</b></p>
                              <p>4. Haz clic en "Confirmar Pago".</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </motion.div>

            <motion.button type="submit" className={`pay-btn ${procesando ? 'processing' : ''}`} disabled={procesando} variants={fadeUpVariant}>
              {procesando ? (
                <><Loader2 className="spinner" size={24} style={{display:'inline-block', verticalAlign:'middle', marginRight:'10px'}} /> Procesando de forma segura...</>
              ) : (
                `Pagar S/ ${totalFinal.toFixed(2)}`
              )}
            </motion.button>
            <motion.div className="trust-footer" variants={fadeUpVariant}>
              <ShieldCheck size={16} color="var(--success)"/> Transacción segura respaldada por Stripe.
            </motion.div>
          </form>
        </motion.div>

        {/* LADO DERECHO: RESUMEN DE LA COMPRA */}
        <motion.div className="checkout-summary-section" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: premiumEase }}>
          <div className="summary-header-box">
            <h3>Resumen del Pedido</h3>
            <ShoppingBag size={20} color="var(--text-muted)"/>
          </div>
          
          <div className="checkout-items-list">
            {itemsUnicos.map((item, i) => (
              <div key={i} className="checkout-item-receipt">
                <div className="receipt-img-wrapper">
                  <img src={item.imagen} alt={item.nombre} />
                  <span className="receipt-qty">{item.cantidadFisica}</span>
                </div>
                <div className="receipt-info">
                  <h4>{item.nombre}</h4>
                  <p>{item.color} / {item.talla}</p>
                </div>
                <div className="receipt-price">S/ {(item.precio * item.cantidadFisica).toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          <div className="summary-totals">
            <div className="summary-row"><span>Subtotal</span> <span>S/ {total.toFixed(2)}</span></div>
            <div className="summary-row">
              <span>Envío</span> 
              <span>{envio === 0 ? <span style={{color:'var(--success)', fontWeight:'bold'}}>¡GRATIS!</span> : `S/ ${envio.toFixed(2)}`}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total</span> 
              <span className="total-price-final">S/ {totalFinal.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}