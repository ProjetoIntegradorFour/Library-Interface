import "./login.css";

export default function Login() {
  return (
    <div className="page-content">
      <div className="login-box">
        <h2>Biblioteca Virtual</h2>
        <form>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Digite seu email" required />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" placeholder="Digite sua senha" required />
          </div>

          <button type="submit" className="login-btn">Entrar</button>
        </form>
      </div>
    </div>
  );
}
