import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Create an account",
  robots: { index: false },
};

const SignupRoute = () => <AuthShell mode="signup" />;

export default SignupRoute;
