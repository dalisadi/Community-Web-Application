import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/admin.css";

export default function Admin() {
    // On crée deux listes distinctes
    const [nouveaux, setNouveaux] = useState([]); 
    const [demandesAdmin, setDemandesAdmin] = useState([]);

    // Une seule fonction pour tout rafraîchir
    const chargerTout = async () => {
        try {
            const resNouveaux = await axios.get("http://localhost:4000/api/admin/nouveaux-utilisateurs");
            const resDemandes = await axios.get("http://localhost:4000/api/admin/liste-demandes-admin");
            
            setNouveaux(resNouveaux.data);
            setDemandesAdmin(resDemandes.data);
            
        } catch (error) {
            console.error("Erreur chargement:", error);
        }
    };

    useEffect(() => {
        chargerTout();
    }, []);

    // Action 1 : Valider l'inscription d'un membre
    const handleValidateMember = async (login) => {
        try {
            await axios.post("http://localhost:4000/api/admin/validate", { login });
            alert("Membre validé !");
            chargerTout(); 
        } catch (error) {
            console.error(error);
        }
    };

    // Action 2 : Promouvoir en Admin
    const handlePromoteAdmin = async (login) => {
        try {
            await axios.post("http://localhost:4000/api/admin/validate-admin", { login });
            alert(`${login} est maintenant Admin !`);
            chargerTout();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="admin-container">
            <h2>Gestion de la communauté</h2>

            {/* SECTION 1 : NOUVEAUX COMPTES */}
            <section className="admin-section">
                <h3>Demandes d'inscription</h3>
                {nouveaux.length === 0 ? <p className="empty-admin">Aucun nouveau membre.</p> : (
                    <ul className="admin-list">
                        {nouveaux.map(user => (
                            <li className="admin-item" key={user.login}>
                                <span className="admin-user">
                                    {user.login} ({user.nom} {user.prenom})
                                </span>
                                <button className="admin-btn" onClick={() => handleValidateMember(user.login)}>Valider l'inscription</button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <hr className="admin-separator" />

            {/* SECTION 2 : DEMANDES DE PROMOTION */}
            <section className="admin-section">
                <h3>Demandes d'administration</h3>
                {demandesAdmin.length === 0 ? <p className="empty-admin">Aucune demande en cours.</p> : (
                    <ul className="admin-list">
                        {demandesAdmin.map(user => (
                            <li className="admin-item" key={user.login}>
                                {user.login} souhaite devenir admin
                                <button className="admin-btn" onClick={() => handlePromoteAdmin(user.login)}>Nommer Admin</button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}