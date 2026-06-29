import { useState } from 'react';
import axios from 'axios';
import "../../styles/Register.css";   //pour avoir acces au css (le design) 

// { setPage } : en arg pour pouvoir passer a l action suivante (regarder les message) une fois register est finit
function Register({ setPage }) {

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [genre, setGenre] = useState("");
  //message sera affiche sur le navigateur pour informer l utilisateur si son compte est bien cree
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    
    e.preventDefault(); //empeche la page de se recharger

    try {

      setIsError(false);
      setMessage("");

      //envoyer les donnees saisies au serveur Express qui ecoute au port 4000
      const response = await axios.post('http://localhost:4000/api/register', {
        nom, prenom, email, dateNaissance, genre,
        login, password
      });
      
      setMessage("Compte créé ! En attente de validation par un admin.");

      // vider le formulaire
      setNom("");
      setPrenom("");
      setEmail("");
      setDateNaissance("");
      setGenre("");
      setLogin("");
      setPassword("");

    } catch (error) {

      setIsError(true);

      if (error.response && error.response.data.error) {
        setMessage(error.response.data.error); 
      } else {
        setMessage("Erreur lors de l'inscription");
      }
    }
  };
  

  return (
    <div className="form-container">
      <div className="form-box">
        
        <h2>Inscription</h2>
        {
          message &&
          <p className={isError ? "error-message" : "success-message"}>
            {message}
          </p>
        }

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Nom*</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Saisir votre nom"
              required
            />  
          </div>

          <div className="form-group">
            <label>Prénom*</label>
            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Saisir votre prénom"
              required
            />
          </div>

          <div className="form-group">
            <label>Email*</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Saisir votre email"
              required
            />
          </div>

          <div className="form-group">
            <label>Date de naissance*</label>
            <input
              type="date"
              value={dateNaissance}
              onChange={(e) => setDateNaissance(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Genre*</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
              >
                <option value="">Choisir</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
                <option value="Autre">Autre</option>
              </select>
          </div>
          
          <div className="form-group">
            <label>Pseudo*</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Saisir votre pseudo"
              required
            />
          </div>

          <div className="form-group">
            <label>Mot de passe*</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Saisir votre mot de passe"
              required
            />
          </div>

          <button type="submit" className="btn">
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
  
}

export default Register;