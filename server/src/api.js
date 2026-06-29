const express = require('express');
const router = express.Router();
const { getDB } = require("./db");
const { ObjectId } = require("mongodb");

// route pour s'inscrire
router.post('/register', async (req, res) => {

    try {

        const db = getDB();

        const {
            nom,
            prenom,
            email,
            dateNaissance,
            genre,
            login,
            password
        } = req.body;

        if (!login || !password) {
            return res.status(400).json({
                error: "Champs manquants"
            });
        }

        const exist = await db.collection("users").findOne({
            login: login
        });

        if (exist) {
            return res.status(400).json({
                error: "Login déjà utilisé"
            });
        }

        const newUser = await db.collection("users").insertOne({
            nom,
            prenom,
            email,
            dateNaissance,
            genre,
            login,
            password,
            statut: false,
            is_admin: false,
            demande_admin: false
        });

        res.status(201).json({
            message: "Compte créé avec succès"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Erreur serveur"
        });
    }
});


// route pour afficher tous les utilisateurs
router.get('/users', async (req, res) => {
    const db = getDB();

    const users = await db
        .collection("users")
        .find()
        .toArray();

    res.json(users);
});


// les utilisateurs pas encore valides par l admin
router.get("/admin/nouveaux-utilisateurs", async (req, res)=>{
    
    const db = getDB();

    const enAttente = await db
        .collection("users")
        .find({ statut: false })
        .toArray();

    res.json(enAttente);
})

// valider un utilisateur, donc il peut avoir un compte sur le site (connexion validee), il est membre
router.post("/admin/validate", async (req, res) => {

    const db = getDB();

    const { login } = req.body;

    const result = await db.collection("users").updateOne(
        { login: login },
        { $set: { statut: true } }
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({
            error: "Utilisateur non trouvé"
        });
    }

    const user = await db.collection("users").findOne({
        login: login
    });

    res.json({
        message: "Utilisateur validé par un des admins !",
        user
    });
});


// route pour creer un message par un utilisateur
router.post("/messages", async (req, res)=>{

    const db = getDB();

    const {auteur, contenu, forum } = req.body;

    const user = await db.collection("users").findOne({
        login: auteur
    });

    if (!user || user.statut !== true) {
        return res.status(403).json({
            error: "Utilisateur non trouvé ou non validé"
        });
    }

    if (forum === "private" && !user.is_admin) {
        return res.status(403).json({
            error: "Accès interdit au forum privé"
        });
    }

    const message = {
        auteur,
        contenu,
        forum,
        date: new Date(),
        likes: [],
        reponses: []
    };

    const result = await db.collection("messages").insertOne(message);

    res.status(201).json({
        message: "Message créé",
        insertedId: result.insertedId
    });

});


// route pour recuperer les messages des membres ou des admin, selon forum si public ou prive
router.get("/messages/:forum", async (req, res) => {

    const db = getDB();

    const { forum } = req.params;

    const listeMessages = await db
        .collection("messages")
        .find({ forum: forum })
        .toArray();

    res.json(listeMessages);
});


// route pour faire une demande a etre admin, elle sera traitee par un des admin
router.post("/demande-admin", async (req, res) => {

    const db = getDB();

    const { login } = req.body;

    const result = await db.collection("users").updateOne(
        { login: login },
        { $set: { demande_admin: true } }
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({
            error: "Utilisateur non trouvé"
        });
    }

    res.json({
        message: "Demande envoyée"
    });
});


//valider un utilisateur a devenir admin
router.post("/admin/validate-admin", async (req, res) => {

    const db = getDB();

    const { login } = req.body;

    const result = await db.collection("users").updateOne(
        { login: login },
        {
            $set: {
                is_admin: true,
                demande_admin: false
            }
        }
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({
            error: "Utilisateur non trouvé"
        });
    }

    const user = await db.collection("users").findOne({
        login: login
    });

    res.json({
        message: "Utilisateur est maintenant admin",
        user
    });
});


// route pour se connecter
router.post("/login", async (req, res) => {

    const db = getDB();

    const { login, password } = req.body;

    // chercher l'utilisateur dans MongoDB
    const user = await db.collection("users").findOne({
        login: login
    });

    if (!user) {
        return res.status(401).json({
            error: "Login ou mot de passe incorrect"
        });
    }

    // vérifier le mot de passe
    if (user.password !== password) {
        return res.status(401).json({
            error: "Login ou mot de passe incorrect"
        });
    }

    // vérifier la validation admin
    if (user.statut !== true) {
        return res.status(403).json({
            error: "Compte non validé par un administrateur"
        });
    }

    // retirer le mot de passe avant d'envoyer la réponse
    const { password: pwd, ...reste } = user;

    return res.status(200).json(reste);
});


// supprimer un message que on a publie deja
router.delete("/messages/:id", async (req, res) => {

    const db = getDB();

    const { id } = req.params;

    const result = await db.collection("messages").deleteOne({
        _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
        return res.status(404).json({
            error: "Message non trouvé"
        });
    }

    res.json({
        message: "Message supprimé"
    });

});


//Route pour récupérer les messages d'un auteur précis 
router.get("/messages/auteur/:login", async (req, res) => {

    const db = getDB();

    const { login } = req.params;

    const mesMessages = await db
        .collection("messages")
        .find({ auteur: login })
        .toArray();

    res.json(mesMessages);

});


//  route pour voir valider des utilisateurs a etre admin
router.get("/admin/liste-demandes-admin", async (req, res) => {

    const db = getDB();

    const liste = await db
        .collection("users")
        .find({ demande_admin: true })
        .toArray();

    res.status(200).json(liste);

});


// route pour creer une reponse a des messages du forum
router.post("/messages/:id/reponses", async (req, res) => {

    const db = getDB();

    const { id } = req.params;
    const { auteur, contenu } = req.body;

    const reponse = {
        id: Date.now(),
        auteur,
        contenu,
        date: new Date(),
        likes: []
    };

    const result = await db.collection("messages").updateOne(
        { _id: new ObjectId(id) },
        {
            $push: {
                reponses: reponse
            }
        }
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({
            error: "Message non trouvé"
        });
    }

    res.status(201).json(reponse);
});


// route pour liker un message publie
router.put("/messages/:id/like", async (req, res) => {

    const db = getDB();

    const { login } = req.body;
    const { id } = req.params;

    const message = await db.collection("messages").findOne({
        _id: new ObjectId(id)
    });

    if (!message) {
        return res.status(404).json({
            error: "Message introuvable"
        });
    }

    const dejaLike = message.likes.includes(login);

    if (dejaLike) {

        await db.collection("messages").updateOne(
            { _id: new ObjectId(id) },
            {
                $pull: {
                    likes: login
                }
            }
        );

    } else {

        await db.collection("messages").updateOne(
            { _id: new ObjectId(id) },
            {
                $push: {
                    likes: login
                }
            }
        );

    }

    const messageMaj = await db.collection("messages").findOne({
        _id: new ObjectId(id)
    });

    res.json(messageMaj);

});


// route pour liker une reponse a un message deja publie
router.put("/messages/:messageId/reponses/:reponseId/like", async (req, res) => {

    const db = getDB();

    const { login } = req.body;
    const { messageId, reponseId } = req.params;

    const message = await db.collection("messages").findOne({
        _id: new ObjectId(messageId)
    });

    if (!message) {
        return res.status(404).json({
            error: "Message introuvable"
        });
    }

    const reponse = message.reponses.find(
        r => String(r.id) === reponseId
    );

    if (!reponse) {
        return res.status(404).json({
            error: "Réponse introuvable"
        });
    }

    const dejaLike = reponse.likes.includes(login);

    if (dejaLike) {

        reponse.likes = reponse.likes.filter(
            l => l !== login
        );

    } else {

        reponse.likes.push(login);

    }

    await db.collection("messages").updateOne(
        { _id: new ObjectId(messageId) },
        {
            $set: {
                reponses: message.reponses
            }
        }
    );

    res.json(reponse);
});


module.exports = router;