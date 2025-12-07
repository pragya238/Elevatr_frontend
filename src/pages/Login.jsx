import { useState } from "react";
import api from "../config/axios";
import "../styles/forms.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });

      if (!res.data?.token) {
        throw new Error("No token received");
      }

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Invalid email or password";
      alert(msg);
    } finally {
      setLoading(false);
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="form-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn-dark" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
