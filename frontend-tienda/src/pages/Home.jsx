import { useState, useEffect } from 'react';
import { SlidersHorizontal, X, SearchX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home({ 
  productosFiltrados, verDetalleProducto, 
  filtroCategoria, setFiltroCategoria,
  filtroGenero, setFiltroGenero,
  filtroPrecio, setFiltroPrecio,
  filtroTalla, setFiltroTalla,
  busqueda
}) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const slides = [
    { title: "NUEVA TEMPORADA", img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2000&auto=format&fit=crop" },
    { title: "STREETWEAR 2026", img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2000&auto=format&fit=crop" },
    { title: "COLECCIÓN OTOÑO", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2000&auto=format&fit=crop" }
  ];

  useEffect(() => {
    if (window.lenis) window.lenis.scrollTo('top', { immediate: true });
    else window.scrollTo(0, 0);
    const interval = setInterval(() => { setSlideIndex((prev) => (prev + 1) % slides.length); }, 6000);
    return () => clearInterval(interval);
  }, []);

  // SCROLL ELEGANTE AL CATÁLOGO
  const scrollToCatalogo = (genero, categoria) => {
    if(genero) setFiltroGenero(genero);
    if(categoria) setFiltroCategoria(categoria);
    
    setTimeout(() => {
      if (window.lenis) {
        window.lenis.scrollTo('#catalogo', { offset: -90, duration: 1.5 }); // Desplazamiento como mantequilla
      } else {
        document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  // CURVA AWWWARDS (Efecto suave y profesional)
  const premiumTransition = { duration: 1, ease: [0.22, 1, 0.36, 1] };
  const fadeUp = { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } };

  return (
    <>
      {busqueda === '' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{duration: 0.8}}>
          <header className="slider-container">
            <AnimatePresence mode="wait">
              <motion.div 
                key={slideIndex} className="slide active" 
                initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5, ease: "easeInOut" }}
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url(${slides[slideIndex].img})` }}
              >
                <div className="hero-content">
                  <motion.h1 
                    initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {slides[slideIndex].title}
                  </motion.h1>
                  <motion.button 
                    className="hero-btn" 
                    onClick={() => scrollToCatalogo(null, null)}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
                  >
                    Ver Catálogo
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </header>

          <motion.section 
            className="brands-section"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} transition={premiumTransition}
          >
            <h3 className="section-subtitle">NUESTRAS MARCAS</h3>
            <div className="brands-logos">
              <span className="brand-txt">ADIDAS</span><span className="brand-txt">NIKE</span>
              <span className="brand-txt">PUMA</span><span className="brand-txt">NEW BALANCE</span>
              <span className="brand-txt">ASICS</span><span className="brand-txt">SPRAYGROUND</span>
            </div>
          </motion.section>

          <section className="visual-categories">
            {[
              { label: 'HOMBRE', img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop', gen: 'Hombre', cat: 'Todos' },
              { label: 'MUJER', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop', gen: 'Mujer', cat: 'Todos' },
              { label: 'ACCESORIOS', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop', gen: 'Todos', cat: 'Accesorios' },
              { label: 'LIMPIEZA', img: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=800&auto=format&fit=crop', gen: 'Todos', cat: 'Limpieza' },
            ].map((item, i) => (
              <motion.div 
                key={i} className="v-cat-box" style={{backgroundImage: `url('${item.img}')`}}
                onClick={() => scrollToCatalogo(item.gen, item.cat)} 
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} transition={{ ...premiumTransition, delay: i * 0.15 }}
              >
                <div className="v-cat-overlay"></div>
                <span className="v-cat-label">{item.label}</span>
              </motion.div>
            ))}
          </section>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={premiumTransition} style={{ padding: '60px 5% 20px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase' }}>Resultados para "{busqueda}"</h2>
          <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '10px' }}>Encontramos {productosFiltrados.length} artículos increíbles para ti.</p>
        </motion.div>
      )}

      <div className="filter-bar-header" id="catalogo" style={{ marginTop: busqueda ? '0' : 'auto' }}>
        <h2>{busqueda ? 'Tus Resultados' : 'Nuevos Lanzamientos'}</h2>
        <button className="open-filter-btn" onClick={() => setMostrarFiltros(true)}>
          <SlidersHorizontal size={18} /> Filtrar y Ordenar
        </button>
      </div>

      {productosFiltrados.length === 0 ? (
        <div style={{textAlign: 'center', padding: '100px 20px', color: '#888'}}>
          <SearchX size={60} style={{margin: '0 auto 20px', color: '#ccc'}} />
          <h3 style={{fontSize: '1.5rem', fontWeight: 800, color: '#444'}}>No se encontraron productos</h3>
          <p style={{marginTop: '10px'}}>Intenta con otros términos o ajusta tus filtros.</p>
        </div>
      ) : (
        <main className="products-grid">
          <AnimatePresence>
            {productosFiltrados.map((prod, i) => (
              <motion.div 
                key={prod.id} 
                className="product-card" 
                onClick={() => verDetalleProducto(prod)}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                variants={{ hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } }}
                transition={{ ...premiumTransition, delay: (i % 4) * 0.1 }}
              >
                <div className="image-wrapper">
                  <motion.img 
                    src={prod.imagen || 'https://via.placeholder.com/400x500?text=Sin+Imagen'} 
                    alt={prod.nombre} 
                    className="product-img" 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=Urban+Store'; }}
                    whileHover={{ scale: 1.05 }} transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }} 
                  />
                  <div className="quick-view">Ver Detalles</div>
                </div>
                <div className="product-info">
                  <span className="category-label">{prod.categoria}</span>
                  <h3 className="product-title">{prod.nombre}</h3>
                  <div className="price-row"><span className="price">S/ {prod.precio}</span></div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </main>
      )}

      {/* FILTROS SIDEBAR (Entrada elegante) */}
      <AnimatePresence>
        {mostrarFiltros && (
          <>
            <motion.div className="overlay" onClick={() => setMostrarFiltros(false)} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{ duration: 0.4 }}/>
            <motion.div className="filter-sidebar" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              <div className="filter-header">
                <h3>Filtrar y Ordenar</h3>
                <X className="close-cart" onClick={() => setMostrarFiltros(false)} style={{cursor: 'pointer'}} />
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
                <button className="apply-filter-btn" onClick={() => { setMostrarFiltros(false); scrollToCatalogo(null, null); }}>
                  Aplicar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}