"use client";

import { createAuthClient } from "better-auth/react";

// Browser side of Better Auth (same origin, so no baseURL needed).
export const authClient = createAuthClient();
