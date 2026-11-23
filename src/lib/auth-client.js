import { createAuthClient } from 'better-auth/react';

/**
 * Better Auth client configuration for MentorLagbe frontend.
 * Backend handler is mounted at /api/auth in server.js.
 * Configured with cross-origin cookie credentials.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  basePath: '/api/auth',
  fetchOptions: {
    credentials: 'include',
  },
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;

