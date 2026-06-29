const app = require('./app'); // On récupère la config de app.js
const port = 4000;  //le port du serveur (Node) different bien sur de celui de React

const { connectDB } = require("./db");

async function startServer() {

    await connectDB();

    app.listen(port, () => {
        console.log(`Serveur démarré sur http://localhost:${port}/api`);
    });

}

startServer();