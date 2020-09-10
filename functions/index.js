const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://up-in-the-air-effe3.firebaseio.com"
});

const express = require('express');
const app = express();
const db = admin.firestore();

const cors = require('cors');
app.use( cors({origin:true}));


/*
*WORK WISH USERS
*/

//Create new user
app.post('/api/create_user', (req, res) =>
{
    (async () => {
        try{
            await db.collection('users').doc(req.body.id)
            .create({
                id: req.body.id,
                username: req.body.username,
                password: req.body.password
            })

            return res.status(200).send();
        }
        catch(error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

//Read a specific user based on ID
//Get
app.get('/api/users/:id', (req, res) =>
{
    (async () => {
        try{
            const document = db.collection('users').doc(req.params.id)
            let user = await document.get()
            let response = user.data()
            return res.status(200).send(response);
        }
        catch(error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

//Read all users
//Get
app.get('/api/users', (req, res) =>
{
    (async () => {
        try{
            let quart = db.collection('users')
            let response = []

            await quart.get().then(querySnapshot => {
                let docs = querySnapshot.docs; //the result of the query

                for (let doc of docs){
                    const selecteItem = {
                        id: doc.id,
                        username: doc.data().username,
                        // password: doc.data().password
                    }
                    response.push(selecteItem)
                }
                return response //each then should return a value
            })

            return res.status(200).send(response)
        }
        catch(error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

//Update user
//Put
app.put('/api/update_user/:id', (req, res) =>
{
    (async () => {
        try{
            const document = db.collection('users').doc(req.params.id)

            await document.update({
                username: req.body.username,
                password: req.body.password
            })

            return res.status(200).send();
        }
        catch(error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

//Delete user
//Delete
app.delete('/api/delete_user/:id', (req, res) =>
{
    (async () => {
        try{
            const document = db.collection('users').doc(req.params.id)
            await document.delete()
            return res.status(200).send();
        }
        catch(error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

/*
*WORK WISH WISHES
*/


//Routest
app.get('/test', (req, res) =>
{
    return res.status(200).send('TEST')
});

//Create new wish
//Post
app.post('/api/create_wish', (req, res) =>
{
    (async () => {
        try{
            // await db.collection('wishes').doc('/' + req.body.id + '/')
            await db.collection('wishes').doc()
            .create({
                name: req.body.name,
                description: req.body.description
            })

            return res.status(200).send();
        }
        catch(error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

//Read a specific wish based on ID
//Get
app.get('/api/wishes/:id', (req, res) =>
{
    (async () => {
        try{
            const document = db.collection('wishes').doc(req.params.id)
            let wish = await document.get()
            let response = wish.data()

            return res.status(200).send(response);
        }
        catch(error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

//Read all wishes
//Get
app.get('/api/wishes', (req, res) =>
{
    (async () => {
        try{
            let quart = db.collection('wishes')
            let response = []

            await quart.get().then(querySnapshot => {
                let docs = querySnapshot.docs; //the result of the query

                for (let doc of docs){
                    const selecteItem = {
                        id: doc.id,
                        name: doc.data().name,
                        description: doc.data().description
                    }
                    response.push(selecteItem)
                }
                return response //each then should return a value
            })

            return res.status(200).send(response)
        }
        catch(error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

//Update
//Put
app.put('/api/update_wish/:id', (req, res) =>
{
    (async () => {
        try{
            const document = db.collection('wishes').doc(req.params.id)

            await document.update({
                name: req.body.name,
                description: req.body.description
            })

            return res.status(200).send();
        }
        catch(error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

//Delete wish
//Delete
app.delete('/api/delete_wish/:id', (req, res) =>
{
    (async () => {
        try{
            const document = db.collection('wishes').doc(req.params.id)
            await document.delete()
            return res.status(200).send();
        }
        catch(error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});


//Export the api to Firebase Cloud Function
exports.app = functions.https.onRequest(app);
