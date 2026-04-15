import LoginForm from "./LoginForm";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string };
}) {
  return (
    <div className="container">
      <div className="login-box">
        <h1>🔒 Acceso Restringido</h1>
        <p>Dashboard privado de 3-1 Notary A Plus.</p>
        {searchParams.error && <div className="error">Contraseña incorrecta</div>}
        <LoginForm next={searchParams.next || "/dashboard"} />
      </div>
    </div>
  );
}
