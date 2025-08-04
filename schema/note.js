// utilities
const mongoose = require("mongoose");

// create a schema | structure for note Collection!
let noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {        // auto add current-date when note is created!
        type: Date,
        default: Date.now
    },
    starred: {
    type: Boolean,
    default: false
  }
});

// create a model via Schema
const Note = mongoose.model('Note', noteSchema);

// export the schema?
module.exports = Note;