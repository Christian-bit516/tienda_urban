import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from '@studio-freight/lenis';

import ProductsManager from './components/ProductsManager';
import OrdersManager from './components/OrdersManager';
import Dashboard from './components/Dashboard';

import './App.css';

export const productosDePrueba = [
  { id: 1, nombre: "Hoodie Oversize Essential", precio: "180.00", categoria: "Poleras", genero: "Unisex", tallas: "S,M,L,XL", imagen: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop" },
  { id: 2, nombre: "Pantalón Cargo Techwear", precio: "220.00", categoria: "Pantalones", genero: "Hombre", tallas: "M,L,XL", imagen: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop" },
  { id: 3, nombre: "Zapatillas Urban Flow X", precio: "350.00", categoria: "Zapatillas", genero: "Unisex", tallas: "40,41,42", imagen: "https://images.unsplash.com/photo-1552346154-21d32810baa3?q=80&w=800&auto=format&fit=crop" },
  { id: 4, nombre: "Gorra Street Vintage", precio: "85.00", categoria: "Accesorios", genero: "Unisex", tallas: "Única", imagen: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop" },
];

export default function App() {
  const [vistaActiva, setVistaActiva] = useState('dashboard');

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const renderizarVista = () => {
    switch (vistaActiva) {
      case 'dashboard': return <Dashboard />;
      case 'productos': return <ProductsManager />;
      case 'pedidos': return <OrdersManager />;
      default: return <Dashboard />;
    }
  };

  return (
    <>
      {/* Fondo Mágico Animado */}
      <div className="ambient-bg">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
      </div>

      <div className="admin-layout">
        <motion.aside className="sidebar" initial={{ x: -300 }} animate={{ x: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <div className="sidebar-brand"><div className="logo-dot"></div> URBAN<span>ADMIN</span></div>
          <nav className="sidebar-nav">
            <div className={`nav-item ${vistaActiva === 'dashboard' ? 'active' : ''}`} onClick={() => setVistaActiva('dashboard')}><LayoutDashboard size={18} /> Dashboard</div>
            <div className={`nav-item ${vistaActiva === 'productos' ? 'active' : ''}`} onClick={() => setVistaActiva('productos')}><Package size={18} /> Inventario</div>
            <div className={`nav-item ${vistaActiva === 'pedidos' ? 'active' : ''}`} onClick={() => setVistaActiva('pedidos')}><ShoppingCart size={18} /> Órdenes</div>
          </nav>
          <div className="sidebar-footer">
            <a href="http://localhost:5173" style={{textDecoration:'none'}}><div className="nav-item return-store"><Store size={18}/> Ir a la Tienda</div></a>
            <div className="logout-btn"><LogOut size={18} /> Cerrar Sesión</div>
          </div>
        </motion.aside>

        <main className="main-content">
          <header className="topbar">
            <h1 className="page-title">
              {vistaActiva === 'dashboard' && 'Visión General'}
              {vistaActiva === 'productos' && 'Catálogo de Productos'}
              {vistaActiva === 'pedidos' && 'Gestión de Órdenes'}
            </h1>
            <div className="admin-profile">
              <div className="avatar">A</div>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Admin</span>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div key={vistaActiva} initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              {renderizarVista()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}