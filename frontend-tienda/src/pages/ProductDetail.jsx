import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Star, ShieldCheck, Truck, RotateCcw, Plus, Minus, ShoppingBag, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

export default function ProductDetail({ 
  productoSeleccionado, 
  irAlInicio, 
  setFiltroCategoria, 
  agregarAlCarrito, 
  productosRelacionados, 
  verDetalleProducto 
}) {
  const [tallaSeleccionada, setTallaSeleccionada] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [colorSeleccionado, setColorSeleccionado] = useState('Negro');
  const [acordeonActivo, setAcordeonActivo] = useState('detalles');
  
  // NUEVO: Estado para controlar qué imagen se muestra
  const [imagenActual, setImagenActual] = useState('');

  const coloresDisponibles = [
    { nombre: 'Negro', hex: '#1a1a1a' }, 
    { nombre: 'Blanco', hex: '#f8f9fa' }, 
    { nombre: 'Gris', hex: '#adb5bd' }
  ];

  // PROTECCIÓN: Si no llega el producto
  if (!productoSeleccionado) {
    return (
      <div className="empty-state-box" style={{ margin: '100px auto', maxWidth: '600px' }}>
        <AlertCircle size={60} color="var(--error)" style={{margin: '0 auto 20px'}}/>
        <h2 style={{fontSize: '2rem', fontWeight: 900, marginBottom: '10px'}}>Producto no encontrado</h2>
        <p style={{color: 'var(--text-muted)', marginBottom: '30px'}}>Hubo un error al cargar la información de este artículo.</p>
        <button type="button" className="btn-solid" onClick={() => irAlInicio && irAlInicio()}>
          Volver al catálogo
        </button>
      </div>
    );
  }

  const tallasArray = productoSeleccionado.tallas 
    ? String(productoSeleccionado.tallas).split(',').map(t => t.trim()).filter(t => t !== '') 
    : ['Única'];

  const precioSeguro = productoSeleccionado.precio && !isNaN(productoSeleccionado.precio) 
    ? parseFloat(productoSeleccionado.precio).toFixed(2) 
    : '0.00';

  // RESETEAR DATOS AL CAMBIAR DE PRODUCTO
  useEffect(() => {
    if (window.lenis) window.lenis.scrollTo('top', { immediate: true });
    else window.scrollTo(0, 0);
    
    if (tallasArray.length > 0) setTallaSeleccionada(tallasArray[0]);
    
    // Reseteamos el color y la imagen a la principal del producto
    setColorSeleccionado('Negro');
    setImagenActual(productoSeleccionado.imagen);
    setCantidad(1);
  }, [productoSeleccionado]);

  // ========================================================
  // LÓGICA DE CAMBIO DE IMAGEN POR COLOR
  // ========================================================
  const handleCambioColor = (color) => {
    setColorSeleccionado(color.nombre);

    // 1. Si tu base de datos ya tuviera un campo "imagenes_variaciones":
    // if (productoSeleccionado.variaciones && productoSeleccionado.variaciones[color.nombre]) {
    //   setImagenActual(productoSeleccionado.variaciones[color.nombre]);
    //   return;
    // }

    // 2. SIMULACIÓN PREMIUM (Borrar cuando conectes las fotos reales en tu BD)
    if (color.nombre === 'Negro') {
      setImagenActual(productoSeleccionado.imagen);
    } 
    else if (color.nombre === 'Blanco') {
      setImagenActual(productoSeleccionado.categoria === 'Zapatillas' 
        ? 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop' 
        : 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop');
    } 
    else if (color.nombre === 'Gris') {
      setImagenActual(productoSeleccionado.categoria === 'Zapatillas'
        ? 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=800&auto=format&fit=crop');
    }
  };

  const handleAgregar = (pagoDirecto = false) => {
    if (agregarAlCarrito) {
      // Pasamos el color y la imagen actual elegida para que salga en el carrito
      agregarAlCarrito({
        ...productoSeleccionado,
        imagen: imagenActual // Guarda la foto del color elegido
      }, cantidad, tallaSeleccionada || 'Única', colorSeleccionado, pagoDirecto);
    }
  };

  const staggerContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const fadeInUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };

  return (
    <motion.div className="product-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      
      <div className="breadcrumb">
        <span onClick={() => irAlInicio && irAlInicio()}>Inicio</span> / 
        <span onClick={() => { setFiltroCategoria(productoSeleccionado.categoria); irAlInicio(); }}>
          {productoSeleccionado.categoria || 'Catálogo'}
        </span> / 
        <span className="current">{productoSeleccionado.nombre}</span>
      </div>

      <button type="button" className="back-btn" onClick={() => irAlInicio && irAlInicio()}>
        <ChevronLeft size={20} /> Volver al catálogo
      </button>

      <div className="product-detail-container">
        
        {/* COLUMNA IZQUIERDA: IMAGEN CON ANIMACIÓN DE CROSSFADE */}
        <motion.div className="product-detail-left" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <div className="product-detail-image-wrapper" style={{ position: 'relative' }}>
            <AnimatePresence mode="wait">
              <motion.img 
                key={imagenActual} // Esto le dice a Framer Motion que anime cuando cambie el link
                src={imagenActual || 'https://via.placeholder.com/600x800?text=Sin+Imagen'} 
                alt={productoSeleccionado.nombre} 
                className="product-detail-img"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x800?text=Urban+Store'; }}
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{ position: 'absolute', top: '-10%', left: 0, width: '100%', height: '120%', objectFit: 'cover' }}
              />
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div className="product-detail-right" variants={staggerContainer} initial="hidden" animate="show">
          <motion.div className="detail-header" variants={fadeInUp}>
            <span className="category-label-premium">{productoSeleccionado.categoria} • {productoSeleccionado.genero}</span>
            <h1 className="detail-title">{productoSeleccionado.nombre}</h1>
            
            <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px'}}>
              <h2 className="detail-price">S/ {precioSeguro}</h2>
              <div style={{display: 'flex', color: '#fbbf24', alignItems: 'center', gap: '4px'}}>
                <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
                <span style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '5px'}}>(4.9/5)</span>
              </div>
            </div>
            
            <p className="detail-description">
              Diseño exclusivo de alta calidad. Confeccionado con materiales premium para garantizar el mejor ajuste, comodidad y durabilidad en tu día a día. Eleva tu estilo urbano con esta pieza indispensable.
            </p>
          </motion.div>

          {/* SELECTOR DE COLORES MEJORADO */}
          <motion.div className="premium-selector-box" variants={fadeInUp}>
            <h4>Color seleccionado: <span className="val">{colorSeleccionado}</span></h4>
            <div className="color-options">
              {coloresDisponibles.map(color => (
                <button 
                  key={color.nombre} 
                  type="button"
                  className={`color-btn ${colorSeleccionado === color.nombre ? 'active' : ''}`} 
                  style={{ backgroundColor: color.hex }} 
                  onClick={() => handleCambioColor(color)} 
                  title={color.nombre} 
                />
              ))}
            </div>
          </motion.div>

          <motion.div className="premium-selector-box" variants={fadeInUp}>
            <h4>Selecciona tu Talla <span className="val">{tallaSeleccionada}</span></h4>
            <div className="sizes">
              {tallasArray.map((t) => (
                <button type="button" key={t} className={`size-btn ${tallaSeleccionada === t ? 'active' : ''}`} onClick={() => setTallaSeleccionada(t)}>
                  {t}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div className="premium-selector-box quantity-box" variants={fadeInUp}>
            <h4>Cantidad</h4>
            <div className="quantity-controls">
              <button type="button" onClick={() => setCantidad(Math.max(1, cantidad - 1))}><Minus size={18}/></button>
              <span>{cantidad}</span>
              <button type="button" onClick={() => setCantidad(cantidad + 1)}><Plus size={18}/></button>
            </div>
          </motion.div>

          <motion.div className="action-buttons-container dual-buttons" variants={fadeInUp}>
            <button type="button" className="btn-outline" onClick={() => handleAgregar(false)}>
              <ShoppingBag size={20} style={{display: 'inline', marginRight: '10px', verticalAlign: 'middle'}}/>
              Añadir a la Cesta
            </button>
            <button type="button" className="btn-solid" onClick={() => handleAgregar(true)}>
              Comprar Ahora
            </button>
          </motion.div>

          <motion.div className="trust-badges" variants={fadeInUp}>
            <div className="badge-item"><Truck size={22} color="var(--accent)" /> Envío gratis en pedidos superiores a S/ 200.</div>
            <div className="badge-item"><ShieldCheck size={22} color="var(--success)" /> Garantía de calidad de 30 días.</div>
            <div className="badge-item"><RotateCcw size={22} color="var(--text-muted)" /> Cambios y devoluciones sin complicaciones.</div>
          </motion.div>

          <motion.div className="premium-accordion" variants={fadeInUp}>
            {[
              { id: 'detalles', title: 'Detalles del Producto', content: 'Corte relajado/oversize. Costuras reforzadas de alta densidad. Logo en alta resolución. Etiqueta interna tejida premium.' },
              { id: 'materiales', title: 'Composición y Cuidado', content: '100% Algodón pima peinado. Lavar a máquina con agua fría. No usar blanqueador. Secar a la sombra para mantener el color intacto.' },
              { id: 'envios', title: 'Envíos y Entregas', content: 'Lima Metropolitana: 1 a 2 días hábiles. Provincias: 3 a 5 días hábiles mediante Olva Courier o Shalom.' }
            ].map((item) => (
              <div className="accordion-item" key={item.id}>
                <button type="button" className="accordion-header" onClick={() => setAcordeonActivo(acordeonActivo === item.id ? '' : item.id)}>
                  {item.title}
                  {acordeonActivo === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                <AnimatePresence>
                  {acordeonActivo === item.id && (
                    <motion.div 
                      className="accordion-content" 
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} 
                      style={{ overflow: 'hidden' }}
                    >
                      <p>{item.content}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {productosRelacionados && productosRelacionados.length > 0 && (
        <div className="related-products">
          <div className="related-header">
            <h2>Completa tu look</h2>
            <p>Selecciones exclusivas basadas en tu estilo.</p>
          </div>
          <div className="products-grid">
            {productosRelacionados.map((prod, i) => (
              <motion.div key={prod.id} className="product-card" onClick={() => verDetalleProducto && verDetalleProducto(prod)} 
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="image-wrapper" style={{overflow: 'hidden'}}>
                  <motion.img src={prod.imagen || 'https://via.placeholder.com/400x500?text=Sin+Imagen'} alt={prod.nombre} className="product-img" whileHover={{ scale: 1.05 }} transition={{ duration: 0.6 }} />
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
    </motion.div>
  );
}