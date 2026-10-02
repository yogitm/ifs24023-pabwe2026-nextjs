import type { Metadata } from "next";
import DetailPage from "@/features/posts/pages/DetailPage";

export const metadata: Metadata = {
  title: "Detail Postingan",
  description: "Lihat detail postingan, isi konten, dan diskusi komentar di Delcom Post.",
};

export default function Page() {
  return <DetailPage />;
}
