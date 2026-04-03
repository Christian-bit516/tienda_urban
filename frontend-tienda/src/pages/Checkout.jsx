import { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, CheckCircle, Loader2, ShoppingBag, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// =====================================================================
// ICONOS SVG PREMIUM (NUNCA SE ROMPEN NI PIERDEN CALIDAD)
// =====================================================================
const VisaIcon = () => (
  <svg width="38" height="24" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="20" rx="4" fill="#1434CB"/>
    <path d="M14.545 14.284L15.938 5.714H18.156L16.762 14.284H14.545ZM22.846 5.928C22.428 5.785 21.670 5.571 20.760 5.571C18.490 5.571 16.896 6.749 16.882 8.621C16.867 9.992 18.156 10.764 19.123 11.221C20.119 11.692 20.451 11.992 20.451 12.435C20.437 13.107 19.603 13.407 18.840 13.407C17.703 13.407 17.068 13.107 16.433 12.821L16.026 14.678C16.661 14.964 17.717 15.221 18.826 15.221C21.242 15.221 22.803 14.064 22.832 12.092C22.846 10.135 20.005 10.021 20.034 8.864C20.048 8.321 20.531 7.735 21.640 7.592C22.180 7.521 23.003 7.564 23.638 7.892L22.846 5.928ZM29.627 14.284H31.545L29.349 5.714H27.595C27.054 5.714 26.643 5.999 26.430 6.471L22.404 14.284H24.704L25.159 12.941H27.954L28.224 14.284H29.627ZM25.798 11.192L26.919 8.021L27.533 11.192H25.798ZM13.354 5.714L9.673 14.284H7.502L5.031 7.649C4.846 7.078 4.704 6.835 4.235 6.578C3.255 6.064 1.548 5.678 0 5.464L0.085 5.035H4.888C5.499 5.035 6.053 5.435 6.209 6.092L7.431 12.064L11.135 5.714H13.354Z" fill="white"/>
  </svg>
);

const MastercardIcon = () => (
  <svg width="38" height="24" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="20" rx="4" fill="#F4F4F5" stroke="#D4D4D8"/>
    <circle cx="11.5" cy="10" r="6" fill="#EB001B"/>
    <circle cx="20.5" cy="10" r="6" fill="#F79E1B"/>
    <path d="M16 14.472C14.819 13.398 14 11.785 14 10C14 8.214 14.819 6.601 16 5.527C17.180 6.601 18 8.214 18 10C18 11.785 17.180 13.398 16 14.472Z" fill="#FF5F00"/>
  </svg>
);

export default function Checkout({ carrito = [], total = 0, irAlInicio, setCarrito }) {
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [compraExitosa, setCompraExitosa] = useState(false);
  const [procesando, setProcesando] = useState(false);
  
  // Datos del cliente
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');

  // Datos Tarjeta Simulada
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const premiumEase = [0.16, 1, 0.3, 1];
  const staggerContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const fadeUpVariant = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: premiumEase } } };

  useEffect(() => {
    if (window.lenis) window.lenis.scrollTo('top', { immediate: true });
    else window.scrollTo(0, 0);
  }, []);

  const envio = total > 200 ? 0 : 15;
  const totalFinal = total + envio;

  // Lógica para formatear tarjeta
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); 
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    setCardNumber(value);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) value = value.substring(0, 2) + '/' + value.substring(2, 4);
    setExpiry(value);
  };

  // Lógica de Compra Simulada
  const handleFinalizarCompra = (e) => {
    e.preventDefault(); 
    setProcesando(true); 

    // Simulamos un retraso de procesamiento bancario (1.5 segundos)
    setTimeout(() => {
      axios.post('http://localhost/tienda_urban/backend/api/finalizar_compra.php', { 
        carrito, 
        total: totalFinal.toFixed(2),
        cliente: { nombre, email },
        metodo: metodoPago 
      })
      .then(res => {
        if (res.data.status === "ok") {
          setProcesando(false);
          setCompraExitosa(true);
          setCarrito([]);
        } else {
          alert("Error al procesar la orden.");
          setProcesando(false);
        }
      })
      .catch(err => {
        console.error(err);
        // Si no hay backend encendido, forzamos el éxito para probar el diseño
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
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
            <CheckCircle size={80} color="var(--success)" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>¡Pago Exitoso!</motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>Tu orden <strong style={{color: 'var(--accent)'}}>#URB-{Math.floor(Math.random() * 10000)}</strong> está confirmada.</motion.p>
          <motion.button type="button" onClick={() => { setCompraExitosa(false); irAlInicio(); }} className="btn-solid" style={{width: 'auto', padding: '18px 40px', marginTop: '30px'}} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            Volver a la Tienda
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const carritoAgrupado = carrito.reduce((acc, item) => {
    const key = `${item.id}-${item.talla}-${item.color}`;
    if (!acc[key]) acc[key] = { ...item, cantidadFisica: 1 };
    else acc[key].cantidadFisica += 1;
    return acc;
  }, {});
  
  const itemsUnicos = Object.values(carritoAgrupado);

  return (
    <motion.div className="checkout-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <div className="checkout-container">
        
        {/* ================= FORMULARIO IZQUIERDO ================= */}
        <motion.div className="checkout-form-section" variants={staggerContainer} initial="hidden" animate="show">
          <button type="button" className="back-btn" onClick={irAlInicio} style={{marginBottom: '35px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', textTransform: 'uppercase'}}>
            <ArrowLeft size={16} /> Volver al Carrito
          </button>

          <form onSubmit={handleFinalizarCompra}>
            <motion.div className="form-section" variants={fadeUpVariant}>
              <div className="section-header"><span className="step-number">1</span><h3>Datos de Envío</h3></div>
              <div className="input-group-2">
                <input type="text" placeholder="Nombre completo" required className="checkout-input" value={nombre} onChange={e => setNombre(e.target.value)} />
                <input type="email" placeholder="Correo electrónico" required className="checkout-input" value={email} onChange={e => setEmail(e.target.value)}/>
              </div>
              <input type="text" placeholder="Dirección completa (Calle, distrito)" required className="checkout-input" />
            </motion.div>
              
            <motion.div className="form-section" variants={fadeUpVariant} style={{marginBottom: '20px', border: 'none', background: 'transparent', padding: 0, boxShadow: 'none'}}>
              <div className="section-header"><span className="step-number">2</span><h3>Método de Pago</h3></div>
              <div className="payment-methods">
                  
                {/* === OPCIÓN: TARJETA SIMULADA === */}
                <div className={`payment-wrapper ${metodoPago === 'tarjeta' ? 'active-wrapper' : ''}`}>
                  <label className="payment-option">
                    <input type="radio" name="pago" value="tarjeta" className="hidden-radio" checked={metodoPago === 'tarjeta'} onChange={() => setMetodoPago('tarjeta')} />
                    <div className="custom-radio"></div>
                    <span style={{fontWeight: 800}}>Tarjeta de Crédito / Débito</span>
                    <span className="card-icons-mini" style={{marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center'}}>
                      <VisaIcon />
                      <MastercardIcon />
                    </span>
                  </label>
                  
                  <AnimatePresence>
                    {metodoPago === 'tarjeta' && (
                      <motion.div className="payment-details-dropdown" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{overflow: 'hidden'}}>
                        <div className="card-form-grid" style={{background: 'var(--bg-main)'}}>
                          <div className="card-input-wrapper full-width">
                            <input type="text" placeholder="Número de Tarjeta" maxLength="19" required className="checkout-input" value={cardNumber} onChange={handleCardNumberChange} style={{marginBottom: 0, background: 'var(--bg-surface)'}} />
                          </div>
                          <div className="card-input-wrapper full-width">
                            <input type="text" placeholder="Nombre en la Tarjeta" required className="checkout-input" style={{marginBottom: 0, background: 'var(--bg-surface)'}} />
                          </div>
                          <div className="card-input-wrapper">
                            <input type="text" placeholder="MM/YY" maxLength="5" required className="checkout-input" value={expiry} onChange={handleExpiryChange} style={{marginBottom: 0, background: 'var(--bg-surface)'}} />
                          </div>
                          <div className="card-input-wrapper">
                            <input type="text" placeholder="CVV" maxLength="4" required className="checkout-input" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))} style={{marginBottom: 0, background: 'var(--bg-surface)'}} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* === OPCIÓN: YAPE === */}
                <div className={`payment-wrapper ${metodoPago === 'yape' ? 'active-wrapper' : ''}`}>
                  <label className="payment-option">
                    <input type="radio" name="pago" value="yape" className="hidden-radio" checked={metodoPago === 'yape'} onChange={() => setMetodoPago('yape')} />
                    <div className="custom-radio"></div>
                    <span style={{fontWeight: 800}}>Billetera Digital (Yape/Plin)</span>
                  </label>
                  <AnimatePresence>
                    {metodoPago === 'yape' && (
                      <motion.div className="payment-details-dropdown" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{overflow: 'hidden'}}>
                        <div className="yape-box">
                          <div className="yape-content">
                            <div className="yape-qr-bg"><img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR" className="qr-img" /></div>
                            <div className="yape-instructions">
                              <p>1. Abre tu App Yape o Plin.</p>
                              <p>2. Paga el monto exacto: <b>S/ {totalFinal.toFixed(2)}</b></p>
                              <p>3. Haz clic en "Confirmar Pago".</p>
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
                <><Loader2 className="spinner" size={24} style={{display:'inline-block', verticalAlign:'middle', marginRight:'10px'}} /> Procesando Pago Seguro...</>
              ) : (
                `Pagar S/ ${totalFinal.toFixed(2)}`
              )}
            </motion.button>

            <motion.div style={{textAlign: 'center', marginTop: '15px', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px'}} variants={fadeUpVariant}>
              <Lock size={14}/> Entorno de prueba activo. Ningún cobro real será procesado.
            </motion.div>
          </form>
        </motion.div>

        {/* ================= RESUMEN DERECHO ================= */}
        <motion.div className="checkout-summary-section" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: premiumEase }}>
          <div className="summary-header-box">
            <h3>Resumen del Pedido</h3>
            <ShoppingBag size={20} color="var(--text-primary)"/>
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
            <div className="summary-row"><span>Subtotal</span> <span style={{fontWeight: 700}}>S/ {total.toFixed(2)}</span></div>
            <div className="summary-row">
              <span>Envío</span> 
              <span>{envio === 0 ? <span style={{color:'var(--success)', fontWeight:'bold'}}>¡GRATIS!</span> : <span style={{fontWeight: 700}}>S/ {envio.toFixed(2)}</span>}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total a pagar</span> 
              <span className="total-price-final">S/ {totalFinal.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}