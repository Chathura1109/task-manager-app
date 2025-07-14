import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import styles from '../styles/Login.module.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Welcome Back</h1>
          <p className={styles.authSubtitle}>Sign in to your account</p>
        </div>
        
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        
        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
          </div>
          
          <div className={styles.formGroup}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? (
              <span className={styles.loading}>Signing in</span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className={styles.authFooter}>
          Don't have an account? <Link to="/register">Create one here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;