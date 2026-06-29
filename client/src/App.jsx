import { useState } from "react";
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Forum from './components/Forum/Forum';
import Profil from './components/Profil';
import Header from "./components/Header";
import Admin from './components/Admin'; 
import MessageDetail from './components/Forum/MessageDetail';
import "./styles/global.css";

function App() {
  const [page, setPage] = useState("forum-public"); 
  const [user, setUser] = useState(() => {

    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });
  const [selectedMessage, setSelectedMessage] = useState(null);

  return (
    <div>
      <Header setPage={setPage} user={user} setUser={setUser} page={page} />

      {page === "login" && <Login setPage={setPage} setUser={setUser} />}
      
      {page === "register" && <Register setPage={setPage} />}
      
      {page === "forum-public" && (
        <Forum
          user={user}
          typeForum="public"
          setSelectedMessage={setSelectedMessage}
          setPage={setPage}
        />
      )}
      
      {page === "forum-prive" && user?.is_admin && (
        <Forum
          user={user}
          typeForum="private"
          setSelectedMessage={setSelectedMessage}
          setPage={setPage}
        />
      )}
      
      {page === "profil" && user && <Profil user={user} setUser={setUser} />}
      
      {page === "admin" && user?.is_admin && <Admin />} 
      
      {page === "message-detail" && selectedMessage && (
        <MessageDetail
          message={selectedMessage}
          user={user}
        />
      )}
    </div>
  );
}
export default App;


//pour la suitee : 
//si une page donne accès à une autre → on passe la fonction setPage en argument
//comme une fois register il faut forum pour creer ou voir les mssg
