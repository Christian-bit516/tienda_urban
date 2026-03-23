import { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft, Minus, Plus, ShieldCheck, Truck, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductDetail({ 
  productoSeleccionado, irAlInicio, setFiltroCategoria, 
  agregarAlCarrito, productosRelacionados, verDetalleProducto 
}) {
  const [tallaSeleccionada, setTallaSeleccionada] = useState('M');
  const [colorSeleccionado, setColorSeleccionado] = useState('Negro');
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);
  const [mostrarGuiaTallas, setMostrarGuiaTallas] = useState(false);
  const [acordeonActivo, setAcordeonActivo] = useState('detalles'); 

  useEffect(() => {
    if (window.lenis) window.lenis.scrollTo('top', { immediate: true });
    else window.scrollTo(0, 0);
  }, [productoSeleccionado]); 

  const coloresDisponibles = [
    { nombre: 'Negro', hex: '#1a1a1a' }, { nombre: 'Blanco', hex: '#f8f9fa' }, { nombre: 'Gris', hex: '#adb5bd' }
  ];

  // ANIMACIONES LENTAS Y ELEGANTES (ESTILO AWWWARDS)
  const premiumEase = [0.22, 1, 0.36, 1];
  const staggerContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const itemVariant = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: premiumEase } } };

  return (
    <div className="product-page">
      <div className="breadcrumb">
        <span onClick={irAlInicio}>Inicio</span> <ChevronRight size={14} /> 
        <span onClick={() => { setFiltroCategoria(productoSeleccionado.categoria); irAlInicio(); }}>{productoSeleccionado.categoria}</span> <ChevronRight size={14} /> 
        <span className="current">{productoSeleccionado.nombre}</span>
      </div>

      <button className="back-btn" onClick={irAlInicio}><ArrowLeft size={18} /> Volver al catálogo</button>

      <div className="product-detail-container">
        
        <motion.div className="product-detail-left" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: premiumEase }}>
          <div className="product-detail-image-wrapper">
            <img src={productoSeleccionado.imagen} alt={productoSeleccionado.nombre} className="product-detail-img" />
          </div>
        </motion.div>
        
        <motion.div className="product-detail-right" variants={staggerContainer} initial="hidden" animate="show">
          <motion.div className="detail-header" variants={itemVariant}>
            <span className="category-label" style={{fontSize: '0.9rem', marginBottom: '10px', display: 'block'}}>{productoSeleccionado.categoria}</span>
            <h1 className="detail-title">{productoSeleccionado.nombre}</h1>
            <p className="detail-price">S/ {productoSeleccionado.precio}</p>
          </motion.div>
          
          <motion.div className="detail-description" variants={itemVariant}>
            <p>Diseño exclusivo para el entorno urbano. Materiales de alta resistencia y transpirabilidad superior. Confeccionado pensando en cada detalle para destacar tu estilo y brindarte máxima comodidad durante todo el día.</p>
          </motion.div>

          <motion.div variants={itemVariant} className="premium-selector-container">
            <div className="premium-selector-box">
              <h4>Color: <span className="val">{colorSeleccionado}</span></h4>
              <div className="color-options">
                {coloresDisponibles.map(color => (
                  <button key={color.nombre} className={`color-btn ${colorSeleccionado === color.nombre ? 'active' : ''}`} style={{ backgroundColor: color.hex }} onClick={() => setColorSeleccionado(color.nombre)} title={color.nombre} />
                ))}
              </div>
            </div>

            <div className="premium-selector-box">
              <h4>Talla: <span className="val">{tallaSeleccionada}</span> <span className="size-guide-link" onClick={() => setMostrarGuiaTallas(true)}>Guía de tallas</span></h4>
              <div className="sizes">
                {['S', 'M', 'L', 'XL', 'XXL'].map(talla => (
                  <button key={talla} className={`size-btn ${tallaSeleccionada === talla ? 'active' : ''}`} onClick={() => setTallaSeleccionada(talla)}>{talla}</button>
                ))}
              </div>
            </div>

            <div className="premium-selector-box quantity-box">
              <h4>Cantidad:</h4>
              <div className="quantity-controls">
                <button onClick={() => setCantidadSeleccionada(Math.max(1, cantidadSeleccionada - 1))}><Minus size={16}/></button>
                <span>{cantidadSeleccionada}</span>
                <button onClick={() => setCantidadSeleccionada(cantidadSeleccionada + 1)}><Plus size={16}/></button>
              </div>
            </div>
          </motion.div>

          <motion.div className="action-buttons-container" variants={itemVariant}>
            <div className="dual-buttons">
              <button className="btn-outline" onClick={() => agregarAlCarrito(productoSeleccionado, cantidadSeleccionada, tallaSeleccionada, colorSeleccionado, false)}>AÑADIR A LA CESTA</button>
              <button className="btn-solid" onClick={() => agregarAlCarrito(productoSeleccionado, cantidadSeleccionada, tallaSeleccionada, colorSeleccionado, true)}>COMPRAR AHORA</button>
            </div>
            
            <div className="trust-badges">
              <div className="badge-item"><ShieldCheck size={20} color="#28a745"/> <span>Pagos 100% Seguros. Encriptación SSL.</span></div>
              <div className="badge-item"><Truck size={20} color="#000"/> <span>Envío garantizado a todo el Perú en 24/48h.</span></div>
            </div>
          </motion.div>

          <motion.div className="premium-accordion" variants={itemVariant}>
            <div className="accordion-item">
              <button className="accordion-header" onClick={() => setAcordeonActivo(acordeonActivo === 'detalles' ? '' : 'detalles')}>
                Características del producto
                <motion.div animate={{ rotate: acordeonActivo === 'detalles' ? 180 : 0 }} transition={{duration: 0.4, ease: premiumEase}}><ChevronDown size={20}/></motion.div>
              </button>
              <AnimatePresence>
                {acordeonActivo === 'detalles' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{duration: 0.4, ease: premiumEase}} className="accordion-content">
                    <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                      <li style={{marginBottom: '8px'}}>Composición: 100% Algodón de alto gramaje.</li>
                      <li style={{marginBottom: '8px'}}>Corte Oversize / Relaxed Fit.</li>
                      <li style={{marginBottom: '8px'}}>Estampado de alta durabilidad anti-cuarteo.</li>
                      <li style={{marginBottom: '8px'}}>Diseñado y fabricado en Perú.</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="accordion-item">
              <button className="accordion-header" onClick={() => setAcordeonActivo(acordeonActivo === 'envios' ? '' : 'envios')}>
                Envíos y Devoluciones
                <motion.div animate={{ rotate: acordeonActivo === 'envios' ? 180 : 0 }} transition={{duration: 0.4, ease: premiumEase}}><ChevronDown size={20}/></motion.div>
              </button>
              <AnimatePresence>
                {acordeonActivo === 'envios' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{duration: 0.4, ease: premiumEase}} className="accordion-content">
                    <p style={{ marginTop: '10px', marginBottom: '10px' }}><strong>Envío Standard:</strong> S/ 15.00 (Llega en 2 a 3 días hábiles).</p>
                    <p style={{ marginBottom: '10px' }}><strong>Envío Express Lima:</strong> S/ 25.00 (Llega el mismo día si compras antes de la 1 PM).</p>
                    <p>Devoluciones gratuitas dentro de los primeros 7 días luego de recibir el producto (aplican T&C).</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </motion.div>
      </div>

      {productosRelacionados.length > 0 && (
        <div className="related-products">
          <div className="related-header">
            <h2>También te podría gustar</h2>
            <p>Completa tu estilo con estas recomendaciones exclusivas.</p>
          </div>
          <div className="products-grid">
            {productosRelacionados.map((prod, i) => (
              <motion.div key={prod.id} className="product-card" onClick={() => verDetalleProducto(prod)} 
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.1, ease: premiumEase }}
              >
                <div className="image-wrapper" style={{overflow: 'hidden'}}>
                  <motion.img src={prod.imagen || 'https://via.placeholder.com/400x500?text=Sin+Imagen'} alt={prod.nombre} className="product-img" whileHover={{ scale: 1.05 }} transition={{ duration: 0.6, ease: premiumEase }} />
                  <div className="quick-view">Ver Detalles</div>
                </div>
                <div className="product-info">
                  <span className="category-label">{prod.categoria}</span>
                  <h3 className="product-title">{prod.nombre}</h3>
                  <span className="price">S/ {prod.precio}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {mostrarGuiaTallas && (
          <motion.div className="modal-overlay" onClick={() => setMostrarGuiaTallas(false)} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{ duration: 0.4 }}>
            <motion.div className="modal-content" onClick={(e) => e.stopPropagation()} initial={{scale:0.95, opacity: 0, y: 20}} animate={{scale:1, opacity: 1, y: 0}} exit={{scale:0.95, opacity: 0, y: 20}} transition={{ duration: 0.6, ease: premiumEase}}>
              <X className="close-modal" onClick={() => setMostrarGuiaTallas(false)} size={24} />
              <h3 style={{fontWeight: 900, fontSize: '1.5rem', marginBottom: '10px'}}>GUÍA DE TALLAS</h3>
              <p style={{color: '#666', fontSize: '0.9rem'}}>Encuentra la medida perfecta para ti.</p>
              <img src="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=800&auto=format&fit=crop" alt="Guía de tallas" className="modal-img" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}