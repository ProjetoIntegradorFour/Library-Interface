import "../styles/login.css";

export default function Login() {
  return (
    <div className="login-page">

      <div className="login-box">
        <h1>Biblioteca Virtual</h1>
        <form>
          <input type="email" id="email" placeholder="Digite seu email" required autoComplete="off" title="Insert your Email" />
          <input type="password" id="password" placeholder="Digite sua senha" required autoComplete="off" title="Insert your Password" />
          <button type="submit">Entrar</button>
        </form>
      </div>

    </div>
  );
}
