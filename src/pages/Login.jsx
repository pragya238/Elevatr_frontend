import { useState } from "react";
import api from "../config/axios";

import "../styles/forms.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch {
      alert("Invalid login");
    }
  };

  return (
  <div className="form-card">
    <h2 className="form-title">Login</h2>
    <form onSubmit={submit}>
      <input
        className="form-input"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="form-input"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn-dark">Login</button>
    </form>
  </div>
);

}
