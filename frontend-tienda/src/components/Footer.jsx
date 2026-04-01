import { useRef } from 'react';
import { Facebook, Instagram, Twitter, MapPin } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Footer({ irAlAdmin }) {
  const footerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-40%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);

  return (
    <div style={{ position: 'relative', background: '#050505', zIndex: 0 }} ref={footerRef}>
      <motion.footer className="footer dark-footer" style={{ y, opacity }}>
        <div className="footer-content">
          <div className="footer-brand">
            <h2 className="logo" style={{color:'white'}}>URBAN<span style={{color:'#888'}}>STORE</span></h2>
            <p>Streetwear Premium. Elevando la moda urbana.</p>
          </div>
          <div className="footer-contact">
            <h3 style={{marginBottom: '15px'}}>Contáctanos</h3>
            <p><MapPin size={16} /> Lima, Perú</p>
            <div className="social-links" style={{marginTop: '15px', display: 'flex', gap:'15px'}}>
              <motion.div whileHover={{ y: -5 }} className="social-icon"><Facebook size={20}/></motion.div> 
              <motion.div whileHover={{ y: -5 }} className="social-icon"><Instagram size={20}/></motion.div> 
              <motion.div whileHover={{ y: -5 }} className="social-icon"><Twitter size={20}/></motion.div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 URBAN STORE. Todos los derechos reservados.</p>
          {/* Enlace discreto para entrar al admin intacto */}
          <p 
            onClick={irAlAdmin} 
            style={{ cursor: 'pointer', color: '#555', marginTop: '10px', fontSize: '0.8rem', display: 'inline-block' }}
          >
            Acceso Administrador
          </p>
        </div>
      </motion.footer>
    </div>
  );
}