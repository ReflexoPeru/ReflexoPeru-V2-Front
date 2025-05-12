import React from 'react';
import styles from './Toastify.module.css';

const ToastButton = ({ type, onClick }) => {
  return (
    <button
      className={styles.btn}
      onClick={onClick}
      aria-label={`Show ${type} notification`}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </button>
  );
};

export default ToastButton;
