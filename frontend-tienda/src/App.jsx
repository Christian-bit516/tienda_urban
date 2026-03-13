import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  ShoppingCart, Search, X, Trash2, CheckCircle, 
  Facebook, Instagram, Twitter, MapPin, Phone, Mail, 
  Truck, ShieldCheck, CreditCard, ArrowLeft, ChevronRight, Lock,
  Minus, Plus, SlidersHorizontal
} from 'lucide-react';
import './App.css';
import './index.css';

function App() {
  // --- ESTADOS DE DATOS ---
  const [productos, setProductos] = useState([]);
  
  // --- ESTADOS DE FILTROS ---
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [filtroGenero, setFiltroGenero] = useState('Todos');
  const [filtroPrecio, setFiltroPrecio] = useState(1000);
  const [filtroTalla, setFiltroTalla] = useState('Todas');

  const [busqueda, setBusqueda] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [verCarrito, setVerCarrito] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false); 
  
  // --- ESTADOS DE NAVEGACIÓN Y UX ---
  const [vista, setVista] = useState('inicio'); 
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [notificacion, setNotificacion] = useState(null);
  const [compraExitosa, setCompraExitosa] = useState(false);
  
  // --- ESTADOS DE SELECCIÓN DE PRODUCTO ---
  const [tallaSeleccionada, setTallaSeleccionada] = useState('M');
  const [colorSeleccionado, setColorSeleccionado] = useState('Negro');
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1); 

  // --- ESTADO PARA SLIDER INICIO ---
  const [slideIndex, setSlideIndex] = useState(0);
  const slides = [
    { title: "NUEVA TEMPORADA", img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2000&auto=format&fit=crop" },
    { title: "STREETWEAR 2026", img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2000&auto=format&fit=crop" },
    { title: "COLECCIÓN OTOÑO", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2000&auto=format&fit=crop" }
  ];

  const coloresDisponibles = [
    { nombre: 'Negro', hex: '#1a1a1a' },
    { nombre: 'Blanco', hex: '#f8f9fa' },
    { nombre: 'Gris', hex: '#adb5bd' }
  ];

  // --- EFECTOS ---
  useEffect(() => {
    axios.get('http://localhost/tienda_urban/backend/api/get_productos.php')
      .then(res => setProductos(res.data))
      .catch(err => console.error("Error al cargar:", err));
  }, []);

  useEffect(() => {
    if(vista === 'inicio') {
      const interval = setInterval(() => {
        setSlideIndex((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [vista, slides.length]);

  // --- LÓGICA DE FILTRADO (IGNORANDO MAYÚSCULAS/MINÚSCULAS) ---
  const productosFiltrados = productos.filter(p => {
    const catDB = p.categoria ? p.categoria.toLowerCase() : '';
    const genDB = p.genero ? p.genero.toLowerCase() : '';
    
    const coincideCategoria = filtroCategoria === 'Todos' || catDB === filtroCategoria.toLowerCase();
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideGenero = filtroGenero === 'Todos' || genDB === filtroGenero.toLowerCase();
    const coincidePrecio = parseFloat(p.precio || 0) <= filtroPrecio;
    const coincideTalla = filtroTalla === 'Todas' || (p.tallas && p.tallas.includes(filtroTalla));
    
    return coincideCategoria && coincideBusqueda && coincideGenero && coincidePrecio && coincideTalla;
  });

  const productosRelacionados = productoSeleccionado 
    ? productos.filter(p => p.categoria === productoSeleccionado.categoria && p.id !== productoSeleccionado.id).slice(0, 4)
    : [];

  // --- GESTIÓN DEL CARRITO ---
  const agregarAlCarrito = (p, irAPagoDirecto = false) => {
    const nuevosItems = Array(cantidadSeleccionada).fill({ ...p, talla: tallaSeleccionada, color: colorSeleccionado });
    setCarrito([...carrito, ...nuevosItems]);
    
    if (irAPagoDirecto) {
      setVista('checkout');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setNotificacion(`¡Agregado a tu bolsa!`);
      setTimeout(() => setNotificacion(null), 3000);
      setVerCarrito(true);
    }
  };

  const eliminarDelCarrito = (index) => setCarrito(carrito.filter((_, i) => i !== index));
  const total = carrito.reduce((sum, p) => sum + parseFloat(p.precio), 0);

  // --- NAVEGACIÓN ---
  const verDetalleProducto = (prod) => {
    setProductoSeleccionado(prod);
    setTallaSeleccionada('M'); 
    setColorSeleccionado('Negro');
    setCantidadSeleccionada(1);
    setVista('detalle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const irAlInicio = () => {
    setVista('inicio');
    setProductoSeleccionado(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const irAlCheckout = () => {
    setVerCarrito(false);
    setVista('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  return (
    <div className="app-container">
      {notificacion && <div className="toast"><CheckCircle size={18} /> {notificacion}</div>}

      <nav className="navbar">
        <div className="logo" onClick={irAlInicio}>
          URBAN<span>STORE</span>
        </div>

        {vista === 'inicio' && (
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input 
              type="text" className="search-input"
              placeholder="Buscar colección..." 
              value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        )}

        <div className="nav-actions">
          <div className="cart-trigger" onClick={() => setVerCarrito(true)}>
            <ShoppingCart size={26} />
            {carrito.length > 0 && <span className="cart-count">{carrito.length}</span>}
          </div>
        </div>
      </nav>

      {/* =========================================
          VISTA 1: INICIO (CATÁLOGO)
          ========================================= */}
      {vista === 'inicio' && (
        <>
          <header className="slider-container">
            {slides.map((slide, index) => (
              <div key={index} className={`slide ${index === slideIndex ? 'active' : ''}`} style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${slide.img})` }}>
                <div className="hero-content">
                  <h1>{slide.title}</h1>
                  <button className="hero-btn" onClick={() => document.getElementById('catalogo').scrollIntoView({behavior: 'smooth'})}>
                    Ver Catálogo
                  </button>
                </div>
              </div>
            ))}
          </header>

          <section className="brands-section">
            <h3 className="section-subtitle">NUESTRAS MARCAS</h3>
            <div className="brands-logos">
              <span className="brand-txt">adidas</span>
              <span className="brand-txt">NIKE</span>
              <span className="brand-txt">PUMA</span>
              <span className="brand-txt">new balance</span>
              <span className="brand-txt">asics</span>
              <span className="brand-txt">SPRAYGROUND</span>
            </div>
          </section>

          <section className="visual-categories">
            <div className="v-cat-box" style={{backgroundImage: "url('https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop')"}} 
                 onClick={() => { setFiltroGenero('Hombre'); setFiltroCategoria('Todos'); document.getElementById('catalogo').scrollIntoView({behavior: 'smooth'}); }}>
              <span className="v-cat-label">HOMBRE</span>
            </div>
            
            <div className="v-cat-box" style={{backgroundImage: "url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop')"}} 
                 onClick={() => { setFiltroGenero('Mujer'); setFiltroCategoria('Todos'); document.getElementById('catalogo').scrollIntoView({behavior: 'smooth'}); }}>
              <span className="v-cat-label">MUJER</span>
            </div>
            
            <div className="v-cat-box" style={{backgroundImage: "url('https://images.unsplash.com/photo-1547949007-5350b9866894?q=80&w=800&auto=format&fit=crop')"}} 
                 onClick={() => { setFiltroCategoria('Accesorios'); setFiltroGenero('Todos'); document.getElementById('catalogo').scrollIntoView({behavior: 'smooth'}); }}>
              <span className="v-cat-label">ACCESORIOS</span>
            </div>
            
            <div className="v-cat-box" style={{backgroundImage: "url('https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=800&auto=format&fit=crop')"}} 
                 onClick={() => { setFiltroCategoria('Limpieza'); setFiltroGenero('Todos'); document.getElementById('catalogo').scrollIntoView({behavior: 'smooth'}); }}>
              <span className="v-cat-label">LIMPIEZA</span>
            </div>
          </section>

          <div className="filter-bar-header" id="catalogo">
            <h2>Nuevos Lanzamientos</h2>
            <button className="open-filter-btn" onClick={() => setMostrarFiltros(true)}>
              <SlidersHorizontal size={18} /> Filtrar y Ordenar
            </button>
          </div>

          {productosFiltrados.length === 0 && (
            <div style={{textAlign: 'center', padding: '50px', color: '#888', fontSize: '1.2rem', fontWeight: 'bold'}}>
              No se encontraron productos con estos filtros.
            </div>
          )}

          <main className="products-grid">
            {productosFiltrados.map(prod => (
              <div key={prod.id} className="product-card" onClick={() => verDetalleProducto(prod)}>
                <div className="image-wrapper">
                  <img src={prod.imagen} alt={prod.nombre} className="product-img" />
                  <div className="quick-view">Ver Detalles</div>
                </div>
                <div className="product-info">
                  <span className="category-label">{prod.categoria}</span>
                  <h3 className="product-title">{prod.nombre}</h3>
                  <div className="price-row"><span className="price">S/ {prod.precio}</span></div>
                </div>
              </div>
            ))}
          </main>
        </>
      )}

      {/* =========================================
          MENÚ LATERAL DE FILTROS
          ========================================= */}
      {mostrarFiltros && (
        <>
          <div className="overlay" onClick={() => setMostrarFiltros(false)}></div>
          <div className="filter-sidebar">
            <div className="filter-header">
              <h3>Filtrar y Ordenar</h3>
              <X className="close-cart" onClick={() => setMostrarFiltros(false)} />
            </div>
            
            <div className="filter-content">
              <div className="filter-group-side">
                <h4>Género</h4>
                {['Todos', 'Hombre', 'Mujer'].map(g => (
                  <label key={g} className="filter-radio">
                    <input type="radio" name="genero" checked={filtroGenero === g} onChange={() => setFiltroGenero(g)} /> {g}
                  </label>
                ))}
              </div>

              <div className="filter-group-side">
                <h4>Categoría</h4>
                {['Todos', 'Poleras', 'Pantalones', 'Zapatillas', 'Accesorios', 'Limpieza'].map(c => (
                  <label key={c} className="filter-radio">
                    <input type="radio" name="categoria" checked={filtroCategoria === c} onChange={() => setFiltroCategoria(c)} /> {c}
                  </label>
                ))}
              </div>

              <div className="filter-group-side">
                <h4>Talla</h4>
                <div className="tallas-grid-side">
                  {['Todas', 'S', 'M', 'L', 'XL', 'XXL'].map(t => (
                    <button key={t} className={`side-talla-btn ${filtroTalla === t ? 'active' : ''}`} onClick={() => setFiltroTalla(t)}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="filter-group-side">
                <h4>Precio Máximo: S/ {filtroPrecio}</h4>
                <input type="range" min="0" max="1000" step="10" value={filtroPrecio} onChange={(e) => setFiltroPrecio(e.target.value)} className="price-slider-side" />
              </div>
            </div>
            
            <div className="filter-footer">
              <button className="reset-filter-btn" onClick={() => {setFiltroCategoria('Todos'); setFiltroGenero('Todos'); setFiltroPrecio(1000); setFiltroTalla('Todas');}}>Borrar todo</button>
              <button className="apply-filter-btn" onClick={() => setMostrarFiltros(false)}>Ver {productosFiltrados.length} artículos</button>
            </div>
          </div>
        </>
      )}

      {/* =========================================
          VISTA 2: DETALLE DEL PRODUCTO MEJORADO
          ========================================= */}
      {vista === 'detalle' && productoSeleccionado && (
        <div className="product-page">
          <div className="breadcrumb">
            <span onClick={irAlInicio}>Inicio</span> <ChevronRight size={14} /> 
            <span onClick={() => { setFiltroCategoria(productoSeleccionado.categoria); irAlInicio(); }}>{productoSeleccionado.categoria}</span> <ChevronRight size={14} /> 
            <span className="current">{productoSeleccionado.nombre}</span>
          </div>

          <button className="back-btn" onClick={irAlInicio}><ArrowLeft size={18} /> Volver al catálogo</button>

          <div className="product-detail-container">
            {/* SECCIÓN IMAGEN */}
            <div className="product-detail-image-wrapper">
              <img src={productoSeleccionado.imagen} alt={productoSeleccionado.nombre} className="product-detail-img" />
            </div>
            
            {/* SECCIÓN INFORMACIÓN */}
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
                  <span className="size-guide">Guía de tallas</span>
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
                  <button className="btn-outline" onClick={() => agregarAlCarrito(productoSeleccionado, false)}>AÑADIR A LA CESTA</button>
                  <button className="btn-solid" onClick={() => agregarAlCarrito(productoSeleccionado, true)}>COMPRAR AHORA</button>
                </div>
                
                <div className="trust-badges">
                  <div className="badge-item"><ShieldCheck size={20}/> <span>Pagos 100% Seguros. Tus datos están protegidos con nosotros.</span></div>
                  <div className="badge-item"><Truck size={20}/> <span>Envío garantizado a todo el Perú.</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================
              SUGERENCIAS DE PRODUCTOS (HERMOSAS)
              ========================================= */}
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
        </div>
      )}

      {/* =========================================
          VISTA 3: CHECKOUT (PASARELA DE PAGO)
          ========================================= */}
      {vista === 'checkout' && (
        <div className="checkout-page">
          {!compraExitosa ? (
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
                        <option value="">Selecciona tu Distrito (Lima)</option>
                        <option value="miraflores">Miraflores</option>
                        <option value="san_isidro">San Isidro</option>
                        <option value="surco">Surco</option>
                        <option value="lima">Lima Cercado</option>
                        <option value="otros">Otros (Provincias)</option>
                      </select>
                      <input type="text" placeholder="Referencia" className="checkout-input" />
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>3. Método de Pago</h3>
                    <div className="payment-methods">
                      <label className="payment-option">
                        <input type="radio" name="pago" value="tarjeta" defaultChecked />
                        <span>Tarjeta de Crédito / Débito <CreditCard size={18}/></span>
                      </label>
                      <label className="payment-option">
                        <input type="radio" name="pago" value="yape" />
                        <span>Yape / Plin</span>
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="pay-btn">Pagar S/ {(total + 15).toFixed(2)}</button>
                  <p className="secure-text"><ShieldCheck size={14}/> Tus datos están protegidos por encriptación de 256-bits.</p>
                </form>
              </div>

              <div className="checkout-summary-section">
                <h3>Resumen de tu pedido</h3>
                <div className="checkout-items">
                  {carrito.map((item, i) => (
                    <div key={i} className="checkout-item">
                      <div className="checkout-item-img"><img src={item.imagen} alt={item.nombre} /></div>
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
          ) : (
            <div className="success-screen">
              <CheckCircle size={80} color="#28a745" />
              <h2>¡Pago Procesado con Éxito!</h2>
              <p>Tu número de orden es: <strong>#URB-{Math.floor(Math.random() * 10000)}</strong></p>
              <p>Te hemos enviado un correo de confirmación con los detalles del envío.</p>
              <button onClick={() => { setCompraExitosa(false); irAlInicio(); }} className="success-btn">
                Volver a la Pantalla Principal
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================
          CARRITO LATERAL
          ========================================= */}
      {verCarrito && vista !== 'checkout' && (
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
      )}

      {/* FOOTER GENERAL */}
      {vista !== 'checkout' && (
        <footer className="footer dark-footer">
          <div className="footer-content">
            <div className="footer-brand">
              <h2 className="logo" style={{color:'white'}}>URBAN<span style={{color:'#888'}}>STORE</span></h2>
              <p>Streetwear Premium. Elevando la moda urbana.</p>
            </div>
            <div className="footer-contact">
              <h3 style={{marginBottom: '15px'}}>Contáctanos</h3>
              <p><MapPin size={16} /> Lima, Perú</p>
              <div className="social-links" style={{marginTop: '15px', display: 'flex', gap:'15px'}}>
                <div className="social-icon"><Facebook size={20}/></div> 
                <div className="social-icon"><Instagram size={20}/></div> 
                <div className="social-icon"><Twitter size={20}/></div>
              </div>
            </div>
          </div>
          <div className="footer-bottom"><p>&copy; 2026 URBAN STORE. Todos los derechos reservados.</p></div>
        </footer>
      )}

    </div>
  );
}

export default App;