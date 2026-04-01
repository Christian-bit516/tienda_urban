import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X, Search, UploadCloud, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductsManager() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modoModal, setModoModal] = useState('crear'); 
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  
  // Estados para manejar la imagen importada
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  
  const estadoInicial = { id: '', nombre: '', precio: '', categoria: 'Poleras', genero: 'Unisex', tallas: 'S,M,L,XL', imagen: '' };
  const [form, setForm] = useState(estadoInicial);

  const cargarProductos = () => {
    setLoading(true);
    axios.get('http://localhost/tienda_urban/backend/api/get_productos.php')
      .then(res => { setProductos(Array.isArray(res.data) ? res.data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { cargarProductos(); }, []);

  useEffect(() => {
    if (modalVisible) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [modalVisible]);

  const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  // ABRIR PARA CREAR
  const abrirCrear = () => { 
    setForm(estadoInicial); 
    setImagenArchivo(null);
    setImagenPreview(null);
    setModoModal('crear'); 
    setModalVisible(true); 
  };

  // ABRIR PARA EDITAR
  const abrirEditar = (prod) => { 
    setForm(prod); 
    setImagenArchivo(null);
    setImagenPreview(prod.imagen); // Muestra la foto actual
    setModoModal('editar'); 
    setModalVisible(true); 
  };

  // FUNCION: IMPORTAR FOTO DESDE LA PC
  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenArchivo(file);
      setImagenPreview(URL.createObjectURL(file));
    }
  };

  // FUNCION: GUARDAR PRODUCTO E IMAGEN (Usa FormData para enviar la foto física)
  const handleGuardar = (e) => {
    e.preventDefault();
    setGuardando(true);
    
    const formData = new FormData();
    formData.append('id', form.id);
    formData.append('nombre', form.nombre);
    formData.append('precio', form.precio);
    formData.append('categoria', form.categoria);
    formData.append('genero', form.genero);
    formData.append('tallas', form.tallas);
    formData.append('imagen_actual', form.imagen); // Mantiene la anterior si no subes una nueva
    
    if (imagenArchivo) {
      formData.append('imagen', imagenArchivo); // Adjunta el archivo de foto
    }
    
    const endpoint = modoModal === 'crear' ? 'agregar_producto.php' : 'editar_producto.php';
    
    axios.post(`http://localhost/tienda_urban/backend/api/${endpoint}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(res => {
        if (res.data.status === 'ok') {
          setModalVisible(false);
          cargarProductos(); 
        } else alert(`Error: ${res.data.mensaje}`);
      })
      .catch(() => alert("Error de servidor. Revisa tu PHP o BD."))
      .finally(() => setGuardando(false));
  };

  // FUNCION: ELIMINAR
  const handleEliminar = (id, nombre) => {
    if(window.confirm(`¿Eliminar permanentemente "${nombre}"?`)) {
      axios.post('http://localhost/tienda_urban/backend/api/eliminar_producto.php', { id })
        .then(res => { if(res.data.status === 'ok') cargarProductos(); })
        .catch(() => alert("Error al intentar eliminar."));
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      
      {/* HEADER DE CONTROLES */}
      <div className="controls-header">
        <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder="Buscar productos..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary" onClick={abrirCrear}>
          <Plus size={18} /> Nuevo Artículo
        </motion.button>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría / Género</th>
              <th>Estado</th>
              <th>Precio</th>
              <th>Acciones</th> {/* <--- AQUÍ ESTÁ LA COLUMNA DE ACCIONES */}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '50px' }}><Loader2 className="spinner" size={24} style={{margin: '0 auto'}}/></td></tr>
              ) : filtrados.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '50px' }}>No hay productos.</td></tr>
              ) : (
                filtrados.map((p, i) => (
                  <motion.tr key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img src={p.imagen} alt="" className="product-img-td" onError={(e) => e.target.src = 'https://via.placeholder.com/60x75?text=Sin+Imagen'}/>
                      <div>
                        <div style={{ fontWeight: 700, color: 'white', marginBottom: '4px' }}>{p.nombre}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tallas: {p.tallas}</div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{p.categoria} • {p.genero}</td>
                    <td><span className="status-badge active">EN STOCK</span></td>
                    <td style={{ fontWeight: '800', color: 'white' }}>S/ {p.precio}</td>
                    
                    {/* <--- AQUÍ ESTÁN LOS BOTONES EDITAR Y ELIMINAR */}
                    <td>
                      <div className="actions-wrapper">
                        <button className="action-btn edit" onClick={() => abrirEditar(p)} title="Editar"><Edit size={16} /></button>
                        <button className="action-btn delete" onClick={() => handleEliminar(p.id, p.nombre)} title="Eliminar"><Trash2 size={16} /></button>
                      </div>
                    </td>
                    
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* MODAL LATERAL (DRAWER) CON IMPORTAR FOTO */}
      <AnimatePresence>
        {modalVisible && (
          <div className="modal-wrapper">
            <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalVisible(false)} />
            <motion.div className="modal-box" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}>
              <div className="modal-header">
                <h2>{modoModal === 'crear' ? 'Añadir Producto' : 'Editar Producto'}</h2>
                <button className="close-btn" onClick={() => setModalVisible(false)}><X size={20} /></button>
              </div>
              
              <form onSubmit={handleGuardar} className="admin-form" data-lenis-prevent="true">
                
                {/* ZONA DE IMPORTAR FOTO */}
                <div className="form-group">
                  <label>Importar Foto</label>
                  <label className="upload-box">
                    <input type="file" accept="image/*" onChange={handleArchivoChange} style={{ display: 'none' }} />
                    {imagenPreview ? (
                      <img src={imagenPreview} alt="Preview" />
                    ) : (
                      <>
                        <UploadCloud size={30} style={{marginBottom: '10px'}}/>
                        <span>Haz clic para importar imagen desde tu PC</span>
                      </>
                    )}
                  </label>
                </div>

                <div className="form-group"><label>Nombre del producto</label><input type="text" value={form.nombre} required onChange={e => setForm({...form, nombre: e.target.value})} /></div>
                <div className="form-group"><label>Precio (S/)</label><input type="number" step="0.01" value={form.precio} required onChange={e => setForm({...form, precio: e.target.value})} /></div>
                
                <div style={{display:'flex', gap:'20px'}}>
                  <div className="form-group" style={{flex:1}}><label>Categoría</label>
                    <select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})}>
                      <option value="Poleras">Poleras</option><option value="Pantalones">Pantalones</option>
                      <option value="Zapatillas">Zapatillas</option><option value="Accesorios">Accesorios</option>
                    </select>
                  </div>
                  <div className="form-group" style={{flex:1}}><label>Género</label>
                    <select value={form.genero} onChange={e => setForm({...form, genero: e.target.value})}>
                      <option value="Unisex">Unisex</option><option value="Hombre">Hombre</option><option value="Mujer">Mujer</option>
                    </select>
                  </div>
                </div>

                <div className="form-group"><label>Tallas (S,M,L...)</label><input type="text" value={form.tallas} required onChange={e => setForm({...form, tallas: e.target.value})} /></div>
              </form>

              <div className="modal-footer">
                <motion.button whileTap={{ scale: 0.98 }} className="btn-solid-accent" onClick={handleGuardar} disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar Cambios'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}