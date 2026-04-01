import { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrdersManager() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState('Todos');

  useEffect(() => {
    axios.get('http://localhost/tienda_urban/backend/api/get_pedidos.php')
      .then(res => setPedidos(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error(err));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      
      <div className="tabs">
        <div className={`tab ${filtro === 'Todos' ? 'active' : ''}`} onClick={() => setFiltro('Todos')}>Todos</div>
        <div className={`tab ${filtro === 'Pendientes' ? 'active' : ''}`} onClick={() => setFiltro('Pendientes')}><Clock size={14} style={{display:'inline', marginRight:'5px'}}/> Pendientes</div>
        <div className={`tab ${filtro === 'Completados' ? 'active' : ''}`} onClick={() => setFiltro('Completados')}><CheckCircle size={14} style={{display:'inline', marginRight:'5px'}}/> Completados</div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr><th>ID Pedido</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {pedidos.map((pedido, i) => (
              <motion.tr key={pedido.id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                <td style={{ fontWeight: 'bold' }}>#URB-00{pedido.id}</td>
                <td style={{ color: 'var(--text-muted)' }}>Reciente</td>
                <td style={{ fontWeight: 'bold' }}>S/ {pedido.total}</td>
                <td><span className="status-badge active">Completado</span></td>
                <td><button className="action-btn edit"><Eye size={16} /> Ver</button></td>
              </motion.tr>
            ))}
            {pedidos.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>No hay pedidos aún.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}