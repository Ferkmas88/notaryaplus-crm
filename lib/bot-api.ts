import type { SourceId } from "./sources";

export interface Lead {
  phone: string;
  name: string;
  servicio?: string;
  notas?: unknown;
  created_at?: string;
  last_contact?: string;
  status?: string;
  source?: SourceId | string;
}

export interface Click {
  source: string;
  at: string;
  ua?: string;
  ref?: string;
}

const BOT = process.env.BOT_API_URL || "https://web-production-c32f8.up.railway.app";

export async function fetchLeads(): Promise<Lead[]> {
  try {
    const r = await fetch(`${BOT}/leads`, { cache: "no-store" });
    if (!r.ok) return [];
    return (await r.json()) as Lead[];
  } catch {
    return [];
  }
}

export async function fetchClicks(): Promise<Click[]> {
  try {
    const r = await fetch(`${BOT}/clicks`, { cache: "no-store" });
    if (!r.ok) return [];
    return (await r.json()) as Click[];
  } catch {
    return [];
  }
}

export async function logClick(source: string, ua?: string, ref?: string): Promise<void> {
  try {
    await fetch(`${BOT}/api/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source, ua: ua || "", ref: ref || "" }),
      cache: "no-store",
    });
  } catch {
    /* non-fatal */
  }
}

export interface Stats {
  totalClicks: number;
  totalLeads: number;
  bySource: Record<
    string,
    {
      clicks: number;
      leads: number;
      conversion: number;
    }
  >;
  recentLeads: Lead[];
}

export function computeStats(leads: Lead[], clicks: Click[]): Stats {
  const bySource: Stats["bySource"] = {};
  for (const c of clicks) {
    const k = c.source || "unknown";
    bySource[k] = bySource[k] || { clicks: 0, leads: 0, conversion: 0 };
    bySource[k].clicks += 1;
  }
  for (const l of leads) {
    const k = (l.source as string) || "unknown";
    bySource[k] = bySource[k] || { clicks: 0, leads: 0, conversion: 0 };
    bySource[k].leads += 1;
  }
  for (const k of Object.keys(bySource)) {
    const { clicks: c, leads: lc } = bySource[k];
    bySource[k].conversion = c > 0 ? Math.round((lc / c) * 100) : 0;
  }
  const recentLeads = [...leads]
    .sort((a, b) => (b.last_contact || "").localeCompare(a.last_contact || ""))
    .slice(0, 20);
  return {
    totalClicks: clicks.length,
    totalLeads: leads.length,
    bySource,
    recentLeads,
  };
}
