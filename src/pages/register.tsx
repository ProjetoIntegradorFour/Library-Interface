import { useEffect, useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");

  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState("");

  // Carrega usuários cadastrados (GET)
  useEffect(() => {
    fetch("http://localhost:8080/api/auth/signup")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => setUsers([]));
  }, []);

  // Registrar usuário (POST)
  const handleRegister = async () => {
    const userData = {
      username,
      cpf,
      password,
      role: [role],
    };

    await fetch("http://localhost:8080/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    // Atualiza lista
    const res = await fetch("http://localhost:8080/api/auth/signup");
    const data = await res.json();
    setUsers(data);
  };

  const handleLogin = () => {
    alert("Entrou como: " + selectedUser);
  };

  return (
    <div className="login-container">
      <h2>Registrar Usuário</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="text"
        placeholder="CPF"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="admin">admin</option>
        <option value="user">user</option>
      </select>

      <button onClick={handleRegister}>Registrar</button>

      <h2>Entrar</h2>

      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">Selecione um usuário</option>
        {users.map((u: any, index) => (
          <option key={index} value={u.username}>
            {u.username}
          </option>
        ))}
      </select>

      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}