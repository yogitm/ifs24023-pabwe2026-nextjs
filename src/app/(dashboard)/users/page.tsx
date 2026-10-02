import type { Metadata } from "next";
import UsersPage from "@/features/users/pages/UsersPage";

export const metadata: Metadata = {
  title: "Daftar Pengguna",
  description: "Daftar seluruh pengguna aktif dan profil kreator di Delcom Post.",
};

export default function Page() {
  return <UsersPage />;
}
