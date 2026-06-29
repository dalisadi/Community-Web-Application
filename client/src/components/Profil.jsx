import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/profil.css";

function Profil({ user, setUser }) {
  const [mesMessages, setMesMessages] = useState([]);

  // 1. Charger les messages de l'utilisateur au montage du composant
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/messages/auteur/${user.login}`);
        setMesMessages(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des messages :", error);
      }
    };
    if (user?.login) fetchMessages();
  }, [user?.login]);

  // 2. Gérer la demande pour devenir Admin
  const handleDemandeAdmin = async () => {
    try {
       await axios.post("http://localhost:4000/api/demande-admin", {
        login: user.login
       });
      
       alert("Demande envoyée avec succès !");

      
        setUser({ ...user, demande_admin: true });
      
      } catch (error) {
      console.error("Erreur demande admin :", error);
      alert("Une erreur est survenue lors de la demande.");
    }
  };

  // 3. Supprimer un message
  const handleDelete = async (id) => {
    if (window.confirm("Es-tu sûr de vouloir supprimer ce message ?")) {
      try {
        await axios.delete(`http://localhost:4000/api/messages/${id}`);
        
        // On filtre la liste pour retirer le message visuellement sans recharger la page
        setMesMessages(mesMessages.filter((m) => m._id !== id));
      } catch (error) {
        console.error("Erreur suppression :", error);
        alert("Impossible de supprimer le message.");
      }
    }
  };

  // 4. Déterminer le libellé et la couleur du statut
  const getStatusInfo = () => {
    if (user.is_admin) return { label: "Administrateur", class: "status-admin" };
    if (user.demande_admin) return { label: "Membre (Demande admin en cours)", class: "status-pending" };
    return { label: "Membre", class: "status-member" };
  };

  const status = getStatusInfo();

  return (
    <div className="profil-container">
      <h2>Mon Profil</h2>

      {/* CARTE D'INFORMATIONS */}
      <div className="profil-card">
        <div className="info-item">
          <strong>Statut :</strong> 
          <span className={`status-badge ${status.class}`}>{status.label}</span>
        </div>
        <p><strong>Nom :</strong> {user.nom}</p>
        <p><strong>Prénom :</strong> {user.prenom}</p>
        <p><strong>Email :</strong> {user.email}</p>
        <p><strong>Login :</strong> {user.login}</p>

        {/* Action : Devenir Admin */}
        {!user.is_admin && !user.demande_admin && (
          <button className="admin-btn" onClick={handleDemandeAdmin}>
            Devenir admin ?
          </button>
        )}

        {user.demande_admin && !user.is_admin && (
          <p className="pending-msg">⏳ Votre demande est en attente de validation.</p>
        )}
      </div>

      <hr className="separator" />

      {/* LISTE DES MESSAGES PERSO */}
      <h3>Mes messages publiés</h3>
      <div className="messages-container">
        {mesMessages.length === 0 ? (
          <p className="no-message">Vous n'avez publié aucun message pour le moment.</p>
        ) : (
          mesMessages.map((m) => (
            <div key={m._id} className="message-card">
              <p className="message-content">{m.contenu}</p>
              <button 
                className="delete-btn" 
                onClick={() => handleDelete(m._id)}
              >
                Supprimer le message
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profil;