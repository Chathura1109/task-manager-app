import React, { useState, useEffect } from 'react';
import styles from '../../styles/TaskForm.module.css';

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      });
    }
  }, [task]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        dueDate: formData.dueDate || null
      };
      
      await onSubmit(submitData);
      
      // Reset form if creating new task
      if (!task) {
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          status: 'pending',
          dueDate: ''
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: 'Failed to save task. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  return (
    <form className={styles.taskForm} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>
          {task ? 'Edit Task' : 'Create New Task'}
        </h2>
        <button 
          type="button" 
          className={styles.closeButton}
          onClick={onCancel}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {errors.submit && (
        <div className={styles.errorMessage}>
          {errors.submit}
        </div>
      )}

      <div className={styles.formBody}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            Task Title <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className={`${styles.input} ${errors.title ? styles.error : ''}`}
            placeholder="Enter task title..."
            maxLength={100}
            autoFocus
          />
          {errors.title && (
            <span className={styles.errorText}>{errors.title}</span>
          )}
          <div className={styles.charCount}>
            {formData.title.length}/100
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`${styles.textarea} ${errors.description ? styles.error : ''}`}
            placeholder="Add task description (optional)..."
            rows={4}
            maxLength={500}
          />
          {errors.description && (
            <span className={styles.errorText}>{errors.description}</span>
          )}
          <div className={styles.charCount}>
            {formData.description.length}/500
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="priority" className={styles.label}>
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status" className={styles.label}>
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="dueDate" className={styles.label}>
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className={`${styles.input} ${errors.dueDate ? styles.error : ''}`}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.dueDate && (
            <span className={styles.errorText}>{errors.dueDate}</span>
          )}
        </div>
      </div>

      <div className={styles.formFooter}>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className={styles.spinner}></div>
              {task ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {task ? 'Update Task' : 'Create Task'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;