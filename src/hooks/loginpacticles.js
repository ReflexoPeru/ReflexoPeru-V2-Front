// Implementación robusta de partículas que funciona en producción
export const initializeParticles = () => {
  // Verificar si ya existe particles.js
  if (window.particlesJS) {
    initParticlesConfig();
    return () => {}; // No cleanup needed if already loaded
  }

  // Intentar cargar desde múltiples fuentes (HTTPS primero)
  const cdnSources = [
    'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js',
    // Fallback a implementación CSS si falla
  ];

  let currentSourceIndex = 0;

  const loadScript = () => {
    if (currentSourceIndex >= cdnSources.length) {
      console.warn('⚠️ No se pudo cargar particles.js, usando fallback CSS');
      initCSSParticlesFallback();
      return;
    }

    const script = document.createElement('script');
    script.src = cdnSources[currentSourceIndex];
    script.async = true;
    script.crossOrigin = 'anonymous'; // Para CORS

    script.onload = () => {
      console.log('✅ Particles.js cargado exitosamente');
      initParticlesConfig();
    };

    script.onerror = () => {
      console.warn(`❌ Error cargando desde: ${cdnSources[currentSourceIndex]}`);
      document.body.removeChild(script);
      currentSourceIndex++;
      loadScript(); // Intentar siguiente fuente
    };

    // Timeout de seguridad
    setTimeout(() => {
      if (!window.particlesJS) {
        console.warn('⏰ Timeout cargando particles.js, usando fallback');
        script.onerror();
      }
    }, 5000);

    document.body.appendChild(script);
  };

  // Iniciar carga
  loadScript();

  return () => {
    // Cleanup más seguro
    try {
      const existingScript = document.querySelector('script[src*="particles"]');
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
      
      const particlesContainer = document.getElementById('particles-js');
      if (particlesContainer) {
        particlesContainer.innerHTML = '';
      }
    } catch (error) {
      console.warn('Error durante cleanup de particles:', error);
    }
  };
};

// Configuración de partículas
const initParticlesConfig = () => {
  if (!window.particlesJS) {
    console.error('❌ particlesJS no está disponible');
    return;
  }

  window.particlesJS('particles-js', {
    particles: {
      number: { 
        value: 8, // Reducido para mejor performance
        density: { enable: true, value_area: 1000 } 
      },
      color: { value: '#20362e' },
      shape: {
        type: 'circle',
        stroke: { width: 0, color: '#8aa967' },
        polygon: { nb_sides: 7 },
      },
      opacity: {
        value: 0.3,
        random: false,
        anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
      },
      size: {
        value: 160,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 40,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: '#ffffff',
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 3,
        direction: 'top',
        random: false,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: { enable: false, rotateX: 600, rotateY: 1200 },
      },
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: false, mode: 'repulse' },
        onclick: { enable: false, mode: 'push' },
        resize: true,
      },
      modes: {
        grab: { distance: 400, line_linked: { opacity: 1 } },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 3,
        },
        repulse: { distance: 200, duration: 0.4 },
        push: { particles_nb: 4 },
        remove: { particles_nb: 2 },
      },
    },
    retina_detect: true,
  });
};

// Fallback CSS para cuando no se puede cargar particles.js
const initCSSParticlesFallback = () => {
  const particlesContainer = document.getElementById('particles-js');
  if (!particlesContainer) return;

  // Crear burbujas CSS puras
  particlesContainer.innerHTML = '';
  particlesContainer.style.position = 'relative';
  particlesContainer.style.overflow = 'hidden';

  // Crear 6 burbujas animadas con CSS
  for (let i = 0; i < 6; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'css-particle';
    
    // Estilos inline para las burbujas
    const size = Math.random() * 100 + 50; // 50-150px
    const left = Math.random() * 100; // 0-100%
    const duration = Math.random() * 10 + 8; // 8-18s
    const delay = Math.random() * 5; // 0-5s

    bubble.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, rgba(32, 54, 46, 0.3) 0%, transparent 70%);
      border-radius: 50%;
      left: ${left}%;
      bottom: -150px;
      animation: floatUp ${duration}s ${delay}s infinite linear;
      pointer-events: none;
    `;

    particlesContainer.appendChild(bubble);
  }

  // Agregar keyframes si no existen
  if (!document.querySelector('#particles-keyframes')) {
    const style = document.createElement('style');
    style.id = 'particles-keyframes';
    style.textContent = `
      @keyframes floatUp {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 0.3;
        }
        10% {
          opacity: 0.6;
        }
        90% {
          opacity: 0.6;
        }
        100% {
          transform: translateY(-100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  console.log('✅ Fallback CSS particles iniciado');
};
