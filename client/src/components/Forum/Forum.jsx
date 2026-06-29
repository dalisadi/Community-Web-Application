import { useState, useEffect } from 'react';
import axios from 'axios';
import "../../styles/forum.css";

function Forum({ user, typeForum, setSelectedMessage, setPage }){
    const [messages, setMessages] = useState([]);
    const [contenu, setContenu] = useState("");
    const [recherche, setRecherche] = useState(""); 
    const [reponseContenu, setReponseContenu] = useState({});
    const [afficherFormulaire, setAfficherFormulaire] = useState(false);    // affiche un formulaire pour publier un message
    const [likedMessages, setLikedMessages] = useState([]);  // pour les mssg likes

    useEffect(() => {
        const afficherMessage = async () => {
            try {
                const res = await axios.get(`http://localhost:4000/api/messages/${typeForum}`);
                setMessages(res.data);
            } catch(error) {
                console.error("Erreur:", error);
            }
        };
        afficherMessage();
    }, [typeForum]);

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await axios.post(
                "http://localhost:4000/api/messages", 
                {
                    auteur: user.login,
                    contenu: contenu,
                    forum: typeForum,
                }
            );

            // Recharger tous les messages depuis MongoDB
            const resMessages = await axios.get(
                `http://localhost:4000/api/messages/${typeForum}`
            );

            setMessages(resMessages.data);

            setContenu("");
            setAfficherFormulaire(false);   // fermer le formulaire une fois que le message est publie
            
            // une fois le formulaire se ferme descendre en bas pour voir le mssg publie
            setTimeout(() => {

                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth"
                });

            }, 100);

        } catch(error) {
            console.error("Erreur:", error);
        }
    };

    const envoyerReponse = async (idMessage) => {

        try {
            const res = await axios.post(`http://localhost:4000/api/messages/${idMessage}/reponses`,
                {
                    auteur: user.login,
                    contenu: reponseContenu[idMessage]
                }
            );

            const updated = messages.map(m => {
                if (m._id === idMessage) {
                    return {...m, reponses: [...m.reponses, res.data]};
                }

                return m;
            });

            setMessages(updated);   // modifier le message car maintenant il a une reponse

            setReponseContenu({...reponseContenu, [idMessage]: ""});  // reinitialiser le champ texte apres l’envoi de la reponse

        } catch(error) {
            console.error(error);
        }
    };

    const likerMessage = async (idMessage) => {
        const dejaLike = likedMessages.includes(idMessage);  // si il y est donc deja like
        try {
            await axios.put(
                `http://localhost:4000/api/messages/${idMessage}/like`,
                {
                    login: user.login
                }
            );

            const updated = messages.map(m => {
                if(m._id === idMessage){
                    if(dejaLike){
                        return {...m, likes: m.likes.filter(
                                        l => l !== user.login
                                        )
                        };
                    } else {
                        return {...m, likes: [...m.likes, user.login]
                        };
                    }
                }
                return m;
            });

            setMessages(updated);

            if(dejaLike){
                setLikedMessages(
                    likedMessages.filter(id => id !== idMessage)
                );
            } else {
                setLikedMessages([...likedMessages, idMessage]);
            }

        } catch(error){
            console.error(error);
        }
};

    return (
        <div className="forum-container">
            <h2>
                {typeForum === "private" ? "Forum Privé" : "Forum Public"}
            </h2>

            {/* Barre de recherche */}
            <input 
                type="text" 
                placeholder="Rechercher un message ou un auteur..." 
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="search-bar"
            />

            {/* Formulaire pour poster seulement si on est connecte, en appuyant sur le bouton + qui nous affiche le formulaire pour ecrire ce message*/}
            {user && (
                <div className="publication-section">
                    {!afficherFormulaire ? (
                        <button
                            className="open-message-btn"
                            onClick={() => setAfficherFormulaire(true)}
                        >
                            + Publier un message
                        </button>

                    ) : (
                    <div className="modal-overlay">
                        <div className="message-modal">
                            <button
                                className="close-modal"
                                onClick={() => setAfficherFormulaire(false)}
                            >
                                ×
                            </button>
                            <h3>Publier un message</h3>
                        <form
                            className="modal-form"
                            onSubmit={handleSubmit}
                        >
                            <textarea
                                placeholder="Entrer votre message..."
                                value={contenu}
                                onChange={(e) => setContenu(e.target.value)}
                            />
                            <button type="submit">
                                Publier
                            </button>
                        </form>
                        </div>              
                    </div>
                    )}
                </div>
            )}

            {!user && 
                <p>Connectez-vous pour publier un message.</p>
            }

            {/* On filtre et on affiche */}
            <div className="messages-list">
                {messages.length === 0 && (
                    <p className="empty-message">
                        Aucun message n'est encore publié.
                    </p>
                )}
                {messages
                    .filter(m => 
                        m.contenu.toLowerCase().includes(recherche.toLowerCase()) || 
                        m.auteur.toLowerCase().includes(recherche.toLowerCase())
                    )
                    .map((m) => (
                        <div 
                            key={m._id}
                            className="message-card"
                            onClick={() => {    
                                //pour rendre chaque message cliquable
                                setSelectedMessage(m);
                                setPage("message-detail");
                            }}
                        >
                            <h3 className="message-author">{m.auteur}</h3>
                            <p className="message-content">{m.contenu}</p>
                            <p className="message-date">
                                Publié le {new Date(m.date).toLocaleDateString()} à {new Date(m.date).toLocaleTimeString()}
                            </p>
                            <div className="message-actions">

                                <button
                                    className={`like-btn ${
                                    m.likes?.includes(user?.login) ? "liked" : ""
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        likerMessage(m._id);
                                    }}
                                >
                                    ❤️ {m.likes?.length || 0}
                                </button>

                            </div>
                        </div>
                    ))
                }
                {/* Petit message si rien ne correspond à la recherche */}
                {messages.length > 0 && messages.filter(m => 
                    (m.contenu || "").toLowerCase().includes(recherche.toLowerCase()) || 
                    (m.auteur || "").toLowerCase().includes(recherche.toLowerCase())
                ).length === 0 && <p>Aucun résultat pour "{recherche}"</p>}
            </div>
        </div>
    );
}

export default Forum;