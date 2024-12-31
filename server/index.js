const express = require('express'); 
const app = express(); 
const bodyParser = require('body-parser'); 
const cors = require('cors'); 
 
require('dotenv').config(); 
require('./db'); 
const  r_task = require('./r_task'); 
const PORT = 8000 
 
console.log('Starting Task Manager API...'); 
// app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

console.log() 
app.use('/tasks', r_task); 
 
app.get('/', (req, res) => { 
    res.json({ 
        message: 'Task Manager API is working!' 
    }) 
}); 
 
app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}.`); 
});