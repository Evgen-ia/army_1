import React, { useState } from 'react';
import axios from 'axios';

const TaskForm = () => {
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/tasks', {
        description,
        completed,
      });

      setMessage(`Task created successfully: ${response.data.task.description}`);
      setDescription(''); // Reset the form
      setCompleted(false);
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.error || 'Something went wrong'}`);
    }
  };

  return (
    <div>
      <h2>Create a New Task</h2>
      <form onSubmit={handleSubmit}>
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
    </div>
  );
};

export default TaskForm;
