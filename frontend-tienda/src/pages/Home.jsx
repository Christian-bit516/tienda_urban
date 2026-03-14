import { useState, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

export default function Home({ 
  productosFiltrados, verDetalleProducto, 
  filtroCategoria, setFiltroCategoria,
  filtroGenero, setFiltroGenero,
  filtroPrecio, setFiltroPrecio,
  filtroTalla, setFiltroTalla
}) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const slides = [
    { title: "NUEVA TEMPORADA", img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2000&auto=format&fit=crop" },
    { title: "STREETWEAR 2026", img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2000&auto=format&fit=crop" },
    { title: "COLECCIÓN OTOÑO", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2000&auto=format&fit=crop" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
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
          <span className="brand-txt">adidas</span><span className="brand-txt">NIKE</span>
          <span className="brand-txt">PUMA</span><span className="brand-txt">new balance</span>
          <span className="brand-txt">asics</span><span className="brand-txt">SPRAYGROUND</span>
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
    </>
  );
}