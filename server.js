// utlities
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Note = require("./schema/note");

// instantiate express to for new app!
let app = express();

// middleware*
app.use(express.static("public"));      //. accessible on server!
app.use(cors());    // allow access to urls `public`
app.use(express.json());    //. automatic parsing of WHEN client's sent-data {JSON -> OBJ} && {OBJ -> JSON}
app.use(express.urlencoded())   //. get the client's sent-data [form-data only**]


// **check
/*
let note = new Note({"title": "New title", "content": "New content 💡"});
if (note.save()) {
    console.log("A new note just added");
} else {
    console.log("Something went wrong!");
}
*/

// Communicate with MongoDB System [locally]**
async function connectToDB(db) {
    // try-catch?
    // to safely handle connection!
    try{
        // connect?
        await mongoose.connect(`mongodb://127.0.0.1:27017/${db}`);      //. wait till interaction's done!
        // log**
        console.log(`Connected to ${db}! ✅`);
    }
    // handle run-time errors
    catch(error) {
        console.error(`Can't connect.. ❌\nERROR: ${error}`);
    }
}

// invoke()
connectToDB("notesdb");

// `get()` request!
// route - '/' -> home
app.get('/', function(request, response) {

    // send the static content to client!
    response.sendFile(__dirname + 'public/index.html');
    
});


// API - route - '/all-notes'
app.get('/all-notes', async function(request, response){
    // try safely
    try{
        //. try to get all the data?
        let allNotes = await Note.find();

        // send response as json!
        response.json(allNotes);

        // log**
        console.log(allNotes);
    }
    // handle run-time issues
    catch(error) {
        // log**
        console.log(`ERROR: ${error}`);
    }
});


// API - route - '/note/:id/'
app.get('/note/:id', async function(request, response){
    // try safely
    try{
        // fetch the id from url?
        let _id = request.params.id;

        //. try fetching the data of current Note?
        let note = await Note.findById(_id);

        // log**
        console.log(note);

        // send response as json!
        response.json({
            "status": "success",
            "data": note
        });
    }
    // handle run-time issues
    catch(error) {
        // log**
        console.log(`ERROR: ${error}`);
    }
});


// API - route - '/new-note/'
app.post('/new-note', async function(request, response){
    // try safely
    try{
        //. get the client-data
        let { title, content } = request.body;

        // add to DB!
        let newNote = new Note({
            "title": title,
            "content": content
        })

        // try to save?
        let saved = await newNote.save();

        // log**
        console.log(newNote);

        // send the response accordingly!
        response.json({
            "status": "added ✨",
            "data": `${title} was recently added..`
        });
    }
    // handle run-time issues
    catch(error) {
        // log**
        console.log(`ERROR: ${error}`);
    }
});

// API - route - '/edit-note/:id/'
app.patch('/edit-note/:id', async function(request, response){

    //. try safely!
    try{

        // fetch the id from url?
        let _id = request.params.id;
        let noteToUpdate = request.body;

        // try updating the existing data?
        let updated = await Note.findByIdAndUpdate(
            _id,
            noteToUpdate,
            {"new": true}   // show the recently updated data?
        );

        // log**
        console.log(updated);

        // send the response to client?
        if(updated) {
            response.json({
                "status": "updated!",
                "data": updated
            });
        }
        // otherwise,
        else{
            response.status(404).json({
                "status": "failed",
                "data": `OOPS! Note of Object-Id(_id): ${_id} doesn't exist...`
            });
        }
    }
    // handle run-time issues
    catch(error) {
        console.log(`ERROR: ${error}`);
    }
});

// API - route '/toggle-star/:id/'
app.patch('/toggle-star/:id', async (req, res) => {

 // try-safely
  try {
    // fetch the appropriate note
    const note = await Note.findById(req.params.id);

    // when note isn't found with object id
    if (!note) {
            return response.status(404).json({
                "status": "failed",
                "data": `OOPS! Note of Object-Id(_id): ${_id} doesn't exist..`
            });
    };

    // update it's status
    note.starred = !note.starred;

    // save the node
    await note.save();

    // send the note to client
    res.json(note);
  } 
  
  // handle run-time errors
  catch (err) {
    res.status(500).send("Server Error");
  }
});

// API - route '/delete-note/:id/'
app.delete('/delete-note/:id', async function(request, response){
    //. try-safely
    try{

        // fetch the _id from url?
        let _id = request.params.id;

        // try to delete?
        let deleted = await Note.findByIdAndDelete(_id);

        // send the response to client?
        if(deleted) {
            response.json({
                "status": "deleted!",
                "data": `deleted the Note of Object-Id(_id): ${_id}`
            });
        }
        // otherwise
        else {
            response.status(404).json({
                "status": "failed",
                "data": `OOPS! Note of Object-Id(_id): ${_id} doesn't exist..`
            });
        }
    }
    // handle run-time errors
    catch(error) {
        // log**
        console.log(error);
    }
});

// run the app!
app.listen(1111, function(error){
    if (error) console.log(error);      //. when error!
    console.log("SUCCESSFUL START!✅\nAPP IS LIVE AT - http://localhost:1111");
});
