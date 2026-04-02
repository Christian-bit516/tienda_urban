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

const productosDePrueba = [
  { id: 1, nombre: "Hoodie Oversize Essential", precio: "180.00", categoria: "Poleras", genero: "Unisex", tallas: "S,M,L,XL", imagen: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop" },
  { id: 2, nombre: "Pantalón Cargo Techwear", precio: "220.00", categoria: "Pantalones", genero: "Hombre", tallas: "M,L,XL", imagen: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop" },
  { id: 3, nombre: "Zapatillas Urban Flow X", precio: "350.00", categoria: "Zapatillas", genero: "Unisex", tallas: "40,41,42", imagen: "https://images.unsplash.com/photo-1552346154-21d32810baa3?q=80&w=800&auto=format&fit=crop" },
  { id: 4, nombre: "Gorra Street Vintage", precio: "85.00", categoria: "Accesorios", genero: "Unisex", tallas: "Única", imagen: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop" },
  { id: 5, nombre: "T-Shirt Boxy Fit Blanca", precio: "95.00", categoria: "Poleras", genero: "Mujer", tallas: "XS,S,M", imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop" },
  { id: 6, nombre: "Kit Limpieza Premium Sneaker", precio: "120.00", categoria: "Limpieza", genero: "Unisex", tallas: "Única", imagen: "https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=800&auto=format&fit=crop" },
];

function App() {
  const [productos, setProductos] = useState([]);
  
  // ==========================================
  // PERSISTENCIA DEL CARRITO
  // ==========================================
  const [carrito, setCarrito] = useState(() => {
    try {
      const carritoGuardado = window.localStorage.getItem('urban_cart');
      return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('urban_cart', JSON.stringify(carrito));
    } catch (error) {
      console.error("Error guardando el carrito", error);
    }
  }, [carrito]);

  // ESTADOS DE NAVEGACIÓN Y FILTROS
  const [vista, setVista] = useState('inicio'); 
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [notificacion, setNotificacion] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [verCarrito, setVerCarrito] = useState(false);
  const [scrollHome, setScrollHome] = useState(0); // NUEVO: Guarda la posición exacta del scroll
  
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [filtroGenero, setFiltroGenero] = useState('Todos');
  const [filtroPrecio, setFiltroPrecio] = useState(1000);
  const [filtroTalla, setFiltroTalla] = useState('Todas');

  // =========================================================
  // INTERCEPTAR BOTÓN "ATRÁS" DEL CELULAR / NAVEGADOR
  // =========================================================
  useEffect(() => {
    window.history.pushState(null, null, window.location.href);

    const handleBotonAtras = () => {
      if (verCarrito) {
        setVerCarrito(false);
        window.history.pushState(null, null, window.location.href);
      } else if (vista !== 'inicio') {
        irAlInicio(); // Llamamos a nuestra función mejorada
        window.history.pushState(null, null, window.location.href);
      }
    };

    window.addEventListener('popstate', handleBotonAtras);
    return () => window.removeEventListener('popstate', handleBotonAtras);
  }, [vista, verCarrito, scrollHome]); 

  // =========================================================
  // INICIALIZACIÓN DE SCROLL SUAVE (LENIS)
  // =========================================================
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
    });

    window.lenis = lenis; 
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    return () => { lenis.destroy(); delete window.lenis; };
  }, []);

  // Cargar BD
  useEffect(() => {
    axios.get('http://localhost/tienda_urban/backend/api/get_productos.php')
      .then(res => setProductos(res.data && res.data.length > 0 ? res.data : productosDePrueba))
      .catch(() => setProductos(productosDePrueba));
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

  // =========================================================
  // SISTEMA DE NAVEGACIÓN CON MEMORIA DE SCROLL
  // =========================================================
  const verDetalleProducto = (prod) => { 
    setScrollHome(window.scrollY); // 1. Guardamos la posición exacta en el catálogo
    setProductoSeleccionado(prod); 
    setVista('detalle'); 
  };

  const irAlInicio = () => { 
    setVista('inicio'); 
    setProductoSeleccionado(null); 
    // NOTA: Ya no reseteamos "setBusqueda('')" para que conserve lo que escribió
    
    // 2. Restauramos la posición del scroll con un pequeño retraso para que cargue el DOM
    setTimeout(() => {
      if (window.lenis) {
        window.lenis.scrollTo(scrollHome, { immediate: true });
      } else {
        window.scrollTo({ top: scrollHome, behavior: 'instant' });
      }
    }, 50);
  };

  const irAlCheckout = () => { 
    if (vista === 'inicio') setScrollHome(window.scrollY); // Guardar scroll si viene desde el home
    setVerCarrito(false); 
    setVista('checkout'); 
  };

  const resetFiltros = () => {
    setFiltroCategoria('Todos'); setFiltroGenero('Todos');
    setFiltroPrecio(1000); setFiltroTalla('Todas'); setBusqueda('');
  };

  const pageTransition = { duration: 0.6, ease: [0.16, 1, 0.3, 1] };

  return (
    <div className="app-container">
      <AnimatePresence>
        {notificacion && (
          <motion.div className="toast" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }}>
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
              busqueda={busqueda} resetFiltros={resetFiltros}
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