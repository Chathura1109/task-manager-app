import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import styles from '../styles/Register.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', className: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const strengthLevels = [
      { text: 'Very Weak', className: styles.strengthWeak },
      { text: 'Weak', className: styles.strengthWeak },
      { text: 'Fair', className: styles.strengthMedium },
      { text: 'Good', className: styles.strengthStrong },
      { text: 'Strong', className: styles.strengthVeryStrong }
    ];
    
    return strengthLevels[strength] || strengthLevels[0];
  };

  const passwordStrength = getPasswordStrength(formData.password);

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

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Create Account</h1>
          <p className={styles.authSubtitle}>Join us today and get started</p>
        </div>
        
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        
        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
          </div>
          
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
            {formData.password && (
              <div className={styles.passwordStrength}>
                <div className={styles.strengthBar}>
                  <div className={`${styles.strengthFill} ${passwordStrength.className}`}></div>
                </div>
                <span>Password strength: {passwordStrength.text}</span>
              </div>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`${styles.formInput} ${
                formData.confirmPassword && formData.password 
                  ? (formData.password === formData.confirmPassword ? styles.valid : styles.invalid)
                  : ''
              }`}
            />
            {formData.confirmPassword && formData.password && (
              <div className={`${styles.validationMessage} ${
                formData.password === formData.confirmPassword ? styles.success : ''
              }`}>
                {formData.password === formData.confirmPassword 
                  ? 'Passwords match' 
                  : 'Passwords do not match'}
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? (
              <span className={styles.loading}>Creating account</span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        
        <div className={styles.authFooter}>
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
