//. initialize the Angular JS Application
const notesApp = angular.module("notesApp", []);

// controller to interact with view and model!
const notesController = notesApp.controller("notesController", function($scope, $http){

    // model-data*
    $scope.status = ""; // ignore-this*
    
    // track click status*
    $scope._fetchNoteTriggered = false;     //. intial*
    $scope._newNoteTriggered = false;     //. intial*
    $scope._onAction = false;   //. intial*

    // handle the notes-data in ArrayOfObject?
    $scope.data = [];
    $scope.noteData = {};
    $scope.dataToUpdate = {};

    // () -> fetchAllNotes -
    $scope.fetchAllNotes = function() {
        // try safely!
        try{
            // try getting data?
            $http.get('/all-notes').then(function(response){
                // log**check
                console.log(response);

                // add to data?
                $scope.data = response.data;
            });
        }
        // handle run-time errors
        catch(error) {
            console.error(error);
        }
    }

    // ()! render the notes-data...
    $scope.fetchAllNotes();

    //. () -> newNote
    $scope.newNote = function() {

        //. clear data?
        $scope.noteData = {
            title: "",
            content: "",
        };

        // update status
        $scope._newNoteTriggered = true;

        // log** check
        console.log($scope.noteData);
    }

    // () -> saveNewNote
    $scope.saveNewNote = function() {

        // log** test
        console.log($scope.noteData);

        // try-safely
        try{
            // try adding new-note?
            $http.post('/new-note', $scope.noteData).then(function(response){

                // log** check
                console.log(response);

                // re-render all notes?
                $scope.fetchAllNotes();

                // update state
                $scope._newNoteTriggered = false;
            });
        }
        // handle run-time issues
        catch(error){
            //*show error
            console.log(error);
        }
    }

    //. () -> fetchNote
    $scope.fetchNote = function(_id) {

        // update the state*
        $scope._fetchNoteTriggered = true;

        // try safely!
        try{
            // try getting data of current-note?
            $http.get(`/note/${_id}`).then(function(response){
                // log**check
                console.log(response);

                // add to data?
                $scope.noteData = response.data.data;
            
            });
        }
        // handle run-time errors
        catch(error) {
            console.error(error);
        }

        // log** text
        console.log(_id);
    }

    //. () -> removeNote
    $scope.removeNote = function(_id) {

        // update the state!
        $scope._onAction = true;


        // try safely!
        try{
            // try sending the data-to-update and getting app. response?
            $http.delete(`/delete-note/${_id}`).then(function(response){
                // log**check
                console.log(response.data);
                
                // re-render the notes?
                $scope.fetchAllNotes();
            });
        }
        // handle run-time errors
        catch(error) {
            console.error(error);
        }

        // log** text
        console.log(_id);
    }

    //. () -> updateNote
    $scope.updateNote = function(_id) {
        // update the state!
        $scope._onAction = true;

        // wrap the updated-data!
        $scope.dataToUpdate = {
            title: $scope.noteData.title, 
            content: $scope.noteData.content
        };

        // try safely!
        try{
            // try sending the data-to-update and getting app. response?
            $http.patch(`/edit-note/${_id}`, $scope.dataToUpdate).then(function(response){
                // log**check
                console.log(response.data);

                // show status**
                $scope.status = response.data.status;

                // re-render the notes?
                $scope.fetchAllNotes();
            });
        }
        // handle run-time errors
        catch(error) {
            console.error(error);
        }

        // log** text
        // console.log(_id, $scope.dataToUpdate);
    }

    // () -> toggle favorite/ starred
    $scope.toggleStarred = function(_id) {
        
        // check** log
        // console.log(_id);

        // make a request
        $http.patch(`/toggle-star/${_id}`).then((response) => console.log(response));

        // render the ui!
        $scope.fetchAllNotes();
    }
});