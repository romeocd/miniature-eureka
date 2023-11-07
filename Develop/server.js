const express = require('express');

const fs = require('fs');
const path = require('path');

const api = require ('./routes/index.js');

const PORT = process.env.port || 3001;

const app = express();

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

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);