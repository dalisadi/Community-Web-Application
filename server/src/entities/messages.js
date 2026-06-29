// Structure d'un document de la collection "messages"

/*
{
    _id: ObjectId,

    auteur: String,
    contenu: String,
    forum: String,       // "public" ou "private"

    date: Date,

    likes: [
        String           // login des utilisateurs ayant liké
    ],

    reponses: [
        {
            id: Number,
            auteur: String,
            contenu: String,
            date: Date,

            likes: [
                String
            ]
        }
    ]
}
*/