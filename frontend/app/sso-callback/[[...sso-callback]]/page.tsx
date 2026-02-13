'use client';

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  return (
    <AuthenticateWithRedirectCallback
      signUpUrl="/sign-up"
      signInUrl="/sign-in"
    />
  );
}
