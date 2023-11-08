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

// GET route for notes.html
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);



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
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
    } else {

        var paresdNotes = JSON.parse(data);
        const { noteID } =  req.params;
        const noteIndex = paresdNotes.findIndex(p => p.noteID == noteID);
        paresdNotes.splice(noteIndex, 1);     

        obj = JSON.stringify(paresdNotes, null, 4);
                        
            fs.writeFile(
                './db/db.json',
                obj,
                (writeErr) =>
                    writeErr
                        ? console.error(err)
                        : console.log(
                            `Note has been REMOVED from JSON file`
                        ))

    }})

    const newNote = require('./db/notes');

    res.json(newNote);
});

// GET route for index.html
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
