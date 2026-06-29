import "../styles/header.css";

function Header({ setPage, user, setUser, page }) {

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);      
    setPage("login");     
  };

  return (
  <header>

    <div className="logo">
      Let's talk
    </div>

    {!user && (
      <nav>
        <a 
          className={page === "login" ? "active-link" : ""}
          onClick={() => setPage("login")}
        >
          Connexion
        </a>

        <a 
          className={page === "register" ? "active-link" : ""}
          onClick={() => setPage("register")}
        >
          Inscription
        </a>

        <a 
          className={(page === "forum-public") ? "active-link" : ""}
          onClick={() => setPage("forum-public")}
        >
          Forum Public
        </a>
      </nav>
    )}

    {user && (

      <div className="header-right">

        <nav>

          <a 
            className={(page === "forum-public") ? "active-link" : ""}
            onClick={() => setPage("forum-public")}
          >
            Forum Public
          </a>

          {user?.is_admin && (
            <a 
              className={(page === "forum-prive") ? "active-link" : ""}
              onClick={() => setPage("forum-prive")}
            >
              Forum Privé
            </a>
          )}

          {user.is_admin && (
            <a className={page === "admin" ? "active-link" : ""} onClick={() => setPage("admin")}>
              Administration
            </a>
          )}

          <a
            onClick={handleLogout}
            className="logout"
          >
            Déconnexion
          </a>

        </nav>

        <div
          className={`profile-circle ${page === "profil" ? "active-profile" : ""}`}
          onClick={() => setPage("profil")}
        >
          {user.login.charAt(0).toUpperCase()}
        </div>

      </div>
    )}

  </header>
);

}

export default Header;