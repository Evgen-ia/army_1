const express = require('express'); 
const mongoose = require('mongoose'); 
 
const router = express.Router(); 
require('./db'); 
 
 
//create a task 
router.get('/', async (req, res) => { 
   try{ 
    console.log("HI!") 
    const { description, completed } = req.params; 
    if (!description) { 
        return res.status(400).json({ error: 'Description is required' }); 
      } 
 
    const taskCollection = mongoose.connection.db.collection('everything'); 
 
    const task = { 
    description, 
    completed: completed || false,  
    }; 
    const result = await taskCollection.insertOne(task); 
 
    res.status(201).json({ task, message: 'Task created successfully' }); 
  } catch (err) { 
    res.status(500).send({ error: 'Something went wrong',  details: err.message }); 
  } 
 
}); 
 
module.exports = router;