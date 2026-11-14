"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import type { ActionResult } from "@/lib/admin-auth";

/** Runs an admin server action, shows the result as a toast, and refreshes the page data. */
export const useAdminAction = () => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const run = <T,>(action: () => Promise<ActionResult<T>>, onSuccess?: (data: T | undefined) => void) =>
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      if (result.message) toast.success(result.message);
      onSuccess?.(result.data);
      router.refresh();
    });

  return { pending, run };
};
