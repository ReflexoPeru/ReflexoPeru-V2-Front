import { useEffect, useState } from 'react';

/**
 * Hook para manejar animaciones de página
 * @param {string} animationType - Tipo de animación ('fade', 'slide', 'zoom', 'bounce')
 * @param {number} delay - Retraso en ms antes de mostrar la animación
 * @returns {Object} - Estado de la animación y función para activarla
 */
export const usePageAnimation = (animationType = 'fade', delay = 0) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setAnimationClass(`animate-${animationType}-in`);
    }, delay);

    return () => clearTimeout(timer);
  }, [animationType, delay]);

  const triggerAnimation = (type) => {
    setIsVisible(false);
    setTimeout(() => {
      setAnimationClass(`animate-${type}-in`);
      setIsVisible(true);
    }, 100);
  };

  return {
    isVisible,
    animationClass,
    triggerAnimation
  };
};

/**
 * Hook para animaciones de entrada escalonadas (staggered)
 * @param {number} itemCount - Número de elementos a animar
 * @param {number} staggerDelay - Retraso entre cada elemento en ms
 * @returns {Array} - Array de estados de animación para cada elemento
 */
export const useStaggeredAnimation = (itemCount, staggerDelay = 100) => {
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    const timers = [];
    
    for (let i = 0; i < itemCount; i++) {
      const timer = setTimeout(() => {
        setVisibleItems(prev => [...prev, i]);
      }, i * staggerDelay);
      
      timers.push(timer);
    }

    return () => timers.forEach(clearTimeout);
  }, [itemCount, staggerDelay]);

  return visibleItems;
};

/**
 * Hook para animaciones de scroll (intersection observer)
 * @param {Object} options - Opciones del IntersectionObserver
 * @returns {Object} - Referencia y estado de visibilidad
 */
export const useScrollAnimation = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        ...options
      }
    );

    observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [ref, options]);

  return [setRef, isVisible];
};

/**
 * Hook para animaciones de contador
 * @param {number} end - Valor final del contador
 * @param {number} duration - Duración de la animación en ms
 * @param {boolean} startAnimation - Si debe empezar la animación
 * @returns {number} - Valor actual del contador
 */
export const useCounterAnimation = (end, duration = 2000, startAnimation = true) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Función de easing (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(end * easeOut);
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, startAnimation]);

  return count;
};

/**
 * Hook para animaciones de typing (máquina de escribir)
 * @param {string} text - Texto a escribir
 * @param {number} speed - Velocidad de escritura en ms
 * @param {boolean} startAnimation - Si debe empezar la animación
 * @returns {string} - Texto actual
 */
export const useTypingAnimation = (text, speed = 100, startAnimation = true) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!startAnimation || !text) return;

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed, startAnimation]);

  useEffect(() => {
    if (startAnimation) {
      setDisplayText('');
      setCurrentIndex(0);
    }
  }, [text, startAnimation]);

  return displayText;
};

export default usePageAnimation;
