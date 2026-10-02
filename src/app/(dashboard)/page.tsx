import type { Metadata } from "next";
import HomePage from "@/features/posts/pages/HomePage";

export const metadata: Metadata = {
  title: "Beranda - Linimasa Postingan",
  description: "Jelajahi linimasa postingan terbaru, cerita inspiratif, dan diskusi menarik di Delcom Post.",
};

export default function Page() {
  return <HomePage />;
}
