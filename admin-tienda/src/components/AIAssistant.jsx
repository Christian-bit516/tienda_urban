import { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, X, Send, Loader2, Zap, Copy, Check, Trash2, LineChart, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  // Copiar al portapapeles
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = (textToSend = input) => {
    if (!textToSend.trim()) return;
    
    const newUserMsg = { id: Date.now(), role: 'user', text: textToSend };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    // ========================================================
    // LÓGICA SIMULADA PROFESIONAL (NIVEL ENTERPRISE)
    // ========================================================
    setTimeout(() => {
      setIsTyping(false);
      let reply = "Estoy analizando los datos de tu tienda para darte la mejor respuesta...";
      const lowerText = textToSend.toLowerCase();

      if (lowerText.includes('descripción') || lowerText.includes('hoodie')) {
        reply = `¡Claro! Aquí tienes una descripción optimizada para SEO y conversión:\n\n**Título Sugerido:** Hoodie Urban Essential - Corte Oversize Premium\n\n**Descripción:**\nEleva tu estilo urbano con nuestra pieza insignia. Diseñado para quienes no comprometen la comodidad por el diseño, este hoodie ofrece una silueta moderna y estructurada que se adapta a cualquier look de calle.\n\n**Características principales:**\n• **Material:** 100% Algodón Pima peinado (alta densidad).\n• **Fit:** Oversize relajado con hombros caídos.\n• **Detalles:** Costuras reforzadas y capucha de doble forro.\n• **Cuidado:** Lavado en frío para mantener la fidelidad del color.\n\n*💡 Tip de la IA: Te sugiero hacer upselling ofreciendo un 10% de descuento si lo compran junto a un Pantalón Cargo.*`;
      } else if (lowerText.includes('ventas') || lowerText.includes('analizar')) {
        reply = `He analizado tus métricas de los últimos 7 días. Aquí tienes el resumen ejecutivo:\n\n📊 **Rendimiento General:**\n• **Ingresos Totales:** S/ 4,250.00 (**+14.5%** vs sem. anterior)\n• **Tasa de Conversión:** 3.2% (Óptimo)\n• **Ticket Promedio:** S/ 185.00\n\n🏆 **Top Productos:**\n1. Zapatillas Urban Flow X (12 unidades)\n2. Pantalón Cargo Techwear (8 unidades)\n\n⚠️ **Área de Oportunidad:**\nHe notado que la categoría "Accesorios" tiene muchas visitas pero pocas compras. Te sugiero revisar los precios o crear un combo (Ej: Compra unas zapatillas y lleva una gorra a mitad de precio).`;
      } else if (lowerText.includes('promoción') || lowerText.includes('descuento')) {
        reply = `Para impulsar las ventas de fin de mes sin dañar tus márgenes de ganancia, te propongo esta estrategia de escasez:\n\n🏷️ **Campaña: "Flash Urban 48H"**\n\n• **Mecánica:** 15% de descuento en carritos superiores a S/ 250.00.\n• **Código:** \`URBAN15\`\n• **Canal:** Email Marketing a clientes que han abandonado el carrito en los últimos 15 días.\n\n*¿Quieres que genere el texto para el correo electrónico de esta campaña?*`;
      } else {
        reply = `He registrado tu solicitud: "${textToSend}". \n\nComo soy una versión de demostración en este entorno, mi conocimiento está enfocado en darte ejemplos de **Descripciones de productos**, **Análisis de ventas** y **Estrategias de promoción**. ¡Prueba preguntarme por alguna de esas opciones!`;
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: reply }]);
    }, 1800);
  };

  const clearChat = () => setMessages([]);

  // Función para renderizar negritas y saltos de línea simulando Markdown
  const renderFormattedText = (text) => {
    return text.split('\n').map((line, i) => {
      // Reemplaza **texto** por <strong>texto</strong>
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={i}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
          <br />
        </span>
      );
    });
  };

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <motion.button 
        className="ai-fab" onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05, boxShadow: "0 15px 35px rgba(99, 102, 241, 0.5)" }} whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }} animate={{ scale: isOpen ? 0 : 1 }}
      >
        <Sparkles size={24} />
      </motion.button>

      {/* VENTANA DE CHAT */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="ai-chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* CABECERA */}
            <div className="ai-chat-header">
              <div className="ai-header-info">
                <div className="ai-avatar"><Bot size={20} /></div>
                <div>
                  <h4>Urban Intelligence</h4>
                  <span className="ai-status"><span className="status-dot"></span> Online</span>
                </div>
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                {messages.length > 0 && (
                  <button className="ai-action-btn" onClick={clearChat} title="Limpiar chat"><Trash2 size={16}/></button>
                )}
                <button className="ai-action-btn" onClick={() => setIsOpen(false)} title="Cerrar"><X size={20}/></button>
              </div>
            </div>

            {/* CUERPO DEL CHAT (Scrollable) */}
            <div className="ai-chat-body" data-lenis-prevent="true">
              
              {/* PANTALLA DE BIENVENIDA (Empty State) */}
              {messages.length === 0 && (
                <div className="ai-welcome-screen">
                  <div className="ai-welcome-icon"><Sparkles size={32} /></div>
                  <h3>¿Cómo puedo ayudarte hoy?</h3>
                  <p>Soy tu asistente experto en e-commerce. Selecciona una opción o hazme una pregunta directa.</p>
                  
                  <div className="ai-suggestions-grid">
                    <button onClick={() => handleSend("Ayúdame a redactar la descripción para un Hoodie oversize")} className="ai-suggestion-card">
                      <PenTool size={18} color="#a855f7" />
                      <span>Redactar Descripción</span>
                    </button>
                    <button onClick={() => handleSend("Analizar las ventas recientes y sugerir mejoras")} className="ai-suggestion-card">
                      <LineChart size={18} color="#3b82f6" />
                      <span>Analizar Ventas</span>
                    </button>
                    <button onClick={() => handleSend("Sugerir promoción de fin de mes para aumentar conversión")} className="ai-suggestion-card">
                      <Zap size={18} color="#f59e0b" />
                      <span>Crear Promoción</span>
                    </button>
                  </div>
                </div>
              )}

              {/* LISTA DE MENSAJES */}
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`ai-message-wrapper ${msg.role === 'ai' ? 'ai-msg' : 'user-msg'}`}>
                  {msg.role === 'ai' && <div className="ai-msg-icon"><Sparkles size={14}/></div>}
                  <div className="ai-message-content">
                    <div className="ai-message">
                      {msg.role === 'ai' ? renderFormattedText(msg.text) : msg.text}
                    </div>
                    {/* Botón de copiar solo para la IA */}
                    {msg.role === 'ai' && (
                      <div className="ai-message-actions">
                        <button onClick={() => handleCopy(msg.text, msg.id)} className="copy-btn">
                          {copiedId === msg.id ? <><Check size={12}/> Copiado</> : <><Copy size={12}/> Copiar texto</>}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* INDICADOR DE ESCRITURA */}
              {isTyping && (
                <div className="ai-message-wrapper ai-msg">
                  <div className="ai-msg-icon"><Sparkles size={14}/></div>
                  <div className="ai-message typing-indicator">
                    <Loader2 size={16} className="spinner" /> Pensando...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} style={{height: '1px'}} />
            </div>

            {/* ZONA DE INPUT */}
            <div className="ai-chat-footer">
              <input 
                type="text" placeholder="Pregúntale a Urban AI..." 
                value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button onClick={() => handleSend()} disabled={!input.trim() || isTyping} className="send-btn">
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}