import { useState } from "react";
import axios from "axios";
import "../../styles/Register.css";  

function Login({ setPage, setUser }) {

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");

    try {
      // On envoie les identifiants au serveur
      const res = await axios.post(
        "http://localhost:4000/api/login", 
        { 
          login, 
          password 
        }
      );

      // sauvegarder l'utilisateur
      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

      setUser(res.data);
      setPage("forum-public");

    } catch (error) {

      if (error.response) {
        setError(error.response.data.error);
      } else {
        setError("Serveur indisponible");
      }
      
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Connexion</h2>

        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Login*</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Saisir votre login"
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

          <p className="forgot-password">
            Mot de passe oublié ?
          </p>

          <button type="submit" className="btn">
            Se connecter
          </button>

          <p className="form-footer">
            Pas encore inscrit ?{" "}
            <span className="form-link" onClick={() => setPage("register")}>
              S'inscrire
            </span>
          </p>

        </form>

      </div>
    </div>
  );
}

export default Login;