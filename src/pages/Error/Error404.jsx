import React, { useEffect } from 'react';
import { Button } from 'antd';
import styles from './Error404.module.css';
import imgerror from '../../assets/Img/imgerror.png';
import { initializeParticles } from '../../features/auth/hook/loginpacticles';

const Error = () => {
  useEffect(() => {
    const cleanup = initializeParticles();

    return cleanup;
  }, []);

  return (
    <div className={styles.errorBg}>
      {/* Contenedor para las partículas */}
      <div id="particles-js" className={styles.particlesJs}></div>

      <div className={styles.errorContent}>
        <img
          src={imgerror}
          alt="Error"
          className={styles.errorImage}
          style={{ width: '320px', maxWidth: '90%' }}
        />
        <h1 className={styles.title}>404</h1>
        <p className={styles.subtitle}>
          No pudimos encontrar la página que buscas.
          <br />
          Quizá fue eliminada, movida o nunca existió.
        </p>
        <Button className={styles.homeButton} size="large">
          Volver al inicio
        </Button>
      </div>
    </div>
  );
};

export default Error;
