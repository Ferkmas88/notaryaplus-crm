import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NotaryaPlus CRM",
  description: "CRM y tracking de leads para 3-1 Notary A Plus",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
