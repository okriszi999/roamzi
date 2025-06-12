"use client";
import { AuthSessionProvider } from "./AuthSessionProviders";
import { QueryProvider } from "./QueryProvider";

export const Providers = ({ children }: React.PropsWithChildren) => {
  return (
    <QueryProvider>
      <AuthSessionProvider>{children}</AuthSessionProvider>
    </QueryProvider>
  );
};
