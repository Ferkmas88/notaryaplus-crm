import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { fetchLeads, fetchClicks, computeStats } from "@/lib/bot-api";
import { SOURCES } from "@/lib/sources";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";

function sourceLabel(id: string): string {
  return SOURCES.find((s) => s.id === id)?.label || id;
}

function formatDate(s?: string): string {
  if (!s) return "-";
  try {
    return new Date(s).toLocaleString("es-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return s;
  }
}

export default async function DashboardPage() {
  if (!isAuthed()) {
    redirect("/login?next=/dashboard");
  }

  const [leads, clicks] = await Promise.all([fetchLeads(), fetchClicks()]);
  const stats = computeStats(leads, clicks);

  return (
    <div className="container">
      <div className="top-bar">
        <h1>
          NotaryaPlus <span className="gold">Dashboard</span>
        </h1>
        <LogoutButton />
      </div>

      <div className="stats-row">
        <div className="stat">
          <div className="value">{stats.totalClicks}</div>
          <div className="label">Clicks totales</div>
        </div>
        <div className="stat">
          <div className="value">{stats.totalLeads}</div>
          <div className="label">Leads totales</div>
        </div>
        <div className="stat">
          <div className="value">
            {stats.totalClicks > 0
              ? Math.round((stats.totalLeads / stats.totalClicks) * 100)
              : 0}
            %
          </div>
          <div className="label">Conversión global</div>
        </div>
      </div>

      <h2 style={{ fontSize: 18, marginBottom: 12, color: "#e5b94a" }}>Por fuente</h2>
      <table>
        <thead>
          <tr>
            <th>Fuente</th>
            <th>Clicks</th>
            <th>Leads</th>
            <th>Conversión</th>
          </tr>
        </thead>
        <tbody>
          {SOURCES.map((s) => {
            const row = stats.bySource[s.id] || { clicks: 0, leads: 0, conversion: 0 };
            return (
              <tr key={s.id}>
                <td>
                  <span className="source-pill">
                    {s.icon} {s.label}
                  </span>
                </td>
                <td>{row.clicks}</td>
                <td>{row.leads}</td>
                <td>{row.conversion}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 style={{ fontSize: 18, margin: "32px 0 12px", color: "#e5b94a" }}>
        Últimos 20 leads
      </h2>
      {stats.recentLeads.length === 0 ? (
        <div className="empty-state">
          No hay leads todavía. Los clientes que escriban por WhatsApp aparecerán aquí.
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Teléfono</th>
              <th>Nombre</th>
              <th>Servicio</th>
              <th>Fuente</th>
              <th>Último contacto</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentLeads.map((l, i) => (
              <tr key={l.phone + i}>
                <td>{l.phone}</td>
                <td>{l.name || "-"}</td>
                <td>{l.servicio || "-"}</td>
                <td>
                  <span className="source-pill">{sourceLabel(l.source || "")}</span>
                </td>
                <td>{formatDate(l.last_contact)}</td>
                <td>{l.status || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
