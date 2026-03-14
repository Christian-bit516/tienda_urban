import { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';

// Importamos nuestros nuevos componentes separados
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';

import './App.css';
import './index.css';

function App() {
  // ESTADOS PRINCIPALES
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [vista, setVista] = useState('inicio'); 
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [notificacion, setNotificacion] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [verCarrito, setVerCarrito] = useState(false);
  
  // ESTADOS DE FILTROS
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [filtroGenero, setFiltroGenero] = useState('Todos');
  const [filtroPrecio, setFiltroPrecio] = useState(1000);
  const [filtroTalla, setFiltroTalla] = useState('Todas');

  useEffect(() => {
    axios.get('http://localhost/tienda_urban/backend/api/get_productos.php')
      .then(res => setProductos(res.data))
      .catch(err => console.error("Error al cargar:", err));
  }, []);

  // LÓGICA DE DATOS
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

  const agregarAlCarrito = (producto, cantidad, talla, color, irAPagoDirecto = false) => {
    const nuevosItems = Array(cantidad).fill({ ...producto, talla, color });
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

  // NAVEGACIÓN
  const verDetalleProducto = (prod) => { setProductoSeleccionado(prod); setVista('detalle'); window.scrollTo({ top: 0 }); };
  const irAlInicio = () => { setVista('inicio'); setProductoSeleccionado(null); window.scrollTo({ top: 0 }); };
  const irAlCheckout = () => { setVerCarrito(false); setVista('checkout'); window.scrollTo({ top: 0 }); };

  return (
    <div className="app-container">
      {notificacion && <div className="toast"><CheckCircle size={18} /> {notificacion}</div>}

      <Navbar 
        vista={vista} irAlInicio={irAlInicio} 
        busqueda={busqueda} setBusqueda={setBusqueda} 
        setVerCarrito={setVerCarrito} carrito={carrito} 
      />

      {vista === 'inicio' && (
        <Home 
          productosFiltrados={productosFiltrados} verDetalleProducto={verDetalleProducto}
          filtroCategoria={filtroCategoria} setFiltroCategoria={setFiltroCategoria}
          filtroGenero={filtroGenero} setFiltroGenero={setFiltroGenero}
          filtroPrecio={filtroPrecio} setFiltroPrecio={setFiltroPrecio}
          filtroTalla={filtroTalla} setFiltroTalla={setFiltroTalla}
        />
      )}

      {vista === 'detalle' && productoSeleccionado && (
        <ProductDetail 
          productoSeleccionado={productoSeleccionado} irAlInicio={irAlInicio}
          setFiltroCategoria={setFiltroCategoria} agregarAlCarrito={agregarAlCarrito}
          productosRelacionados={productosRelacionados} verDetalleProducto={verDetalleProducto}
        />
      )}

      {vista === 'checkout' && (
        <Checkout carrito={carrito} total={total} irAlInicio={irAlInicio} setCarrito={setCarrito} />
      )}

      {verCarrito && vista !== 'checkout' && (
        <CartSidebar 
          carrito={carrito} setVerCarrito={setVerCarrito} 
          eliminarDelCarrito={eliminarDelCarrito} total={total} irAlCheckout={irAlCheckout} 
        />
      )}

      {vista !== 'checkout' && <Footer />}
    </div>
  );
}

export default App;