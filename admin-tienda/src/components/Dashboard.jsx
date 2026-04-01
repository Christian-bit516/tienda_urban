import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, ShoppingCart, DollarSign, TrendingUp, Activity, ArrowUpRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { productosDePrueba } from '../App';

export default function Dashboard() {
  const [stats, setStats] = useState({ productos: 0, pedidos: 0, ingresos: 0 });
  const [pedidosRecientes, setPedidosRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost/tienda_urban/backend/api/get_productos.php').catch(() => ({ data: productosDePrueba })),
      axios.get('http://localhost/tienda_urban/backend/api/get_pedidos.php').catch(() => ({ data: [] }))
    ]).then(([resProd, resPed]) => {
      const productos = (resProd.data && resProd.data.length > 0) ? resProd.data : productosDePrueba;
      const pedidos = Array.isArray(resPed.data) ? resPed.data : [];
      
      const ingresos = pedidos.reduce((sum, p) => sum + parseFloat(p.total || 0), 0);
      
      setStats({ productos: productos.length, pedidos: pedidos.length, ingresos: ingresos.toFixed(2) });
      setPedidosRecientes(pedidos.slice(0, 5));
      
      setTimeout(() => setLoading(false), 500);
    });
  }, []);

  const stagger = { show: { transition: { staggerChildren: 0.1 } } };
  const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="dashboard-wrapper">
      
      {/* CABECERA */}
      <motion.div variants={fadeUp} className="dashboard-header-text">
        <h2>{saludo}, Admin.</h2>
        <p>Aquí tienes el rendimiento de Urban Store al día de hoy.</p>
      </motion.div>

      {/* TARJETAS KPI */}
      <div className="dash-stats-grid">
        <motion.div className="dash-stat-card" variants={fadeUp}>
          <div className="dash-stat-header"><span>Ingresos Brutos</span> <div className="dash-stat-icon"><DollarSign size={20} /></div></div>
          <div className="dash-stat-info">
            <div className="dash-stat-value">{loading ? '...' : <><span>S/</span>{stats.ingresos}</>}</div>
            <div className="dash-stat-trend up"><TrendingUp size={14}/> +14.5% este mes</div>
          </div>
        </motion.div>
        
        <motion.div className="dash-stat-card" variants={fadeUp}>
          <div className="dash-stat-header"><span>Órdenes</span> <div className="dash-stat-icon" style={{color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)'}}><ShoppingCart size={20} /></div></div>
          <div className="dash-stat-info">
            <div className="dash-stat-value">{loading ? '...' : stats.pedidos}</div>
            <div className="dash-stat-trend up"><TrendingUp size={14}/> +8 órdenes hoy</div>
          </div>
        </motion.div>

        <motion.div className="dash-stat-card" variants={fadeUp}>
          <div className="dash-stat-header"><span>Catálogo</span> <div className="dash-stat-icon" style={{color: 'var(--warning)', background: 'rgba(245, 158, 11, 0.1)'}}><Package size={20} /></div></div>
          <div className="dash-stat-info">
            <div className="dash-stat-value">{loading ? '...' : stats.productos}</div>
            <div className="dash-stat-trend neutral">Actualizado hoy</div>
          </div>
        </motion.div>
      </div>

      {/* ZONA DE WIDGETS (Gráfico + Pedidos) */}
      <div className="dash-widgets-layout">
        
        {/* GRÁFICO VECTORIAL */}
        <motion.div className="dash-widget chart-widget" variants={fadeUp}>
          <div className="dash-widget-header">
            <div>
              <h3>Rendimiento de Ventas</h3>
              <p>Últimos 7 días</p>
            </div>
            <button className="dash-widget-btn">Reporte <ArrowUpRight size={16}/></button>
          </div>
          
          <div className="dash-svg-container">
            <svg viewBox="0 0 800 250" preserveAspectRatio="none" className="dash-premium-svg">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path 
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}
                d="M0,250 L0,150 Q100,180 200,100 T400,120 T600,50 T800,80 L800,250 Z" 
                fill="url(#chartGradient)" 
              />
              <motion.path 
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                d="M0,150 Q100,180 200,100 T400,120 T600,50 T800,80" 
                fill="none" stroke="var(--accent)" strokeWidth="3" 
                strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>

        {/* LISTA DE PEDIDOS */}
        <motion.div className="dash-widget orders-widget" variants={fadeUp}>
          <div className="dash-widget-header">
            <div>
              <h3>Actividad Reciente</h3>
              <p>Últimos pedidos</p>
            </div>
            <Activity size={20} color="var(--text-muted)" />
          </div>
          
          <div className="dash-recent-orders">
            {loading ? (
              <p style={{color: 'var(--text-muted)'}}>Cargando...</p>
            ) : pedidosRecientes.length > 0 ? (
              pedidosRecientes.map((pedido, i) => (
                <div className="dash-order-item" key={pedido.id || i}>
                  <div className="dash-order-icon"><Clock size={16}/></div>
                  <div className="dash-order-text">
                    <h4>Pedido #URB-00{pedido.id}</h4>
                    <p>{pedido.productos}</p>
                  </div>
                  <div className="dash-order-price">S/ {pedido.total}</div>
                </div>
              ))
            ) : (
              <div style={{ padding: '40px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No hay pedidos recientes
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}