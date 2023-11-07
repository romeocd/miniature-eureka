const express = require('express');

const fs = require('fs');
const path = require('path');

const api = require ('./routes/index.js');

const PORT = process.env.port || 3001;

const app = express();

//npm package for generating unique ID
const { v4: uuidv4} = require('uuid')

//Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api', api);

//GET route for notes.html 
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
    );

//GET route for index.html
app.get('*', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
    );

//GET /api/notes route
app.get('api/notes', (req, res) => {
    //read db.json file
    fs.readFile('db.json', 'utf8', (err, data) =>{
        if (err) {
            //Error
            res.status(500).json({ error: 'Unable to read the notes'});
        } else {
            try {
                //Parse the JSON data from the file
                const notes = JSON.parse(data);
                //Respond with notes as the JSON
                res.json(notes);
            } catch (error) {
                //error for JSON parse
            }
        }
    });
});

//POST /api/notes route to add new notes
app.post('api/notes', (req,res) => {
    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) {
            //Potential errors
            res.status(500).json({ error: 'Unable to read the notes'})
        } else {
            try {
                //Parse existing notes as JSON
                const notes = JSON.parse(data);

                //create unique ID for each new notes
                const newNote = {
                    id: uuidv4(),
                    
                };
                //add the new note to the existing notes
                notes.push(newNote);

                // Write the updated notes back to the db.json file
                fs.writeFile('db.json', JSON.stringify(notes), (err) => {
                    if (err) {
                      // Handle any file writing errors
                      res.status(500).json({ error: 'Unable to save the note' });
                    } else {
                      // Respond with the newly created note
                      res.json(newNote);
                    }
                  });
                } catch (error) {
                  // Handle any JSON parsing errors
                  res.status(500).json({ error: 'Error parsing notes' });
            }
        }
    });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);