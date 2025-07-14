import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tasksAPI } from '../services/api';
import TaskForm from '../components/Tasks/TaskForm';
import styles from '../styles/Dashboard.module.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getTasks();
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await tasksAPI.createTask(taskData);
      setTasks([response.data, ...tasks]);
      setShowTaskForm(false);
      setError('');
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      const response = await tasksAPI.updateTask(id, taskData);
      setTasks(tasks.map(task => task._id === id ? response.data : task));
      setEditingTask(null);
      setError('');
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.deleteTask(id);
        setTasks(tasks.filter(task => task._id !== id));
        setError('');
      } catch (err) {
        setError('Failed to delete task');
        console.error(err);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const task = tasks.find(t => t._id === id);
      const response = await tasksAPI.updateTask(id, { ...task, status: newStatus });
      setTasks(tasks.map(t => t._id === id ? response.data : t));
    } catch (err) {
      setError('Failed to update task status');
      console.error(err);
    }
  };

  const getFilteredTasks = () => {
    switch (activeFilter) {
      case 'pending':
        return tasks.filter(task => task.status === 'pending');
      case 'in-progress':
        return tasks.filter(task => task.status === 'in-progress');
      case 'completed':
        return tasks.filter(task => task.status === 'completed');
      default:
        return tasks;
    }
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const overdue = tasks.filter(task => {
      if (!task.dueDate) return false;
      const today = new Date();
      const due = new Date(task.dueDate);
      return due < today && task.status !== 'completed';
    }).length;

    return { total, completed, pending, inProgress, overdue };
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const isOverdue = date < today;
    
    const options = { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined 
    };
    
    return {
      formatted: date.toLocaleDateString('en-US', options),
      isOverdue
    };
  };

  const stats = getTaskStats();
  const filteredTasks = getFilteredTasks();
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1>Welcome back, {user?.name}!</h1>
          <p>Here's what's happening with your tasks today</p>
        </div>
        <div className={styles.userActions}>
          <button 
            className={styles.logoutButton}
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Total Tasks</span>
            <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className={styles.statNumber}>{stats.total}</p>
          <p className={styles.statDescription}>All your tasks</p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Completed</span>
            <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className={styles.statNumber}>{stats.completed}</p>
          <p className={styles.statDescription}>{completionRate}% completion rate</p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>In Progress</span>
            <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className={styles.statNumber}>{stats.inProgress}</p>
          <p className={styles.statDescription}>Currently working on</p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Overdue</span>
            <svg className={styles.statIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className={styles.statNumber}>{stats.overdue}</p>
          <p className={styles.statDescription}>Need attention</p>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Tasks Section */}
        <div className={styles.tasksSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Your Tasks</h2>
            <button 
              className={styles.addTaskButton}
              onClick={() => setShowTaskForm(true)}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
          </div>

          {/* Filter Tabs */}
          <div className={styles.filterTabs}>
            <button 
              className={`${styles.filterTab} ${activeFilter === 'all' ? styles.active : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All ({tasks.length})
            </button>
            <button 
              className={`${styles.filterTab} ${activeFilter === 'pending' ? styles.active : ''}`}
              onClick={() => setActiveFilter('pending')}
            >
              Pending ({stats.pending})
            </button>
            <button 
              className={`${styles.filterTab} ${activeFilter === 'in-progress' ? styles.active : ''}`}
              onClick={() => setActiveFilter('in-progress')}
            >
              In Progress ({stats.inProgress})
            </button>
            <button 
              className={`${styles.filterTab} ${activeFilter === 'completed' ? styles.active : ''}`}
              onClick={() => setActiveFilter('completed')}
            >
              Completed ({stats.completed})
            </button>
          </div>

          {/* Tasks List */}
          <div className={styles.tasksList}>
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <span style={{ marginLeft: '10px' }}>Loading tasks...</span>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>No tasks found</h3>
                <p>
                  {activeFilter === 'all' 
                    ? "You don't have any tasks yet. Create your first task to get started!"
                    : `No ${activeFilter.replace('-', ' ')} tasks at the moment.`
                  }
                </p>
                {activeFilter === 'all' && (
                  <button 
                    className={styles.addTaskButton}
                    onClick={() => setShowTaskForm(true)}
                  >
                    Create Your First Task
                  </button>
                )}
              </div>
            ) : (
              filteredTasks.map(task => {
                const dueDateInfo = formatDate(task.dueDate);
                return (
                  <div 
                    key={task._id} 
                    className={`${styles.taskItem} ${task.status === 'completed' ? styles.completed : ''}`}
                  >
                    <div className={styles.taskHeader}>
                      <h3 className={`${styles.taskTitle} ${task.status === 'completed' ? styles.completed : ''}`}>
                        {task.title}
                      </h3>
                      <div className={styles.taskActions}>
                        <select 
                          value={task.status} 
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          className={styles.statusSelect}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button 
                          className={`${styles.actionButton} ${styles.edit}`}
                          onClick={() => setEditingTask(task)}
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          className={`${styles.actionButton} ${styles.delete}`}
                          onClick={() => handleDeleteTask(task._id)}
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className={styles.taskDescription}>
                        {task.description}
                      </p>
                    )}
                    
                    <div className={styles.taskMeta}>
                      <span className={`${styles.priorityBadge} ${styles[`priority-${task.priority}`]}`}>
                        {task.priority}
                      </span>
                      <span className={`${styles.statusBadge} ${styles[`status-${task.status}`]}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                      {task.dueDate && (
                        <span className={`${styles.dueDate} ${dueDateInfo.isOverdue ? styles.overdue : ''}`}>
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {dueDateInfo.formatted}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.quickStats}>
            <h3>Progress Overview</h3>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Overall Progress</span>
                <span>{completionRate}%</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <p><strong>Pending:</strong> {stats.pending}</p>
              <p><strong>In Progress:</strong> {stats.inProgress}</p>
              <p><strong>Completed:</strong> {stats.completed}</p>
              {stats.overdue > 0 && (
                <p style={{ color: '#dc2626' }}><strong>Overdue:</strong> {stats.overdue}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      {(showTaskForm || editingTask) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <TaskForm
              task={editingTask}
              onSubmit={editingTask ? 
                (data) => handleUpdateTask(editingTask._id, data) : 
                handleCreateTask
              }
              onCancel={() => {
                setShowTaskForm(false);
                setEditingTask(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;