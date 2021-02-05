const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const messageRoutes = require('./routes/messageRoutes');
const express = require('express');
const cors = require('cors')

const app = express();

app.use(cors({ origin: true, credentials: true }));

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/messages', messageRoutes);

app.get('/', (req, res) => {
    console.log(req.body);
    res.send(req.body);
})

app.listen(5000,
    () => {
        console.log('Running fire-messenger server at port: ' + 5000);
    }
)