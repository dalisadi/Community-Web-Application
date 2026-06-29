import { StrictMode } from 'react'   //un outil de React qui aide a debug
import { createRoot } from 'react-dom/client'  //connecter React au HTML
import "./styles/global.css";
import App from './App.jsx'  //le composant principal (racine)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />  
  </StrictMode>,
)