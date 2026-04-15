import { SOURCES } from "@/lib/sources";
import CopyButton from "./CopyButton";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default function Home() {
  const h = headers();
  const proto = h.get("x-forwarded-proto") || "https";
  const host = h.get("host") || "notaryaplus-crm.vercel.app";
  const base = `${proto}://${host}`;

  return (
    <div className="container">
      <div className="header">
        <h1>
          NotaryaPlus <span className="gold">CRM</span> — Enlaces de tracking
        </h1>
        <p>
          Cada botón que pegues en tu web, Facebook, Google e Instagram usa un enlace diferente.
          El bot detecta de dónde viene cada cliente y lo guarda automáticamente.
        </p>
      </div>

      <div className="grid">
        {SOURCES.map((s) => {
          const trackingUrl = `${base}/r/${s.id}`;
          return (
            <div key={s.id} className="card">
              <div className="icon">{s.icon}</div>
              <h3>{s.label}</h3>
              <p className="desc">{s.description}</p>
              <div className="url">{trackingUrl}</div>
              <div className="actions">
                <CopyButton text={trackingUrl} label="Copiar link" />
                <a className="btn primary" href={trackingUrl} target="_blank" rel="noreferrer">
                  Probar
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 48, textAlign: "center" }}>
        <a className="btn primary" href="/dashboard" style={{ display: "inline-block", padding: "14px 28px" }}>
          Ver Dashboard →
        </a>
      </div>
    </div>
  );
}
