import type { Metadata } from "next";
import RegisterPage from "@/features/auth/pages/RegisterPage";

export const metadata: Metadata = {
  title: "Daftar Akun Baru",
  description: "Daftarkan akun baru di Delcom Post untuk mulai berbagi cerita dan ide inspiratif.",
};

export default function Page() {
  return <RegisterPage />;
}
