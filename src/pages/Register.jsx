import { useState } from "react";
import api from "../config/axios";
import "../styles/forms.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();

    console.log("SUBMIT FUNCTION TRIGGERED", form);

    try {
      // FIXED → send "form", not "data"
      const res = await api.post("/auth/register", form);

      console.log("REGISTER RESPONSE:", res.data);

      // FIXED → use res.data, not undefined "data"
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Registration failed";
      alert(msg);
    }
  };

  return (
    <div className="form-card">
      <h2 className="form-title">Create Account</h2>

      <form onSubmit={submit}>
        <input
          className="form-input"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="form-input"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="form-input"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit" className="btn-dark">
          Register
        </button>
      </form>
    </div>
  );
}
