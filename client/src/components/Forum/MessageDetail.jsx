import { useState } from "react";
import axios from "axios";
import "../../styles/messageDetail.css";

function MessageDetail({ message, user }) {

    const [reponses, setReponses] = useState(
        message.reponses || []
    );

    const [contenu, setContenu] = useState("");

    const [afficherFormulaire, setAfficherFormulaire] =
        useState(false);

    const envoyerReponse = async () => {

        try {

            const res = await axios.post(
                `http://localhost:4000/api/messages/${message._id}/reponses`,
                {
                    auteur: user.login,
                    contenu: contenu
                }
            );

            setReponses([...reponses, res.data]);

            setContenu("");

            setAfficherFormulaire(false);
            setTimeout(() => {

                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth"
                });

            }, 100);

        } catch(error) {

            console.error(error);
        }
    };

    const likerReponse = async (idMessage, idReponse) => {
        try {

            await axios.put(
                `http://localhost:4000/api/messages/${idMessage}/reponses/${idReponse}/like`,
                {
                    login: user.login
                }
            );

            const updated = reponses.map(r => {
                if(r.id === idReponse){
                    const dejaLike = r.likes.includes(user?.login);
                    if(dejaLike){
                        return {...r, likes: r.likes.filter(
                                        l => l !== user.login
                                    )
                        };
                    } else {
                        return {...r, likes: [...r.likes, user.login]
                        };
                    }
                }
                return r;
            });

            setReponses(updated);

        } catch(error){
            console.error(error);
        }
    };

    return (

        <div className="detail-container">

            <div className="detail-message">

                <h2>{message.auteur}</h2>
                <p className="message-content">
                    {message.contenu}
                </p>
                <p className="message-date">
                    Publié le {new Date(message.date).toLocaleDateString()} à {new Date(message.date).toLocaleTimeString()}
                </p>

            </div>

            <div className="responses-section">

                <h3>Réponses : </h3>

                {reponses.length === 0 && (
                    <p className="empty-response">
                        Aucune réponse pour ce message.
                    </p>
                )}

                {reponses.map(r => (

                    <div
                        key={r.id}
                        className="response-card"
                    >

                        <strong>{r.auteur}</strong>
                        <p>{r.contenu}</p>
                        <p className="response-date">
                            Publié le {new Date(r.date).toLocaleDateString()} à {new Date(r.date).toLocaleTimeString()}
                        </p>

                        <div className="response-actions">
                            
                            <button
                                className={`like-btn ${
                                    r.likes?.includes(user?.login) ? "liked" : ""
                                }`}
                                onClick={() => likerReponse(message._id, r.id)}
                            >
                                ❤️ {r.likes?.length || 0}
                            </button>
                        
                        </div>

                    </div>

                ))}

            </div>

            {user && (

                <>

                    <button
                        className="open-response-btn"
                        onClick={() =>
                            setAfficherFormulaire(true)
                        }
                    >
                        + Répondre
                    </button>

                    {afficherFormulaire && (

                        <div className="modal-overlay">

                            <div className="message-modal">

                                <button
                                    className="close-modal"
                                    onClick={() =>
                                        setAfficherFormulaire(false)
                                    }
                                >
                                    ×
                                </button>

                                <h3>Ajouter une réponse</h3>

                                <textarea
                                    value={contenu}
                                    onChange={(e) =>
                                        setContenu(e.target.value)
                                    }
                                />

                                <button
                                    onClick={envoyerReponse}
                                >
                                    Publier
                                </button>

                            </div>

                        </div>
                    )}
                </>
            )}

        </div>
    );
}

export default MessageDetail;