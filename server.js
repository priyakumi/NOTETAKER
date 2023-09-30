// required modules
const express = require("express");
const fs = require("fs");

//path  module
const path = require("path");

//unique id module
const uniqid = require("uniqid"); 

// express object
const app = express();

// defines the port the application uses
const PORT = process.env.PORT || 3001;


// middlware for parsing the data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// middleware for static folder 
app.use(express.static(__dirname + "/public"));

//api routes

// api get call for get the notes from db.json file
app.get("/api/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});

//api post call for store the notes from db.json file
app.post("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    const parsedDb = JSON.parse(data);
    const newNote = {
      title: req.body.title,
      text: req.body.text,
      id: uniqid("note-"),// adding the new id for the new note(using this id we can edit and delete the note)
    };
    parsedDb.push(newNote);
    const newDB = JSON.stringify(parsedDb);
    fs.writeFile("./db/db.json", newDB, (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
    res.send("your note has been saved");
  });
});

// api call for delete a note for db.json using the  note id.
app.delete("/api/notes/:id", (req, res) => {
  const noteID = req.params.id;
  fs.readFile("./db/db.json", "utf8", (err, data) => {
  
    if (err) throw err;
    const parsedDb = JSON.parse(data);
    const newData = parsedDb.filter((note) => note.id !== noteID);
    const newDB = JSON.stringify(newData);
    
    fs.writeFile("./db/db.json", newDB, (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
    res.send("your note has been deleted");
  });
});


//html page routes

// note page route
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// index page route
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// port listner
app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
  });