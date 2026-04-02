import { useState, useRef, useCallback } from 'react';
import { SlidersHorizontal, X, SearchX, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const slides = [
  { title: "NUEVA TEMPORADA", img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2000&auto=format&fit=crop" },
  { title: "STREETWEAR 2026", img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2000&auto=format&fit=crop" },
  { title: "COLECCIÓN OTOÑO", img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=2000&auto=format&fit=crop" }
];

const HeroSlider = ({ scrollToCatalogo }) => {
  const [slideIndex] = useState(0); // Simplificado para no forzar re-renders del catálogo
  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 1000], ["0%", "35%"]);
  const heroTextY = useTransform(scrollY, [0, 800], ["0%", "80%"]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  return (
    <header className="slider-container">
      <AnimatePresence mode="wait">
        <motion.div key={slideIndex} className="slide active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5, ease: "easeInOut" }}>
          <motion.div className="slider-bg" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url(${slides[slideIndex].img})`, y: heroBgY }} />
          <motion.div className="hero-content" style={{ y: heroTextY, opacity: heroOpacity }}>
            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
              {slides[slideIndex].title}
            </motion.h1>
            <motion.button type="button" className="hero-btn" onClick={() => scrollToCatalogo(null, null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}>
              Ver Catálogo
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </header>
  );
};

const ParallaxCategory = ({ item, onClick, index }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <motion.div ref={ref} className="v-cat-box" onClick={onClick} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}>
      <motion.img src={item.img} alt={item.label} className="v-cat-img" style={{ y }} />
      <div className="v-cat-overlay"></div>
      <span className="v-cat-label">{item.label}</span>
    </motion.div>
  );
};

export default function Home({ 
  productosFiltrados, verDetalleProducto, 
  filtroCategoria, setFiltroCategoria,
  filtroGenero, setFiltroGenero,
  filtroPrecio, setFiltroPrecio,
  filtroTalla, setFiltroTalla,
  busqueda, resetFiltros
}) {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // NOTA: Se eliminó el `useEffect` que hacía `scrollTo('top')` en cada render para arreglar el problema del botón "Atrás".

  const scrollToCatalogo = useCallback((genero, categoria) => {
    if(genero) setFiltroGenero(genero);
    if(categoria) setFiltroCategoria(categoria);
    
    setTimeout(() => {
      if (window.lenis) {
        window.lenis.scrollTo('#catalogo', { offset: -90, duration: 1.5 });
      } else {
        document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  }, [setFiltroGenero, setFiltroCategoria]);

  const premiumTransition = { duration: 1, ease: [0.16, 1, 0.3, 1] };
  const fadeUp = { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } };

  return (
    <>
      {busqueda === '' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{duration: 0.5}}>
          <HeroSlider scrollToCatalogo={scrollToCatalogo} />

          <motion.section className="brands-section" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} transition={premiumTransition}>
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
              <ParallaxCategory key={i} item={item} index={i} onClick={() => scrollToCatalogo(item.gen, item.cat)} />
            ))}
          </section>
        </motion.div>
      ) : (
        <motion.div className="search-results-header" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={premiumTransition}>
          <h2>Resultados para "{busqueda}"</h2>
          <p>Encontramos {productosFiltrados.length} artículos increíbles para ti.</p>
        </motion.div>
      )}

      <div className="filter-bar-header" id="catalogo">
        <h2>{busqueda ? 'Tus Resultados' : 'Nuevos Lanzamientos'}</h2>
        <button type="button" className="open-filter-btn" onClick={() => setMostrarFiltros(true)}>
          <SlidersHorizontal size={18} /> Filtrar y Ordenar
        </button>
      </div>

      {productosFiltrados.length === 0 ? (
        <motion.div className="empty-state-box" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={premiumTransition}>
          <motion.div initial={{ rotate: -10 }} animate={{ rotate: 10 }} transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}>
            <SearchX size={60} className="empty-icon" />
          </motion.div>
          <h3>No hay coincidencias</h3>
          <p>No encontramos productos que coincidan con tu búsqueda actual.</p>
          <button type="button" className="reset-search-btn" onClick={resetFiltros} style={{width: 'auto', padding: '16px 35px', marginTop: '20px'}}>
            <RefreshCcw size={18} style={{marginRight: '10px', verticalAlign: 'middle'}}/> Limpiar todos los filtros
          </button>
        </motion.div>
      ) : (
        <main className="products-grid">
          <AnimatePresence>
            {productosFiltrados.map((prod, i) => (
              <motion.div 
                key={prod.id} className="product-card" onClick={() => verDetalleProducto(prod)}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                variants={{ hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.1 }}
              >
                <div className="image-wrapper">
                  <img src={prod.imagen || 'https://via.placeholder.com/400x500?text=Sin+Imagen'} alt={prod.nombre} className="product-img" onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=Urban+Store'; }} />
                  <div className="quick-view">Ver Detalles</div>
                </div>
                <div className="product-info">
                  <span className="category-label">{prod.categoria}</span>
                  <h3 className="product-title">{prod.nombre}</h3>
                  <span className="price">S/ {prod.precio}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </main>
      )}

      {/* FILTROS SIDEBAR */}
      <AnimatePresence>
        {mostrarFiltros && (
          <>
            <motion.div className="overlay" onClick={() => setMostrarFiltros(false)} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{ duration: 0.4 }}/>
            <motion.div className="filter-sidebar" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
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
                      <button type="button" key={t} className={`side-talla-btn ${filtroTalla === t ? 'active' : ''}`} onClick={() => setFiltroTalla(t)}>{t}</button>
                    ))}
                  </div>
                </div>
                <div className="filter-group-side">
                  <h4>Precio Máximo: S/ {filtroPrecio}</h4>
                  <input type="range" min="0" max="1000" step="10" value={filtroPrecio} onChange={(e) => setFiltroPrecio(e.target.value)} className="price-slider-side" />
                </div>
              </div>
              <div className="filter-footer">
                <button type="button" className="reset-filter-btn" onClick={resetFiltros}>Borrar todo</button>
                <button type="button" className="apply-filter-btn" onClick={() => { setMostrarFiltros(false); scrollToCatalogo(null, null); }}>Aplicar</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}