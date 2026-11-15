"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

// Your own computer: localhost, 127.0.0.1, or a local network address like 192.168.x.x.
const isLocalHost = (host: string) =>
  host === "localhost" || host === "127.0.0.1" || host === "[::1]" || /^(10|192\.168|172\.(1[6-9]|2\d|3[01]))\./.test(host);

/*
 * Loads Microsoft Clarity for shoppers only. It isn't loaded:
 * - on your own computer (localhost), even for a production build,
 * - on admin pages,
 * - for signed-in admins, anywhere on the site.
 * It waits until the sign-in check finishes, so an admin is never recorded by accident.
 */
export const ClarityLoader = ({ id }: { id: string }) => {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const loaded = useRef(false);
  const isAdmin = session?.user.role === "admin";

  useEffect(() => {
    if (loaded.current || isPending || isAdmin) return;
    if (pathname.startsWith("/admin") || isLocalHost(window.location.hostname)) return;

    loaded.current = true;
    // Clarity's standard loader: queue calls until the script arrives.
    const queue: unknown[][] = [];
    window.clarity ??= Object.assign((...args: unknown[]) => void queue.push(args), { q: queue });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${id}`;
    document.head.appendChild(script);
  }, [id, isPending, isAdmin, pathname]);

  // An admin signs in after Clarity already started (e.g. in the same tab): stop recording.
  useEffect(() => {
    if (loaded.current && isAdmin) window.clarity?.("stop");
  }, [isAdmin]);

  return null;
};
