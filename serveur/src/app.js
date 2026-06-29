const express = require('express');
const cors = require('cors');  //pour permettre au React d'acceder au serveur
const api = require('./api'); //on importe toutes les routes 

const app = express();  //creer le serveur 

app.use(cors()); //autorise React
app.use(express.json()); //permet de lire le JSON envoye par React au serveur

//pour dire a Express : toutes les routes de api.js commencent par /api
app.use('/api', api);
/*
donc dans react axios.get("http://localhost:4000/api/hello") : on precise le port du serveur
ensuite grace a .use Express combine
ex : 
router.get('/hello', ...)
->    /api + /hello = /api/hello
*schema
React écrit :
http://localhost:4000/api/hello
         ↓
Express reçoit :
/api → il va vers app.js car "si quelqu’un demande /api → va dans api.js"  d apres .use
/hello → api.js    : /hello trouve dans api.js : un composant
*/

module.exports = app; //ligne obligatoire