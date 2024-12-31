const express = require('express'); 
const mongoose = require('mongoose'); 

const router = express.Router(); 
require('./db'); 
 

//create a task 
router.post('/', async (req, res) => { 
   try{ 
    console.log("Received request body:", req.body); 
    console.log("HI!") 
    // console,log("body =", req)
    const { description, completed } = req.body; 
    if (!description) { 
        console.log("description =", description)
        // console,log("req =", req)
        console.log("req.body =", req.body)
        return res.status(400).json({ error: 'Description is required' }); 
      } 
 
    const taskCollection = mongoose.connection.db.collection("tasks"); 
 
    const task = { 
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
    const { id } = req.params; // Get the task ID from the URL parameter
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