/* 
  TODO: match oauth steps required 
  button functions : starts auth check system and and redirect to dashboard if ok, wait to relaod the page
*/



import { useState } from "react";
import "../styles/login.css";
import authService from "../service/auth/authService"; // adjust path as needed

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // stop browser reload
    try {
      const result = await authService.login(email, password);
      console.log("Login successful:", result);
      // maybe redirect or let ProtectedLayout handle it
    } catch (err) {
      console.error("Login failed:", err);
      alert("Usuário ou senha inválidos");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Biblioteca Virtual</h1>
        <form onSubmit={handleSubmit}>
          <input type="email" id="email" placeholder="Digite seu email" required autoComplete="off" title="Insert your Email" 
          value={email} onChange={(e) => setEmail(e.target.value)}/>

          <input type="password" id="password" placeholder="Digite sua senha" required autoComplete="off" title="Insert your Password" 
          value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Entrar</button>
        </form>
      </div>

    </div>
  );
}
