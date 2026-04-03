import { useState, useEffect, useRef } from 'react';

export default function AIAssistant() {
  const [productos, setProductos] = useState([]);
  const recognitionRef = useRef(null);
  
  const isListeningRef = useRef(false);
  const productosRef = useRef([]);
  
  // Memoria a corto plazo para comandos incompletos
  const memoriaComandoRef = useRef({ accionPendiente: null, productoPendiente: null });
  const yaSaludoRef = useRef(false);

  // 1. CARGAR PRODUCTOS AL INICIO
  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost/tienda_urban/backend/api/get_productos.php');
      const data = await response.json();
      setProductos(data);
      productosRef.current = data;
    } catch (error) {
      console.error("Error al cargar inventario para la IA:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // 2. VOZ DE LA IA
  const hablarTexto = (texto) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'es-ES';
        utterance.rate = 1.0; 
        utterance.pitch = 1.0; 
        
        const voces = window.speechSynthesis.getVoices();
        const vozEspanol = voces.find(voz => voz.lang.startsWith('es') && voz.localService);
        if (vozEspanol) utterance.voice = vozEspanol;
        
        window.speechSynthesis.speak(utterance);
      }, 50);
    }
  };

  // 3. CEREBRO LOCAL (Órdenes directas sin palabra clave)
  const procesarOrdenDirecta = async (textoUsuario) => {
    // Normalizamos quitando tildes y pasando a minúsculas
    const texto = textoUsuario.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Resetear memoria si se lo pides
    if (texto.includes('cancelar') || texto.includes('olvidalo') || texto.includes('nada')) {
      memoriaComandoRef.current = { accionPendiente: null, productoPendiente: null };
      hablarTexto("Orden cancelada.");
      return;
    }

    let accion = memoriaComandoRef.current.accionPendiente;
    let productoObjetivo = memoriaComandoRef.current.productoPendiente;
    let nuevoPrecio = null;

    // Detectar intención si no hay una orden pendiente
    if (!accion) {
      if (texto.includes('eliminar') || texto.includes('borrar') || texto.includes('quitar')) {
        accion = 'eliminar';
      } else if (texto.includes('precio') || texto.includes('cambiar') || texto.includes('cuesta') || texto.includes('actualizar')) {
        accion = 'editar_precio';
      }
    }

    // 🛑 FILTRO INTELIGENTE: Si no detecta una orden de borrar o cambiar precio, 
    // y no está a la mitad de una conversación, ignora el texto por completo.
    if (!accion) return; 

    // Buscar coincidencia de producto en la base de datos
    if (!productoObjetivo) {
      productoObjetivo = productosRef.current.find(prod => {
        const nombreLimpio = prod.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (texto.includes(nombreLimpio)) return true;
        
        const palabrasClave = nombreLimpio.split(' ').filter(p => p.length > 3);
        return palabrasClave.some(palabra => texto.includes(palabra));
      });
    }

    if (accion === 'editar_precio') {
      const numerosEncontrados = texto.match(/\d+/); 
      if (numerosEncontrados) nuevoPrecio = numerosEncontrados[0];
    }

    // ==========================================
    // EJECUCIÓN A TU BACKEND
    // ==========================================
    if (accion === 'eliminar') {
      if (!productoObjetivo) {
        memoriaComandoRef.current.accionPendiente = 'eliminar';
        hablarTexto("¿Qué producto deseas eliminar?");
      } else {
        await fetch('http://localhost/tienda_urban/backend/api/eliminar_producto.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: productoObjetivo.id })
        });
        
        hablarTexto(`He eliminado ${productoObjetivo.nombre} del catálogo.`);
        memoriaComandoRef.current = { accionPendiente: null, productoPendiente: null }; 
        fetchProductos(); 
        setTimeout(() => window.location.reload(), 2000); // Recarga para ver cambios
      }
    } 
    
    else if (accion === 'editar_precio') {
      if (!productoObjetivo) {
        memoriaComandoRef.current.accionPendiente = 'editar_precio';
        hablarTexto("¿A qué producto le cambiamos el precio?");
      } else if (!nuevoPrecio) {
        memoriaComandoRef.current.accionPendiente = 'editar_precio';
        memoriaComandoRef.current.productoPendiente = productoObjetivo;
        hablarTexto(`¿Cuál será el nuevo precio para ${productoObjetivo.nombre}?`);
      } else {
        const formData = new FormData();
        formData.append('id', productoObjetivo.id);
        formData.append('nombre', productoObjetivo.nombre);
        formData.append('precio', nuevoPrecio);
        formData.append('categoria', productoObjetivo.categoria);
        formData.append('genero', productoObjetivo.genero);
        formData.append('tallas', productoObjetivo.tallas);
        formData.append('imagen_actual', productoObjetivo.imagen);

        await fetch('http://localhost/tienda_urban/backend/api/editar_producto.php', {
          method: 'POST',
          body: formData
        });

        hablarTexto(`Precio actualizado. ${productoObjetivo.nombre} ahora cuesta ${nuevoPrecio} soles.`);
        memoriaComandoRef.current = { accionPendiente: null, productoPendiente: null }; 
        fetchProductos();
        setTimeout(() => window.location.reload(), 2000); // Recarga para ver cambios
      }
    } 
  };

  // 4. MOTOR DE ESCUCHA CONTINUA
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true; 
    recognition.lang = 'es-ES';
    recognition.interimResults = false;

    const arrancarMicrofono = () => {
      if (isListeningRef.current) return;
      try {
        recognition.start();
        isListeningRef.current = true;
      } catch (e) {}
    };

    // Arranque silencioso en el primer clic
    const iniciarSistemaOculto = () => {
      if (!yaSaludoRef.current) {
        const unlockAudio = new SpeechSynthesisUtterance('');
        window.speechSynthesis.speak(unlockAudio);
        
        setTimeout(() => {
          hablarTexto("Bienvenido admin, ¿en qué puedo ayudarte?");
        }, 100);
        
        yaSaludoRef.current = true;
      }
      arrancarMicrofono();
      document.removeEventListener('click', iniciarSistemaOculto);
    };
    
    document.addEventListener('click', iniciarSistemaOculto);

    recognition.onresult = (event) => {
      const current = event.results.length - 1;
      const transcript = event.results[current][0].transcript;
      
      console.log("IA Escuchó:", transcript);

      // Enviamos TODO lo que escuche directamente al procesador.
      // El procesador ignorará el texto si no encuentra órdenes directas.
      procesarOrdenDirecta(transcript);
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') isListeningRef.current = false;
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      setTimeout(() => { arrancarMicrofono(); }, 300);
    };

    recognitionRef.current = recognition;

    return () => {
      document.removeEventListener('click', iniciarSistemaOculto);
      if (recognitionRef.current) {
        recognitionRef.current.onend = null; 
        recognitionRef.current.stop();
      }
    };
  }, []);

  return null; // 100% Invisible
}