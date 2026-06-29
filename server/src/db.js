const { MongoClient } = require("mongodb");

const url = "mongodb+srv://dalisadi:sdFRdbmon9999@cluster0.i0vwhdc.mongodb.net/?appName=Cluster0";

const client = new MongoClient(url);

let db;

async function connectDB() {
    await client.connect();

    db = client.db("letstalk");

    console.log("MongoDB connecté");
}

function getDB() {
    return db;
}

module.exports = {
    connectDB,
    getDB
};