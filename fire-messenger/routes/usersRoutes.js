const app = require('express')();
const fetchAllUsers = require('../users/fetchAllUsers');
const fetchActiveUsers = require('../users/fetchActiveUsers');
const setActiveUserForAUser = require('../users/setActiveUserForAUser')

app.use(fetchAllUsers);
app.use(fetchActiveUsers);
app.use(setActiveUserForAUser);

module.exports = app;