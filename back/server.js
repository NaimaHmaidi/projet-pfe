const express = require('express');
const cors = require('cors');
const tacheRoute = require('./routes/tache');
const userRoute = require('./routes/user');
const projetRoute = require('./routes/projet');
require('./config/connect');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/user', userRoute); // Utilisation du routeur des utilisateurs
app.use('/tache', tacheRoute);
app.use('/projet', projetRoute);

app.listen(3000, () => {
    console.log('Server is running');
});
