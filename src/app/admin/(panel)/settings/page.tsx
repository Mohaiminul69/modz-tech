import type { Metadata } from "next";
import { SettingsForm } from "@/components/admin/settings-form";
import { requireAdminPage } from "@/lib/admin-auth";
import { getSettingsForEdit } from "@/lib/admin/data";

// Admin pages read the sign-in session on every request, so navigating to them may wait for
// the server (Next.js "instant navigation" check opts out; the loading skeleton still shows).
export const instant = false;

export const metadata: Metadata = { title: "Settings" };

const SettingsPage = async () => {
  await requireAdminPage();
  const settings = await getSettingsForEdit();

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-page-title text-ink">Settings</h1>
        <p className="text-label text-ink-muted">Changes show on the shop as soon as you save.</p>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
};

export default SettingsPage;
