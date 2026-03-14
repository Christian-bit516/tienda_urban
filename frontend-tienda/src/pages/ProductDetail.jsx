import { useState } from 'react';
import { ChevronRight, ArrowLeft, Minus, Plus, ShieldCheck, Truck, X } from 'lucide-react';

export default function ProductDetail({ 
  productoSeleccionado, irAlInicio, setFiltroCategoria, 
  agregarAlCarrito, productosRelacionados, verDetalleProducto 
}) {
  const [tallaSeleccionada, setTallaSeleccionada] = useState('M');
  const [colorSeleccionado, setColorSeleccionado] = useState('Negro');
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);
  const [mostrarGuiaTallas, setMostrarGuiaTallas] = useState(false);

  const coloresDisponibles = [
    { nombre: 'Negro', hex: '#1a1a1a' },
    { nombre: 'Blanco', hex: '#f8f9fa' },
    { nombre: 'Gris', hex: '#adb5bd' }
  ];

  return (
    <div className="product-page">
      <div className="breadcrumb">
        <span onClick={irAlInicio}>Inicio</span> <ChevronRight size={14} /> 
        <span onClick={() => { setFiltroCategoria(productoSeleccionado.categoria); irAlInicio(); }}>{productoSeleccionado.categoria}</span> <ChevronRight size={14} /> 
        <span className="current">{productoSeleccionado.nombre}</span>
      </div>

      <button className="back-btn" onClick={irAlInicio}><ArrowLeft size={18} /> Volver al catálogo</button>

      <div className="product-detail-container">
        <div className="product-detail-image-wrapper">
          <img src={productoSeleccionado.imagen} alt={productoSeleccionado.nombre} className="product-detail-img" />
        </div>
        
        <div className="product-detail-info">
          <div className="detail-header">
            <h1 className="detail-title">{productoSeleccionado.nombre}</h1>
            <p className="detail-price">S/ {productoSeleccionado.precio}</p>
          </div>
          
          <div className="detail-description">
            <p>Diseño exclusivo para el entorno urbano. Materiales de alta resistencia y transpirabilidad superior. Hecho para destacar y brindar máxima comodidad durante todo el día.</p>
          </div>

          <div className="options-selector">
            <h4>Color seleccionado: <span>{colorSeleccionado}</span></h4>
            <div className="color-options">
              {coloresDisponibles.map(color => (
                <button key={color.nombre} className={`color-btn ${colorSeleccionado === color.nombre ? 'active' : ''}`} style={{ backgroundColor: color.hex }} onClick={() => setColorSeleccionado(color.nombre)} title={color.nombre} />
              ))}
            </div>
          </div>

          <div className="options-selector">
            <div className="size-header">
              <h4>Selecciona tu talla:</h4>
              <span className="size-guide" onClick={() => setMostrarGuiaTallas(true)}>Guía de tallas</span>
            </div>
            <div className="sizes">
              {['S', 'M', 'L', 'XL', 'XXL'].map(talla => (
                <button key={talla} className={`size-btn ${tallaSeleccionada === talla ? 'active' : ''}`} onClick={() => setTallaSeleccionada(talla)}>{talla}</button>
              ))}
            </div>
          </div>

          <div className="action-buttons-container">
            <div className="quantity-wrapper">
              <span className="qty-label">Cantidad</span>
              <div className="quantity-controls">
                <button onClick={() => setCantidadSeleccionada(Math.max(1, cantidadSeleccionada - 1))}><Minus size={16}/></button>
                <span>{cantidadSeleccionada}</span>
                <button onClick={() => setCantidadSeleccionada(cantidadSeleccionada + 1)}><Plus size={16}/></button>
              </div>
            </div>

            <div className="dual-buttons">
              <button className="btn-outline" onClick={() => agregarAlCarrito(productoSeleccionado, cantidadSeleccionada, tallaSeleccionada, colorSeleccionado, false)}>AÑADIR A LA CESTA</button>
              <button className="btn-solid" onClick={() => agregarAlCarrito(productoSeleccionado, cantidadSeleccionada, tallaSeleccionada, colorSeleccionado, true)}>COMPRAR AHORA</button>
            </div>
            
            <div className="trust-badges">
              <div className="badge-item"><ShieldCheck size={20}/> <span>Pagos 100% Seguros. Tus datos están protegidos con nosotros.</span></div>
              <div className="badge-item"><Truck size={20}/> <span>Envío garantizado a todo el Perú.</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Sugerencias */}
      {productosRelacionados.length > 0 && (
        <div className="related-products">
          <div className="related-header">
            <h2>También te podría gustar</h2>
            <p>Completa tu estilo con estas recomendaciones exclusivas.</p>
          </div>
          <div className="products-grid">
            {productosRelacionados.map(prod => (
              <div key={prod.id} className="product-card" onClick={() => verDetalleProducto(prod)}>
                <div className="image-wrapper">
                  <img src={prod.imagen} alt={prod.nombre} className="product-img" />
                  <div className="quick-view">Ver Detalles</div>
                </div>
                <div className="product-info">
                  <span className="category-label">{prod.categoria}</span>
                  <h3 className="product-title">{prod.nombre}</h3>
                  <span className="price">S/ {prod.precio}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Guía Tallas */}
      {mostrarGuiaTallas && (
        <div className="modal-overlay" onClick={() => setMostrarGuiaTallas(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <X className="close-modal" onClick={() => setMostrarGuiaTallas(false)} size={24} />
            <h3 style={{fontWeight: 900, fontSize: '1.5rem', marginBottom: '10px'}}>GUÍA DE TALLAS</h3>
            <p style={{color: '#666', fontSize: '0.9rem'}}>Encuentra la medida perfecta para ti.</p>
            <img src="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=800&auto=format&fit=crop" alt="Guía de tallas" className="modal-img" />
          </div>
        </div>
      )}
    </div>
  );
}