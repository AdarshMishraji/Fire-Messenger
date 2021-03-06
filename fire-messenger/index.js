const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const messageRoutes = require('./routes/messageRoutes');
const express = require('express');
const cors = require('cors');
// const functions = require('firebase-functions');

const app = express();

app.use(cors({ origin: true, credentials: true }));

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/messages', messageRoutes);

app.get('/hello', (req, res) => {
    res.send('Hello World');
})

app.listen(5000,
    () => {
        console.log('Running fire-messenger server at port: ' + 5000);
    }
)

// exports.App = functions.https.onRequest(app);