const loginWithEmailAndPassword = require('../auth/login/withEmailAndPassword');
const signInWithEmailAndPassword = require('../auth/signup/withEmailAndPassword');
const signOut = require('../auth/signout');
const withGoogleJWT = require('../auth/signup/withGoogle');
const withFacebookToken = require('../auth/signup/withFacebook');

const express = require('express');
const app = express();

app.use('/signup', withGoogleJWT);
app.use('/signup', signInWithEmailAndPassword);
app.use('/signup', withFacebookToken)
app.use('/login', loginWithEmailAndPassword);
app.use(signOut);

module.exports = app;