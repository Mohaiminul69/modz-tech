import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Log in",
  robots: { index: false },
};

const LoginRoute = () => <AuthShell mode="login" />;

export default LoginRoute;
