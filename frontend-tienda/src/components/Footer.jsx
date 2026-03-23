import { Facebook, Instagram, Twitter, MapPin } from 'lucide-react';

export default function Footer({ irAlAdmin }) {
  return (
    <footer className="footer dark-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2 className="logo" style={{color:'white'}}>URBAN<span style={{color:'#888'}}>STORE</span></h2>
          <p>Streetwear Premium. Elevando la moda urbana.</p>
        </div>
        <div className="footer-contact">
          <h3 style={{marginBottom: '15px'}}>Contáctanos</h3>
          <p><MapPin size={16} /> Lima, Perú</p>
          <div className="social-links" style={{marginTop: '15px', display: 'flex', gap:'15px'}}>
            <div className="social-icon"><Facebook size={20}/></div> 
            <div className="social-icon"><Instagram size={20}/></div> 
            <div className="social-icon"><Twitter size={20}/></div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 URBAN STORE. Todos los derechos reservados.</p>
        {/* Enlace discreto para entrar al admin */}
        <p 
          onClick={irAlAdmin} 
          style={{ cursor: 'pointer', color: '#333', marginTop: '10px', fontSize: '0.8rem', display: 'inline-block' }}
        >
          Acceso Administrador
        </p>
      </div>
    </footer>
  );
}