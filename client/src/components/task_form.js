import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState('');
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  // Fetch all tasks from the backend on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/tasks');
        setTasks(response.data);
      } catch (err) {
        setError('Error fetching tasks');
      }
    };
    fetchTasks();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/tasks', {
        name,
        description,
        completed,
      });

      setMessage(`Task created successfully: ${response.data.task.name}`);
      setName(''); // Reset the form
      setDescription('');
      setCompleted(false);

      // Add the new task to the list (without fetching again)
      setTasks((prevTasks) => [...prevTasks, response.data.task]);
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.error || 'Something went wrong'}`);
    }
  };

  const [expandedTask, setExpandedTask] = useState(null);

  const handleTaskClick = (taskId) => {
    if (expandedTask === taskId) {
      setExpandedTask(null); // Collapse if clicked again
    } else {
      setExpandedTask(taskId); // Expand the clicked task
    }
  };

  return (
    <div>
      <h2>Create a New Task</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            Completed
          </label>
        </div>
        <button type="submit">Add Task</button>
      </form>
      {message && <p>{message}</p>}

      <h2>Task List</h2>
      {error && <p>{error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task._id} onClick={() => handleTaskClick(task._id)}>
            <strong>{task.name}</strong>
            {expandedTask === task._id && (
              <div style={{ marginLeft: '20px', marginTop: '10px' }}>
                <p>{task.description}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskForm;
