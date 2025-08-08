import LoginPage from "@/components/LoginPage";
import { SessionProvider } from "next-auth/react";

export default function Login() {
  return (
    <>
    <div className="w-full h-screen flex justify-center items-center">
      <SessionProvider>
        <LoginPage />
      </SessionProvider>
    </div>
    </>
  )
}