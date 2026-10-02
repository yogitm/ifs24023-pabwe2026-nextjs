import type { Metadata } from "next";
import LoginPage from "@/features/auth/pages/LoginPage";

export const metadata: Metadata = {
  title: "Masuk Akun",
  description: "Masuk ke akun Delcom Post untuk membaca, berbagi cerita, dan berinteraksi.",
};

export default function Page() {
  return <LoginPage />;
}
