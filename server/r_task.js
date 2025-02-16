const express = require('express'); 
const mongoose = require('mongoose'); 

const router = express.Router(); 
require('./db'); 
 

//create a task 
router.post('/', async (req, res) => { 
   try{  
    console.log("HI!") 
    // console,log("body =", req)
    const { name, description, completed } = req.body; 
    if (!description || !name) { 
        console.log("description =", description)
        // console,log("req =", req)
        console.log("req.body =", req.body)
        return res.status(400).json({ error: 'Description and name are required' }); 
      } 
 
    const taskCollection = mongoose.connection.db.collection("tasks"); 
 
    const task = { 
    name,
    description, 
    completed: completed || false,  
    }; 
    console.log("task:", task)
    const result = await taskCollection.insertOne(task); 
    console.log("result", result)
    res.status(201).json({ task, message: 'Task created successfully' }); 
  } catch (err) { 
    res.status(500).send({ error: 'Something went wrong',  details: err.message }); 
  } 
 
}); 
 
module.exports = router;

router.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await mongoose.connection.db.collection("tasks").deleteOne({ _id: mongoose.Types.ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong', details: err.message });
  }
});

module.exports = router;

router.get('/', async (req, res) => {
  try {
    const taskCollection = mongoose.connection.db.collection('tasks');
    const tasks = await taskCollection.find().toArray();

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong', details: err.message });
  }
});
module.exports = router;

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;  // The ID of the task to be deleted

    const taskCollection = mongoose.connection.db.collection('tasks');
    const result = await taskCollection.deleteOne({ _id: new mongoose.Types.ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong', details: err.message });
  }
});

router.patch('/:id/completed', async (req, res) => {
  try {
    const taskId = req.params.id;
    const { completed } = req.body; // Expecting a boolean value for "completed"

    const taskCollection = mongoose.connection.db.collection('tasks');

    // Correctly instantiate ObjectId with `new` keyword
    const result = await taskCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(taskId) }, // Fix here: use `new mongoose.Types.ObjectId()`
      { $set: { completed } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task updated successfully' });
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong', details: err.message });
  }
});


module.exports = router;