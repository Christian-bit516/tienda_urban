import { Facebook, Instagram, Twitter, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer({ irAlAdmin }) {
  return (
    <footer className="footer dark-footer" style={{ background: '#050505', position: 'relative', zIndex: 10, width: '100%' }}>
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
    </footer>
  );
}