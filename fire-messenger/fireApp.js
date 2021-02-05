const admin = require('firebase-admin');
const firebase = require('firebase').default;

const config = {
    // apiKey: "AIzaSyCU9nbrY_IWnDgjPuv2ptOklKAk0t1d54I",
    apiKey: "AIzaSyCU9nbrY_IWnDgjPuv2ptOklKAk0t1d54I",
    authDomain: "firemessenger-8bdcc.firebaseapp.com",
    databaseURL: "https://firemessenger-8bdcc-default-rtdb.firebaseio.com",
    projectId: "firemessenger-8bdcc",
    storageBucket: "firemessenger-8bdcc.appspot.com",
    messagingSenderId: "1017171902033",
    appId: "1:1017171902033:web:11c54e891f88ac31bc8270",
    measurementId: "G-9LLM4F82WN"

};

const adminApp = admin.initializeApp(config);

const firebaseApp = firebase.initializeApp(config);

module.exports = adminApp, firebaseApp;
