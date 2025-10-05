import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);

  // Charger les tâches au démarrage
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement des tâches');
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(API_URL, { title: newTask });
      setTasks([response.data, ...tasks]);
      setNewTask('');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout de la tâche');
    }
    setLoading(false);
  };

  const toggleTask = async (task) => {
    try {
      const response = await axios.put(`${API_URL}/${task.id}`, {
        completed: !task.completed
      });
      setTasks(tasks.map(t => t.id === task.id ? response.data : t));
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Supprimer cette tâche ?')) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>📝 Ma Todo App</h1>
        
        <form onSubmit={addTask} className="add-task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Nouvelle tâche..."
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? '⏳' : '➕ Ajouter'}
          </button>
        </form>

        <div className="stats">
          <span>Total: {tasks.length}</span>
          <span>Complétées: {tasks.filter(t => t.completed).length}</span>
          <span>En cours: {tasks.filter(t => !t.completed).length}</span>
        </div>

        <div className="tasks-list">
          {tasks.length === 0 ? (
            <p className="empty">Aucune tâche. Ajoutez-en une ! 🚀</p>
          ) : (
            tasks.map(task => (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task)}
                />
                <span className="task-title">{task.title}</span>
                <button 
                  className="delete-btn"
                  onClick={() => deleteTask(task.id)}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;