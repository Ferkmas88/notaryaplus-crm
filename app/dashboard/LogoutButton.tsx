"use client";

export default function LogoutButton() {
  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.href = "/login";
  }
  return (
    <button className="logout" onClick={logout}>
      Cerrar sesión
    </button>
  );
}
