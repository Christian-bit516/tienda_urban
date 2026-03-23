import { useState } from 'react';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

export default function Admin({ productos, irAlInicio }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '', precio: '', imagen: '', categoria: 'Poleras', genero: 'Unisex', tallas: 'S,M,L,XL'
  });

  const handleAgregar = (e) => {
    e.preventDefault();
    axios.post('http://localhost/tienda_urban/backend/api/agregar_producto.php', nuevoProducto)
      .then(res => {
        if (res.data.status === 'ok') {
          alert('Producto agregado con éxito');
          setMostrarFormulario(false);
          // Opcional: recargar la página para ver el nuevo producto o pasarlo al estado principal
          window.location.reload();
        } else {
          alert('Error al agregar el producto');
        }
      });
  };

  return (
    <div style={{ padding: '40px 5%', fontFamily: 'Inter, sans-serif' }}>
      <button 
        onClick={irAlInicio} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' }}
      >
        <ArrowLeft size={20} /> Volver a la Tienda
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>Panel de Administración</h1>
        <button 
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          style={{ padding: '12px 24px', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
        >
          <Plus size={18} /> {mostrarFormulario ? 'Cancelar' : 'Nuevo Producto'}
        </button>
      </div>

      {mostrarFormulario && (
        <form onSubmit={handleAgregar} style={{ background: '#f4f4f4', padding: '30px', borderRadius: '12px', marginBottom: '40px', display: 'grid', gap: '15px', gridTemplateColumns: '1fr 1fr' }}>
          <input type="text" placeholder="Nombre del producto" required onChange={e => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
          <input type="number" placeholder="Precio" required onChange={e => setNuevoProducto({...nuevoProducto, precio: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
          <input type="text" placeholder="URL de la Imagen" required onChange={e => setNuevoProducto({...nuevoProducto, imagen: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', gridColumn: '1 / -1' }} />
          
          <select onChange={e => setNuevoProducto({...nuevoProducto, categoria: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}>
            <option value="Poleras">Poleras</option>
            <option value="Pantalones">Pantalones</option>
            <option value="Zapatillas">Zapatillas</option>
            <option value="Accesorios">Accesorios</option>
            <option value="Limpieza">Limpieza</option>
          </select>

          <select onChange={e => setNuevoProducto({...nuevoProducto, genero: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}>
            <option value="Unisex">Unisex</option>
            <option value="Hombre">Hombre</option>
            <option value="Mujer">Mujer</option>
          </select>

          <input type="text" placeholder="Tallas (ej: S,M,L)" required onChange={e => setNuevoProducto({...nuevoProducto, tallas: e.target.value})} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc', gridColumn: '1 / -1' }} />
          
          <button type="submit" style={{ gridColumn: '1 / -1', padding: '15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            Guardar Producto
          </button>
        </form>
      )}

      {/* Tabla de Productos Existentes */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead>
            <tr style={{ background: '#1a1a1a', color: 'white' }}>
              <th style={{ padding: '15px' }}>Imagen</th>
              <th style={{ padding: '15px' }}>Nombre</th>
              <th style={{ padding: '15px' }}>Categoría</th>
              <th style={{ padding: '15px' }}>Precio</th>
              <th style={{ padding: '15px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '15px' }}><img src={p.imagen} alt={p.nombre} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} /></td>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>{p.nombre}</td>
                <td style={{ padding: '15px' }}>{p.categoria}</td>
                <td style={{ padding: '15px' }}>S/ {p.precio}</td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{ padding: '8px', cursor: 'pointer', background: '#ffc107', color: '#000', border: 'none', borderRadius: '5px', display: 'flex', alignItems: 'center' }} title="Editar"><Edit size={16} /></button>
                    <button style={{ padding: '8px', cursor: 'pointer', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', display: 'flex', alignItems: 'center' }} title="Eliminar"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>No hay productos registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}