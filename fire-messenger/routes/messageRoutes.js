const app = require('express')();
const sendMessages = require('../messeges/sendMessage');

app.use(sendMessages);

module.exports = app;