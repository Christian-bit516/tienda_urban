import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ArrowLeft, Minus, Plus, ShieldCheck, Truck, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

export default function ProductDetail({ 
  productoSeleccionado, irAlInicio, setFiltroCategoria, 
  agregarAlCarrito, productosRelacionados, verDetalleProducto 
}) {
  const [tallaSeleccionada, setTallaSeleccionada] = useState('M');
  const [colorSeleccionado, setColorSeleccionado] = useState('Negro');
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);
  const [mostrarGuiaTallas, setMostrarGuiaTallas] = useState(false);
  const [acordeonActivo, setAcordeonActivo] = useState('detalles'); 

  // Referencia al contenedor principal para el Parallax Cinematográfico
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start start", "end center"] 
  });
  
  // EFECTO ULTRA PREMIUM: La imagen se traslada suavemente y reduce ligeramente su escala para dar profundidad de campo.
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]); 
  const imgFilter = useTransform(scrollYProgress, [0, 1], ["brightness(1)", "brightness(0.85)"]);

  useEffect(() => {
    if (window.lenis) window.lenis.scrollTo('top', { immediate: true });
    else window.scrollTo(0, 0);
  }, [productoSeleccionado]); 

  const coloresDisponibles = [
    { nombre: 'Negro', hex: '#1a1a1a' }, { nombre: 'Blanco', hex: '#f8f9fa' }, { nombre: 'Gris', hex: '#adb5bd' }
  ];

  const premiumEase = [0.22, 1, 0.36, 1];

  // 1. Animación del contenedor (Cortina Reveal)
  const imageWrapperVariant = {
    hidden: { opacity: 0, clipPath: "inset(20% 0 20% 0 round 24px)" },
    show: { 
      opacity: 1, 
      clipPath: "inset(0% 0 0% 0 round 24px)", 
      transition: { duration: 1.4, ease: premiumEase } 
    }
  };

  // 2. Animación de Cascada fluida para el contenido derecho
  const staggerContainer = { 
    hidden: { opacity: 0 }, 
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } } 
  };
  const itemVariant = { 
    hidden: { opacity: 0, y: 50 }, 
    show: { opacity: 1, y: 0, transition: { duration: 1, ease: premiumEase } } 
  };

  return (
    <motion.div 
      className="product-page"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
    >
      <motion.div className="breadcrumb" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.8, ease: premiumEase }}>
        <span onClick={irAlInicio}>Inicio</span> <ChevronRight size={14} /> 
        <span onClick={() => { setFiltroCategoria(productoSeleccionado.categoria); irAlInicio(); }}>{productoSeleccionado.categoria}</span> <ChevronRight size={14} /> 
        <span className="current">{productoSeleccionado.nombre}</span>
      </motion.div>

      <motion.button className="back-btn" onClick={irAlInicio} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <ArrowLeft size={18} /> Volver al catálogo
      </motion.button>

      <div className="product-detail-container" ref={containerRef}>
        
        {/* COLUMNA IZQUIERDA: IMAGEN STICKY + PARALLAX */}
        <div className="product-detail-left">
          <motion.div 
            className="product-detail-image-wrapper" 
            variants={imageWrapperVariant}
            initial="hidden"
            animate="show"
          >
            {/* Vinculamos el estilo a los hooks de framer-motion */}
            <motion.img 
              src={productoSeleccionado.imagen} 
              alt={productoSeleccionado.nombre} 
              className="product-detail-img" 
              initial={{ scale: 1.3 }}
              animate={{ scale: 1.1 }}
              transition={{ duration: 1.6, ease: premiumEase }}
              style={{ y: imgY, scale: imgScale, filter: imgFilter, willChange: 'transform' }} 
            />
          </motion.div>
        </div>
        
        {/* COLUMNA DERECHA: TEXTOS Y OPCIONES */}
        <motion.div className="product-detail-right" variants={staggerContainer} initial="hidden" animate="show">
          <motion.div className="detail-header" variants={itemVariant}>
            <span className="category-label-premium">{productoSeleccionado.categoria}</span>
            <h1 className="detail-title">{productoSeleccionado.nombre}</h1>
            <p className="detail-price">S/ {productoSeleccionado.precio}</p>
          </motion.div>
          
          <motion.div className="detail-description" variants={itemVariant}>
            <p>Diseño exclusivo para el entorno urbano. Materiales de alta resistencia y transpirabilidad superior. Confeccionado pensando en cada detalle para destacar tu estilo y brindarte máxima comodidad durante todo el día. Eleva tu outfit con esta pieza fundamental.</p>
          </motion.div>

          <motion.div variants={itemVariant} className="premium-selector-container">
            <div className="premium-selector-box">
              <h4>Color seleccionado: <span className="val">{colorSeleccionado}</span></h4>
              <div className="color-options">
                {coloresDisponibles.map(color => (
                  <motion.button 
                    key={color.nombre} 
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    className={`color-btn ${colorSeleccionado === color.nombre ? 'active' : ''}`} 
                    style={{ backgroundColor: color.hex }} 
                    onClick={() => setColorSeleccionado(color.nombre)} 
                    title={color.nombre} 
                  />
                ))}
              </div>
            </div>

            <div className="premium-selector-box">
              <h4>Talla: <span className="val">{tallaSeleccionada}</span> <span className="size-guide-link" onClick={() => setMostrarGuiaTallas(true)}>Ver guía de tallas</span></h4>
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
                <motion.span key={cantidadSeleccionada} initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>{cantidadSeleccionada}</motion.span>
                <button onClick={() => setCantidadSeleccionada(cantidadSeleccionada + 1)}><Plus size={16}/></button>
              </div>
            </div>
          </motion.div>

          <motion.div className="action-buttons-container" variants={itemVariant}>
            <div className="dual-buttons">
              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="btn-outline" 
                onClick={() => agregarAlCarrito(productoSeleccionado, cantidadSeleccionada, tallaSeleccionada, colorSeleccionado, false)}
              >
                AÑADIR A LA CESTA
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: '#222' }} whileTap={{ scale: 0.98 }}
                className="btn-solid" 
                onClick={() => agregarAlCarrito(productoSeleccionado, cantidadSeleccionada, tallaSeleccionada, colorSeleccionado, true)}
              >
                COMPRAR AHORA
              </motion.button>
            </div>
            
            <div className="trust-badges">
              <div className="badge-item"><ShieldCheck size={20} color="#28a745"/> <span>Pagos 100% Seguros. Encriptación SSL.</span></div>
              <div className="badge-item"><Truck size={20} color="#000"/> <span>Envío garantizado a todo el Perú en 24/48h.</span></div>
            </div>
          </motion.div>

          <motion.div className="premium-accordion" variants={itemVariant}>
            <div className="accordion-item">
              <button className="accordion-header" onClick={() => setAcordeonActivo(acordeonActivo === 'detalles' ? '' : 'detalles')}>
                Características y Cuidado
                <motion.div animate={{ rotate: acordeonActivo === 'detalles' ? 180 : 0 }} transition={{duration: 0.4, ease: premiumEase}}><ChevronDown size={20}/></motion.div>
              </button>
              <AnimatePresence>
                {acordeonActivo === 'detalles' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{duration: 0.4, ease: premiumEase}} className="accordion-content" style={{ overflow: 'hidden' }}>
                    <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                      <li style={{marginBottom: '8px'}}>Composición: 100% Algodón orgánico de alto gramaje.</li>
                      <li style={{marginBottom: '8px'}}>Corte: Oversize / Relaxed Fit con caída estructurada.</li>
                      <li style={{marginBottom: '8px'}}>Detalles: Costuras reforzadas, no encoge al lavar.</li>
                      <li style={{marginBottom: '8px'}}>Cuidado: Lavar en frío, secar a la sombra.</li>
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
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{duration: 0.4, ease: premiumEase}} className="accordion-content" style={{ overflow: 'hidden' }}>
                    <p style={{ marginTop: '10px', marginBottom: '10px' }}><strong>Envío Standard:</strong> S/ 15.00 (Llega en 2 a 3 días hábiles).</p>
                    <p style={{ marginBottom: '10px' }}><strong>Envío Express Lima:</strong> S/ 25.00 (Llega el mismo día si compras antes de la 1 PM).</p>
                    <p>Devoluciones gratuitas dentro de los primeros 7 días luego de recibir el producto (aplican T&C). Solicita el cambio fácilmente desde tu cuenta.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* PRODUCTOS RELACIONADOS */}
      {productosRelacionados.length > 0 && (
        <div className="related-products">
          <div className="related-header">
            <h2>Completa tu look</h2>
            <p>Selecciones exclusivas basadas en tu estilo.</p>
          </div>
          <div className="products-grid">
            {productosRelacionados.map((prod, i) => (
              <motion.div key={prod.id} className="product-card" onClick={() => verDetalleProducto(prod)} 
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, delay: i * 0.1, ease: premiumEase }}
              >
                <div className="image-wrapper" style={{overflow: 'hidden'}}>
                  <motion.img src={prod.imagen || 'https://via.placeholder.com/400x500?text=Sin+Imagen'} alt={prod.nombre} className="product-img" whileHover={{ scale: 1.08 }} transition={{ duration: 0.8, ease: premiumEase }} />
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

      {/* MODAL GUIA DE TALLAS */}
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
    </motion.div>
  );
}