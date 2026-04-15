export type SourceId = "web" | "facebook" | "google" | "instagram" | "flyer";

export interface Source {
  id: SourceId;
  label: string;
  icon: string;
  description: string;
  message: string;
  color: string;
  dotColor: string;
}

export const SOURCES: Source[] = [
  {
    id: "web",
    label: "Sitio Web",
    icon: "🌐",
    description: "Botón WhatsApp en notaryaplus.com",
    message: "Hola, vengo desde su sitio web. Necesito información.",
    color: "#1A2E4A",
    dotColor: "#E5B94A",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: "📘",
    description: "Botón en la Facebook Page de Myrna",
    message: "Hola, vengo desde su página de Facebook.",
    color: "#1877F2",
    dotColor: "#1877F2",
  },
  {
    id: "google",
    label: "Google",
    icon: "🔎",
    description: "Link en Google Business Profile",
    message: "Hola, los encontré en Google. Tengo una consulta.",
    color: "#4285F4",
    dotColor: "#34A853",
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: "📸",
    description: "Bio link de @myrna.chacon.1",
    message: "Hola, vengo desde Instagram.",
    color: "#E1306C",
    dotColor: "#E1306C",
  },
  {
    id: "flyer",
    label: "Flyer Impreso",
    icon: "📄",
    description: "QR del flyer impreso en la oficina",
    message: "Hola, escanee el flyer de la oficina.",
    color: "#E5B94A",
    dotColor: "#E5B94A",
  },
];

export function getSource(id: string): Source | undefined {
  return SOURCES.find((s) => s.id === id);
}

export function buildWaLink(message: string): string {
  const phone = process.env.WA_PHONE || "15027555027";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
