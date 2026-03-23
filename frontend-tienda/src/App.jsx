import { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle } from 'lucide-react';
import Lenis from '@studio-freight/lenis';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';

import './App.css';
import './index.css';

function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [vista, setVista] = useState('inicio'); 
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [notificacion, setNotificacion] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [verCarrito, setVerCarrito] = useState(false);
  
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [filtroGenero, setFiltroGenero] = useState('Todos');
  const [filtroPrecio, setFiltroPrecio] = useState(1000);
  const [filtroTalla, setFiltroTalla] = useState('Todas');

  // EL SECRETO DEL VIDEO: SCROLL PESADO Y BUTTERY SMOOTH
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5, // Scroll largo y relajante
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Curva suave
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
    });

    window.lenis = lenis; 

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  useEffect(() => {
    axios.get('http://localhost/tienda_urban/backend/api/get_productos.php')
      .then(res => setProductos(res.data))
      .catch(err => console.error("Error al cargar:", err));
  }, []);

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
      irAlCheckout();
    } else {
      setNotificacion(`¡Agregado a tu bolsa!`);
      setTimeout(() => setNotificacion(null), 3000);
      setVerCarrito(true);
    }
  };

  const eliminarDelCarrito = (index) => setCarrito(carrito.filter((_, i) => i !== index));
  const total = carrito.reduce((sum, p) => sum + parseFloat(p.precio), 0);

  const verDetalleProducto = (prod) => { 
    setProductoSeleccionado(prod); 
    setVista('detalle'); 
  };

  const irAlInicio = () => { 
    setVista('inicio'); 
    setProductoSeleccionado(null); 
  };

  const irAlCheckout = () => { 
    setVerCarrito(false); 
    setVista('checkout'); 
  };

  // CURVA DE ANIMACIÓN PREMIUM PARA TRANSICIONES
  const pageTransition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] };

  return (
    <div className="app-container">
      <AnimatePresence>
        {notificacion && (
          <motion.div className="toast" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <CheckCircle size={18} /> {notificacion}
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar vista={vista} irAlInicio={irAlInicio} busqueda={busqueda} setBusqueda={setBusqueda} setVerCarrito={setVerCarrito} carrito={carrito} />

      <AnimatePresence mode="wait">
        {vista === 'inicio' && (
          <motion.div key="inicio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={pageTransition}>
            <Home 
              productosFiltrados={productosFiltrados} verDetalleProducto={verDetalleProducto}
              filtroCategoria={filtroCategoria} setFiltroCategoria={setFiltroCategoria}
              filtroGenero={filtroGenero} setFiltroGenero={setFiltroGenero}
              filtroPrecio={filtroPrecio} setFiltroPrecio={setFiltroPrecio}
              filtroTalla={filtroTalla} setFiltroTalla={setFiltroTalla}
              busqueda={busqueda}
            />
          </motion.div>
        )}

        {vista === 'detalle' && productoSeleccionado && (
          <motion.div key="detalle" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={pageTransition}>
            <ProductDetail 
              productoSeleccionado={productoSeleccionado} irAlInicio={irAlInicio}
              setFiltroCategoria={setFiltroCategoria} agregarAlCarrito={agregarAlCarrito}
              productosRelacionados={productosRelacionados} verDetalleProducto={verDetalleProducto}
            />
          </motion.div>
        )}

        {vista === 'checkout' && (
          <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={pageTransition}>
            <Checkout carrito={carrito} total={total} irAlInicio={irAlInicio} setCarrito={setCarrito} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {verCarrito && vista !== 'checkout' && (
          <CartSidebar carrito={carrito} setVerCarrito={setVerCarrito} eliminarDelCarrito={eliminarDelCarrito} total={total} irAlCheckout={irAlCheckout} />
        )}
      </AnimatePresence>

      {vista !== 'checkout' && <Footer />}
    </div>
  );
}

export default App;