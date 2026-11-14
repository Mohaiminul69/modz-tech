import { redirect } from "next/navigation";
import { requireAdminPage } from "@/lib/admin-auth";

// Admin pages read the sign-in session on every request, so navigating to them may wait for
// the server (Next.js "instant navigation" check opts out; the loading skeleton still shows).
export const instant = false;

const AdminHome = async () => {
  await requireAdminPage();
  redirect("/admin/orders");
};

export default AdminHome;
