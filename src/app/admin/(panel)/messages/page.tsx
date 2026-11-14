import type { Metadata } from "next";
import { MessageList } from "@/components/admin/message-list";
import { requireAdminPage } from "@/lib/admin-auth";
import { formatDhakaDateTime, listMessages } from "@/lib/admin/data";

// Admin pages read the sign-in session on every request, so navigating to them may wait for
// the server (Next.js "instant navigation" check opts out; the loading skeleton still shows).
export const instant = false;

export const metadata: Metadata = { title: "Messages" };

const MessagesPage = async () => {
  await requireAdminPage();
  const messages = await listMessages();
  const unread = messages.filter((message) => message.status === "new").length;

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h1 className="text-page-title text-ink">Messages</h1>
        <span className="text-label text-ink-muted">{unread} new</span>
      </div>
      <MessageList messages={messages.map((message) => ({ ...message, when: formatDhakaDateTime(message.createdAt) }))} />
    </div>
  );
};

export default MessagesPage;
