import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Delcom Post - Berbagi Cerita & Postingan Modern",
    template: "%s | Delcom Post",
  },
  description:
    "Delcom Post adalah platform modern untuk berbagi cerita, pemikiran, berita, dan ide kreatif bersama komunitas kampus dan masyarakat.",
  keywords: [
    "delcom post",
    "delcom",
    "pabwe",
    "cerita",
    "postingan",
    "komunitas",
    "sosial media",
    "artikel",
  ],
  authors: [{ name: "Delcom Team" }],
  creator: "Delcom Community",
  publisher: "Delcom",
  metadataBase: new URL("https://delcom-post.example.com"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://delcom-post.example.com",
    siteName: "Delcom Post",
    title: "Delcom Post - Berbagi Cerita & Postingan Modern",
    description:
      "Delcom Post adalah platform modern untuk berbagi cerita, pemikiran, berita, dan ide kreatif.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Delcom Post - Berbagi Cerita Modern",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Delcom Post - Berbagi Cerita & Postingan Modern",
    description:
      "Platform modern untuk berbagi cerita, pemikiran, dan ide kreatif bersama komunitas.",
    creator: "@delcom",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 text-slate-900 font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
