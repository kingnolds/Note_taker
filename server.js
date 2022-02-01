const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const {readAndAppend, writeToFile, readFromFile } = require('./helpers/fsUtils');
const path = require('path')
const { v4: uuidv4 } = require('uuid');

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sets up the Express app to serve static files
app.use(express.static('public'))

// get routes for notes
app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then(function(data) {
        var notes = JSON.parse(data)
        res.json(notes)
    }).catch(function(err) {
        console.log(err)
        res.json(err)
    })
})

// post route for adding notes
app.post('/api/notes', (req, res) => {
    req.body["id"]= uuidv4()
    readAndAppend(req.body, './db/db.json')
    res.json({ok:true})
})

// Delete route for removing notes
app.delete('/api/notes/:id', (req, res) => {
    readFromFile('./db/db.json').then((data) => {
        const notes = JSON.parse(data)
        const id = req.params.id
        const newData = notes.filter(note => note.id !== id)
        writeToFile('./db/db.json', newData)
        res.json(newData)
    }).catch(function(err) {
        console.log(err)
        res.json(err)
    })
})

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
