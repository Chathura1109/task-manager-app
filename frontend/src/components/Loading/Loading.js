import React from 'react';
import styles from './Loading.module.css';

const Loading = ({ 
  message = "Loading...", 
  size = "medium", 
  fullScreen = false 
}) => {
  const containerClass = fullScreen ? styles.fullScreen : styles.container;
  const spinnerClass = `${styles.spinner} ${styles[size]}`;

  return (
    <div className={containerClass}>
      <div className={spinnerClass}></div>
      <span className={styles.message}>{message}</span>
    </div>
  );
};

export default Loading;