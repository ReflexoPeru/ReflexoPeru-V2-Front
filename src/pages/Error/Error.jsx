import React from 'react';
import { Button } from 'antd';
import styles from './Error.module.css';
import imgerror from '../../assets/Img/imgerror.png';

const Error = () => {
  return (
    <div className={styles.errorBg}>
      <div className={styles.errorContent}>
        <img src={imgerror} alt="Error 404" className={styles.errorImage} />
        <h1 className={styles.title}>404</h1>
        <p className={styles.subtitle}>No pudimos encontrar la página que buscas.<br/>Quizá fue eliminada, movida o nunca existió.</p>
        <Button className={styles.homeButton} size="large">Volver al inicio</Button>
      </div>
    </div>
  );
};

export default Error;
