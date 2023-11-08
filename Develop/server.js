const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;

const app = express();

// npm package for generating unique ID
const { v4: uuidv4 } = require('uuid');

const db = require('./db/db.json')

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.static('public'));




// GET /api/notes route
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        ///error logging
        if (err) throw err;
        let dbData = JSON.parse(data);
        //Returns new database
        res.json(dbData)
    });   
})

// POST /api/notes route to add new notes
app.post('/api/notes', (req, res) => {
  //grabs notes from body of request
  const newNote = req.body
  
  //gives each note a random ID
  newNote.id = uuidv4()

  //adds the note object to the array
  db.push(newNote)

  //update the json file with the new object
  fs.writeFileSync('./db/db.json', JSON.stringify(db));

  //responds with the note object used
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const newDb = db.filter((note) =>
      note.id !== req.params.id)

  // update the db.json file to reflect the modified notes array
  fs.writeFileSync('./db/db.json', JSON.stringify(newDb))

  // send that removed note object back to user
  readFile.json(newDb)
})

// GET route for notes.html
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET route for index.html
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
