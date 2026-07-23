import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host?.includes("localhost") ? "http" : "https");
  const imageUrl = host ? `${protocol}://${host}/og-v2.png` : undefined;

  return {
    title: "Seduo Plán | Ověřený vzdělávací plán",
    description:
      "Hlavní a doplňkové ověřené kurzy Seduo.cz včetně krátkých microlearningových lekcí.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: imageUrl
      ? {
          title: "Vzdělávací plán pro každou profesi",
          description: "Hlavní kurzy, doplňkové kurzy a microlearning.",
          images: [{ url: imageUrl, width: 1200, height: 630 }],
        }
      : undefined,
    twitter: imageUrl
      ? {
          card: "summary_large_image",
          title: "Vzdělávací plán pro každou profesi",
          description: "Hlavní kurzy, doplňkové kurzy a microlearning.",
          images: [imageUrl],
        }
      : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
