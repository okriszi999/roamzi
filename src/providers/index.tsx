"use client";
import { QueryProvider } from "./QueryProvider";

export const Providers = ({ children }: React.PropsWithChildren) => {
  return <QueryProvider>{children}</QueryProvider>;
};
