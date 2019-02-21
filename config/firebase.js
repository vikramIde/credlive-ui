// Initiation 
 var config = {
    apiKey: "AIzaSyAySmXtzzoLlNnPtSw1p6L1dzeCmBpnY_Y",
    authDomain: "hypersign-e0a0d.firebaseapp.com",
    databaseURL: "https://hypersign-e0a0d.firebaseio.com",
    projectId: "hypersign-e0a0d",
    storageBucket: "hypersign-e0a0d.appspot.com",
    messagingSenderId: "795005676642"
  };

const firebase = require("firebase");

firebase.initializeApp(config);
const database = firebase.firestore();

export default database;