import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  ShoppingCart, Search, X, Trash2, CheckCircle, 
  Facebook, Instagram, Twitter, MapPin, Phone, Mail, 
  Truck, ShieldCheck, CreditCard, Star, ArrowLeft, ChevronRight, Lock
} from 'lucide-react';
import './App.css';
import './index.css';

function App() {
  // --- ESTADOS DE DATOS ---
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [verCarrito, setVerCarrito] = useState(false);
  
  // --- ESTADOS DE NAVEGACIÓN Y UX ---
  const [vista, setVista] = useState('inicio'); // 'inicio', 'detalle', 'checkout'
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [notificacion, setNotificacion] = useState(null);
  const [compraExitosa, setCompraExitosa] = useState(false);
  
  // --- ESTADOS DE SELECCIÓN DE PRODUCTO ---
  const [tallaSeleccionada, setTallaSeleccionada] = useState('M');
  const [colorSeleccionado, setColorSeleccionado] = useState('Negro');

  // Colores simulados para el dinamismo
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

  // --- LÓGICA DE FILTRADO ---
  const productosFiltrados = productos.filter(p => {
    const coincideFiltro = filtro === 'Todos' || p.categoria === filtro;
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideFiltro && coincideBusqueda;
  });

  const productosRelacionados = productoSeleccionado 
    ? productos.filter(p => p.categoria === productoSeleccionado.categoria && p.id !== productoSeleccionado.id).slice(0, 4)
    : [];

  // --- GESTIÓN DEL CARRITO ---
  const agregarAlCarrito = (p, mostrarCarrito = true) => {
    setCarrito([...carrito, { ...p, talla: tallaSeleccionada, color: colorSeleccionado }]);
    setNotificacion(`¡${p.nombre} agregado a tu bolsa!`);
    setTimeout(() => setNotificacion(null), 3000);
    if (mostrarCarrito) setVerCarrito(true);
  };

  const eliminarDelCarrito = (index) => setCarrito(carrito.filter((_, i) => i !== index));
  const total = carrito.reduce((sum, p) => sum + parseFloat(p.precio), 0);

  // --- NAVEGACIÓN ---
  const verDetalleProducto = (prod) => {
    setProductoSeleccionado(prod);
    setTallaSeleccionada('M'); // Resetear selección por defecto
    setColorSeleccionado('Negro');
    setVista('detalle');
    window.scrollTo(0, 0);
  };

  const irAlInicio = () => {
    setVista('inicio');
    setProductoSeleccionado(null);
    window.scrollTo(0, 0);
  };

  const irAlCheckout = () => {
    setVerCarrito(false);
    setVista('checkout');
    window.scrollTo(0, 0);
  };

  // --- PROCESAR PAGO (CHECKOUT) ---
  const handleFinalizarCompra = (e) => {
    e.preventDefault(); // Evita recargar la página
    
    // Aquí podrías capturar los datos del formulario, por ahora enviamos el carrito al backend
    axios.post('http://localhost/tienda_urban/backend/api/finalizar_compra.php', { carrito, total: total.toFixed(2) })
      .then(res => {
        if (res.data.status === "ok") {
          setCompraExitosa(true);
          setCarrito([]);
          setTimeout(() => { 
            setCompraExitosa(false); 
            irAlInicio(); // Volver al inicio tras comprar
          }, 4000);
        }
      });
  };

  return (
    <div className="app-container">
      
      {/* TOAST DE NOTIFICACIÓN */}
      {notificacion && (
        <div className="toast"><CheckCircle size={18} /> {notificacion}</div>
      )}

      {/* NAVBAR GENERAL */}
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
          <header className="hero-banner">
            <div className="hero-content">
              <span className="hero-tag">NUEVA TEMPORADA</span>
              <h1>DOMINA LAS CALLES</h1>
              <p>Minimalismo y actitud. Descubre nuestra colección urbana.</p>
              <button className="hero-btn" onClick={() => document.getElementById('catalogo').scrollIntoView({behavior: 'smooth'})}>
                Ver Catálogo
              </button>
            </div>
          </header>

          <section className="filter-section">
            {['Todos', 'Poleras', 'Pantalones', 'Zapatillas', 'Accesorios'].map(cat => (
              <button key={cat} className={`filter-tab ${filtro === cat ? 'active' : ''}`} onClick={() => setFiltro(cat)}>{cat}</button>
            ))}
          </section>

          <main id="catalogo" className="products-grid">
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
          VISTA 2: DETALLE DEL PRODUCTO
          ========================================= */}
      {vista === 'detalle' && productoSeleccionado && (
        <div className="product-page">
          <div className="breadcrumb">
            <span onClick={irAlInicio}>Inicio</span> <ChevronRight size={14} /> 
            <span onClick={() => { setFiltro(productoSeleccionado.categoria); irAlInicio(); }}>{productoSeleccionado.categoria}</span> <ChevronRight size={14} /> 
            <span className="current">{productoSeleccionado.nombre}</span>
          </div>

          <button className="back-btn" onClick={irAlInicio}><ArrowLeft size={18} /> Volver</button>

          <div className="product-detail-container">
            <div className="product-detail-image">
              <img src={productoSeleccionado.imagen} alt={productoSeleccionado.nombre} />
            </div>
            
            <div className="product-detail-info">
              <h1 className="detail-title">{productoSeleccionado.nombre}</h1>
              <p className="detail-price">S/ {productoSeleccionado.precio}</p>
              <div className="detail-description">
                <p>Diseño exclusivo para el entorno urbano. Materiales de alta resistencia y transpirabilidad superior. Hecho para destacar.</p>
              </div>

              {/* SELECTOR DE COLOR */}
              <div className="options-selector">
                <h4>Color: <span style={{fontWeight: 'normal', color: '#666'}}>{colorSeleccionado}</span></h4>
                <div className="color-options">
                  {coloresDisponibles.map(color => (
                    <button 
                      key={color.nombre}
                      className={`color-btn ${colorSeleccionado === color.nombre ? 'active' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setColorSeleccionado(color.nombre)}
                      title={color.nombre}
                    />
                  ))}
                </div>
              </div>

              {/* SELECTOR DE TALLA */}
              <div className="options-selector">
                <h4>Talla:</h4>
                <div className="sizes">
                  {['S', 'M', 'L', 'XL'].map(talla => (
                    <button 
                      key={talla} 
                      className={`size-btn ${tallaSeleccionada === talla ? 'active' : ''}`}
                      onClick={() => setTallaSeleccionada(talla)}
                    >
                      {talla}
                    </button>
                  ))}
                </div>
              </div>

              <button className="add-to-cart-huge" onClick={() => agregarAlCarrito(productoSeleccionado)}>
                AGREGAR A LA BOLSA - S/ {productoSeleccionado.precio}
              </button>
              
              <div className="trust-badges">
                <div className="badge-item"><Truck size={20}/> <span>Envío a todo el Perú</span></div>
                <div className="badge-item"><ShieldCheck size={20}/> <span>Compra 100% Segura</span></div>
              </div>
            </div>
          </div>

          {/* SUGERENCIAS */}
          {productosRelacionados.length > 0 && (
            <div className="related-products">
              <h3>También te podría gustar</h3>
              <div className="products-grid related-grid">
                {productosRelacionados.map(prod => (
                  <div key={prod.id} className="product-card" onClick={() => verDetalleProducto(prod)}>
                    <div className="image-wrapper"><img src={prod.imagen} alt={prod.nombre} className="product-img" /></div>
                    <div className="product-info">
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

              {/* RESUMEN DE COMPRA EN CHECKOUT */}
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
              <CheckCircle size={80} color="#000" />
              <h2>¡Pago Procesado con Éxito!</h2>
              <p>Tu número de orden es: <strong>#URB-{Math.floor(Math.random() * 10000)}</strong></p>
              <p>Te hemos enviado un correo de confirmación con los detalles del envío.</p>
              <button onClick={irAlInicio} className="hero-btn" style={{background: '#000', color: '#fff', marginTop: '20px'}}>Volver a la Tienda</button>
            </div>
          )}
        </div>
      )}

      {/* --- CARRITO LATERAL (Solo visible si no estamos en checkout) --- */}
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
              <button className="checkout-btn" onClick={irAlCheckout}>Ir al Pago Seguro</button>
            </div>
          )}
        </div>
      )}

      {/* FOOTER GENERAL */}
      {vista !== 'checkout' && (
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-brand">
              <h2 className="logo">URBAN<span>STORE</span></h2>
              <p>Streetwear Premium. Elevando la moda urbana.</p>
            </div>
            <div className="footer-contact">
              <p><MapPin size={16} /> Lima, Perú</p>
              <div className="social-links" style={{marginTop: '15px', display: 'flex', gap:'15px'}}><Facebook /> <Instagram /> <Twitter /></div>
            </div>
          </div>
          <div className="footer-bottom"><p>&copy; 2026 URBAN STORE.</p></div>
        </footer>
      )}

    </div>
  );
}

export default App;