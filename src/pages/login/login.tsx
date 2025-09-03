import "./login.css";

export default function Login() {
  return (
      <div className="login-page">
      <div className="login-box">
        <h2>Biblioteca Virtual</h2>
        <form>
          <div className="input-group">
            <input type="email" id="email" placeholder="Digite seu email" required />
          </div>

          <div className="input-group">
            <input type="password" id="password" placeholder="Digite sua senha" required />
          </div>

          <button type="submit" className="login-btn">Entrar</button>
        </form>
      </div>
      </div>
  );
}
