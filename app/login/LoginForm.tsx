"use client";
import { useState } from "react";

export default function LoginForm({ next }: { next: string }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const r = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (r.ok) {
      window.location.href = next;
    } else {
      setLoading(false);
      window.location.href = `/login?error=1&next=${encodeURIComponent(next)}`;
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
      />
      <button className="btn primary" type="submit" disabled={loading} style={{ width: "100%" }}>
        {loading ? "Verificando..." : "Entrar"}
      </button>
    </form>
  );
}
