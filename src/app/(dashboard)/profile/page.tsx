import type { Metadata } from "next";
import ProfilePage from "@/features/users/pages/ProfilePage";

export const metadata: Metadata = {
  title: "Profil Saya",
  description: "Kelola profil pribadi, foto, kata sandi, dan preferensi akun Anda di Delcom Post.",
};

export default function Page() {
  return <ProfilePage />;
}
