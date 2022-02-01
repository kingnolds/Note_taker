const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const {readAndAppend, writeToFile, readFromFile } = require('./helpers/fsUtils');
const path = require('path')

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sets up the Express app to serve static files
app.use(express.static('public'))

app.get('/api/notes', (req, res) => {
    readFromFile('./db/db.json').then(function(data) {
        var notes = JSON.parse(data)
        console.log(notes)
        res.json(notes)
    }).catch(function(err) {console.log(err)})
})

app.post('/api/notes', (req, res) => {
    readAndAppend(req.body, './db/db.json')
    res.json({ok:true})
})

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);



// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, '/public/pages/404.html'))
// )

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
