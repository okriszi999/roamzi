"use client";
import { AuthSessionProvider } from "./AuthSessionProviders";
import { JotaiProvider } from "./JotaiProvider";
import { QueryProvider } from "./QueryProvider";

export const Providers = ({ children }: React.PropsWithChildren) => {
  return (
    <JotaiProvider>
      <QueryProvider>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </QueryProvider>
    </JotaiProvider>
  );
};
